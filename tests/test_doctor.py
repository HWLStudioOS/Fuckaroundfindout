import json
import plistlib
import tempfile
import unittest
from pathlib import Path

from scripts import doctor


class DoctorValidationTests(unittest.TestCase):
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


if __name__ == "__main__":
    unittest.main()
