import sqlite3
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from jarvis_core import (
    ApprovalHashMismatch,
    IdempotencyConflict,
    MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS,
    PolicyDenied,
    RuntimeStore,
    classify_action,
)


NOW = datetime(2026, 7, 12, 12, 0, tzinfo=timezone.utc)


class ActionPolicyTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.path = Path(self.temporary.name) / "runtime.sqlite3"
        self.store = RuntimeStore(self.path)

    def tearDown(self):
        self.store.close()
        self.temporary.cleanup()

    def test_internal_low_risk_action_does_not_need_approval(self):
        action = self.store.propose_action(
            "note.create",
            {"title": "Follow up"},
            risk="low",
            is_external=False,
            proposed_at=NOW,
        )
        decision = self.store.evaluate_action(action.action_id, action.action_hash, at=NOW)
        self.assertTrue(decision.allowed)
        self.assertFalse(decision.requires_approval)

    def test_external_action_requires_exact_unexpired_approval(self):
        action = self.store.propose_action(
            "email.send",
            {"to": "kerri@example.com", "subject": "Plan", "body": "Ready for review"},
            target="kerri@example.com",
            risk="medium",
            is_external=True,
            reversible=False,
            idempotency_key="email-plan",
            expires_in_seconds=600,
            proposed_at=NOW,
        )
        before = self.store.evaluate_action(action.action_id, action.action_hash, at=NOW)
        self.assertFalse(before.allowed)
        self.assertTrue(before.requires_approval)

        with self.assertRaises(ApprovalHashMismatch):
            self.store.approve_action(action.action_id, "0" * 64, "Harrison", at=NOW)

        approval = self.store.approve_action(
            action.action_id,
            action.action_hash,
            "Harrison",
            ttl_seconds=60,
            at=NOW,
        )
        allowed = self.store.evaluate_action(
            action.action_id, action.action_hash, at=NOW + timedelta(seconds=59)
        )
        self.assertTrue(allowed.allowed)
        self.assertEqual(approval.approval_id, allowed.approval_id)
        expired = self.store.evaluate_action(
            action.action_id, action.action_hash, at=NOW + timedelta(seconds=60)
        )
        self.assertFalse(expired.allowed)
        self.assertIn("expired", expired.reason)
        wrong_hash = self.store.evaluate_action(action.action_id, "f" * 64, at=NOW)
        self.assertFalse(wrong_hash.allowed)

    def test_high_risk_internal_action_also_requires_approval(self):
        action = self.store.propose_action(
            "files.delete",
            {"paths": ["old.txt"]},
            idempotency_key="delete-old",
            expires_in_seconds=600,
            proposed_at=NOW,
        )
        self.assertFalse(
            self.store.evaluate_action(action.action_id, action.action_hash, at=NOW).allowed
        )

    def test_medium_or_irreversible_internal_action_requires_approval(self):
        medium = self.store.propose_action(
            "calendar.hold",
            {"time": "14:00"},
            idempotency_key="hold-1400",
            expires_in_seconds=600,
            proposed_at=NOW,
        )
        irreversible = self.store.propose_action(
            "local.destroy",
            {"id": 7},
            idempotency_key="destroy-7",
            expires_in_seconds=600,
            proposed_at=NOW,
        )
        self.assertFalse(
            self.store.evaluate_action(medium.action_id, medium.action_hash, at=NOW).allowed
        )
        self.assertFalse(
            self.store.evaluate_action(
                irreversible.action_id, irreversible.action_hash, at=NOW
            ).allowed
        )

    def test_action_hash_binds_expiry_and_idempotent_retry_preserves_it(self):
        first = self.store.propose_action(
            "email.send",
            {"to": "a@example.com"},
            is_external=True,
            idempotency_key="send-a",
            expires_in_seconds=60,
            proposed_at=NOW,
            proposed_by="planner",
            run_id=None,
        )
        replay = self.store.propose_action(
            "email.send",
            {"to": "a@example.com"},
            is_external=True,
            idempotency_key="send-a",
            expires_in_seconds=60,
            proposed_at=NOW + timedelta(seconds=30),
            proposed_by="planner",
            run_id=None,
        )
        later_expiry = self.store.propose_action(
            "email.send",
            {"to": "a@example.com"},
            is_external=True,
            idempotency_key="send-a-later",
            expires_in_seconds=60,
            proposed_at=NOW + timedelta(seconds=30),
            proposed_by="planner",
        )
        self.assertEqual(first.action_id, replay.action_id)
        self.assertEqual(first.expires_at, replay.expires_at)
        self.assertEqual(first.action_hash, replay.action_hash)
        self.assertNotEqual(first.action_hash, later_expiry.action_hash)
        with self.assertRaises(IdempotencyConflict):
            self.store.propose_action(
                "email.send",
                {"to": "a@example.com"},
                is_external=True,
                idempotency_key="send-a",
                expires_in_seconds=60,
                proposed_by="different-planner",
            )

    def test_rejection_denies_and_ledgers_are_immutable(self):
        action = self.store.propose_action(
            "message.send",
            {"text": "No"},
            idempotency_key="message-no",
            expires_in_seconds=600,
            proposed_at=NOW,
        )
        rejection = self.store.reject_action(
            action.action_id, action.action_hash, "Harrison", reason="Wrong recipient", at=NOW
        )
        self.assertEqual("rejected", rejection.decision)
        self.assertFalse(
            self.store.evaluate_action(action.action_id, action.action_hash, at=NOW).allowed
        )
        with self.assertRaises(PolicyDenied):
            self.store.require_action_authorization(action.action_id, action.action_hash, at=NOW)
        with self.assertRaises(sqlite3.IntegrityError):
            self.store.connection.execute(
                "UPDATE approvals SET actor = 'somebody else' WHERE approval_id = ?",
                (rejection.approval_id,),
            )
        with self.assertRaises(sqlite3.IntegrityError):
            self.store.connection.execute(
                "UPDATE proposed_actions SET payload_json = '{}' WHERE action_id = ?",
                (action.action_id,),
            )

    def test_registry_is_fail_closed_and_caller_can_only_raise_safety(self):
        email = classify_action("email.send")
        deleted = classify_action("files.delete", requested_risk="low", requested_reversible=True)
        unknown = classify_action("tool.arbitrary")
        raised = classify_action(
            "note.create",
            requested_risk="medium",
            requested_external=True,
            requested_reversible=False,
        )
        self.assertEqual(("high", True, False), (email.risk, email.is_external, email.reversible))
        self.assertEqual(("high", False, False), (deleted.risk, deleted.is_external, deleted.reversible))
        self.assertEqual(
            ("critical", True, False, False),
            (unknown.risk, unknown.is_external, unknown.reversible, unknown.registered),
        )
        self.assertEqual(("medium", True, False), (raised.risk, raised.is_external, raised.reversible))

    def test_unsafe_proposal_needs_explicit_key_and_bounded_expiry(self):
        with self.assertRaises(ValueError):
            self.store.propose_action("email.send", {"to": "a@example.com"})
        with self.assertRaises(ValueError):
            self.store.propose_action(
                "email.send", {"to": "a@example.com"}, idempotency_key="send-no-expiry"
            )
        with self.assertRaises(ValueError):
            self.store.propose_action(
                "email.send", {"to": "a@example.com"}, expires_in_seconds=60
            )
        with self.assertRaises(ValueError):
            self.store.propose_action(
                "email.send",
                {"to": "a@example.com"},
                idempotency_key="send-too-long",
                expires_in_seconds=MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS + 1,
            )

        unknown = self.store.propose_action(
            "tool.arbitrary",
            {"instruction": "anything"},
            idempotency_key="unknown-1",
            expires_in_seconds=60,
            proposed_at=NOW,
        )
        self.assertEqual("critical", unknown.risk)
        self.assertTrue(unknown.is_external)
        self.assertFalse(unknown.reversible)
        email = self.store.propose_action(
            "email.send",
            {"to": "safe-claim@example.com"},
            risk="low",
            is_external=False,
            reversible=True,
            idempotency_key="email-safe-claim",
            expires_in_seconds=60,
            proposed_at=NOW,
        )
        self.assertEqual("high", email.risk)
        self.assertTrue(email.is_external)
        self.assertFalse(email.reversible)

    def test_action_explicit_id_and_idempotency_key_cannot_diverge(self):
        first = self.store.propose_action(
            "note.create",
            {"title": "One"},
            action_id="act_fixed",
            idempotency_key="note-one",
            proposed_at=NOW,
        )
        self.assertEqual("act_fixed", first.action_id)
        with self.assertRaises(IdempotencyConflict):
            self.store.propose_action(
                "note.create",
                {"title": "One"},
                action_id="act_fixed",
                idempotency_key="note-two",
                proposed_at=NOW,
            )
        with self.assertRaises(IdempotencyConflict):
            self.store.propose_action(
                "note.create",
                {"title": "One"},
                action_id="act_other",
                idempotency_key="note-one",
                proposed_at=NOW,
            )

    def test_store_exposes_no_action_execution_api(self):
        self.assertFalse(hasattr(self.store, "mark_action_executed"))


if __name__ == "__main__":
    unittest.main()
