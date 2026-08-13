import os
import sqlite3
import stat
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

from jarvis_core import IdempotencyConflict, InvalidStateTransition, RuntimeStore
from jarvis_core.database import SCHEMA_VERSION


NOW = datetime(2026, 7, 12, 12, 0, tzinfo=timezone.utc)


class RuntimeStoreTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.path = Path(self.temporary.name) / "private" / "runtime.sqlite3"
        self.store = RuntimeStore(self.path)

    def tearDown(self):
        self.store.close()
        self.temporary.cleanup()

    def test_migration_schema_and_private_permissions(self):
        tables = {
            row[0]
            for row in self.store.connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            )
        }
        self.assertTrue(
            {
                "events",
                "facts",
                "commitments",
                "tasks",
                "runs",
                "proposed_actions",
                "approvals",
                "work_queue",
            }.issubset(tables)
        )
        # Assert against the constant, not a literal, so adding a migration does not
        # break this test. Migration 2 added resource-scoped leases.
        self.assertEqual(
            SCHEMA_VERSION,
            self.store.connection.execute("PRAGMA user_version").fetchone()[0],
        )
        self.assertEqual("wal", self.store.connection.execute("PRAGMA journal_mode").fetchone()[0])
        self.assertEqual(1, self.store.connection.execute("PRAGMA foreign_keys").fetchone()[0])
        self.assertEqual(0o600, stat.S_IMODE(os.stat(self.path).st_mode))
        self.assertEqual(0o700, stat.S_IMODE(os.stat(self.path.parent).st_mode))

    def test_events_are_append_only_and_idempotent(self):
        first = self.store.append_event(
            "calendar.changed",
            "google-calendar",
            {"event": "Council", "time": "14:00"},
            occurred_at=NOW,
            idempotency_key="calendar-42-v3",
        )
        replay = self.store.append_event(
            "calendar.changed",
            "google-calendar",
            {"time": "14:00", "event": "Council"},
            occurred_at=NOW,
            idempotency_key="calendar-42-v3",
        )
        self.assertEqual(first.event_id, replay.event_id)
        with self.assertRaises(IdempotencyConflict):
            self.store.append_event(
                "calendar.changed",
                "google-calendar",
                {"event": "Council", "time": "15:00"},
                occurred_at=NOW,
                idempotency_key="calendar-42-v3",
            )
        with self.assertRaises(sqlite3.IntegrityError):
            self.store.connection.execute(
                "UPDATE events SET event_type = 'tampered' WHERE event_id = ?",
                (first.event_id,),
            )

    def test_event_replay_without_explicit_time_returns_original(self):
        first = self.store.append_event(
            "capture.received", "telegram", {"text": "Call Laurence"}, idempotency_key="99"
        )
        replay = self.store.append_event(
            "capture.received", "telegram", {"text": "Call Laurence"}, idempotency_key="99"
        )
        self.assertEqual(first, replay)

    def test_event_explicit_id_and_idempotency_key_cannot_diverge(self):
        self.store.append_event(
            "capture.received",
            "telegram",
            {"text": "One"},
            event_id="evt_fixed",
            idempotency_key="telegram-1",
            occurred_at=NOW,
        )
        with self.assertRaises(IdempotencyConflict):
            self.store.append_event(
                "capture.received",
                "telegram",
                {"text": "One"},
                event_id="evt_fixed",
                idempotency_key="telegram-2",
                occurred_at=NOW,
            )
        with self.assertRaises(IdempotencyConflict):
            self.store.append_event(
                "capture.received",
                "telegram",
                {"text": "One"},
                event_id="evt_other",
                idempotency_key="telegram-1",
                occurred_at=NOW,
            )

    def test_run_lifecycle_is_durable_and_guarded(self):
        run = self.store.create_run(
            "morning-brief", {"date": "2026-07-12"}, idempotency_key="brief-2026-07-12"
        )
        self.assertEqual("pending", run.status)
        self.assertEqual("running", self.store.start_run(run.run_id, at=NOW).status)
        completed = self.store.complete_run(run.run_id, {"sent": False}, at=NOW)
        self.assertEqual("succeeded", completed.status)
        self.assertEqual({"sent": False}, completed.output)
        self.assertEqual(completed, self.store.complete_run(run.run_id, {"sent": False}, at=NOW))
        with self.assertRaises(InvalidStateTransition):
            self.store.fail_run(run.run_id, "late failure", at=NOW)

        self.store.close()
        self.store = RuntimeStore(self.path)
        self.assertEqual("succeeded", self.store.get_run(run.run_id).status)

    def test_run_explicit_id_and_idempotency_key_cannot_diverge(self):
        self.store.create_run(
            "brief", {"date": "2026-07-12"}, run_id="run_fixed", idempotency_key="brief-1"
        )
        with self.assertRaises(IdempotencyConflict):
            self.store.create_run(
                "brief",
                {"date": "2026-07-12"},
                run_id="run_fixed",
                idempotency_key="brief-2",
            )
        with self.assertRaises(IdempotencyConflict):
            self.store.create_run(
                "brief",
                {"date": "2026-07-12"},
                run_id="run_other",
                idempotency_key="brief-1",
            )


if __name__ == "__main__":
    unittest.main()
