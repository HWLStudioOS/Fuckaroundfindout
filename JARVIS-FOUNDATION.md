# Jarvis Foundation

## Status

This is an additive engineering boundary for the existing personal operating
system. It does not replace, reschedule, or reconfigure any live agent. The
current Markdown workflows remain usable while the durable core is introduced
behind explicit feature flags.

The near-term objective is trust, not breadth: one durable record of what was
observed, what ran, what was proposed, what was approved, and what actually
happened.

### Current branch boundary

This branch implements the ledger, conservative queues, typed action
classification, proposal hashing, approval recording, tests, and diagnostics.
It deliberately does **not** implement an action executor or route existing
agents through the new policy layer yet.

Approval actor names recorded by the CLI/API are unauthenticated assertions.
They are useful for modelling and audit tests, but they are not identity proof
and must not authorise a real side effect. Authenticated approval ingress,
execution leases, destination receipts, and verification are Phase 3 work.
Likewise, the generic queue's explicit retry method is not approval to replay
an external side effect; external jobs remain quarantined until destination
reconciliation and authenticated review exist.

The existing Claude runners still have their existing permissions. Until each
one is migrated behind a typed adapter, this foundation is an additive shadow
system, not a hard sandbox around legacy agents.

## Design principles

1. **Local first, recoverable elsewhere.** Sensitive work can execute on the
   Mac Mini, but scheduling, queues, approvals, and recovery must not depend on
   one process or one model session.
2. **Evidence before inference.** Facts carry source, observation time,
   confidence, sensitivity, and expiry. Unknown remains unknown.
3. **Proposals are not permission.** Models propose typed actions. A policy
   layer decides whether an exact proposal may run.
4. **Every side effect has a receipt.** External actions are idempotent,
   attributable, and verified against the destination where practical.
5. **Fail closed.** If verification, policy, credentials, or durable recording
   is unavailable, an external action is withheld.
6. **Markdown remains humane.** Personal context and generated views stay easy
   to read and edit; mutable operational state does not use Markdown as a
   concurrent database.
7. **One migration at a time.** Each workflow can return to its previous path
   without rolling back unrelated workflows.

## Directory boundaries

| Path | Owns | Must not own |
|---|---|---|
| jarvis_core/ | Standard-library domain models, SQLite migrations, event/run/action ledgers, queues, policy primitives | Connector credentials, prompts, network clients, user-authored canon |
| agents/ | Existing launchd entry points and thin edge adapters | New canonical state or broadly reusable business rules |
| self/, business/, life/, health/, money/, campaigns/, capture/, spec/ | The current human-readable personal vault and authored source material | Locks, queue leases, approval state, process sentinels |
| runtime/ | Local databases, WAL/SHM files, leases, sentinels, generated logs and caches | Version-controlled source or irreplaceable artifacts |
| scripts/ | Read-only diagnostics and explicit operator/migration utilities | Hidden daemons or ambient side effects |
| tests/ | Unit, contract, migration and failure-path tests | Live credentials or production data |
| .github/workflows/ | Repository validation only | Deployment to the Mac Mini or autonomous external actions |
| artifacts/ or encrypted object storage | Future large generated media and client deliverables | Secrets or canonical operational records |
| infra/ | Future service definitions, deployment configuration and health checks | Personal content |

The existing personal-domain folders collectively act as the vault. Moving
them into a new vault/ folder is optional and should only happen after all
absolute paths and launchd jobs have been removed or migrated.

## State ownership

### Authored knowledge

Human-authored Markdown remains authoritative for identity, preferences,
strategy, standards, and long-lived narrative context. Agent output must not
silently rewrite those documents as if it were user-authored.

### Operational truth

The runtime store becomes authoritative for:

- observed events and their provenance;
- derived facts and supersession;
- goals, commitments, and task lifecycle;
- run attempts, inputs, outputs, and errors;
- proposed actions, policy decisions, and approvals;
- work queue leases, retries, and dead-letter state;
- execution and verification receipts.

SQLite is the initial store because it is transactional, inspectable,
back-upable, and already available in supported Python. A single database is
enough until measured load proves otherwise.

### Projections

Files such as today.md, this-week.md, dashboards, and Linear issues become
projections of operational truth one workflow at a time. During migration:

1. The current source remains authoritative.
2. The new core records a shadow copy and compares results.
3. A feature flag switches reads to the new projection.
4. Only after an observation period does the old writer stop.

There must never be two unqualified writers claiming the same field is
canonical. Projection files should carry a generated marker and stable entity
IDs before agents are allowed to update them.

## Execution flow

    Connector or local observer
        -> normalized event with evidence
        -> durable event ledger
        -> fact / commitment / task derivation
        -> planner creates a typed proposal
        -> policy decision
        -> exact-action approval when required
        -> idempotent executor
        -> destination receipt
        -> independent verification
        -> result event and updated projection

Planning and execution are separate runs. A model restart can lose its
conversation without losing the plan, approval, or current execution state.

## Safety model

### Typed actions

An executor accepts a small schema, not an open-ended instruction. A proposal
includes at least:

- action type and version;
- exact target;
- normalized payload and deterministic hash;
- requesting run and actor;
- risk class and reversibility;
- idempotency key;
- creation and expiry time;
- required policy and approval evidence.

Credentials stay inside the adapter that performs the action. They are never
included in model context, action payloads, logs, or approval messages.

### Risk classes

| Class | Examples | Default |
|---|---|---|
| R0 — observe | Read a file, inspect connector freshness, calculate a summary | Automatic and logged |
| R1 — internal reversible | Create a private draft, refresh a generated view, enqueue local work | Automatic only through an allowlisted typed action |
| R2 — external reversible | Create a calendar hold, save an external draft, update a reversible task | Exact approval unless a narrow, revocable standing policy exists |
| R3 — consequential | Send as Harrison, move money, publish, delete, change access, disclose restricted data | Fresh human approval; no standing approval |

An action is classified at the highest applicable risk. Ambiguous actions move
up a class, not down.

### Approval binding

Approval binds to the action hash, target, payload, risk, and expiry. Editing
any of them invalidates approval. A conversational phrase such as “send it”
can approve only the one currently presented action and cannot grant a resumed
session general permission.

### Idempotency and transitions

Each external intent has one stable idempotency key. Executors use explicit
state transitions:

    proposed -> approved -> executing -> executed -> verified

Terminal alternatives include rejected, expired, failed, needs_review, and
cancelled. A process crash while executing never becomes an automatic retry
until destination state is reconciled.

### Verification

The executor's success response is evidence, not proof. Where an API permits,
a separate read verifies recipient, content hash, identifier, and state.
Verification failure creates needs_review and never fabricates success.

### Privacy and retention

- Runtime databases and logs are ignored by Git.
- Sensitive backups are encrypted client-side and tested through restore
  drills.
- Logs store identifiers and hashes rather than full restricted payloads.
- Raw health, financial, location, and communication data gets an explicit
  retention policy.
- “Forget this” creates a reviewable deletion request covering source,
  derivatives, search indexes, and backups where feasible.

## Operator controls

The first operator command is intentionally read-only:

    /usr/bin/python3 scripts/doctor.py

It checks the supported Python floor, repository shape, required commands,
tracked and untracked non-ignored Python/JSON/plist validity, Git readiness,
and accidental runtime database tracking. It reports warnings without changing
files, installing packages, loading services, contacting remotes, or printing
credential values.

Repository validation is also available locally:

    /usr/bin/python3 -m unittest discover -s tests -p 'test_*.py' -v

CI runs the tests and Python compile checks on 3.9 and a current Python, plus
Bash, JavaScript, JSON, and property-list validation. CI is deliberately not a
deployment pipeline.

Every active workflow should eventually expose:

- enabled or disabled feature flag;
- last start, success, and verified success;
- source freshness;
- queue depth and oldest item age;
- current version;
- a bounded retry count and dead-letter state;
- a one-command stop path.

## Rollout

### Phase 0 — Baseline

- Keep live schedules and paths unchanged.
- Add tests, CI, doctor, dependency metadata, and ignore rules.
- Capture expected behavior as contract tests before changing a workflow.
- Back up and perform a restore rehearsal.

Exit condition: the baseline is repeatable on the Mini's Python 3.9 runtime and
CI is green.

### Phase 1 — Shadow ledger

- Create the versioned runtime database outside Git.
- Record events, runs, and results alongside one existing workflow.
- Do not change its user-visible output.
- Compare old output with derived state and measure missed or duplicated work.

Exit condition: at least two weeks without unexplained loss, duplication, or
state divergence.

### Phase 2 — Durable queue and projections

- Move one workflow from file/process sentinels to leased durable work.
- Quarantine interrupted execution for review.
- Generate one Markdown view from stable IDs in the store.
- Keep the legacy writer available behind a mutually exclusive flag.

Exit condition: restart, duplicate-delivery, and stale-lease tests pass and a
projection can be rebuilt from the store.

### Phase 3 — Action gateway

- Implement typed adapters in dry-run mode.
- Record proposals, policy decisions, approvals, and simulated receipts.
- Add approval expiry, hash binding, idempotency, and destination
  reconciliation.
- Start with drafts and other reversible internal actions.

Exit condition: no code path can produce an external side effect without an
allowed transition in the durable ledger.

### Phase 4 — Narrow autonomy

- Enable one low-risk adapter for a small allowlist.
- Add mobile approval and a global external-action kill switch.
- Measure false positives, stale context, reversals, and user interruption.
- Expand scope only when evidence supports it.

Exit condition: the workflow meets an agreed reliability target and has
completed rollback and credential-revocation drills.

### Phase 5 — Resilient control plane

- Move scheduling, encrypted queues, approvals, push notifications, and health
  monitoring to a minimal off-machine control plane.
- Keep the Mini as a private edge worker for local files and Mac applications.
- Queue work safely while the Mini is offline.

Exit condition: loss of the Mini or one provider cannot erase state, approve
work, or strand the user without status.

Voice, passive sensing, and broad multi-step autonomy come only after these
controls are proven.

## Rollback

Rollback is designed per workflow, not as a repo-wide emergency rewrite.

1. Set the workflow feature flag to legacy or disabled.
2. Stop claiming new queue items; allow safe reads to continue.
3. Mark in-flight external actions needs_review. Do not blindly retry them.
4. Preserve the append-only ledger and take a database snapshot.
5. Re-enable the previous writer only after its input boundary is restored.
6. Rebuild generated views from the selected source of truth.
7. Record the reason, affected run/action IDs, and operator decision.

| Trigger | Immediate response |
|---|---|
| Incorrect brief or projection | Disable that projection; serve last verified or explicit unavailable state |
| Queue duplication or lost lease | Stop workers; reconcile idempotency keys and destination receipts |
| Approval mismatch | Disable all external executors; preserve proposals and audit records |
| Credential exposure | Kill switch, revoke credential, rotate, then review logs and actions |
| Database corruption | Stop writers, copy files, restore verified backup, replay append-only events |
| Mini offline | Keep remote intake queued; do not reroute privileged actions to an untrusted worker |

Schema migrations are forward-only in production. Application rollback must
remain able to read the latest schema, or use a verified pre-migration snapshot
after all post-snapshot external actions have been reconciled.

## Non-goals for the foundation

- Recreating an Iron Man personality.
- Adding more scheduled prompt agents before state and permission boundaries
  are reliable.
- Replacing every existing Markdown file.
- Introducing microservices, a vector database, or a mobile native app before
  one-machine reliability is proven.
- Treating embeddings, model transcripts, or Linear as canonical truth.

The foundation succeeds when the assistant can say what it knows, show why,
resume after interruption, request exact permission, act once, prove the
result, and stop safely.
