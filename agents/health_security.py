"""Fail-closed validation for the optional hosted health ingest."""

from urllib.parse import urlsplit


def require_allowlisted_https_url(url: str, allowed_hostname: str) -> str:
    """Return url only when it is credential-free HTTPS to the exact host."""
    if not url or not allowed_hostname:
        raise ValueError("Baseline ingest needs an explicit HTTPS host allowlist.")

    expected_hostname = allowed_hostname.strip().lower()
    if not expected_hostname or any(character in expected_hostname for character in "/:@"):
        raise ValueError("Baseline ingest hostname allowlist is invalid.")

    parsed = urlsplit(url)
    if (
        parsed.scheme != "https"
        or parsed.hostname != expected_hostname
        or parsed.username is not None
        or parsed.password is not None
        or parsed.port not in (None, 443)
        or parsed.query
        or parsed.fragment
    ):
        raise ValueError("Baseline ingest destination is not an allowlisted HTTPS endpoint.")
    return url
