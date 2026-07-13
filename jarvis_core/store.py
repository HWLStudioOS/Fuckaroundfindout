"""Event, run, and approval ledgers backed by SQLite."""

from __future__ import annotations

import json
import math
import sqlite3
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, List, Optional, Union

from ._time import as_utc_text, parse_utc_text, utc_now
from .action_types import (
    MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS,
    UNAUTHENTICATED_APPROVAL_WARNING,
    classify_action,
)
from .canonical import canonical_hash, canonical_json
from .database import Database
from .errors import (
    ApprovalHashMismatch,
    IdempotencyConflict,
    InvalidStateTransition,
    NotFound,
    PolicyDenied,
)
from .models import ActionPolicyDecision, Approval, Event, ProposedAction, Run


def _new_id(prefix: str) -> str:
    return "%s_%s" % (prefix, uuid.uuid4().hex)


def _decode(value: Optional[str]) -> Any:
    return None if value is None else json.loads(value)


def _require_text(value: str, name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError("%s must be a non-empty string" % name)
    return value


def _event_from_row(row: sqlite3.Row) -> Event:
    return Event(
        event_id=row["event_id"],
        event_type=row["event_type"],
        source=row["source"],
        payload=_decode(row["payload_json"]),
        payload_hash=row["payload_hash"],
        occurred_at=row["occurred_at"],
        recorded_at=row["recorded_at"],
        entity_type=row["entity_type"],
        entity_id=row["entity_id"],
        correlation_id=row["correlation_id"],
        causation_id=row["causation_id"],
        idempotency_key=row["idempotency_key"],
        metadata=_decode(row["metadata_json"]),
    )


def _run_from_row(row: sqlite3.Row) -> Run:
    return Run(
        run_id=row["run_id"],
        run_type=row["run_type"],
        status=row["status"],
        input=_decode(row["input_json"]),
        input_hash=row["input_hash"],
        output=_decode(row["output_json"]),
        error=row["error"],
        idempotency_key=row["idempotency_key"],
        created_at=row["created_at"],
        started_at=row["started_at"],
        finished_at=row["finished_at"],
        updated_at=row["updated_at"],
    )


def _action_from_row(row: sqlite3.Row) -> ProposedAction:
    return ProposedAction(
        action_id=row["action_id"],
        run_id=row["run_id"],
        action_type=row["action_type"],
        target=row["target"],
        payload=_decode(row["payload_json"]),
        action_hash=row["action_hash"],
        risk=row["risk"],
        is_external=bool(row["is_external"]),
        reversible=bool(row["reversible"]),
        status=row["status"],
        proposed_by=row["proposed_by"],
        idempotency_key=row["idempotency_key"],
        proposed_at=row["proposed_at"],
        expires_at=row["expires_at"],
        executed_at=row["executed_at"],
    )


def _approval_from_row(row: sqlite3.Row) -> Approval:
    return Approval(
        approval_id=row["approval_id"],
        action_id=row["action_id"],
        action_hash=row["action_hash"],
        decision=row["decision"],
        actor=row["actor"],
        reason=row["reason"],
        decided_at=row["decided_at"],
        expires_at=row["expires_at"],
    )


class RuntimeStore:
    """Durable state spine for events, runs, and proposed actions.

    One instance owns one SQLite connection.  Separate processes should create
    separate instances against the same path.  SQLite WAL mode and immediate
    write transactions provide safe coordination between them.
    """

    def __init__(self, path: Union[str, Path] = ":memory:", *, timeout: float = 5.0) -> None:
        self._database = Database(path, timeout=timeout)

    @property
    def connection(self) -> sqlite3.Connection:
        """Expose the configured connection for read-only diagnostics."""

        return self._database.connection

    def close(self) -> None:
        """Close the store."""

        self._database.close()

    def __enter__(self) -> "RuntimeStore":
        return self

    def __exit__(self, exc_type: object, exc: object, traceback: object) -> None:
        self.close()

    def append_event(
        self,
        event_type: str,
        source: str,
        payload: Any,
        *,
        occurred_at: Optional[datetime] = None,
        event_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        correlation_id: Optional[str] = None,
        causation_id: Optional[str] = None,
        idempotency_key: Optional[str] = None,
        metadata: Any = None,
    ) -> Event:
        """Append an immutable event, returning an existing idempotent match.

        Idempotency is scoped by ``source``.  Reusing the same key with changed
        event identity or content raises :class:`IdempotencyConflict`.
        """

        event_type = _require_text(event_type, "event_type")
        source = _require_text(source, "source")
        if idempotency_key is not None:
            _require_text(idempotency_key, "idempotency_key")
        payload_json = canonical_json(payload)
        metadata_json = canonical_json({} if metadata is None else metadata)
        occurred_was_supplied = occurred_at is not None
        occurred_text = as_utc_text(occurred_at)
        recorded_text = as_utc_text()
        desired_id = event_id or _new_id("evt")

        with self._database.transaction() as connection:
            by_key = None
            if idempotency_key is not None:
                by_key = connection.execute(
                    "SELECT * FROM events WHERE source = ? AND idempotency_key = ?",
                    (source, idempotency_key),
                ).fetchone()
            by_id = None
            if event_id is not None:
                by_id = connection.execute(
                    "SELECT * FROM events WHERE event_id = ?", (event_id,)
                ).fetchone()
            if by_key is not None and event_id is not None and by_key["event_id"] != event_id:
                raise IdempotencyConflict(
                    "event ID and idempotency key refer to different records"
                )
            if by_id is not None and by_id["idempotency_key"] != idempotency_key:
                raise IdempotencyConflict(
                    "event ID already exists with a different idempotency key"
                )
            existing = by_key if by_key is not None else by_id
            if existing is not None:
                matches = (
                    existing["event_type"] == event_type
                    and existing["source"] == source
                    and existing["payload_json"] == payload_json
                    and (
                        not occurred_was_supplied
                        or existing["occurred_at"] == occurred_text
                    )
                    and existing["entity_type"] == entity_type
                    and existing["entity_id"] == entity_id
                    and existing["correlation_id"] == correlation_id
                    and existing["causation_id"] == causation_id
                    and existing["metadata_json"] == metadata_json
                )
                if not matches:
                    raise IdempotencyConflict("event idempotency key was reused for different content")
                return _event_from_row(existing)

            connection.execute(
                """
                INSERT INTO events(
                    event_id, event_type, source, payload_json, payload_hash,
                    occurred_at, recorded_at, entity_type, entity_id,
                    correlation_id, causation_id, idempotency_key, metadata_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    desired_id,
                    event_type,
                    source,
                    payload_json,
                    canonical_hash(payload),
                    occurred_text,
                    recorded_text,
                    entity_type,
                    entity_id,
                    correlation_id,
                    causation_id,
                    idempotency_key,
                    metadata_json,
                ),
            )
            row = connection.execute(
                "SELECT * FROM events WHERE event_id = ?", (desired_id,)
            ).fetchone()
            return _event_from_row(row)

    def get_event(self, event_id: str) -> Event:
        """Return one event by ID."""

        row = self.connection.execute(
            "SELECT * FROM events WHERE event_id = ?", (event_id,)
        ).fetchone()
        if row is None:
            raise NotFound("event not found: %s" % event_id)
        return _event_from_row(row)

    def create_run(
        self,
        run_type: str,
        input: Any,
        *,
        idempotency_key: Optional[str] = None,
        run_id: Optional[str] = None,
        created_at: Optional[datetime] = None,
    ) -> Run:
        """Create a pending run, idempotently within one run type."""

        run_type = _require_text(run_type, "run_type")
        if idempotency_key is not None:
            _require_text(idempotency_key, "idempotency_key")
        input_json = canonical_json(input)
        input_hash = canonical_hash(input)
        now_text = as_utc_text(created_at)
        desired_id = run_id or _new_id("run")
        with self._database.transaction() as connection:
            by_key = None
            if idempotency_key is not None:
                by_key = connection.execute(
                    "SELECT * FROM runs WHERE run_type = ? AND idempotency_key = ?",
                    (run_type, idempotency_key),
                ).fetchone()
            by_id = None
            if run_id is not None:
                by_id = connection.execute(
                    "SELECT * FROM runs WHERE run_id = ?", (run_id,)
                ).fetchone()
            if by_key is not None and run_id is not None and by_key["run_id"] != run_id:
                raise IdempotencyConflict(
                    "run ID and idempotency key refer to different records"
                )
            if by_id is not None and by_id["idempotency_key"] != idempotency_key:
                raise IdempotencyConflict(
                    "run ID already exists with a different idempotency key"
                )
            existing = by_key if by_key is not None else by_id
            if existing is not None:
                if existing["run_type"] != run_type or existing["input_hash"] != input_hash:
                    raise IdempotencyConflict("run idempotency key was reused for different input")
                return _run_from_row(existing)
            connection.execute(
                """
                INSERT INTO runs(
                    run_id, run_type, status, input_json, input_hash,
                    idempotency_key, created_at, updated_at
                ) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)
                """,
                (desired_id, run_type, input_json, input_hash, idempotency_key, now_text, now_text),
            )
            return self._get_run(connection, desired_id)

    def get_run(self, run_id: str) -> Run:
        """Return one run by ID."""

        return self._get_run(self.connection, run_id)

    def _get_run(self, connection: sqlite3.Connection, run_id: str) -> Run:
        row = connection.execute("SELECT * FROM runs WHERE run_id = ?", (run_id,)).fetchone()
        if row is None:
            raise NotFound("run not found: %s" % run_id)
        return _run_from_row(row)

    def start_run(self, run_id: str, *, at: Optional[datetime] = None) -> Run:
        """Move a pending run to running.  Repeated starts are idempotent."""

        now_text = as_utc_text(at)
        with self._database.transaction() as connection:
            current = self._get_run(connection, run_id)
            if current.status == "running":
                return current
            if current.status != "pending":
                raise InvalidStateTransition(
                    "cannot start run %s from %s" % (run_id, current.status)
                )
            connection.execute(
                "UPDATE runs SET status = 'running', started_at = ?, updated_at = ? WHERE run_id = ?",
                (now_text, now_text, run_id),
            )
            return self._get_run(connection, run_id)

    def complete_run(self, run_id: str, output: Any, *, at: Optional[datetime] = None) -> Run:
        """Finish a running run successfully with a durable output."""

        output_json = canonical_json(output)
        now_text = as_utc_text(at)
        with self._database.transaction() as connection:
            current = self._get_run(connection, run_id)
            if current.status == "succeeded":
                if canonical_json(current.output) != output_json:
                    raise IdempotencyConflict("completed run already has a different output")
                return current
            if current.status != "running":
                raise InvalidStateTransition(
                    "cannot complete run %s from %s" % (run_id, current.status)
                )
            connection.execute(
                """
                UPDATE runs
                SET status = 'succeeded', output_json = ?, error = NULL,
                    finished_at = ?, updated_at = ?
                WHERE run_id = ?
                """,
                (output_json, now_text, now_text, run_id),
            )
            return self._get_run(connection, run_id)

    def fail_run(self, run_id: str, error: str, *, at: Optional[datetime] = None) -> Run:
        """Finish a running run as failed, retaining a safe error summary."""

        error = _require_text(error, "error")
        now_text = as_utc_text(at)
        with self._database.transaction() as connection:
            current = self._get_run(connection, run_id)
            if current.status == "failed":
                if current.error != error:
                    raise IdempotencyConflict("failed run already has a different error")
                return current
            if current.status != "running":
                raise InvalidStateTransition("cannot fail run %s from %s" % (run_id, current.status))
            connection.execute(
                """
                UPDATE runs
                SET status = 'failed', error = ?, finished_at = ?, updated_at = ?
                WHERE run_id = ?
                """,
                (error, now_text, now_text, run_id),
            )
            return self._get_run(connection, run_id)

    def mark_run_needs_review(
        self, run_id: str, reason: str, *, at: Optional[datetime] = None
    ) -> Run:
        """Stop an uncertain pending or running run for human inspection."""

        reason = _require_text(reason, "reason")
        now_text = as_utc_text(at)
        with self._database.transaction() as connection:
            current = self._get_run(connection, run_id)
            if current.status == "needs_review":
                return current
            if current.status not in ("pending", "running"):
                raise InvalidStateTransition(
                    "cannot review run %s from %s" % (run_id, current.status)
                )
            connection.execute(
                """
                UPDATE runs
                SET status = 'needs_review', error = ?, finished_at = ?, updated_at = ?
                WHERE run_id = ?
                """,
                (reason, now_text, now_text, run_id),
            )
            return self._get_run(connection, run_id)

    def propose_action(
        self,
        action_type: str,
        payload: Any,
        *,
        target: Optional[str] = None,
        risk: str = "low",
        is_external: bool = False,
        reversible: bool = True,
        proposed_by: str = "assistant",
        run_id: Optional[str] = None,
        idempotency_key: Optional[str] = None,
        expires_in_seconds: Optional[Union[int, float]] = None,
        proposed_at: Optional[datetime] = None,
        action_id: Optional[str] = None,
    ) -> ProposedAction:
        """Persist an immutable, registry-classified proposal.

        Caller-supplied safety flags can only make the registered action type
        stricter.  Unknown types fail closed.  Any proposal requiring approval
        must have an explicit idempotency key and an expiry of at most 24 hours.
        This method never executes or claims an action.
        """

        action_type = _require_text(action_type, "action_type")
        proposed_by = _require_text(proposed_by, "proposed_by")
        classification = classify_action(
            action_type,
            requested_risk=risk,
            requested_external=is_external,
            requested_reversible=reversible,
        )
        risk = classification.risk
        is_external = classification.is_external
        reversible = classification.reversible
        if target is not None:
            _require_text(target, "target")
        if idempotency_key is not None:
            _require_text(idempotency_key, "idempotency_key")
        if expires_in_seconds is not None:
            if not math.isfinite(expires_in_seconds) or expires_in_seconds <= 0:
                raise ValueError("expires_in_seconds must be finite and greater than zero")
        if classification.requires_approval:
            if idempotency_key is None:
                raise ValueError("approval-required actions need an explicit idempotency_key")
            if expires_in_seconds is None:
                raise ValueError("approval-required actions need a bounded proposal expiry")
            if expires_in_seconds > MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS:
                raise ValueError("approval-required proposal expiry cannot exceed 24 hours")
        payload_json = canonical_json(payload)
        desired_id = action_id or _new_id("act")
        with self._database.transaction() as connection:
            by_key = None
            if idempotency_key is not None:
                by_key = connection.execute(
                    "SELECT * FROM proposed_actions WHERE idempotency_key = ?",
                    (idempotency_key,),
                ).fetchone()
            by_id = None
            if action_id is not None:
                by_id = connection.execute(
                    "SELECT * FROM proposed_actions WHERE action_id = ?", (action_id,)
                ).fetchone()
            if by_key is not None and action_id is not None and by_key["action_id"] != action_id:
                raise IdempotencyConflict(
                    "action ID and idempotency key refer to different records"
                )
            if by_id is not None and by_id["idempotency_key"] != idempotency_key:
                raise IdempotencyConflict(
                    "action ID already exists with a different idempotency key"
                )
            existing = by_key if by_key is not None else by_id
            if existing is not None:
                same_proposal = (
                    existing["run_id"] == run_id
                    and existing["action_type"] == action_type
                    and existing["target"] == target
                    and existing["payload_json"] == payload_json
                    and existing["risk"] == risk
                    and bool(existing["is_external"]) == bool(is_external)
                    and bool(existing["reversible"]) == bool(reversible)
                    and existing["proposed_by"] == proposed_by
                )
                if not same_proposal:
                    raise IdempotencyConflict("action idempotency key was reused for different content")
                return _action_from_row(existing)
            instant = utc_now() if proposed_at is None else proposed_at
            proposed_text = as_utc_text(instant)
            expires_text = None
            if expires_in_seconds is not None:
                expires_text = as_utc_text(instant + timedelta(seconds=expires_in_seconds))
            identity = {
                "version": 1,
                "action_type": action_type,
                "target": target,
                "payload": payload,
                "risk": risk,
                "is_external": bool(is_external),
                "reversible": bool(reversible),
                "expires_at": expires_text,
            }
            action_hash = canonical_hash(identity)
            connection.execute(
                """
                INSERT INTO proposed_actions(
                    action_id, run_id, action_type, target, payload_json,
                    action_hash, risk, is_external, reversible, status,
                    proposed_by, idempotency_key, proposed_at, expires_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'proposed', ?, ?, ?, ?)
                """,
                (
                    desired_id,
                    run_id,
                    action_type,
                    target,
                    payload_json,
                    action_hash,
                    risk,
                    int(is_external),
                    int(reversible),
                    proposed_by,
                    idempotency_key,
                    proposed_text,
                    expires_text,
                ),
            )
            return self._get_action(connection, desired_id)

    def get_action(self, action_id: str) -> ProposedAction:
        """Return one proposed action by ID."""

        return self._get_action(self.connection, action_id)

    def _get_action(self, connection: sqlite3.Connection, action_id: str) -> ProposedAction:
        row = connection.execute(
            "SELECT * FROM proposed_actions WHERE action_id = ?", (action_id,)
        ).fetchone()
        if row is None:
            raise NotFound("action not found: %s" % action_id)
        return _action_from_row(row)

    def list_actions(
        self, *, status: Optional[str] = None, limit: int = 100
    ) -> List[ProposedAction]:
        """List recent proposals, optionally filtered by status."""

        if limit <= 0:
            raise ValueError("limit must be greater than zero")
        if status is None:
            rows = self.connection.execute(
                "SELECT * FROM proposed_actions ORDER BY proposed_at DESC LIMIT ?", (limit,)
            ).fetchall()
        else:
            rows = self.connection.execute(
                """
                SELECT * FROM proposed_actions
                WHERE status = ? ORDER BY proposed_at DESC LIMIT ?
                """,
                (status, limit),
            ).fetchall()
        return [_action_from_row(row) for row in rows]

    def approve_action(
        self,
        action_id: str,
        expected_action_hash: str,
        actor: str,
        *,
        ttl_seconds: Union[int, float] = 1800,
        reason: Optional[str] = None,
        at: Optional[datetime] = None,
    ) -> Approval:
        """Approve one exact action hash for a bounded period.

        The caller must supply the hash it reviewed.  This prevents a generic
        response such as "send it" from approving a changed payload.  ``actor``
        is an unauthenticated assertion, not identity proof.  See
        :data:`UNAUTHENTICATED_APPROVAL_WARNING`.
        """

        actor = _require_text(actor, "actor")
        _require_text(expected_action_hash, "expected_action_hash")
        if ttl_seconds <= 0:
            raise ValueError("ttl_seconds must be greater than zero")
        instant = utc_now() if at is None else at
        decided_text = as_utc_text(instant)
        expires_text = as_utc_text(instant + timedelta(seconds=ttl_seconds))
        with self._database.transaction() as connection:
            action = self._get_action(connection, action_id)
            self._require_matching_hash(action, expected_action_hash)
            if action.status in ("rejected", "cancelled", "executed"):
                raise InvalidStateTransition(
                    "cannot approve action %s from %s" % (action_id, action.status)
                )
            if action.expires_at is not None and action.expires_at <= decided_text:
                raise PolicyDenied("the proposed action has expired")
            approval_id = _new_id("apr")
            connection.execute(
                """
                INSERT INTO approvals(
                    approval_id, action_id, action_hash, decision, actor,
                    reason, decided_at, expires_at
                ) VALUES (?, ?, ?, 'approved', ?, ?, ?, ?)
                """,
                (
                    approval_id,
                    action_id,
                    expected_action_hash,
                    actor,
                    reason,
                    decided_text,
                    expires_text,
                ),
            )
            connection.execute(
                "UPDATE proposed_actions SET status = 'approved' WHERE action_id = ?",
                (action_id,),
            )
            row = connection.execute(
                "SELECT * FROM approvals WHERE approval_id = ?", (approval_id,)
            ).fetchone()
            return _approval_from_row(row)

    def reject_action(
        self,
        action_id: str,
        expected_action_hash: str,
        actor: str,
        *,
        reason: Optional[str] = None,
        at: Optional[datetime] = None,
    ) -> Approval:
        """Reject one exact proposal using an unauthenticated actor assertion."""

        actor = _require_text(actor, "actor")
        _require_text(expected_action_hash, "expected_action_hash")
        decided_text = as_utc_text(at)
        with self._database.transaction() as connection:
            action = self._get_action(connection, action_id)
            self._require_matching_hash(action, expected_action_hash)
            if action.status in ("executed", "cancelled"):
                raise InvalidStateTransition(
                    "cannot reject action %s from %s" % (action_id, action.status)
                )
            approval_id = _new_id("apr")
            connection.execute(
                """
                INSERT INTO approvals(
                    approval_id, action_id, action_hash, decision, actor,
                    reason, decided_at, expires_at
                ) VALUES (?, ?, ?, 'rejected', ?, ?, ?, NULL)
                """,
                (approval_id, action_id, expected_action_hash, actor, reason, decided_text),
            )
            connection.execute(
                "UPDATE proposed_actions SET status = 'rejected' WHERE action_id = ?",
                (action_id,),
            )
            row = connection.execute(
                "SELECT * FROM approvals WHERE approval_id = ?", (approval_id,)
            ).fetchone()
            return _approval_from_row(row)

    @staticmethod
    def _require_matching_hash(action: ProposedAction, expected_action_hash: str) -> None:
        if action.action_hash != expected_action_hash:
            raise ApprovalHashMismatch(
                "reviewed hash does not match proposed action %s" % action.action_id
            )

    def list_approvals(self, action_id: str) -> List[Approval]:
        """Return the immutable decision history for an action."""

        self.get_action(action_id)
        rows = self.connection.execute(
            """
            SELECT * FROM approvals
            WHERE action_id = ? ORDER BY decided_at ASC, rowid ASC
            """,
            (action_id,),
        ).fetchall()
        return [_approval_from_row(row) for row in rows]

    def evaluate_action(
        self,
        action_id: str,
        expected_action_hash: str,
        *,
        at: Optional[datetime] = None,
    ) -> ActionPolicyDecision:
        """Evaluate whether the exact reviewed proposal may execute now.

        Only internal, low risk, reversible actions are allowed without
        approval.  External, medium or higher risk, and irreversible actions
        require the latest exact, unexpired approval.  This method does not
        execute anything.
        """

        return self._evaluate_action(
            self.connection, action_id, expected_action_hash, as_utc_text(at)
        )

    def _evaluate_action(
        self,
        connection: sqlite3.Connection,
        action_id: str,
        expected_action_hash: str,
        now_text: str,
    ) -> ActionPolicyDecision:
        action = self._get_action(connection, action_id)
        effective = classify_action(
            action.action_type,
            requested_risk=action.risk,
            requested_external=action.is_external,
            requested_reversible=action.reversible,
        )
        requires_approval = effective.requires_approval
        if action.action_hash != expected_action_hash:
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                requires_approval,
                "expected action hash does not match stored proposal",
            )
        if (
            effective.risk != action.risk
            or effective.is_external != action.is_external
            or effective.reversible != action.reversible
        ):
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                requires_approval,
                "stored classification is weaker than the action registry; repropose",
            )
        if requires_approval and (
            not action.idempotency_key or action.expires_at is None
        ):
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                True,
                "approval-required proposal lacks idempotency or bounded expiry",
            )
        if requires_approval:
            proposal_lifetime = (
                parse_utc_text(action.expires_at) - parse_utc_text(action.proposed_at)
            ).total_seconds()
            if (
                proposal_lifetime <= 0
                or proposal_lifetime > MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS
            ):
                return ActionPolicyDecision(
                    action_id,
                    action.action_hash,
                    False,
                    True,
                    "approval-required proposal expiry is outside the allowed bound",
                )
        if action.status in ("rejected", "cancelled", "executed"):
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                requires_approval,
                "action status is %s" % action.status,
            )
        if action.expires_at is not None and action.expires_at <= now_text:
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                requires_approval,
                "proposed action has expired",
            )
        if not requires_approval:
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                True,
                False,
                "internal low risk reversible action does not require approval",
            )
        row = connection.execute(
            """
            SELECT * FROM approvals
            WHERE action_id = ? AND action_hash = ? AND decided_at <= ?
            ORDER BY decided_at DESC, rowid DESC LIMIT 1
            """,
            (action_id, action.action_hash, now_text),
        ).fetchone()
        if row is None:
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                True,
                "exact approval is required",
            )
        approval = _approval_from_row(row)
        if approval.decision != "approved":
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                True,
                "latest exact decision rejected the action",
                approval.approval_id,
            )
        if approval.expires_at is None or approval.expires_at <= now_text:
            return ActionPolicyDecision(
                action_id,
                action.action_hash,
                False,
                True,
                "exact approval has expired",
                approval.approval_id,
            )
        return ActionPolicyDecision(
            action_id,
            action.action_hash,
            True,
            True,
            "exact approval is valid",
            approval.approval_id,
        )

    def require_action_authorization(
        self,
        action_id: str,
        expected_action_hash: str,
        *,
        at: Optional[datetime] = None,
    ) -> ActionPolicyDecision:
        """Return an allowed decision or raise :class:`PolicyDenied`."""

        decision = self.evaluate_action(action_id, expected_action_hash, at=at)
        if not decision.allowed:
            raise PolicyDenied(decision.reason)
        return decision
