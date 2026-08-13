# State file ownership

Restructure Phase 2. Declared, not inferred.

On 13 August two separate automated passes over the agent prompts disagreed
about who writes `today.md`. One named `content-engine`, which only reads it and
proposes alternatives in its message. Both missed `evening-reflection`, which
genuinely did write to it. If careful tooling and a human review cannot agree on
ownership by reading prose, ownership has to be stated. This file states it.

`scripts/check-state-consistency.mjs` enforces the marker rules mechanically.
This file covers the part a checker cannot infer: intent.

## The rule

**One owner per file.** The owner is the only agent that may change existing
content. Others may read freely. A small number of files are append-only logs,
where many writers are safe because nobody rewrites anyone else's lines.

A doer and its verifier count as one owner. `morning-brief` and
`morning-brief-verify` are two stages of one job, not two writers.

## Owners

| File | Owner | Append-only writers | Notes |
|---|---|---|---|
| `today.md` | `morning-brief` (with `morning-brief-verify`) | none | Daily brief. Reads `_evening-log.md` for the Yesterday wrap. |
| `this-week.md` | `morning-brief` for task state | none | Task source of truth; owns all `linear:HWL-` markers. `weekly-review` rebuilds the board on Sundays, which is a handoff, not concurrent writing: 18:00 Sunday against 06:30 daily. |
| `capture/inbox.md` | no single owner, append-only by design | `discovery-scan`, `morning-brief`, `telegram-inbound`, Harrison | The single trusted intake, H11. Safe because entries are only ever added. |
| `agents/_log.md` | no single owner, append-only audit | every agent via `agent-runtime.sh` | One truthful completion line per run. |
| `agents/_evening-log.md` | `evening-reflection` | none | Its only output. |
| `agents/_review-log.md` | `weekly-review` | none | |
| `money/weekly.md` | `weekly-cfo` | none | |
| `money/index.md` | Harrison | none | Money state follows Harrison's latest dated correction. Agents propose, they do not rewrite. |
| `content/pipeline.md` | `content-engine` | none | `weekly-review` reads it. |
| `content/creative-tests.md` | `creative-lab` | none | The client creative test ledger. Every entry ends in a verdict; a test never resolved is a guess with extra steps. |
| `health/training-plan.md` | Harrison | none | Canonical training plan. Agents read it; none may rewrite it. `pattern-lab` observes against it and is explicitly forbidden from editing it or prescribing training. |
| `health/observations.md` | `pattern-lab` | none | Cross-week observations from Harrison's own Garmin data. Observations with falsifiable predictions, never advice. |
| `content/form-watchlist.md` | Harrison | none | His named form references. `form-lab` reads it; only Harrison changes who is on it. |
| `SYSTEM-STATUS.md` | whoever makes a system change | none | Engineering handoff. Updated deliberately, never by a scheduled agent. |
| `board-room/app/generated-board.json` | generated | none | Built by the nightly backup and verified in frozen-snapshot mode. Never hand-edited. |

## Why `today.md` and `this-week.md` are split this way

They carried the same facts twice, which is what caused the HWL-191 flap on
9 and 10 August and produced two wrong entries on the morning of 13 August.

`this-week.md` holds all 39 `linear:HWL-` markers; `today.md` holds zero. PR #20
established one state-recorded owning Markdown file per Linear issue, and
`this-week.md` is already that file. So task state belongs there.

Only one of `today.md`'s seven sections is task state. Pulse, Yesterday wrap,
Awaiting response, In flight, Standing and Lens are narrative synthesis and stay
authored by the morning brief. The `## Today` checklist is the part that
duplicates, and it must never carry a `linear:HWL-` marker: a marker in two
files is exactly the failure the checker now blocks.

## Known gap

`this-week.md` is written by `morning-brief` daily and rebuilt by
`weekly-review` on Sundays. Their schedules do not overlap, so this is a handoff
rather than a race, but it is still two writers on one file and it is recorded
here rather than glossed. Closing it properly is Phase 4 work, where a
file-scope lease makes the boundary enforced instead of scheduled.
