"""State-consistency guard: today.md and this-week.md must not contradict.

`linear/lib/sync-policy.js` already refuses to write Linear issue state from a
file that does not own a marker. That protects Linear. It does not protect
Harrison, who reads the Markdown every morning, and it cannot see tasks with no
marker at all.

The HWL-191 flap on 9-10 August was two files carrying one marker with opposite
checkbox states. These tests hold the line against a recurrence.
"""

import shutil
import subprocess
import textwrap
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

ROOT = Path(__file__).resolve().parents[1]
CHECKER = ROOT / "scripts" / "check-state-consistency.mjs"
NIGHTLY_BACKUP = ROOT / "agents" / "nightly-backup.sh"
NODE = shutil.which("node") or "/usr/local/bin/node"


def run_against(today: str, this_week: str):
    """Run the real checker against a synthetic pair of state files."""
    with TemporaryDirectory() as tmp:
        d = Path(tmp)
        (d / "scripts").mkdir()
        shutil.copy(CHECKER, d / "scripts" / CHECKER.name)
        (d / "today.md").write_text(textwrap.dedent(today), encoding="utf-8")
        (d / "this-week.md").write_text(textwrap.dedent(this_week), encoding="utf-8")
        return subprocess.run(
            [NODE, "scripts/check-state-consistency.mjs"],
            cwd=d, capture_output=True, text=True,
        )


@unittest.skipUnless(Path(NODE).exists(), "node runtime not available")
class StateConsistencyContractTests(unittest.TestCase):
    def test_catches_the_hwl_191_flap(self):
        """One marker, two files, opposite states. The original failure."""
        r = run_against(
            "- [ ] Stand down the results posts. <!-- linear:HWL-191 -->\n",
            "- [x] Stand down the results posts. <!-- linear:HWL-191 -->\n",
        )
        self.assertEqual(r.returncode, 1)
        self.assertIn("HWL-191", r.stderr)
        self.assertIn("OPPOSITE STATE", r.stderr)

    def test_catches_a_shared_marker_even_when_states_agree(self):
        """Agreement today is not safety. Two owners will drift."""
        r = run_against(
            "- [x] Ship the thing. <!-- linear:HWL-263 -->\n",
            "- [x] Ship the thing. <!-- linear:HWL-263 -->\n",
        )
        self.assertEqual(r.returncode, 1)
        self.assertIn("will drift", r.stderr)

    def test_catches_a_marker_repeated_within_one_file(self):
        r = run_against(
            "- [ ] nothing here\n",
            "- [ ] First copy. <!-- linear:HWL-9 -->\n- [x] Second copy. <!-- linear:HWL-9 -->\n",
        )
        self.assertEqual(r.returncode, 1)
        self.assertIn("recorded twice", r.stderr)

    def test_passes_when_each_marker_has_one_owner(self):
        r = run_against(
            "- [x] A day-local task with no marker.\n",
            "- [x] Weekly task. <!-- linear:HWL-263 -->\n- [ ] Another. <!-- linear:HWL-253 -->\n",
        )
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("No contradictions", r.stdout)

    def test_unmarked_tasks_never_fail_the_check(self):
        """Most today.md items have no weekly counterpart. That is legitimate."""
        r = run_against(
            "- [ ] Review David's revised reel when it lands.\n- [x] Morning VO2 session.\n",
            "- [x] Weekly task. <!-- linear:HWL-1 -->\n",
        )
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_live_repository_state_is_currently_consistent(self):
        r = subprocess.run(
            [NODE, str(CHECKER)], cwd=ROOT, capture_output=True, text=True
        )
        self.assertEqual(r.returncode, 0, f"live state files contradict:\n{r.stderr}")

    def test_nightly_backup_runs_the_check_before_committing(self):
        source = NIGHTLY_BACKUP.read_text(encoding="utf-8")
        check = source.index("check-state-consistency.mjs")
        commit = source.index('git commit -q -m "Nightly backup $STAMP"')
        self.assertLess(check, commit)
        self.assertIn("STATE CONTRADICTION", source)


if __name__ == "__main__":
    unittest.main()
