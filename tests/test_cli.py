import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class CliTests(unittest.TestCase):
    def run_cli(self, *arguments):
        return subprocess.run(
            [sys.executable, "-m", "jarvis_core", *arguments],
            cwd=str(Path(__file__).resolve().parents[1]),
            text=True,
            capture_output=True,
            check=False,
        )

    def test_external_action_propose_approve_show_flow(self):
        with tempfile.TemporaryDirectory() as temporary:
            database = str(Path(temporary) / "runtime" / "core.sqlite3")
            proposed_process = self.run_cli(
                "--db",
                database,
                "action",
                "propose",
                "--type",
                "email.send",
                "--target",
                "kerri@example.com",
                "--risk",
                "medium",
                "--external",
                "--idempotency-key",
                "email-42",
                "--expires-in-seconds",
                "600",
                "--json",
                '{"subject":"Plan","body":"Ready"}',
            )
            self.assertEqual(0, proposed_process.returncode, proposed_process.stderr)
            proposed = json.loads(proposed_process.stdout)

            before_process = self.run_cli(
                "--db", database, "action", "show", proposed["action_id"]
            )
            self.assertEqual(0, before_process.returncode, before_process.stderr)
            self.assertFalse(json.loads(before_process.stdout)["policy"]["allowed"])

            approval_process = self.run_cli(
                "--db",
                database,
                "action",
                "approve",
                proposed["action_id"],
                "--hash",
                proposed["action_hash"],
                "--actor",
                "Harrison",
            )
            self.assertEqual(0, approval_process.returncode, approval_process.stderr)
            approval_output = json.loads(approval_process.stdout)
            self.assertIn("unauthenticated assertions", approval_output["warning"])
            self.assertEqual("approved", approval_output["approval"]["decision"])

            after_process = self.run_cli(
                "--db", database, "action", "show", proposed["action_id"]
            )
            self.assertEqual(0, after_process.returncode, after_process.stderr)
            shown = json.loads(after_process.stdout)
            self.assertTrue(shown["policy"]["allowed"])
            self.assertEqual(1, len(shown["approvals"]))

            execute_process = self.run_cli("--db", database, "action", "execute")
            self.assertNotEqual(0, execute_process.returncode)


if __name__ == "__main__":
    unittest.main()
