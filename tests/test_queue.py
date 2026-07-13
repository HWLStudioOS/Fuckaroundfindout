import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from jarvis_core import (
    IdempotencyConflict,
    InvalidStateTransition,
    QueueLeaseError,
    WorkQueue,
)


NOW = datetime(2026, 7, 12, 12, 0, tzinfo=timezone.utc)


class WorkQueueTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.path = Path(self.temporary.name) / "runtime.sqlite3"
        self.queue = WorkQueue(self.path)

    def tearDown(self):
        self.queue.close()
        self.temporary.cleanup()

    def test_enqueue_is_idempotent_and_detects_key_conflict(self):
        first = self.queue.enqueue(
            "brief.build", {"date": "2026-07-12"}, idempotency_key="brief-12"
        )
        replay = self.queue.enqueue(
            "brief.build", {"date": "2026-07-12"}, idempotency_key="brief-12"
        )
        self.assertEqual(first.job_id, replay.job_id)
        self.assertEqual("pending", first.state)
        with self.assertRaises(IdempotencyConflict):
            self.queue.enqueue(
                "brief.build", {"date": "2026-07-13"}, idempotency_key="brief-12"
            )

    def test_explicit_job_id_and_idempotency_key_cannot_diverge(self):
        self.queue.enqueue(
            "brief.build",
            {"date": "2026-07-12"},
            job_id="job_fixed",
            idempotency_key="brief-1",
        )
        with self.assertRaises(IdempotencyConflict):
            self.queue.enqueue(
                "brief.build",
                {"date": "2026-07-12"},
                job_id="job_fixed",
                idempotency_key="brief-2",
            )
        with self.assertRaises(IdempotencyConflict):
            self.queue.enqueue(
                "brief.build",
                {"date": "2026-07-12"},
                job_id="job_other",
                idempotency_key="brief-1",
            )

    def test_claim_priority_owner_and_completion(self):
        low = self.queue.enqueue(
            "sync", {"n": 1}, priority=1, available_at=NOW, idempotency_key="low"
        )
        high = self.queue.enqueue(
            "sync", {"n": 2}, priority=10, available_at=NOW, idempotency_key="high"
        )
        claimed = self.queue.claim_next("worker-a", at=NOW, lease_seconds=60)
        self.assertEqual(high.job_id, claimed.job_id)
        self.assertEqual("running", claimed.state)
        self.assertEqual(1, claimed.attempts)
        with self.assertRaises(QueueLeaseError):
            self.queue.complete(claimed.job_id, "worker-b", {"ok": True}, at=NOW)
        done = self.queue.complete(
            claimed.job_id, "worker-a", {"ok": True}, at=NOW + timedelta(seconds=30)
        )
        self.assertEqual("done", done.state)
        self.assertEqual({"ok": True}, done.result)
        self.assertEqual(low.job_id, self.queue.claim_next("worker-a", at=NOW).job_id)

    def test_expired_lease_needs_review_instead_of_replay(self):
        item = self.queue.enqueue("email.send", {"to": "a@example.com"}, available_at=NOW)
        claimed = self.queue.claim_next("worker-a", at=NOW, lease_seconds=10)
        self.assertEqual(item.job_id, claimed.job_id)
        self.assertIsNone(
            self.queue.claim_next("worker-b", at=NOW + timedelta(seconds=11))
        )
        reviewed = self.queue.get(item.job_id)
        self.assertEqual("needs_review", reviewed.state)
        self.assertIn("lease expired", reviewed.error)
        retried = self.queue.retry(item.job_id, available_at=NOW + timedelta(seconds=12))
        self.assertEqual("pending", retried.state)

    def test_late_completion_marks_review_and_raises(self):
        item = self.queue.enqueue("external.call", {"id": 1}, available_at=NOW)
        self.queue.claim_next("worker-a", at=NOW, lease_seconds=5)
        with self.assertRaises(QueueLeaseError):
            self.queue.complete(
                item.job_id, "worker-a", {"ok": True}, at=NOW + timedelta(seconds=6)
            )
        self.assertEqual("needs_review", self.queue.get(item.job_id).state)

    def test_failed_work_requires_explicit_retry(self):
        item = self.queue.enqueue(
            "research", {"topic": "x"}, available_at=NOW, max_attempts=1
        )
        self.queue.claim_next("worker", at=NOW)
        failed = self.queue.fail(item.job_id, "worker", "source unavailable", at=NOW)
        self.assertEqual("failed", failed.state)
        with self.assertRaises(InvalidStateTransition):
            self.queue.retry(item.job_id)
        self.assertEqual("pending", self.queue.retry(item.job_id, reset_attempts=True).state)


if __name__ == "__main__":
    unittest.main()
