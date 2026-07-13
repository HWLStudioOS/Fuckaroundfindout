"""Durable task queue and authorization helpers for telegram-agent.py."""

from dataclasses import dataclass
import os
from pathlib import Path
import sqlite3
import time
from typing import Iterable, Mapping, Optional, Tuple


@dataclass(frozen=True)
class TelegramTask:
    id: int
    update_id: int
    message_id: int
    chat_id: int
    text: str
    reset_epoch: float
    enqueued_at: float


def normalize_telegram_ids(values: Iterable[object]) -> set:
    """Return integer Telegram IDs, ignoring missing or malformed values."""
    normalized = set()
    for value in values:
        if value is None or isinstance(value, bool):
            continue
        try:
            normalized.add(int(value))
        except (TypeError, ValueError):
            continue
    return normalized


def is_authorized_private_message(message: Mapping, allowed_ids: Iterable[object]) -> bool:
    """Require a private chat and independently allowlisted chat and sender IDs."""
    chat = message.get("chat") or {}
    sender = message.get("from") or {}
    if chat.get("type") != "private":
        return False
    allowed = normalize_telegram_ids(allowed_ids)
    try:
        chat_id = int(chat["id"])
        sender_id = int(sender["id"])
    except (KeyError, TypeError, ValueError):
        return False
    return chat_id in allowed and sender_id in allowed


class TelegramTaskQueue:
    """Small SQLite queue with conservative crash recovery semantics."""

    TERMINAL_STATUSES = {"completed", "failed", "cancelled"}

    def __init__(self, path: Path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()
        try:
            os.chmod(self.path, 0o600)
        except OSError:
            # Some mounted filesystems do not expose POSIX modes.
            pass

    def _connect(self):
        conn = sqlite3.connect(str(self.path), timeout=10, isolation_level=None)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA busy_timeout = 10000")
        conn.execute("PRAGMA synchronous = FULL")
        return conn

    def _initialize(self):
        with self._connect() as conn:
            # DELETE journaling avoids persistent sidecars next to sensitive task text.
            conn.execute("PRAGMA journal_mode = DELETE")
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS telegram_tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    update_id INTEGER NOT NULL UNIQUE,
                    message_id INTEGER NOT NULL,
                    chat_id INTEGER NOT NULL,
                    text TEXT NOT NULL,
                    reset_epoch REAL NOT NULL,
                    status TEXT NOT NULL,
                    enqueued_at REAL NOT NULL,
                    started_at REAL,
                    finished_at REAL,
                    detail TEXT
                )
                """
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS telegram_tasks_status_id "
                "ON telegram_tasks(status, id)"
            )

    def enqueue(
        self,
        *,
        update_id: int,
        message_id: int,
        chat_id: int,
        text: str,
        reset_epoch: float,
    ) -> Tuple[int, bool]:
        """Persist a task idempotently, returning (task_id, inserted)."""
        now = time.time()
        with self._connect() as conn:
            cursor = conn.execute(
                """
                INSERT OR IGNORE INTO telegram_tasks
                    (update_id, message_id, chat_id, text, reset_epoch, status, enqueued_at)
                VALUES (?, ?, ?, ?, ?, 'queued', ?)
                """,
                (update_id, message_id, chat_id, text, reset_epoch, now),
            )
            inserted = cursor.rowcount == 1
            row = conn.execute(
                "SELECT id FROM telegram_tasks WHERE update_id = ?", (update_id,)
            ).fetchone()
        if row is None:
            raise RuntimeError(f"task was not persisted for update {update_id}")
        return int(row["id"]), inserted

    def claim_next(self) -> Optional[TelegramTask]:
        """Atomically move the oldest queued task to running."""
        conn = self._connect()
        try:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute(
                """
                SELECT id, update_id, message_id, chat_id, text, reset_epoch, enqueued_at
                FROM telegram_tasks
                WHERE status = 'queued'
                ORDER BY id
                LIMIT 1
                """
            ).fetchone()
            if row is None:
                conn.execute("COMMIT")
                return None
            changed = conn.execute(
                """
                UPDATE telegram_tasks
                SET status = 'running', started_at = ?, finished_at = NULL, detail = NULL
                WHERE id = ? AND status = 'queued'
                """,
                (time.time(), row["id"]),
            ).rowcount
            if changed != 1:
                conn.execute("ROLLBACK")
                return None
            conn.execute("COMMIT")
            return TelegramTask(
                id=int(row["id"]),
                update_id=int(row["update_id"]),
                message_id=int(row["message_id"]),
                chat_id=int(row["chat_id"]),
                text=row["text"],
                reset_epoch=float(row["reset_epoch"]),
                enqueued_at=float(row["enqueued_at"]),
            )
        except Exception:
            try:
                conn.execute("ROLLBACK")
            except sqlite3.Error:
                pass
            raise
        finally:
            conn.close()

    def finish(self, task_id: int, status: str, detail: Optional[str] = None) -> bool:
        """Finish a running task; stale/non-running claims are left untouched."""
        if status not in self.TERMINAL_STATUSES:
            raise ValueError(f"invalid terminal status: {status}")
        with self._connect() as conn:
            changed = conn.execute(
                """
                UPDATE telegram_tasks
                SET status = ?, finished_at = ?, detail = ?
                WHERE id = ? AND status = 'running'
                """,
                (status, time.time(), detail, task_id),
            ).rowcount
        return changed == 1

    def recover_interrupted(self) -> int:
        """Quarantine running work after restart so it is never auto-reexecuted."""
        now = time.time()
        with self._connect() as conn:
            changed = conn.execute(
                """
                UPDATE telegram_tasks
                SET status = 'needs_review', finished_at = ?,
                    detail = 'Agent stopped while this task was running; not retried automatically.'
                WHERE status = 'running'
                """,
                (now,),
            ).rowcount
        return changed

    def count(self, status: str) -> int:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT COUNT(*) AS count FROM telegram_tasks WHERE status = ?", (status,)
            ).fetchone()
        return int(row["count"])
