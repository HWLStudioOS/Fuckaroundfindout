"""Resource-scoped leases: a claim can now mean "I am writing this file".

Restructure Phase 4. Before this, a lease covered a queue item and nothing
more, so two workers could hold perfectly valid leases on different items and
write the same file. Coordination between writers was advisory, which on
13 August meant two Claude sessions avoided a collision only because one
voluntarily messaged the other.

The exclusion is deliberately scoped to *running* leases that have not expired,
so a hung worker cannot block a resource forever: its lease expires, recovery
moves it to needs_review, and the resource frees.
"""

import unittest
from datetime import timedelta
from pathlib import Path
from tempfile import TemporaryDirectory

from jarvis_core._time import utc_now
from jarvis_core.database import Database, SCHEMA_VERSION
from jarvis_core.queue import WorkQueue


class ResourceLeaseTests(unittest.TestCase):
    def setUp(self):
        self._tmp = TemporaryDirectory()
        self.db = Database(Path(self._tmp.name) / "queue.sqlite3")
        self.q = WorkQueue(self.db)

    def tearDown(self):
        self._tmp.cleanup()

    def test_schema_migrated_to_resource_scoped_leases(self):
        self.assertGreaterEqual(SCHEMA_VERSION, 2)

    def test_two_items_on_one_resource_cannot_both_be_claimed(self):
        """The core guarantee. today.md has one writer at a time."""
        self.q.enqueue("write", {"n": 1}, resource="today.md")
        self.q.enqueue("write", {"n": 2}, resource="today.md")

        first = self.q.claim_next("morning-brief")
        self.assertIsNotNone(first)
        self.assertEqual(first.resource, "today.md")

        blocked = self.q.claim_next("evening-reflection")
        self.assertIsNone(blocked, "second worker claimed a resource already held")

    def test_different_resources_claim_concurrently(self):
        """Exclusion must be per resource, not a global lock."""
        self.q.enqueue("write", {"n": 1}, resource="today.md")
        self.q.enqueue("write", {"n": 2}, resource="this-week.md")

        a = self.q.claim_next("worker-a")
        b = self.q.claim_next("worker-b")
        self.assertIsNotNone(a)
        self.assertIsNotNone(b)
        self.assertNotEqual(a.resource, b.resource)

    def test_items_without_a_resource_are_unaffected(self):
        """Most work names no file and must not be serialised."""
        self.q.enqueue("compute", {"n": 1})
        self.q.enqueue("compute", {"n": 2})
        self.assertIsNotNone(self.q.claim_next("worker-a"))
        self.assertIsNotNone(self.q.claim_next("worker-b"))

    def test_resource_frees_once_the_holding_lease_expires(self):
        """A hung worker must not hold a file forever."""
        self.q.enqueue("write", {"n": 1}, resource="today.md")
        self.q.enqueue("write", {"n": 2}, resource="today.md")

        held = self.q.claim_next("stuck-worker", lease_seconds=60)
        self.assertIsNotNone(held)
        self.assertIsNone(self.q.claim_next("waiting-worker"))

        later = utc_now() + timedelta(seconds=120)
        freed = self.q.claim_next("waiting-worker", at=later)
        self.assertIsNotNone(freed, "resource stayed locked after its lease expired")

    def test_expired_holder_goes_to_needs_review_not_silently_replayed(self):
        """Side-effect status is unknown, so it must quarantine."""
        self.q.enqueue("write", {"n": 1}, resource="today.md")
        held = self.q.claim_next("stuck-worker", lease_seconds=60)

        later = utc_now() + timedelta(seconds=120)
        self.q.recover_expired_leases(at=later)
        self.assertEqual(self.q.get(held.job_id).state, "needs_review")

    def test_completed_work_releases_its_resource(self):
        self.q.enqueue("write", {"n": 1}, resource="today.md")
        self.q.enqueue("write", {"n": 2}, resource="today.md")

        first = self.q.claim_next("worker-a")
        self.q.complete(first.job_id, "worker-a", {"ok": True})

        second = self.q.claim_next("worker-b")
        self.assertIsNotNone(second, "resource stayed locked after completion")

    def test_resource_survives_the_round_trip(self):
        item = self.q.enqueue("write", {"n": 1}, resource="money/index.md")
        self.assertEqual(self.q.get(item.job_id).resource, "money/index.md")


if __name__ == "__main__":
    unittest.main()
