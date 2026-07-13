"""Fail-closed classification for typed action proposals.

Risk metadata supplied by a planner is untrusted.  The registry establishes a
minimum classification for each known action type.  A caller may make that
classification stricter, but can never lower risk, hide externality, or claim
that an irreversible operation is reversible.

Approval actor strings currently record assertions only.  They are not proof
of identity and must not be trusted by any future executor until approvals
arrive through authenticated ingress.
"""

from __future__ import annotations

from dataclasses import dataclass
from types import MappingProxyType
from typing import Mapping


UNAUTHENTICATED_APPROVAL_WARNING = (
    "Approval actor strings are unauthenticated assertions. Do not trust them "
    "for execution until authenticated approval ingress exists."
)

MAX_APPROVAL_REQUIRED_PROPOSAL_TTL_SECONDS = 24 * 60 * 60

_RISK_ORDER = {"low": 0, "medium": 1, "high": 2, "critical": 3}


@dataclass(frozen=True)
class ActionClassification:
    """Effective minimum safety properties for one typed action."""

    risk: str
    is_external: bool
    reversible: bool
    registered: bool = True

    @property
    def requires_approval(self) -> bool:
        """Only internal, low risk, reversible operations auto-allow."""

        return self.is_external or self.risk != "low" or not self.reversible


REGISTERED_ACTION_TYPES: Mapping[str, ActionClassification] = MappingProxyType(
    {
        "note.create": ActionClassification("low", False, True),
        "email.send": ActionClassification("high", True, False),
        "message.send": ActionClassification("high", True, False),
        "files.delete": ActionClassification("high", False, False),
        "calendar.hold": ActionClassification("medium", True, True),
        "local.destroy": ActionClassification("critical", False, False),
    }
)

UNKNOWN_ACTION_CLASSIFICATION = ActionClassification(
    "critical", True, False, registered=False
)


def classify_action(
    action_type: str,
    *,
    requested_risk: str = "low",
    requested_external: bool = False,
    requested_reversible: bool = True,
) -> ActionClassification:
    """Return the registry floor raised by any stricter caller claims.

    Unknown types fail closed as critical, external, and irreversible.  The
    caller can only raise risk or externality, or reduce reversibility.
    """

    if requested_risk not in _RISK_ORDER:
        raise ValueError("risk must be low, medium, high, or critical")
    baseline = REGISTERED_ACTION_TYPES.get(action_type, UNKNOWN_ACTION_CLASSIFICATION)
    risk = max((baseline.risk, requested_risk), key=_RISK_ORDER.__getitem__)
    return ActionClassification(
        risk=risk,
        is_external=baseline.is_external or bool(requested_external),
        reversible=baseline.reversible and bool(requested_reversible),
        registered=baseline.registered,
    )
