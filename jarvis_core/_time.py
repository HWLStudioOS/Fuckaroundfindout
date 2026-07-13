"""UTC timestamp helpers shared by the SQLite-backed components."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional, Union


def utc_now() -> datetime:
    """Return the current timezone-aware UTC time."""

    return datetime.now(timezone.utc)


def as_utc_text(value: Optional[datetime] = None) -> str:
    """Encode a datetime as fixed-width RFC 3339 UTC text.

    Fixed-width UTC strings preserve chronological ordering in SQLite.  Naive
    datetimes are rejected rather than silently assigned a timezone.
    """

    instant = utc_now() if value is None else value
    if instant.tzinfo is None:
        raise ValueError("datetime must be timezone-aware")
    return instant.astimezone(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z")


def parse_utc_text(value: str) -> datetime:
    """Decode the fixed-width UTC representation emitted by this package."""

    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("stored datetime must be timezone-aware")
    return parsed.astimezone(timezone.utc)


def after(seconds: Union[int, float], *, start: Optional[datetime] = None) -> datetime:
    """Return ``start`` plus a positive duration in seconds."""

    if seconds <= 0:
        raise ValueError("duration must be greater than zero")
    return (utc_now() if start is None else start) + timedelta(seconds=seconds)
