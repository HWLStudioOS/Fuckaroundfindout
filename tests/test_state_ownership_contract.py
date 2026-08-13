"""The declared ownership map must stay true.

A map that drifts from the prompts is worse than no map, because it looks
authoritative. These tests check the two claims most likely to rot: that
evening-reflection stopped writing today.md, and that today.md never grows a
Linear marker (which would put the same marker in two files and reproduce the
HWL-191 flap the checker exists to prevent).
"""

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OWNERSHIP = ROOT / "agents" / "STATE-OWNERSHIP.md"
EVENING = ROOT / "agents" / "evening-reflection.md"
TODAY = ROOT / "today.md"
THIS_WEEK = ROOT / "this-week.md"
MARKER = re.compile(r"<!--\s*linear:HWL-\d+\s*-->")


class StateOwnershipContractTests(unittest.TestCase):
    def test_ownership_map_exists_and_names_the_hot_files(self):
        text = OWNERSHIP.read_text(encoding="utf-8")
        for path in ("today.md", "this-week.md", "capture/inbox.md", "agents/_log.md"):
            self.assertIn(path, text, f"{path} has no declared owner")

    def test_evening_reflection_no_longer_writes_today(self):
        """It was the third writer of today.md. One owner per file."""
        text = EVENING.read_text(encoding="utf-8")
        self.assertIn("Do not write `today.md`", text)
        self.assertNotIn("Optionally write a one-line digest to today.md", text)

    def test_today_carries_no_linear_markers(self):
        """A marker in both files is the HWL-191 flap. this-week.md owns them."""
        self.assertEqual(
            MARKER.findall(TODAY.read_text(encoding="utf-8")),
            [],
            "today.md grew a linear marker; this-week.md is the marker owner",
        )

    def test_this_week_still_owns_the_markers(self):
        markers = MARKER.findall(THIS_WEEK.read_text(encoding="utf-8"))
        self.assertGreater(len(markers), 0, "this-week.md lost its linear markers")

    def test_known_gap_is_recorded_rather_than_glossed(self):
        """weekly-review and morning-brief both write this-week.md.

        Their schedules do not overlap so it is a handoff, not a race, but a map
        that hid it would be dishonest.
        """
        text = OWNERSHIP.read_text(encoding="utf-8")
        self.assertIn("Known gap", text)
        self.assertIn("weekly-review", text)


if __name__ == "__main__":
    unittest.main()
