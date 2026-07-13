from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class MorningBriefSafetyContractTests(unittest.TestCase):
    def test_failed_verification_never_sends_the_candidate(self):
        script = (ROOT / "agents" / "morning-brief.sh").read_text()
        fallback = script.split("# --- Stage 3: safe failure notification", 1)[1]

        self.assertNotIn('cat "$CANDIDATE"', fallback)
        self.assertNotIn("[unverified:", fallback)
        self.assertIn("WITHHELD unchecked brief", fallback)
        self.assertIn("no unchecked claims were sent", fallback)
        self.assertIn("2>/dev/null || true", fallback)


if __name__ == "__main__":
    unittest.main()
