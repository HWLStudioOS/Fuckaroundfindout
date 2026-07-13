"""Deterministic JSON serialisation and hashing helpers."""

from __future__ import annotations

import hashlib
import json
from typing import Any


def _validate_json(value: Any, path: str = "$") -> None:
    """Reject values whose JSON encoding could be ambiguous or lossy."""

    if value is None or isinstance(value, (str, int, float, bool)):
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _validate_json(item, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, item in value.items():
            if not isinstance(key, str):
                raise TypeError(f"JSON object key at {path} is not a string: {key!r}")
            _validate_json(item, f"{path}.{key}")
        return
    raise TypeError(f"value at {path} is not JSON serialisable: {type(value).__name__}")


def canonical_json(value: Any) -> str:
    """Return a stable UTF-8 JSON representation.

    Object keys are sorted, insignificant whitespace is removed, non-ASCII
    characters remain readable, and non-finite floats are rejected.  This is a
    deliberately small deterministic profile for values produced by this
    package.  It is not advertised as a full RFC 8785 implementation.
    """

    _validate_json(value)
    return json.dumps(
        value,
        ensure_ascii=False,
        allow_nan=False,
        separators=(",", ":"),
        sort_keys=True,
    )


def canonical_hash(value: Any) -> str:
    """Return the hexadecimal SHA-256 digest of :func:`canonical_json`."""

    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()
