import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
NIGHTLY_BACKUP = ROOT / "agents" / "nightly-backup.sh"
GITIGNORE = ROOT / ".gitignore"


class NightlyBackupSecurityContractTests(unittest.TestCase):
    def setUp(self):
        self.source = NIGHTLY_BACKUP.read_text(encoding="utf-8")

    def test_secret_scan_precedes_commit_and_commit_failure_is_fatal(self):
        scan = self.source.index('"$GITLEAKS_BIN" git --staged')
        commit = self.source.index('git commit -q -m "Nightly backup $STAMP"')

        self.assertLess(scan, commit)
        self.assertNotIn("git commit -q -m \"Nightly backup $STAMP\" || true", self.source)
        self.assertIn("COMMIT FAILED, nothing pushed or deployed", self.source)

    def test_sensitive_document_guard_precedes_secret_scan_and_commit(self):
        """Financial and identity documents are blocked by path.

        gitleaks matches credential patterns in text and cannot see inside a
        scanned bank statement or a filled identity form, which is how ASB
        statements and Milford KiwiSaver forms reached origin/main on
        12 August 2026. The path guard must run before both the secret scan
        and the commit, and must abort rather than warn.
        """
        guard = self.source.index("SENSITIVE_HITS=\"$(staged_sensitive_paths)\"")
        scan = self.source.index('"$GITLEAKS_BIN" git --staged')
        commit = self.source.index('git commit -q -m "Nightly backup $STAMP"')

        self.assertLess(guard, scan)
        self.assertLess(guard, commit)
        self.assertIn("BACKUP BLOCKED, financial or identity document staged", self.source)

        block = self.source[guard:scan]
        self.assertIn("git reset -q", block)
        self.assertIn("exit 1", block)

    def test_private_and_tmp_directories_are_ignored(self):
        ignore_rules = GITIGNORE.read_text(encoding="utf-8")
        self.assertIn("\nprivate/\n", ignore_rules)
        self.assertIn("\ntmp/\n", ignore_rules)

    def test_guard_matches_real_document_paths_and_spares_prose(self):
        """Exercise the shell matcher itself, not just its source text."""
        script = self.source[
            self.source.index("SENSITIVE_NAME_PATTERN=") : self.source.index("staged_sensitive_paths()")
        ]

        def matches(path):
            probe = (
                f"{script}\n"
                f'printf "%s\\n" "{path}" '
                f'| grep -iE "$SENSITIVE_NAME_PATTERN" '
                f'| grep -iE "$SENSITIVE_EXTENSION_PATTERN"\n'
            )
            return subprocess.run(
                ["bash", "-c", probe], capture_output=True, text=True
            ).stdout.strip() != ""

        # Must block: the exact files that leaked, and their obvious siblings.
        for path in (
            "tmp/pdfs/asb-statement-1.png",
            "tmp/pdfs/milford-filled-final-2.png",
            "output/pdf/Milford-KiwiSaver-Permanent-Emigration-Harrison-Living-draft.pdf",
            "docs/passport-scan.jpg",
            "money/payslip-august.pdf",
            "money/starling-statement-2026-08.pdf",
        ):
            self.assertTrue(matches(path), f"should be blocked: {path}")

        # Must not block: prose and working files that merely use the words.
        for path in (
            "this-week.md",
            "money/index.md",
            "business/clients/creepers-calendar-verification-2026-08-10.md",
            "campaigns/chelsea-contractor-brief.pdf",
            "board-room/app/generated-board.json",
        ):
            self.assertFalse(matches(path), f"should be allowed: {path}")

    def test_deploy_uses_locked_cli_and_detached_pushed_checkout(self):
        self.assertIn('git worktree add --detach "$deploy_worktree" "$pushed_sha"', self.source)
        self.assertIn('node_modules/.bin/vercel', self.source)
        self.assertNotIn("npx", self.source.lower())
        self.assertIn('git rev-parse origin/main', self.source)
        self.assertIn('DEPLOY BLOCKED, local HEAD does not equal origin/main', self.source)


if __name__ == "__main__":
    unittest.main()
