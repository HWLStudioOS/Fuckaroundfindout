import os
import sqlite3
import stat
import tempfile
import unittest
from pathlib import Path
import sys


AGENTS_DIR = Path(__file__).resolve().parents[1] / "agents"
sys.path.insert(0, str(AGENTS_DIR))

from telegram_queue import (  # noqa: E402
    TelegramTaskQueue,
    is_authorized_private_message,
    normalize_telegram_ids,
)


class TelegramTaskQueueTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tempdir.name) / "queue.sqlite3"
        self.queue = TelegramTaskQueue(self.db_path)

    def tearDown(self):
        self.tempdir.cleanup()

    def enqueue(self, update_id=10, text="do the thing"):
        return self.queue.enqueue(
            update_id=update_id,
            message_id=update_id + 100,
            chat_id=42,
            text=text,
            reset_epoch=123.5,
        )

    def test_enqueue_is_durable_and_idempotent_by_update(self):
        task_id, inserted = self.enqueue()
        duplicate_id, duplicate_inserted = self.enqueue(text="changed duplicate")

        self.assertTrue(inserted)
        self.assertFalse(duplicate_inserted)
        self.assertEqual(task_id, duplicate_id)
        reopened = TelegramTaskQueue(self.db_path)
        self.assertEqual(reopened.count("queued"), 1)
        task = reopened.claim_next()
        self.assertEqual(task.text, "do the thing")

    @unittest.skipUnless(os.name == "posix", "POSIX file modes required")
    def test_database_is_private(self):
        mode = stat.S_IMODE(self.db_path.stat().st_mode)
        self.assertEqual(mode, 0o600)

    def test_claim_and_finish_are_persisted(self):
        self.enqueue()
        task = self.queue.claim_next()

        self.assertIsNotNone(task)
        self.assertEqual(self.queue.count("running"), 1)
        self.assertTrue(self.queue.finish(task.id, "completed"))
        self.assertEqual(self.queue.count("running"), 0)
        self.assertEqual(self.queue.count("completed"), 1)
        self.assertIsNone(self.queue.claim_next())

    def test_restart_quarantines_running_tasks_and_keeps_queued_tasks(self):
        self.enqueue(update_id=10)
        self.enqueue(update_id=11)
        running = self.queue.claim_next()

        reopened = TelegramTaskQueue(self.db_path)
        self.assertEqual(reopened.recover_interrupted(), 1)
        self.assertEqual(reopened.count("needs_review"), 1)
        self.assertEqual(reopened.count("queued"), 1)
        next_task = reopened.claim_next()
        self.assertEqual(next_task.update_id, 11)
        self.assertNotEqual(next_task.id, running.id)

        with sqlite3.connect(self.db_path) as conn:
            status = conn.execute(
                "SELECT status FROM telegram_tasks WHERE id = ?", (running.id,)
            ).fetchone()[0]
        self.assertEqual(status, "needs_review")

    def test_finish_rejects_invalid_or_stale_transition(self):
        task_id, _ = self.enqueue()
        with self.assertRaises(ValueError):
            self.queue.finish(task_id, "needs_review")
        self.assertFalse(self.queue.finish(task_id, "completed"))


class TelegramAuthorizationTests(unittest.TestCase):
    @staticmethod
    def message(chat_id=42, sender_id=42, chat_type="private"):
        return {
            "chat": {"id": chat_id, "type": chat_type},
            "from": {"id": sender_id},
        }

    def test_existing_private_chat_id_authorizes_matching_sender(self):
        self.assertTrue(is_authorized_private_message(self.message(), {42}))

    def test_group_chat_is_rejected_even_when_ids_are_allowed(self):
        self.assertFalse(
            is_authorized_private_message(self.message(chat_type="group"), {42})
        )

    def test_chat_and_sender_must_both_be_allowed(self):
        self.assertFalse(is_authorized_private_message(self.message(sender_id=99), {42}))
        self.assertFalse(is_authorized_private_message(self.message(chat_id=99), {42}))
        self.assertTrue(is_authorized_private_message(self.message(99, 99), {42, 99}))

    def test_missing_sender_is_rejected_and_ids_are_normalized(self):
        self.assertFalse(
            is_authorized_private_message(
                {"chat": {"id": 42, "type": "private"}}, {42}
            )
        )
        self.assertEqual(normalize_telegram_ids(["42", 99, None, "bad"]), {42, 99})


class TelegramAgentPrivacyContractTests(unittest.TestCase):
    def test_fleet_logs_use_task_hashes_not_task_text(self):
        source = (AGENTS_DIR / "telegram-agent.py").read_text()

        self.assertIn("def task_ref(text):", source)
        self.assertNotIn('log(f"task ok in {elapsed}: {text[:80]!r}")', source)
        self.assertNotIn('log(f"task FAILED in {elapsed}: {text[:80]!r}', source)


if __name__ == "__main__":
    unittest.main()
