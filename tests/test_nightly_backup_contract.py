import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NIGHTLY_BACKUP = ROOT / "agents" / "nightly-backup.sh"


class NightlyBackupSecurityContractTests(unittest.TestCase):
    def setUp(self):
        self.source = NIGHTLY_BACKUP.read_text(encoding="utf-8")

    def test_secret_scan_precedes_commit_and_commit_failure_is_fatal(self):
        scan = self.source.index('"$GITLEAKS_BIN" git --staged')
        commit = self.source.index('git commit -q -m "Nightly backup $STAMP"')

        self.assertLess(scan, commit)
        self.assertNotIn("git commit -q -m \"Nightly backup $STAMP\" || true", self.source)
        self.assertIn("COMMIT FAILED, nothing pushed or deployed", self.source)

    def test_deploy_uses_locked_cli_and_detached_pushed_checkout(self):
        self.assertIn('git worktree add --detach "$deploy_worktree" "$pushed_sha"', self.source)
        self.assertIn('node_modules/.bin/vercel', self.source)
        self.assertNotIn("npx", self.source.lower())
        self.assertIn('git rev-parse origin/main', self.source)
        self.assertIn('DEPLOY BLOCKED, local HEAD does not equal origin/main', self.source)


if __name__ == "__main__":
    unittest.main()
