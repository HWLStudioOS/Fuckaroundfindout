# HWL OS Restructure, 13 August 2026

Harrison asked whether Codex and Claude should have split access, and whether the OS needs a better structure. This is the answer, built from measurement rather than argument. Every number below was taken from the live repository on 13 August 2026.

Reviewed by the parallel Claude session, which independently re-measured the headline finding and corrected a writer attribution error. Corrections are recorded rather than quietly absorbed.

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

### 1. The repository is roughly 92% media by weight

| Category | Files | Size |
|---|---|---|
| Media and assets | 333 | 2,570 MB |
| Business state | 421 | 207 MB |
| Other | 135 | 1 MB |
| **Engineering** | **99** | **2.9 MB** |

The thing that actually needs version control, branching, review and CI is under 3 MB. It is carried inside a 2.6 GB media store. This single fact explains the worktree cost, the clone time, the twenty-minute force-push on 13 August, and why Git LFS is needed here at all.

The parallel session independently measured 91.2% media against 0.6 MB engineering using a stricter file-extension set. The delta is category-boundary definition, not a disagreement. The finding holds either way: media outweighs code by roughly three orders of magnitude.

### 2. Three scheduled writers on `today.md`

| File | Scheduled writers |
|---|---|
| `today.md` | morning-brief, morning-brief-verify, evening-reflection |
| `this-week.md` | morning-brief, with weekly-review reading it |
| `capture/inbox.md` | discovery-scan, morning-brief, plus telegram-inbound appending |
| `agents/_log.md` | morning-brief, morning-brief-verify |

`today.md` is the hot file: three scheduled writers, plus Harrison, plus any interactive Claude session, plus the Telegram agent.

**Two corrections worth recording, because the method matters more than the numbers.**

An earlier pass reported eleven multi-writer files. That count treated any file mentioned near a write verb as written, which included files merely read as reference. Requiring the verb to be adjacent brought it to four.

The refined method was still wrong. It named `content-engine` as a writer of `today.md`, which is false: `agents/content-engine.md:46` lists `today.md` as read input and line 60 says to *propose alternatives in the message*. It also missed `evening-reflection`, which `agents/evening-reflection.md:4` shows does optionally write a digest line into `today.md`. One false positive and one false negative on the same file.

That failure is itself an argument for Phase 2. If two careful automated passes and a human review disagree about who writes a file, ownership cannot be inferred from prose. It has to be declared.

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

Same shape, found in one morning:

- Five git worktrees nobody removed after merge, 11.5 GB, disk reached 98% full
- `tmp/`, tracked rather than ignored, quietly became a store for bank statements and identity documents, which then reached GitHub
- `today.md` and `this-week.md` carry the same facts twice, which caused the HWL-191 Linear flap and produced two wrong entries on the morning of 13 August alone
- Two queues, three recovery models
- `ExitWorktree` only exits worktrees the session itself created, so a chip-spawned worktree session cannot relocate itself. A sharp edge nobody designed, found by the Clients Lane session the same day

### 5. The shared authentication session is a single point of failure

Every scheduled Claude wrapper depends on one CLI OAuth session. It expired on 2 August and took the learning brief, weekly review, morning brief, content engine, campaign chaser and discovery scan down through 3 August. `SYSTEM-STATUS.md` still records that as a failed acceptance run.

The wrappers now exit 78 on an auth failure, which is correct behaviour, but nothing announces it. A dead fleet is silent until Harrison notices at 06:30.

## Proposal

Four phases, numbered in the order they should be done. Each is independently useful, so stopping after any one leaves the system better than it started.

### Phase 1: Move media out of Git

**Why first.** Highest value, lowest risk, blocks nothing else. It removes roughly 92% of the repository's weight without touching a line of logic.

Client deliverables are outputs, not source. They are never diffed, never merged, never reviewed. They are in version control because that was the path of least resistance, not because anyone wanted history for a WAV file.

Move `business/clients/*/production/**` media out. Keep a manifest in Git recording what exists, where it lives, and its checksum, so the repo still knows the truth about deliverables without carrying their bytes.

**Four things must be decided before anyone starts.** This phase is only low-risk if these are settled first.

1. **Where the bytes live.** A named store, not "somewhere else". The candidates are an external NVMe already in use for editing, or object storage. This is Harrison's call and it has cost and access implications.
2. **The restore path.** A manifest is useless without a fetch script. David and any Codex worktree need media on demand, so `scripts/fetch-media.sh <manifest-entry>` has to exist before the bytes move, not after.
3. **A second history rewrite, done deliberately.** Deleting media from the working tree does not shrink clones; the bytes stay in history. Reaping the actual clone-size win requires one more `filter-repo` pass. That should happen soon, while the media volume is at 2.6 GB, rather than after more weekly podcast masters land.
4. **A backup story.** Git has been the implicit backup for these deliverables. Moving them out removes that without replacing it. Nothing should leave the repository until its replacement backup is real and has been restored from once.

**Effect.** Clones and worktrees drop from 2 to 4 GB to roughly 200 MB. Parallel agent worktrees become cheap enough to be a normal tool rather than a disk emergency. LFS can eventually be retired. This phase alone unblocks the overnight fleet plan.

**Run in parallel:** the authentication root-cause diagnosis below. It is investigation, not engineering, so it does not compete for the same attention.

### Phase 2: One writer per file, and generate what is currently duplicated

Assign every state file exactly one declared owner. Everything else proposes rather than writes. Declared, not inferred, for the reason evidence 2 demonstrates.

**The load-bearing decision, named.** `this-week.md` becomes the task source of truth and `today.md`'s task section becomes a generated view of it.

The evidence points one way. `this-week.md` already owns all 39 `linear:HWL-` markers; `today.md` has zero. PR #20 established one state-recorded owning Markdown file per Linear issue, and `this-week.md` is already that file. Generating in the other direction would fight a rule that was written to stop exactly this failure.

Only one of `today.md`'s seven sections is task state. Pulse, Yesterday wrap, Awaiting response, In flight, Standing and Lens are narrative synthesis and should stay authored by morning-brief. The `## Today` checklist is the part that duplicates `this-week.md`, and the only part that should be generated.

The repository already contains a working version of this pattern. `board-room/app/generated-board.json` is generated from committed sources, and the nightly backup verifies it in frozen-snapshot mode, failing if the committed snapshot has drifted. That is exactly the mechanism needed, already built, already tested, already trusted in production. Reuse it rather than inventing a second one, which would repeat the mistake this document is about.

**Effect.** Removes the entire class of failure that produced the Linear flap and two wrong entries on 13 August.

### Phase 3: Authentication resilience

Split into two pieces of very different size.

**Ship immediately, alongside Phase 1:** a Telegram alert when a wrapper exits 78. The preflight already detects auth failure and exits with the right code. Nothing listens. This is small and it converts a silent dead fleet into a message.

**Investigate in parallel:** why the shared OAuth session expires. It has failed twice and both times the cause was recorded as undiagnosed. Any fleet plan inherits this dependency, so the root cause should be known before the fleet grows.

### Phase 4: Make the concurrency boundary real

Last, and deliberately. Largest engineering effort, highest risk, and it should not be attempted while Phases 1 and 2 are in flight.

Today, coordination between writers is advisory. Two Claude sessions avoided a collision on 13 August only because one voluntarily messaged the other. That is manners, not architecture.

Delete one of the two queue implementations. Extend the survivor with what neither currently has: a resource or path scope, so a claim can mean "I am writing this file", and time-based expiry so a hung worker is reclaimed rather than blocking forever. Keep the `needs_review` quarantine posture from both.

Be honest about the cost. This is not switching on existing infrastructure. `jarvis_core`'s lease is well-designed but unwired and has no resource field; the live queue is wired but has no timeout. The pattern is proven in production, the specific capability is not. Real work, better than greenfield.

**This is also the answer to the original question.** File ownership enforced by lease is the split between Codex and Claude. The boundary is the domain, not the identity.

## What this does not fix

Stated plainly so the proposal is not oversold.

- It leaves one Git history serving both engineering and business state. That is tolerable once media is gone and writers are scoped, but it is not clean separation. Splitting into separate repositories remains available later and is deliberately not proposed now, because cross-repo coordination would add its own failure modes to a system already struggling with coordination.
- It does not reduce the number of agents or scheduled jobs. Seventeen scheduled writers may be correct or may be too many, but that is a product question about what Harrison wants the OS to do, not a structural one.
- Phase 4 is genuine engineering with real risk, and nothing in Phases 1 to 3 depends on it.

## Relationship to the fleet plan

`spec/parallel-agents-playbook-2026-08-13.md` covers the overnight fleet from the other direction. The two documents share one constraint.

That playbook currently avoids worktree isolation because worktrees cost 2 to 4 GB here. **That constraint is entirely media weight, not a property of worktrees.** After Phase 1 it disappears, and worktree isolation becomes affordable. The playbook's ban should be recorded as conditional on Phase 1 rather than permanent.

Only Phase 4 gates unattended concurrent writes. Phases 1 to 3 are independent of the fleet work and do not block it.

## Provenance

Written by the Full Boot Up session, 13 August 2026, and reviewed by the parallel session before delivery. The review corrected the `today.md` writer attribution, forced the phase numbering into recommended order, required Phase 2 to name its load-bearing decision, and added the four Phase 1 preconditions. All four are incorporated above.
