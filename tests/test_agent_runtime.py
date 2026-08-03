import json
import os
import shutil
import stat
import subprocess
import tempfile
import textwrap
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "agents" / "agent-runtime.sh"


class AgentRuntimeTests(unittest.TestCase):
    def test_scheduled_runtime_never_bypasses_claude_permissions(self):
        source = RUNTIME.read_text(encoding="utf-8")

        self.assertIn("--permission-mode auto", source)
        self.assertNotIn("--permission-mode bypassPermissions", source)

    def _fake_claude(self, directory, auth_json, auth_exit, prompt_output, prompt_exit):
        command = Path(directory) / "claude"
        command.write_text(
            textwrap.dedent(
                """\
                #!/bin/bash
                if [ "${1:-}" = "auth" ]; then
                  printf '%s\\n' "$FAKE_AUTH_JSON"
                  exit "$FAKE_AUTH_EXIT"
                fi
                printf '%s\\n' "prompt-called" >> "$FAKE_CALLS_FILE"
                printf '%s\\n' "$FAKE_PROMPT_OUTPUT"
                exit "$FAKE_PROMPT_EXIT"
                """
            ),
            encoding="utf-8",
        )
        command.chmod(command.stat().st_mode | stat.S_IXUSR)
        return command

    def _run_runtime(self, auth_json, auth_exit, prompt_output, prompt_exit):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        root = Path(temporary.name)
        (root / "agents").mkdir()
        calls = root / "calls.log"
        fake_claude = self._fake_claude(
            root, auth_json, auth_exit, prompt_output, prompt_exit
        )
        environment = os.environ.copy()
        environment.update(
            {
                "FAKE_AUTH_JSON": auth_json,
                "FAKE_AUTH_EXIT": str(auth_exit),
                "FAKE_PROMPT_OUTPUT": prompt_output,
                "FAKE_PROMPT_EXIT": str(prompt_exit),
                "FAKE_CALLS_FILE": str(calls),
                "HWL_CLAUDE_BIN": str(fake_claude),
                "HWL_AGENT_LOG_DIR": str(root / "logs"),
                "HWL_AGENT_STATE_DIR": str(root / "state"),
                "HWL_AGENT_AUDIT_LOG": str(root / "audit.log"),
                "HWL_SHARED_STDOUT_LOG": str(root / "shared.stdout.log"),
                "HWL_SHARED_STDERR_LOG": str(root / "shared.stderr.log"),
            }
        )
        script = textwrap.dedent(
            """\
            set -Eeuo pipefail
            source "$RUNTIME_FILE"
            hwl_runtime_init "test-job" "$TEST_ROOT"
            hwl_run_claude "test stage" "do the test"
            hwl_runtime_set_result "succeeded" "test completed"
            """
        )
        result = subprocess.run(
            ["/bin/bash", "-c", script],
            env={
                **environment,
                "RUNTIME_FILE": str(RUNTIME),
                "TEST_ROOT": str(root),
            },
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        status = json.loads((root / "state" / "latest.json").read_text())
        return root, calls, result, status

    def test_logged_out_preflight_fails_without_running_prompt(self):
        root, calls, result, status = self._run_runtime(
            '{"loggedIn": false, "authMethod": "none"}',
            1,
            "should not run",
            0,
        )

        self.assertEqual(result.returncode, 78)
        self.assertFalse(calls.exists())
        self.assertEqual(status["status"], "auth_required")
        self.assertEqual(status["exit_code"], 78)
        self.assertIn("AUTH_REQUIRED", (root / "audit.log").read_text())
        self.assertIn("interactively", (root / "logs/test-job.stderr.log").read_text())

    def test_success_records_per_job_output_and_zero_exit(self):
        root, calls, result, status = self._run_runtime(
            '{"loggedIn": true, "authMethod": "oauth"}',
            0,
            "agent finished",
            0,
        )

        self.assertEqual(result.returncode, 0)
        self.assertEqual(calls.read_text().strip(), "prompt-called")
        self.assertEqual(status["status"], "succeeded")
        self.assertEqual(status["exit_code"], 0)
        self.assertIn("agent finished", (root / "logs/test-job.stdout.log").read_text())

    def test_auth_expiry_during_prompt_is_normalised_to_exit_78(self):
        root, calls, result, status = self._run_runtime(
            '{"loggedIn": true, "authMethod": "oauth"}',
            0,
            "Failed to authenticate: OAuth session expired and could not be refreshed",
            1,
        )

        self.assertEqual(result.returncode, 78)
        self.assertTrue(calls.exists())
        self.assertEqual(status["status"], "auth_required")
        self.assertIn("expired after preflight", status["detail"])
        self.assertIn("OAuth session expired", (root / "logs/test-job.stdout.log").read_text())

    def test_non_auth_agent_failure_preserves_claude_exit_code(self):
        _root, _calls, result, status = self._run_runtime(
            '{"loggedIn": true, "authMethod": "oauth"}',
            0,
            "model unavailable",
            42,
        )

        self.assertEqual(result.returncode, 42)
        self.assertEqual(status["status"], "agent_failed")
        self.assertEqual(status["exit_code"], 42)

    def test_generic_scheduled_runner_uses_preflight_before_prompt(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            agents = root / "agents"
            agents.mkdir()
            shutil.copy2(RUNTIME, agents / "agent-runtime.sh")
            (agents / "test-job.md").write_text("Do not run.\n", encoding="utf-8")
            calls = root / "calls.log"
            fake_claude = self._fake_claude(
                root,
                '{"loggedIn": false, "authMethod": "none"}',
                1,
                "should not run",
                0,
            )
            environment = os.environ.copy()
            environment.update(
                {
                    "FAKE_AUTH_JSON": '{"loggedIn": false, "authMethod": "none"}',
                    "FAKE_AUTH_EXIT": "1",
                    "FAKE_PROMPT_OUTPUT": "should not run",
                    "FAKE_PROMPT_EXIT": "0",
                    "FAKE_CALLS_FILE": str(calls),
                    "HWL_CLAUDE_BIN": str(fake_claude),
                    "HWL_META_DIR": str(root),
                }
            )

            result = subprocess.run(
                ["/bin/bash", str(ROOT / "agents" / "agent-runner.sh"), "test-job"],
                env=environment,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )

            self.assertEqual(result.returncode, 78)
            self.assertFalse(calls.exists())
            status = json.loads(
                (root / ".jarvis-runtime/agent-runs/test-job/latest.json").read_text()
            )
            self.assertEqual(status["status"], "auth_required")

    def test_morning_brief_auth_failure_preserves_existing_handoff_files(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            agents = root / "agents"
            agents.mkdir()
            shutil.copy2(RUNTIME, agents / "agent-runtime.sh")
            shutil.copy2(ROOT / "agents" / "morning-brief.sh", agents / "morning-brief.sh")
            (agents / "morning-brief.md").write_text("Draft.\n", encoding="utf-8")
            (agents / "morning-brief-verify.md").write_text(
                "Verify.\n", encoding="utf-8"
            )
            candidate = agents / "_brief-candidate.txt"
            sentinel = agents / "_brief-sent.json"
            candidate.write_text("previous candidate\n", encoding="utf-8")
            sentinel.write_text('{"previous": true}\n', encoding="utf-8")
            calls = root / "calls.log"
            fake_claude = self._fake_claude(
                root,
                '{"loggedIn": false, "authMethod": "none"}',
                1,
                "should not run",
                0,
            )
            environment = os.environ.copy()
            environment.update(
                {
                    "FAKE_AUTH_JSON": '{"loggedIn": false, "authMethod": "none"}',
                    "FAKE_AUTH_EXIT": "1",
                    "FAKE_PROMPT_OUTPUT": "should not run",
                    "FAKE_PROMPT_EXIT": "0",
                    "FAKE_CALLS_FILE": str(calls),
                    "HWL_CLAUDE_BIN": str(fake_claude),
                    "HWL_META_DIR": str(root),
                }
            )

            result = subprocess.run(
                ["/bin/bash", str(agents / "morning-brief.sh")],
                env=environment,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )

            self.assertEqual(result.returncode, 78)
            self.assertFalse(calls.exists())
            self.assertEqual(candidate.read_text(), "previous candidate\n")
            self.assertEqual(sentinel.read_text(), '{"previous": true}\n')


if __name__ == "__main__":
    unittest.main()
