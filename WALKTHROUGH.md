# v1 Walkthrough

A 15-minute read-through of what's built. Open the files alongside this doc if you want to verify as you go.

---

## What just shipped

HWL META is now your single root. 78 live files across 14 folders. The agency (4.8GB) and rewrite (608KB) are archived inside `.archive/`. The codex folder at `/Users/harrison/hwlstudio-codex/` stays exactly as you left it; HWL META files point at the 22 codex files via absolute paths rather than copying them.

Zero em-dashes anywhere outside `.archive/`. Cleaned with the same sed pattern your agent-runner.sh uses.

---

## Open in this order if you have 15 minutes

1. **`README.md`** (1 min), map of what's where.
2. **`CLAUDE.md`** (2 min), the schema. What Claude reads on session start, push behaviours, voice, hard nos, routing.
3. **`today.md`** (1 min), manual scaffold. Will be agent-driven once Phase 4 ships. Shows what tomorrow's brief will look like.
4. **`self/operating-theory.md`** (3 min), the 21 codex hypotheses, one-liner each. The five most load-bearing (H7, H8, H11, H17, H21) are flagged. Re-read these when the system feels off.
5. **`agents/README.md`** (3 min), honest status table. morning-brief, weekly-review, weekly-cfo each tracked. Known infrastructure issues named. Wiring sequence with explicit acceptance criteria.
6. **`spec/mvp-roadmap.md`** (2 min), Phase 0 to Phase 5. Where v1 ends, where v1.1 (web dashboard) and v1.2 (TestFlight phone app) begin.
7. **`business/offers/flagship-asce.md`** (2 min), what HWL Studio actually sells. Augmented Strategic Content Engine. Three shapes (six-week £45k, £8.5k/£11k advisory, £15k fractional head of content).
8. **`money/analysis-2026-05-11.md`** (1 min), the codex-anchored finance baseline. Read this when the cash-stress impulse hits.

Total: ~15 minutes.

---

## What's load-bearing

Files the system actually runs on:

- `CLAUDE.md`, read on every session start.
- `today.md`, daily brief target. Currently scaffold. Becomes morning-brief output once wired.
- `self/profile.md`, `self/operating-theory.md`, identity grounding. Each session start reads these.
- `business/clients/{lor,creepers,baw,colin-fisher}.md`, client state.
- `business/offers/*.md`, what's actually for sale.
- `money/index.md`, cash truth, refreshed by weekly-cfo agent.
- `health/training-plan.md`, RTTS 50K plan v2.0.
- `health/fuel.md`, validated 51g/hr protocol.
- `capture/inbox.md`, the one trusted intake (codex H11 fix).
- `agents/README.md`, honest agent status. Updated every Sunday.
- `agents/morning-brief.md`, daily brief generator.
- `agents/weekly-review.md`, Sunday 18:00 review generator (NEW, drafted).
- `agents/weekly-cfo.md`, Friday 16:00 money report.
- `council/SKILL.md`, multi-agent deliberation for Type-1 decisions.

Reference layer (read on demand, not session start):
- `self/influences-voice.md`, `self/psychology-standards.md`, `self/learning-memory-taste.md`, `self/elegant-chase-of-better.md`.
- `business/map.md`, `business/delivery.md`, `business/sales-positioning.md`.
- `money/snapshot.md`, `money/analysis-2026-05-11.md`, `money/tax-architecture.md`, `money/13-week-cashflow.md`.
- `health/index.md`, `health/routines.md`.
- `content/strategy.md`, `content/voice-dna.md`, `content/publishing-rules.md`, `content/pipeline.md`.
- `life/relationships.md`, `life/home-environment.md`, `life/attention-tools.md`, `life/nz-future.md`.
- `learning/library.md`, `learning/recall-queue.md`, `learning/research-queue.md`.
- `campaigns/lor-retainer.md`, `campaigns/lor-shell-beam-project.md`, `campaigns/golf-clubs.md`.
- `spec/{command-center,system-requirements,mvp-roadmap,integrations-access-plan}.md`.

Archive layer (rarely touched):
- `research/2026-05-10-operator-deep-dive.md` (still load-bearing for content decisions, despite being in research/).
- Everything else in `research/`, reference only.
- Everything in `.archive/`, historical.

---

## What's NOT in v1

Naming so you don't expect them and so we don't drift:

- No web dashboard (Phase 3 of MVP roadmap, deferred to v1.1).
- No TestFlight phone app (Phase 5, deferred to v1.2, end-of-June target).
- No automated voice-memo transcription.
- No Buffer / social-posting automation.
- No new MCP wiring beyond the existing partial set.
- No Xero integration today (reinstate pending Litchfields conversation).
- No daily check-in store yet (Phase 2 of roadmap, comes after Phase 4).
- No income-lane experiments (vertical AI, premium newsletter, acquisitions, faceless YouTube, retail algo, World Cup product). All filed in `research/` as deferred per codex H10.
- No new persona, no JARVIS, no startup ritual longer than three files.
- The Stones Build 62-day public commitment is killed; the dailies, strength, training, and Maya/Laurence accountability survive in different files.

---

## What needs your attention before Phase 4

Five concrete blockers / decisions:

1. **Apple Health schema fix.** Caused 5 of 5 logged morning-brief runs to skip Apple Health. The `agents/refresh-health-data.sh` script produces the CSV. The column casts in `agents/morning-brief.md` queries need verification against your actual exported schema. ~30 min to debug at the Mac Mini.

2. **Telegram bot token.** Lives at `.archive/2026-04-30-agency/ccpa.config.json`. The morning-brief.md prompt references it at the old hwlstudio-rewrite path. After archiving, the path needs updating in the prompt. Trivial fix.

3. **Path updates in agent prompts.** Every agent prompt references `/Users/harrison/hwlstudio-rewrite/`. Needs find-and-replace to `/Users/harrison/HWL META/`. Trivial sed.

4. **Litchfields conversation.** Most urgent non-system thing. VAT registration timing (approaching £90k threshold). Tax buffer rebuild. SIPP via Ltd setup. Owner draw classification of mixed business card charges (Golf Warehouse, Airbnb, Te Arai Links). Codex 10 names these. Without the accountant conversation, `money/tax-architecture.md` stays a scaffold.

5. **LOR retainer state.** No chase before mid-May per the current posture. If silence past 31 May, Council deliberation triggers automatically per `campaigns/lor-retainer.md`. Watch.

---

## Where the codex content lives

Five codex files become canonical for big domains. HWL META references them by absolute path:

| HWL META file | Canonical source in codex |
|---|---|
| `self/profile.md` | `/Users/harrison/hwlstudio-codex/harrison-os/01-harrison-profile.md` |
| `self/operating-theory.md` | `.../03-operating-theory.md` |
| `self/psychology-standards.md` | `.../15-psychology-and-standards.md` |
| `self/influences-voice.md` | `.../08-influences-and-voice.md` |
| `self/learning-memory-taste.md` | `.../17-learning-memory-taste.md` |
| `self/interview-snapshot.md` | `.../04-interview-log.md` |
| `business/map.md` | `.../02-business-map.md` |
| `business/delivery.md` | `.../13-client-delivery-and-offers.md` |
| `business/sales-positioning.md` | `.../14-sales-audience-positioning.md` |
| `money/analysis-2026-05-11.md` | `.../10-finance-analysis-2026-05-11.md` |
| `money/snapshot.md` | `.../06-financial-snapshot.md` |
| `money/inbox/README.md` | `.../finance-inbox/README.md` |
| `health/index.md` | `.../09-health-performance.md` |
| `life/relationships.md` | `.../07-relationship-map.md` + 16 |
| `life/home-environment.md` | `.../16-relationships-home-environment.md` |
| `life/attention-tools.md` | `.../11-attention-and-tools.md` |
| `learning/research-queue.md` | `.../05-research-queue.md` |
| `spec/command-center.md` | `.../12-command-center-spec.md` |
| `spec/system-requirements.md` | `.../18-system-requirements.md` |
| `spec/mvp-roadmap.md` | `.../19-mvp-roadmap.md` |
| `spec/integrations-access-plan.md` | `.../20-integrations-access-plan.md` |

If you update a codex file in a future ChatGPT session, the HWL META reference stays accurate because it points at the source. If HWL META needs to drift from codex (e.g., post-Litchfields finance state), the HWL META file gets a "this overrides codex source dated X" header.

---

## Honest gaps to call out

- **Audience question is still open.** Content strategy doc names it as deliberately unresolved per codex H10. Don't force a niche before reps prove which one converts.
- **Maya / Laurence accountability surface** is named in `life/relationships.md` but not yet operationalised. The Sunday review with Maya is the explicit touchpoint that survives the Stones Build kill. Laurence Monday call is on hold.
- **The synthesis I wrote earlier is filed in `research/2026-05-11-five-lanes-banker-read.md`** with the "deferred per codex" header. It's not deleted because the lane analyses are real; they're just not the answer to your actual question.
- **The 3.9GB projects/ tree from the agency lives at `.archive/2026-04-30-agency/projects/`** doubling HWL META total size to 4.8GB. Re-evaluate after v1 acceptance whether to move to external storage.

---

## My honest assessment of v1

Decent skeleton. The codex content is the spine, which is right. The rewrite content migrated cleanly. The agency archived cleanly. The agents are drafted but unwired, which is the historical failure mode.

What v1 has not solved: the proactive surface. That's Phase 4. Until morning-brief, weekly-review, and weekly-cfo are RUNNING-CLEAN for their acceptance streaks, this is still a markdown vault, not a working OS. The cathedral is built. The capture habit still needs to ship.

The bet for the next 14 days is: ship Phase 4 wiring. If three agents prove they can run unattended, v1 acceptance hits and v1.1 (web dashboard) starts. If they degrade and need manual rescue every 3 days, the rebuild instinct re-fires and we're back here in eight weeks.

That's the honest read.

---

## Where to find specific things

| If you want to... | Read... |
|---|---|
| Understand the schema | `CLAUDE.md` |
| See today's brief | `today.md` |
| See this week's plan | `this-week.md` |
| Re-read the 21 hypotheses | `self/operating-theory.md` |
| Check the live agent status | `agents/README.md` |
| Read the flagship offer | `business/offers/flagship-asce.md` |
| Check the LOR retainer state | `campaigns/lor-retainer.md` |
| Reality-check money | `money/analysis-2026-05-11.md` |
| Plan the week of training | `health/training-plan.md` |
| See the codex spec | `spec/command-center.md` and `spec/mvp-roadmap.md` |
| Find a published audit | `AUDIT.md` |
| Find the architecture decisions | `ARCHITECTURE.md` |
| Find old material | `.archive/README.md` |

---

End of walkthrough.
