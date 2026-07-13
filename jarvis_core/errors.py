"""Domain exceptions raised by :mod:`jarvis_core`."""


class JarvisCoreError(Exception):
    """Base class for package-specific errors."""


class NotFound(JarvisCoreError):
    """Raised when a requested ledger record does not exist."""


class InvalidStateTransition(JarvisCoreError):
    """Raised when a lifecycle operation is invalid for the current state."""


class IdempotencyConflict(JarvisCoreError):
    """Raised when an idempotency key is reused for different input."""


class ApprovalHashMismatch(JarvisCoreError):
    """Raised when a decision does not bind to the exact proposed action."""


class PolicyDenied(JarvisCoreError):
    """Raised when an action is not currently authorised by policy."""


class QueueLeaseError(JarvisCoreError):
    """Raised when a worker tries to mutate work it does not own."""
