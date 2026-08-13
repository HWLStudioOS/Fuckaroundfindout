# HWL OS Restructure, 13 August 2026

Harrison asked whether Codex and Claude should have split access, and whether the OS needs a better structure. This is the answer, built from measurement rather than argument. Every number below was taken from the live repository on 13 August 2026.

## The short answer

Do not split by agent. Split by job.

Splitting access by identity fixes the wrong variable. Codex writing business state is exactly as wrong as Claude editing `jarvis_core/` without tests. The question is not who is writing, it is what is being written and under what rules. Two identities with unrestricted access to everything becomes two identities with two different unrestricted scopes, which is the same problem wearing a hat.

## Diagnosis: one repository doing four incompatible jobs

| Job | Wants | Currently gets |
|---|---|---|
| Business state of record | One writer, always current, human-readable | 17 scheduled writers, 2+ interactive sessions, a Telegram bot |
| Engineering codebase | Branches, review, CI, tests | Same git history as everything else |
| Media and client deliverables | Bulk storage, no versioning | Versioned in LFS, materialised per worktree |
| Scratch | Disposable | Was tracked and pushed until 13 August |

Every symptom traces to that table. Nothing here is anyone's mistake. Each individual decision was locally reasonable. The problem is that no layer of the system notices when a fifth reasonable decision duplicates the second one.

## Evidence

### 1. The repository is 92% media by weight

| Category | Files | Size |
|---|---|---|
| Media and assets | 333 | 2,570 MB |
| Business state | 421 | 207 MB |
| Other | 135 | 1 MB |
| **Engineering** | **99** | **2.9 MB** |

The thing that actually needs version control, branching, review and CI is 2.9 MB. It is carried inside a 2.6 GB media store. This single fact explains the worktree cost, the clone time, the twenty-minute force-push on 13 August, and why Git LFS is needed here at all.

### 2. Four files have more than one scheduled writer

Measured by parsing agent prompts for write verbs adjacent to a file reference, which separates real writers from files merely read as reference.

| File | Scheduled writers |
|---|---|
| `today.md` | content-engine, morning-brief, morning-brief-verify |
| `this-week.md` | morning-brief, plus weekly-review reading it |
| `capture/inbox.md` | discovery-scan, morning-brief, plus telegram-inbound appending |
| `agents/_log.md` | morning-brief, morning-brief-verify |

`today.md` is the hot file: three scheduled writers, plus Harrison, plus any interactive Claude session, plus the Telegram agent. An earlier naive count suggested eleven multi-writer files. That number was inflated by counting reads as writes. Four is the honest figure.

`capture/inbox.md` is append-only by design and is therefore lower risk than its writer count suggests. `today.md` is not append-only, and that is where drift appears.

### 3. Three recovery models across two queue implementations

| Mechanism | Catches | Status |
|---|---|---|
| `jarvis_core/queue.py` lease expiry, 474 lines | Hung worker, by timeout | **Unused** |
| `agents/telegram_queue.py` `recover_interrupted()`, 222 lines | Crashed worker, on restart | Live |
| `agents/telegram-agent.py` `TASK_TIMEOUT`, 30 min | Runaway subprocess | Live |

A process-level timeout sits on top of a queue with no concept of timeouts, beside an unused queue that has one. `jarvis_core`'s `QueueItem` carries no path or resource field, so no existing lease can express "I am writing this file". Nothing outside `jarvis_core/` and `tests/` imports it.

The unused implementation is the better-designed one. Its expired leases move to `needs_review` rather than being silently replayed, because side-effect status is unknown. That is the correct posture for a concurrent-writer boundary.

### 4. Accretion is the pattern, not the exception

Same shape, four places, all found in one morning:

- Five git worktrees nobody removed after merge, 11.5 GB, disk reached 98% full
- `tmp/`, tracked rather than ignored, quietly became a store for bank statements and identity documents, which then reached GitHub
- `today.md` and `this-week.md` carry the same facts twice, which caused the HWL-191 Linear flap and produced two wrong entries on the morning of 13 August alone
- Two queues, three recovery models

### 5. The shared authentication session is a single point of failure

Every scheduled Claude wrapper depends on one CLI OAuth session. It expired on 2 August and took the learning brief, weekly review, morning brief, content engine, campaign chaser and discovery scan down through 3 August. `SYSTEM-STATUS.md` still records that as a failed acceptance run. Any plan involving more parallel agents inherits a dependency that has already failed twice.

## Proposal

Four phases, ordered by value over risk. Each is independently useful, so stopping after any one leaves the system better than it started.

### Phase 1: Move media out of Git

**Why first.** Highest value, lowest risk, blocks nothing else. It removes 92% of the repository's weight without touching a single line of logic.

Client deliverables are outputs, not source. They are never diffed, never merged, never reviewed. They are in version control because that was the path of least resistance, not because anyone wanted history for a WAV file.

Move `business/clients/*/production/**` media to external storage. Keep a manifest in Git recording what exists, where it lives, and its checksum, so the repo still knows the truth about deliverables without carrying their bytes.

**Effect.** Clones and worktrees drop from 2 to 4 GB to roughly 200 MB. Parallel agent worktrees become cheap enough to be a normal tool rather than a disk emergency. LFS can eventually be retired. This phase alone unblocks the overnight fleet plan.

### Phase 2: One writer per file, and generate what is currently duplicated

Assign every state file exactly one owning writer. Everything else proposes rather than writes.

The specific fix for the worst case: stop hand-maintaining `today.md` and `this-week.md` as two independent documents holding the same facts. Make one the source and generate the other.

The repository already contains a working version of this pattern. `board-room/app/generated-board.json` is generated from committed sources, and the nightly backup verifies it in frozen-snapshot mode, failing if the committed snapshot has drifted. That is exactly the mechanism needed, already built, already tested, already trusted in production. Reuse it rather than inventing a second one, which would repeat the mistake this document is about.

**Effect.** Removes the entire class of failure that produced the Linear flap and two wrong entries on 13 August.

### Phase 3: Make the concurrency boundary real

Today, coordination between writers is advisory. Two Claude sessions avoided a collision on 13 August only because one voluntarily messaged the other. That is manners, not architecture.

Delete one of the two queue implementations. Extend the survivor with what neither currently has: a resource or path scope, so a claim can mean "I am writing this file", and time-based expiry so a hung worker is reclaimed rather than blocking forever. Keep the `needs_review` quarantine posture from both.

Be honest about the cost. This is not switching on existing infrastructure. `jarvis_core`'s lease is well-designed but unwired and has no resource field; the live queue is wired but has no timeout. The pattern is proven in production, the specific capability is not. Real work, better than greenfield.

**This is also the answer to the original question.** File ownership enforced by lease is the split between Codex and Claude. The boundary is the domain, not the identity.

### Phase 4: Authentication resilience

Treat the shared OAuth session as the single point of failure it has twice proven to be. Any fleet plan needs a health check that fails closed and alerts, rather than six agents discovering it independently at 06:30.

## What this does not fix

Stated plainly so the proposal is not oversold.

- It leaves one Git history serving both engineering and business state. That is tolerable once media is gone and writers are scoped, but it is not clean separation. Splitting into separate repositories remains available later and is deliberately not proposed now, because cross-repo coordination would add its own failure modes to a system already struggling with coordination.
- It does not reduce the number of agents or scheduled jobs. Seventeen scheduled writers may be correct or may be too many, but that is a product question about what Harrison wants the OS to do, not a structural one.
- Phase 3 is genuine engineering with real risk. It should not be attempted while Phase 1 and 2 are in flight.

## Recommended order

1. **Phase 1**, media out. Largest measurable win, near-zero risk.
2. **Phase 2**, single writer plus generated views. Fixes the failure Harrison actually feels each morning.
3. **Phase 4**, auth resilience. Small, and it protects everything else.
4. **Phase 3**, real leases. Largest engineering effort, do it last and deliberately.

## Provenance

Written by the Full Boot Up session, 13 August 2026. Sits alongside `spec/parallel-agents-playbook-2026-08-13.md` from the parallel session, which covers the fleet workflow from the other direction. The two documents share the same constraint and should be read together: that playbook's fleet cannot safely scale until Phase 1 makes worktrees cheap and Phase 3 makes writes exclusive.
