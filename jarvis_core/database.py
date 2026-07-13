"""Connection management and versioned SQLite migrations."""

from __future__ import annotations

import sqlite3
import os
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator, Sequence, Union

from ._time import as_utc_text


@dataclass(frozen=True)
class Migration:
    """One ordered, transactional database migration."""

    version: int
    name: str
    statements: Sequence[str]


MIGRATIONS = (
    Migration(
        1,
        "initial durable runtime ledger",
        (
            """
            CREATE TABLE events (
                event_id TEXT PRIMARY KEY,
                event_type TEXT NOT NULL,
                source TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                payload_hash TEXT NOT NULL,
                occurred_at TEXT NOT NULL,
                recorded_at TEXT NOT NULL,
                entity_type TEXT,
                entity_id TEXT,
                correlation_id TEXT,
                causation_id TEXT REFERENCES events(event_id),
                idempotency_key TEXT,
                metadata_json TEXT NOT NULL DEFAULT '{}',
                UNIQUE(source, idempotency_key)
            )
            """,
            "CREATE INDEX events_type_time_idx ON events(event_type, occurred_at)",
            "CREATE INDEX events_entity_idx ON events(entity_type, entity_id, occurred_at)",
            """
            CREATE TRIGGER events_no_update
            BEFORE UPDATE ON events
            BEGIN
                SELECT RAISE(ABORT, 'events are append-only');
            END
            """,
            """
            CREATE TRIGGER events_no_delete
            BEFORE DELETE ON events
            BEGIN
                SELECT RAISE(ABORT, 'events are append-only');
            END
            """,
            """
            CREATE TABLE facts (
                fact_id TEXT PRIMARY KEY,
                subject TEXT NOT NULL,
                predicate TEXT NOT NULL,
                value_json TEXT NOT NULL,
                value_hash TEXT NOT NULL,
                confidence REAL NOT NULL DEFAULT 1.0 CHECK(confidence >= 0 AND confidence <= 1),
                source_event_id TEXT REFERENCES events(event_id),
                observed_at TEXT NOT NULL,
                valid_from TEXT,
                valid_to TEXT,
                expires_at TEXT,
                superseded_by TEXT REFERENCES facts(fact_id),
                sensitivity TEXT NOT NULL DEFAULT 'private'
                    CHECK(sensitivity IN ('public', 'internal', 'private', 'restricted')),
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """,
            "CREATE INDEX facts_lookup_idx ON facts(subject, predicate, observed_at)",
            "CREATE INDEX facts_source_idx ON facts(source_event_id)",
            """
            CREATE TABLE commitments (
                commitment_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                owner TEXT NOT NULL,
                counterparty TEXT,
                status TEXT NOT NULL DEFAULT 'open'
                    CHECK(status IN ('proposed', 'open', 'done', 'cancelled', 'superseded')),
                due_at TEXT,
                source_event_id TEXT REFERENCES events(event_id),
                metadata_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                completed_at TEXT
            )
            """,
            "CREATE INDEX commitments_status_due_idx ON commitments(status, due_at)",
            """
            CREATE TABLE tasks (
                task_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending', 'in_progress', 'done', 'blocked', 'cancelled')),
                priority INTEGER NOT NULL DEFAULT 0,
                due_at TEXT,
                commitment_id TEXT REFERENCES commitments(commitment_id),
                source_event_id TEXT REFERENCES events(event_id),
                assignee TEXT,
                metadata_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                completed_at TEXT
            )
            """,
            "CREATE INDEX tasks_status_due_idx ON tasks(status, priority DESC, due_at)",
            "CREATE INDEX tasks_commitment_idx ON tasks(commitment_id)",
            """
            CREATE TABLE runs (
                run_id TEXT PRIMARY KEY,
                run_type TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending', 'running', 'succeeded', 'failed', 'cancelled', 'needs_review')),
                input_json TEXT NOT NULL,
                input_hash TEXT NOT NULL,
                output_json TEXT,
                error TEXT,
                idempotency_key TEXT,
                created_at TEXT NOT NULL,
                started_at TEXT,
                finished_at TEXT,
                updated_at TEXT NOT NULL,
                UNIQUE(run_type, idempotency_key)
            )
            """,
            "CREATE INDEX runs_status_time_idx ON runs(status, created_at)",
            """
            CREATE TABLE proposed_actions (
                action_id TEXT PRIMARY KEY,
                run_id TEXT REFERENCES runs(run_id),
                action_type TEXT NOT NULL,
                target TEXT,
                payload_json TEXT NOT NULL,
                action_hash TEXT NOT NULL,
                risk TEXT NOT NULL CHECK(risk IN ('low', 'medium', 'high', 'critical')),
                is_external INTEGER NOT NULL CHECK(is_external IN (0, 1)),
                reversible INTEGER NOT NULL CHECK(reversible IN (0, 1)),
                status TEXT NOT NULL DEFAULT 'proposed'
                    CHECK(status IN ('proposed', 'approved', 'rejected', 'executed', 'cancelled')),
                proposed_by TEXT NOT NULL,
                idempotency_key TEXT UNIQUE,
                proposed_at TEXT NOT NULL,
                expires_at TEXT,
                executed_at TEXT
            )
            """,
            "CREATE INDEX proposed_actions_status_idx ON proposed_actions(status, proposed_at)",
            "CREATE INDEX proposed_actions_run_idx ON proposed_actions(run_id)",
            """
            CREATE TRIGGER proposed_actions_identity_immutable
            BEFORE UPDATE OF run_id, action_type, target, payload_json, action_hash,
                risk, is_external, reversible, proposed_by, idempotency_key,
                proposed_at, expires_at
            ON proposed_actions
            BEGIN
                SELECT RAISE(ABORT, 'proposed action identity is immutable');
            END
            """,
            """
            CREATE TABLE approvals (
                approval_id TEXT PRIMARY KEY,
                action_id TEXT NOT NULL REFERENCES proposed_actions(action_id),
                action_hash TEXT NOT NULL,
                decision TEXT NOT NULL CHECK(decision IN ('approved', 'rejected')),
                actor TEXT NOT NULL,
                reason TEXT,
                decided_at TEXT NOT NULL,
                expires_at TEXT
            )
            """,
            "CREATE INDEX approvals_action_time_idx ON approvals(action_id, decided_at DESC)",
            """
            CREATE TRIGGER approvals_no_update
            BEFORE UPDATE ON approvals
            BEGIN
                SELECT RAISE(ABORT, 'approvals are immutable');
            END
            """,
            """
            CREATE TRIGGER approvals_no_delete
            BEFORE DELETE ON approvals
            BEGIN
                SELECT RAISE(ABORT, 'approvals are immutable');
            END
            """,
            """
            CREATE TABLE work_queue (
                job_id TEXT PRIMARY KEY,
                queue_name TEXT NOT NULL,
                kind TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                payload_hash TEXT NOT NULL,
                state TEXT NOT NULL DEFAULT 'pending'
                    CHECK(state IN ('pending', 'running', 'done', 'failed', 'needs_review')),
                idempotency_key TEXT NOT NULL,
                priority INTEGER NOT NULL DEFAULT 0,
                available_at TEXT NOT NULL,
                attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0),
                max_attempts INTEGER NOT NULL DEFAULT 3 CHECK(max_attempts > 0),
                lease_owner TEXT,
                lease_expires_at TEXT,
                result_json TEXT,
                error TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                completed_at TEXT,
                UNIQUE(queue_name, idempotency_key)
            )
            """,
            """
            CREATE INDEX work_queue_claim_idx
            ON work_queue(queue_name, state, available_at, priority DESC, created_at)
            """,
        ),
    ),
)

SCHEMA_VERSION = MIGRATIONS[-1].version


class Database:
    """Own a configured SQLite connection and keep its schema current."""

    def __init__(self, path: Union[str, Path] = ":memory:", *, timeout: float = 5.0) -> None:
        self.path = str(path)
        if self.path != ":memory:":
            database_path = Path(self.path).expanduser()
            self.path = str(database_path)
            parent_was_missing = not database_path.parent.exists()
            database_path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            if parent_was_missing:
                os.chmod(str(database_path.parent), 0o700)
            if not database_path.exists():
                descriptor = os.open(str(database_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
                os.close(descriptor)
            os.chmod(str(database_path), 0o600)
        self.connection = sqlite3.connect(
            self.path,
            timeout=timeout,
            isolation_level=None,
        )
        self.connection.row_factory = sqlite3.Row
        self.connection.execute("PRAGMA foreign_keys = ON")
        self.connection.execute(f"PRAGMA busy_timeout = {max(0, int(timeout * 1000))}")
        if self.path != ":memory:":
            self.connection.execute("PRAGMA journal_mode = WAL")
            self.connection.execute("PRAGMA synchronous = FULL")
            self._secure_sidecars()
        self._migrate()

    def _migrate(self) -> None:
        connection = self.connection
        connection.execute("BEGIN IMMEDIATE")
        try:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    version INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    applied_at TEXT NOT NULL
                )
                """
            )
            applied = {
                row["version"]
                for row in connection.execute("SELECT version FROM schema_migrations")
            }
            unknown = [version for version in applied if version > SCHEMA_VERSION]
            if unknown:
                raise RuntimeError(
                    f"database schema version {max(unknown)} is newer than supported {SCHEMA_VERSION}"
                )
            for migration in MIGRATIONS:
                if migration.version in applied:
                    continue
                for statement in migration.statements:
                    connection.execute(statement)
                connection.execute(
                    "INSERT INTO schema_migrations(version, name, applied_at) VALUES (?, ?, ?)",
                    (migration.version, migration.name, as_utc_text()),
                )
                connection.execute(f"PRAGMA user_version = {migration.version}")
            connection.execute("COMMIT")
        except BaseException:
            connection.execute("ROLLBACK")
            raise

    @contextmanager
    def transaction(self, *, immediate: bool = True) -> Iterator[sqlite3.Connection]:
        """Run a block in an explicit transaction and roll back on error."""

        self.connection.execute("BEGIN IMMEDIATE" if immediate else "BEGIN")
        try:
            yield self.connection
        except BaseException:
            self.connection.execute("ROLLBACK")
            raise
        else:
            self.connection.execute("COMMIT")

    def close(self) -> None:
        """Close the underlying SQLite connection."""

        if self.path != ":memory:":
            self.connection.execute("PRAGMA wal_checkpoint(PASSIVE)")
            self._secure_sidecars()
        self.connection.close()

    def _secure_sidecars(self) -> None:
        """Restrict the database and any SQLite WAL sidecars to the owner."""

        for suffix in ("", "-wal", "-shm"):
            candidate = self.path + suffix
            if os.path.exists(candidate):
                os.chmod(candidate, 0o600)

    def __enter__(self) -> "Database":
        return self

    def __exit__(self, exc_type: object, exc: object, traceback: object) -> None:
        self.close()
