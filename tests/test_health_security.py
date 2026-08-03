import sys
import unittest
from pathlib import Path


AGENTS_DIR = Path(__file__).resolve().parents[1] / "agents"
sys.path.insert(0, str(AGENTS_DIR))

from health_security import require_allowlisted_https_url  # noqa: E402


class HealthIngestDestinationTests(unittest.TestCase):
    def test_accepts_exact_allowlisted_https_destination(self):
        url = "https://health.example.test/ingest"
        self.assertEqual(
            require_allowlisted_https_url(url, "health.example.test"),
            url,
        )

    def test_rejects_http_credentials_ports_and_host_mismatch(self):
        rejected = (
            ("http://health.example.test/ingest", "health.example.test"),
            ("https://token@health.example.test/ingest", "health.example.test"),
            ("https://health.example.test:8443/ingest", "health.example.test"),
            ("https://evil.example.test/ingest", "health.example.test"),
            ("https://health.example.test/ingest?token=value", "health.example.test"),
        )
        for url, hostname in rejected:
            with self.subTest(url=url), self.assertRaises(ValueError):
                require_allowlisted_https_url(url, hostname)

    def test_requires_an_explicit_plain_hostname_allowlist(self):
        with self.assertRaises(ValueError):
            require_allowlisted_https_url("https://health.example.test/ingest", "")
        with self.assertRaises(ValueError):
            require_allowlisted_https_url(
                "https://health.example.test/ingest",
                "https://health.example.test",
            )


if __name__ == "__main__":
    unittest.main()
