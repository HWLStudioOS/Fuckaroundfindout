"""Auth-failure alerting: a dead fleet must not stay silent.

The preflight in agents/agent-runtime.sh has always detected a logged-out
Claude session and exited 78 correctly. Nothing listened. The 2 to 6 August
outage ran four days that way, and the session dropped again mid-session on
13 August with no notification.

Seventeen scheduled jobs share one auth session, so the alert has to be
de-duplicated or it fires seventeen times per outage and gets muted.
"""

import subprocess
import textwrap
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "agents" / "agent-runtime.sh"


def run_snippet(body: str, env_setup: str = "") -> subprocess.CompletedProcess:
    """Source the real runtime and exercise its alert helpers in isolation."""
    script = textwrap.dedent(f"""
        set -u
        HWL_AGENT_NAME=test-agent
        HWL_META_DIR="$PWD"
        HWL_JOB_STDERR_LOG="$PWD/stderr.log"
        HWL_SHARED_STDERR_LOG="$PWD/shared.log"
        touch "$HWL_JOB_STDERR_LOG" "$HWL_SHARED_STDERR_LOG"
        {env_setup}
        # shellcheck disable=SC1090
        source "{RUNTIME}"
        {body}
    """)
    with TemporaryDirectory() as tmp:
        return subprocess.run(
            ["bash", "-c", script], cwd=tmp, capture_output=True, text=True
        )


class AuthAlertContractTests(unittest.TestCase):
    def test_runtime_sources_cleanly(self):
        r = run_snippet('echo SOURCED_OK')
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("SOURCED_OK", r.stdout)

    def test_sentinel_resolves_under_the_repo_not_filesystem_root(self):
        """HWL_META_DIR is set by hwl_runtime_init, after this file is sourced.

        Reading it at source time would put the sentinel at /, where the write
        silently fails and every outage alerts forever.
        """
        r = run_snippet('hwl_auth_alert_sentinel_path')
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertFalse(
            r.stdout.startswith("/.jarvis-runtime"),
            f"sentinel resolved to filesystem root: {r.stdout!r}",
        )
        self.assertIn(".jarvis-runtime/auth-alert-last-sent", r.stdout)

    def test_alert_is_due_when_no_sentinel_exists(self):
        r = run_snippet('if hwl_auth_alert_due; then echo DUE; else echo NOT_DUE; fi')
        self.assertIn("DUE", r.stdout)

    def test_alert_is_suppressed_immediately_after_one_is_sent(self):
        """The de-duplication that stops 17 jobs sending 17 messages."""
        r = run_snippet(
            'mkdir -p .jarvis-runtime && date +%s > .jarvis-runtime/auth-alert-last-sent\n'
            'if hwl_auth_alert_due; then echo DUE; else echo NOT_DUE; fi'
        )
        self.assertIn("NOT_DUE", r.stdout)

    def test_alert_is_due_again_once_the_interval_has_passed(self):
        r = run_snippet(
            'mkdir -p .jarvis-runtime && echo 1 > .jarvis-runtime/auth-alert-last-sent\n'
            'if hwl_auth_alert_due; then echo DUE; else echo NOT_DUE; fi'
        )
        self.assertIn("DUE", r.stdout)

    def test_corrupt_sentinel_does_not_suppress_the_alert(self):
        """Fail open: a garbage sentinel must not silence a real outage."""
        r = run_snippet(
            'mkdir -p .jarvis-runtime && echo "not-a-number" > .jarvis-runtime/auth-alert-last-sent\n'
            'if hwl_auth_alert_due; then echo DUE; else echo NOT_DUE; fi'
        )
        self.assertIn("DUE", r.stdout)

    def test_recovery_clears_the_sentinel(self):
        """So the next outage alerts promptly instead of waiting out a window."""
        r = run_snippet(
            'mkdir -p .jarvis-runtime && date +%s > .jarvis-runtime/auth-alert-last-sent\n'
            'hwl_auth_alert_clear\n'
            'if [ -f .jarvis-runtime/auth-alert-last-sent ]; then echo PRESENT; else echo CLEARED; fi'
        )
        self.assertIn("CLEARED", r.stdout)

    def test_alert_is_silent_when_telegram_config_is_absent(self):
        """No config must be a no-op, never a crash that masks the auth failure."""
        r = run_snippet('hwl_alert_auth_required && echo NO_CRASH')
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("NO_CRASH", r.stdout)

    def test_alert_fires_on_both_auth_required_paths_and_clears_on_success(self):
        source = RUNTIME.read_text(encoding="utf-8")
        self.assertEqual(source.count("hwl_alert_auth_required"), 3)  # def + 2 call sites
        self.assertIn("hwl_auth_alert_clear", source)
        preflight_ok = source.index('hwl_runtime_note "AUTH_OK"')
        clear_call = source.index("hwl_auth_alert_clear\n  hwl_runtime_note \"AUTH_OK\"")
        self.assertLess(clear_call, preflight_ok + 1)


if __name__ == "__main__":
    unittest.main()
