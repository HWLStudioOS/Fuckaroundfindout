import json
import plistlib
import stat
import tempfile
import unittest
from pathlib import Path

from scripts import doctor


class DoctorValidationTests(unittest.TestCase):
    def _auth_command(self, directory, payload, exit_code):
        command = Path(directory) / "claude"
        command.write_text(
            "#!/bin/sh\nprintf '%s\\n' '" + payload + "'\nexit " + str(exit_code) + "\n",
            encoding="utf-8",
        )
        command.chmod(command.stat().st_mode | stat.S_IXUSR)
        return str(command)

    def test_invalid_python_files_reports_only_syntax_errors(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            valid = root / "valid.py"
            invalid = root / "invalid.py"
            valid.write_text("answer = 42\n", encoding="utf-8")
            invalid.write_text("if True print('no')\n", encoding="utf-8")

            failures = doctor.invalid_python_files((valid, invalid))

            self.assertEqual([path for path, _error in failures], [invalid])

    def test_structured_file_validation_supports_json_and_plist(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            valid_json = root / "valid.json"
            invalid_json = root / "invalid.json"
            valid_plist = root / "valid.plist"
            invalid_plist = root / "invalid.plist"
            valid_json.write_text('{"ok": true}\n', encoding="utf-8")
            invalid_json.write_text('{"ok": }\n', encoding="utf-8")
            valid_plist.write_bytes(plistlib.dumps({"ok": True}))
            invalid_plist.write_bytes(b"not a plist")

            json_failures = doctor.invalid_structured_files(
                (valid_json, invalid_json), json.loads
            )
            plist_failures = doctor.invalid_structured_files(
                (valid_plist, invalid_plist), plistlib.loads
            )

            self.assertEqual([path for path, _error in json_failures], [invalid_json])
            self.assertEqual([path for path, _error in plist_failures], [invalid_plist])

    def test_repository_root_walks_up_to_pyproject(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nested = root / "one" / "two"
            nested.mkdir(parents=True)
            (root / "pyproject.toml").write_text("[project]\n", encoding="utf-8")

            self.assertEqual(doctor.repository_root(nested), root.resolve())

    def test_claude_auth_check_passes_for_logged_in_session(self):
        with tempfile.TemporaryDirectory() as directory:
            command = self._auth_command(
                directory,
                '{"loggedIn": true, "authMethod": "oauth"}',
                0,
            )

            check = doctor.check_claude_auth(command)

            self.assertEqual(check.status, doctor.PASS)
            self.assertIn("oauth", check.detail)

    def test_claude_auth_check_warns_for_logged_out_session(self):
        with tempfile.TemporaryDirectory() as directory:
            command = self._auth_command(
                directory,
                '{"loggedIn": false, "authMethod": "none"}',
                1,
            )

            check = doctor.check_claude_auth(command)

            self.assertEqual(check.status, doctor.WARN)
            self.assertIn("exit 78", check.detail)
            self.assertIn("interactively", check.detail)

    def test_claude_auth_check_warns_for_unreadable_status(self):
        with tempfile.TemporaryDirectory() as directory:
            command = self._auth_command(directory, "not-json", 1)

            check = doctor.check_claude_auth(command)

            self.assertEqual(check.status, doctor.WARN)
            self.assertIn("unreadable", check.detail)


if __name__ == "__main__":
    unittest.main()
