"""Durable local foundations for a trustworthy personal assistant.

The package deliberately depends only on Python's standard library.  Its public
surface is small: :class:`RuntimeStore` owns the event, run, and action ledgers,
while :class:`WorkQueue` provides durable background work coordination.  Both
can share the same SQLite database file.
"""

from .action_types import (
    MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS,
    REGISTERED_ACTION_TYPES,
    UNAUTHENTICATED_APPROVAL_WARNING,
    ActionClassification,
    classify_action,
)
from .canonical import canonical_hash, canonical_json
from .errors import (
    ApprovalHashMismatch,
    IdempotencyConflict,
    InvalidStateTransition,
    JarvisCoreError,
    NotFound,
    PolicyDenied,
    QueueLeaseError,
)
from .models import (
    ActionPolicyDecision,
    Approval,
    Event,
    ProposedAction,
    QueueItem,
    Run,
)
from .queue import WorkQueue
from .store import RuntimeStore

__all__ = [
    "ActionPolicyDecision",
    "ActionClassification",
    "Approval",
    "ApprovalHashMismatch",
    "Event",
    "IdempotencyConflict",
    "InvalidStateTransition",
    "JarvisCoreError",
    "NotFound",
    "MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS",
    "PolicyDenied",
    "ProposedAction",
    "QueueItem",
    "QueueLeaseError",
    "Run",
    "RuntimeStore",
    "REGISTERED_ACTION_TYPES",
    "UNAUTHENTICATED_APPROVAL_WARNING",
    "WorkQueue",
    "canonical_hash",
    "canonical_json",
    "classify_action",
]
