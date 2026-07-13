"""Persistent, leased work queue with conservative crash recovery."""

from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, List, Optional, Union

from ._time import as_utc_text, utc_now
from .canonical import canonical_hash, canonical_json
from .database import Database
from .errors import IdempotencyConflict, InvalidStateTransition, NotFound, QueueLeaseError
from .models import QueueItem


def _queue_item_from_row(row: sqlite3.Row) -> QueueItem:
    return QueueItem(
        job_id=row["job_id"],
        queue_name=row["queue_name"],
        kind=row["kind"],
        payload=json.loads(row["payload_json"]),
        payload_hash=row["payload_hash"],
        state=row["state"],
        idempotency_key=row["idempotency_key"],
        priority=row["priority"],
        available_at=row["available_at"],
        attempts=row["attempts"],
        max_attempts=row["max_attempts"],
        lease_owner=row["lease_owner"],
        lease_expires_at=row["lease_expires_at"],
        result=None if row["result_json"] is None else json.loads(row["result_json"]),
        error=row["error"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        completed_at=row["completed_at"],
    )


def _required(value: str, name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError("%s must be a non-empty string" % name)
    return value


class WorkQueue:
    """Coordinate durable work between local or remote worker processes.

    A claim is a bounded lease.  An expired running item moves to
    ``needs_review`` instead of being replayed automatically, because a worker
    may have completed an external side effect before it crashed.
    """

    def __init__(self, path: Union[str, Path] = ":memory:", *, timeout: float = 5.0) -> None:
        self._database = Database(path, timeout=timeout)

    @property
    def connection(self) -> sqlite3.Connection:
        """Expose the configured connection for read-only diagnostics."""

        return self._database.connection

    def close(self) -> None:
        """Close the queue connection."""

        self._database.close()

    def __enter__(self) -> "WorkQueue":
        return self

    def __exit__(self, exc_type: object, exc: object, traceback: object) -> None:
        self.close()

    def enqueue(
        self,
        kind: str,
        payload: Any,
        *,
        queue_name: str = "default",
        idempotency_key: Optional[str] = None,
        priority: int = 0,
        available_at: Optional[datetime] = None,
        max_attempts: int = 3,
        job_id: Optional[str] = None,
    ) -> QueueItem:
        """Insert work once and return the existing item on a safe replay.

        If no explicit idempotency key is supplied, one is derived from the
        queue, kind, and canonical payload.  Reusing an explicit key for
        different content raises :class:`IdempotencyConflict`.
        """

        kind = _required(kind, "kind")
        queue_name = _required(queue_name, "queue_name")
        if max_attempts <= 0:
            raise ValueError("max_attempts must be greater than zero")
        payload_json = canonical_json(payload)
        payload_hash = canonical_hash(payload)
        key = idempotency_key or "auto:%s" % canonical_hash(
            {"queue_name": queue_name, "kind": kind, "payload": payload}
        )
        _required(key, "idempotency_key")
        now_text = as_utc_text()
        available_text = as_utc_text(available_at)
        desired_id = job_id or "job_%s" % uuid.uuid4().hex

        with self._database.transaction() as connection:
            by_key = connection.execute(
                """
                SELECT * FROM work_queue
                WHERE queue_name = ? AND idempotency_key = ?
                """,
                (queue_name, key),
            ).fetchone()
            by_id = None
            if job_id is not None:
                by_id = connection.execute(
                    "SELECT * FROM work_queue WHERE job_id = ?", (job_id,)
                ).fetchone()
            if by_key is not None and job_id is not None and by_key["job_id"] != job_id:
                raise IdempotencyConflict(
                    "queue job ID and idempotency key refer to different records"
                )
            if by_id is not None and (
                by_id["queue_name"] != queue_name
                or by_id["idempotency_key"] != key
            ):
                raise IdempotencyConflict(
                    "queue job ID already exists with a different idempotency key"
                )
            existing = by_key if by_key is not None else by_id
            if existing is not None:
                if (
                    existing["queue_name"] != queue_name
                    or existing["kind"] != kind
                    or existing["payload_hash"] != payload_hash
                    or existing["payload_json"] != payload_json
                ):
                    raise IdempotencyConflict(
                        "queue idempotency key was reused for different work"
                    )
                return _queue_item_from_row(existing)
            connection.execute(
                """
                INSERT INTO work_queue(
                    job_id, queue_name, kind, payload_json, payload_hash, state,
                    idempotency_key, priority, available_at, attempts,
                    max_attempts, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, 0, ?, ?, ?)
                """,
                (
                    desired_id,
                    queue_name,
                    kind,
                    payload_json,
                    payload_hash,
                    key,
                    int(priority),
                    available_text,
                    int(max_attempts),
                    now_text,
                    now_text,
                ),
            )
            return self._get(connection, desired_id)

    def get(self, job_id: str) -> QueueItem:
        """Return one queue item by ID."""

        return self._get(self.connection, job_id)

    def _get(self, connection: sqlite3.Connection, job_id: str) -> QueueItem:
        row = connection.execute(
            "SELECT * FROM work_queue WHERE job_id = ?", (job_id,)
        ).fetchone()
        if row is None:
            raise NotFound("queue item not found: %s" % job_id)
        return _queue_item_from_row(row)

    def list(
        self,
        *,
        queue_name: str = "default",
        state: Optional[str] = None,
        limit: int = 100,
    ) -> List[QueueItem]:
        """List queue items in scheduling order."""

        if limit <= 0:
            raise ValueError("limit must be greater than zero")
        if state is None:
            rows = self.connection.execute(
                """
                SELECT * FROM work_queue WHERE queue_name = ?
                ORDER BY priority DESC, available_at ASC, created_at ASC LIMIT ?
                """,
                (queue_name, limit),
            ).fetchall()
        else:
            rows = self.connection.execute(
                """
                SELECT * FROM work_queue WHERE queue_name = ? AND state = ?
                ORDER BY priority DESC, available_at ASC, created_at ASC LIMIT ?
                """,
                (queue_name, state, limit),
            ).fetchall()
        return [_queue_item_from_row(row) for row in rows]

    def claim_next(
        self,
        worker_id: str,
        *,
        queue_name: str = "default",
        lease_seconds: Union[int, float] = 300,
        at: Optional[datetime] = None,
    ) -> Optional[QueueItem]:
        """Atomically lease the next available item, or return ``None``.

        Any expired leases are first moved to ``needs_review``.  They are not
        silently replayed because their side-effect status may be unknown.
        """

        worker_id = _required(worker_id, "worker_id")
        queue_name = _required(queue_name, "queue_name")
        if lease_seconds <= 0:
            raise ValueError("lease_seconds must be greater than zero")
        instant = utc_now() if at is None else at
        now_text = as_utc_text(instant)
        lease_text = as_utc_text(instant + timedelta(seconds=lease_seconds))
        with self._database.transaction() as connection:
            self._recover_expired(connection, queue_name, now_text)
            row = connection.execute(
                """
                SELECT * FROM work_queue
                WHERE queue_name = ? AND state = 'pending'
                    AND available_at <= ? AND attempts < max_attempts
                ORDER BY priority DESC, available_at ASC, created_at ASC
                LIMIT 1
                """,
                (queue_name, now_text),
            ).fetchone()
            if row is None:
                return None
            connection.execute(
                """
                UPDATE work_queue
                SET state = 'running', attempts = attempts + 1,
                    lease_owner = ?, lease_expires_at = ?, error = NULL,
                    updated_at = ?
                WHERE job_id = ?
                """,
                (worker_id, lease_text, now_text, row["job_id"]),
            )
            return self._get(connection, row["job_id"])

    def recover_expired_leases(
        self, *, queue_name: str = "default", at: Optional[datetime] = None
    ) -> int:
        """Move expired running work to ``needs_review`` and return its count."""

        now_text = as_utc_text(at)
        with self._database.transaction() as connection:
            return self._recover_expired(connection, queue_name, now_text)

    @staticmethod
    def _recover_expired(
        connection: sqlite3.Connection, queue_name: str, now_text: str
    ) -> int:
        cursor = connection.execute(
            """
            UPDATE work_queue
            SET state = 'needs_review', lease_owner = NULL,
                lease_expires_at = NULL,
                error = 'worker lease expired before completion',
                updated_at = ?
            WHERE queue_name = ? AND state = 'running'
                AND lease_expires_at IS NOT NULL AND lease_expires_at <= ?
            """,
            (now_text, queue_name, now_text),
        )
        return cursor.rowcount

    def heartbeat(
        self,
        job_id: str,
        worker_id: str,
        *,
        lease_seconds: Union[int, float] = 300,
        at: Optional[datetime] = None,
    ) -> QueueItem:
        """Extend a live lease owned by ``worker_id``."""

        if lease_seconds <= 0:
            raise ValueError("lease_seconds must be greater than zero")
        instant = utc_now() if at is None else at
        now_text = as_utc_text(instant)
        lease_text = as_utc_text(instant + timedelta(seconds=lease_seconds))
        expired = False
        with self._database.transaction() as connection:
            current = self._get(connection, job_id)
            self._require_owner(current, worker_id)
            if current.lease_expires_at is None or current.lease_expires_at <= now_text:
                self._expire_one(connection, job_id, now_text)
                expired = True
            else:
                connection.execute(
                    """
                    UPDATE work_queue SET lease_expires_at = ?, updated_at = ?
                    WHERE job_id = ?
                    """,
                    (lease_text, now_text, job_id),
                )
        if expired:
            raise QueueLeaseError("queue lease has expired; work needs review")
        return self.get(job_id)

    def complete(
        self,
        job_id: str,
        worker_id: str,
        result: Any,
        *,
        at: Optional[datetime] = None,
    ) -> QueueItem:
        """Mark owned, running work done and retain its result."""

        result_json = canonical_json(result)
        now_text = as_utc_text(at)
        expired = False
        with self._database.transaction() as connection:
            current = self._get(connection, job_id)
            self._require_owner(current, worker_id)
            if current.lease_expires_at is None or current.lease_expires_at <= now_text:
                self._expire_one(connection, job_id, now_text)
                expired = True
            else:
                connection.execute(
                    """
                    UPDATE work_queue
                    SET state = 'done', result_json = ?, error = NULL,
                        lease_owner = NULL, lease_expires_at = NULL,
                        completed_at = ?, updated_at = ?
                    WHERE job_id = ?
                    """,
                    (result_json, now_text, now_text, job_id),
                )
        if expired:
            raise QueueLeaseError("queue lease has expired; work needs review")
        return self.get(job_id)

    def fail(
        self,
        job_id: str,
        worker_id: str,
        error: str,
        *,
        at: Optional[datetime] = None,
    ) -> QueueItem:
        """Mark owned, running work failed with a non-secret error summary."""

        error = _required(error, "error")
        now_text = as_utc_text(at)
        expired = False
        with self._database.transaction() as connection:
            current = self._get(connection, job_id)
            self._require_owner(current, worker_id)
            if current.lease_expires_at is None or current.lease_expires_at <= now_text:
                self._expire_one(connection, job_id, now_text)
                expired = True
            else:
                connection.execute(
                    """
                    UPDATE work_queue
                    SET state = 'failed', error = ?, lease_owner = NULL,
                        lease_expires_at = NULL, completed_at = ?, updated_at = ?
                    WHERE job_id = ?
                    """,
                    (error, now_text, now_text, job_id),
                )
        if expired:
            raise QueueLeaseError("queue lease has expired; work needs review")
        return self.get(job_id)

    @staticmethod
    def _require_owner(item: QueueItem, worker_id: str) -> None:
        _required(worker_id, "worker_id")
        if item.state != "running":
            raise InvalidStateTransition(
                "queue item %s is %s, not running" % (item.job_id, item.state)
            )
        if item.lease_owner != worker_id:
            raise QueueLeaseError("queue item is leased by a different worker")

    @staticmethod
    def _expire_one(connection: sqlite3.Connection, job_id: str, now_text: str) -> None:
        connection.execute(
            """
            UPDATE work_queue
            SET state = 'needs_review', lease_owner = NULL,
                lease_expires_at = NULL,
                error = 'worker lease expired before completion', updated_at = ?
            WHERE job_id = ?
            """,
            (now_text, job_id),
        )

    def mark_needs_review(
        self,
        job_id: str,
        reason: str,
        *,
        worker_id: Optional[str] = None,
        at: Optional[datetime] = None,
    ) -> QueueItem:
        """Stop pending or owned running work for human review."""

        reason = _required(reason, "reason")
        now_text = as_utc_text(at)
        with self._database.transaction() as connection:
            current = self._get(connection, job_id)
            if current.state not in ("pending", "running"):
                raise InvalidStateTransition(
                    "cannot review queue item %s from %s" % (job_id, current.state)
                )
            if current.state == "running":
                if worker_id is None:
                    raise QueueLeaseError("worker_id is required for running work")
                self._require_owner(current, worker_id)
            connection.execute(
                """
                UPDATE work_queue
                SET state = 'needs_review', error = ?, lease_owner = NULL,
                    lease_expires_at = NULL, completed_at = ?, updated_at = ?
                WHERE job_id = ?
                """,
                (reason, now_text, now_text, job_id),
            )
            return self._get(connection, job_id)

    def retry(
        self,
        job_id: str,
        *,
        available_at: Optional[datetime] = None,
        reset_attempts: bool = False,
    ) -> QueueItem:
        """Return failed or reviewed work to pending after an explicit decision."""

        now_text = as_utc_text()
        available_text = as_utc_text(available_at)
        with self._database.transaction() as connection:
            current = self._get(connection, job_id)
            if current.state not in ("failed", "needs_review"):
                raise InvalidStateTransition(
                    "cannot retry queue item %s from %s" % (job_id, current.state)
                )
            attempts = 0 if reset_attempts else current.attempts
            if attempts >= current.max_attempts:
                raise InvalidStateTransition(
                    "queue item has exhausted max_attempts; reset_attempts is required"
                )
            connection.execute(
                """
                UPDATE work_queue
                SET state = 'pending', available_at = ?, attempts = ?,
                    error = NULL, result_json = NULL, completed_at = NULL,
                    lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
                WHERE job_id = ?
                """,
                (available_text, attempts, now_text, job_id),
            )
            return self._get(connection, job_id)
