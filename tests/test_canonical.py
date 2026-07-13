import math
import unittest

from jarvis_core import canonical_hash, canonical_json


class CanonicalJsonTests(unittest.TestCase):
    def test_key_order_and_unicode_are_stable(self):
        left = {"z": [3, 2, 1], "name": "Harrison", "nested": {"b": True, "a": "£"}}
        right = {"nested": {"a": "£", "b": True}, "name": "Harrison", "z": [3, 2, 1]}

        self.assertEqual(canonical_json(left), canonical_json(right))
        self.assertEqual(canonical_hash(left), canonical_hash(right))
        self.assertIn("£", canonical_json(left))
        self.assertNotIn(" ", canonical_json(left))

    def test_non_finite_numbers_and_non_string_keys_are_rejected(self):
        with self.assertRaises(ValueError):
            canonical_json({"bad": math.nan})
        with self.assertRaises(TypeError):
            canonical_json({1: "ambiguous"})


if __name__ == "__main__":
    unittest.main()
