"""Immutable value objects returned by the runtime APIs."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional


@dataclass(frozen=True)
class Event:
    """An immutable observation in the append-only event ledger."""

    event_id: str
    event_type: str
    source: str
    payload: Any
    payload_hash: str
    occurred_at: str
    recorded_at: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    correlation_id: Optional[str] = None
    causation_id: Optional[str] = None
    idempotency_key: Optional[str] = None
    metadata: Any = None


@dataclass(frozen=True)
class Run:
    """A durable execution attempt and its lifecycle state."""

    run_id: str
    run_type: str
    status: str
    input: Any
    input_hash: str
    output: Any
    error: Optional[str]
    idempotency_key: Optional[str]
    created_at: str
    started_at: Optional[str]
    finished_at: Optional[str]
    updated_at: str


@dataclass(frozen=True)
class ProposedAction:
    """An immutable external or internal operation proposed by a run."""

    action_id: str
    run_id: Optional[str]
    action_type: str
    target: Optional[str]
    payload: Any
    action_hash: str
    risk: str
    is_external: bool
    reversible: bool
    status: str
    proposed_by: str
    idempotency_key: Optional[str]
    proposed_at: str
    expires_at: Optional[str]
    executed_at: Optional[str]


@dataclass(frozen=True)
class Approval:
    """A human or policy decision bound to one exact action hash."""

    approval_id: str
    action_id: str
    action_hash: str
    decision: str
    actor: str
    reason: Optional[str]
    decided_at: str
    expires_at: Optional[str]


@dataclass(frozen=True)
class ActionPolicyDecision:
    """The result of evaluating an action against execution policy."""

    action_id: str
    action_hash: str
    allowed: bool
    requires_approval: bool
    reason: str
    approval_id: Optional[str] = None


@dataclass(frozen=True)
class QueueItem:
    """One durable item of work and its lease information."""

    job_id: str
    queue_name: str
    kind: str
    payload: Any
    payload_hash: str
    state: str
    idempotency_key: str
    priority: int
    available_at: str
    attempts: int
    max_attempts: int
    lease_owner: Optional[str]
    lease_expires_at: Optional[str]
    result: Any
    error: Optional[str]
    created_at: str
    updated_at: str
    completed_at: Optional[str]
