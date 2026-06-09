# HWL META Architecture, Harrison OS v1

**Prepared:** 11 May 2026
**Status:** Phase 2 deliverable. Review only. No files moved or deleted yet.
**Source-of-truth inputs:** codex interview (your voice via ChatGPT, 11 rounds, 22 files), the rewrite (38 files), the agency (200 files frozen 30 Apr), my synthesis (250+ verified sources, surfaced and re-anchored).

This document describes the structure of HWL META going forward, what migrates from where, and the Phase 0 to Phase 5 build sequence the codex MVP roadmap calls for. Sign-off here triggers Phase 3 (build).

---

## 0. The principle

Codex Hypothesis 21 names the rebuild trap directly: *"Manual prompting will kill the OS. Harrison is explicit that the system fails if he has to manually open sessions, keep a machine alive, prompt Codex every day, and remember to close/log sessions."*

Three previous rebuilds (Forge, JARVIS, hwlstudio-rewrite) shipped markdown structure but did not ship a proactive surface. v1 of HWL META inverts the priority. The daily brief ships first. The folder structure is whatever the daily brief actually reads from. Cathedral-before-capture is the recurring failure mode; the architecture below is sized for capture-first.

---

## 1. Root layout

```
/Users/harrison/HWL META/
├── README.md                   one-page system map
├── CLAUDE.md                   schema. read every session.
├── today.md                    live brief. refreshed by morning-brief agent.
├── this-week.md                weekly review surface. refreshed Sundays.
│
├── self/                       who Harrison is
├── business/                   HWL Studio, clients, offers
├── money/                      cash position, tax, finance inbox
├── health/                     training plan, fuel, sleep, body
├── content/                    audience strategy, pipeline, voice
├── life/                       Maya, family, environment, NZ arc
├── learning/                   library, recall queue, research queue
├── campaigns/                  active outreach + pushes
├── council/                    multi-agent deliberation skill
├── agents/                     scheduled prompts + dispatcher
├── capture/                    one trusted intake
├── research/                   reports archive
├── spec/                       Command Center design docs
│
├── AUDIT.md                    the audit from earlier today (kept for record)
├── RESEARCH-SYNTHESIS.md       my synthesis (reframed in this doc, kept honest)
│
└── .archive/                   frozen historical material
    ├── README.md
    ├── 2026-04-30-agency/      hwlstudio-ai-agency snapshot
    ├── 2026-05-10-rewrite/     hwlstudio-rewrite snapshot
    └── 2026-05-11-codex/       hwlstudio-codex snapshot
```

Fourteen top-level folders. Four root-level operational files. Three meta files. Single archive.

---

## 2. What each folder holds

### `self/`, who Harrison is

Static reference layer. Read on session start to ground context. Most files don't change weekly.

```
self/
├── profile.md                  codex 01, compressed
├── operating-theory.md         codex 03, the 21 hypotheses. load-bearing.
├── psychology-standards.md     codex 15, power/shame states, call-out rules
├── influences-voice.md         codex 08, creators + books + visual + voice tics
├── learning-memory-taste.md    codex 17, recall system requirements
├── elegant-chase-of-better.md  ported from agency, the "why" layer
└── interview-snapshot.md       summarised highlights from codex 04 (full log archived)
```

**Migrations:**
- codex/01-harrison-profile.md → self/profile.md
- codex/03-operating-theory.md → self/operating-theory.md (verbatim, the hypotheses are gold)
- codex/15-psychology-and-standards.md → self/psychology-standards.md
- codex/08-influences-and-voice.md → self/influences-voice.md
- codex/17-learning-memory-taste.md → self/learning-memory-taste.md
- agency/The Elegant Chase of Better.md → self/elegant-chase-of-better.md
- codex/04-interview-log.md → self/interview-snapshot.md + full log to .archive/

### `business/`, HWL Studio

```
business/
├── map.md                      codex 02, what HWL Studio is + referral chain
├── delivery.md                 codex 13, workflows + delegation map
├── sales-positioning.md        codex 14, buyer language, audience direction
├── clients/
│   ├── lor.md                  rewrite + codex + agency PII merged
│   ├── creepers.md             same
│   ├── baw.md                  same
│   └── colin-fisher.md         ported from agency (rewrite has no file)
└── offers/
    ├── flagship-asce.md        Augmented Strategic Content Engine, the actual flagship
    ├── blueprint-45k.md        £45k six-week page (from rewrite campaigns/blueprint-offer.md)
    ├── retainer-options.md     £8.5k advisory / £11k middle / £15k fractional head
    └── lor-proposal-status.md  live state of the LOR retainer negotiation
```

**Migrations:**
- codex/02-business-map.md → business/map.md
- codex/13-client-delivery-and-offers.md → business/delivery.md
- codex/14-sales-audience-positioning.md → business/sales-positioning.md
- rewrite/context/clients/*.md → business/clients/*.md (merged with agency PII via earlier audit)
- agency/.claude/rules/clients/colin-fisher.md + memory/project_colin_fisher.md → business/clients/colin-fisher.md
- rewrite/campaigns/blueprint-offer.md → business/offers/blueprint-45k.md
- codex/13 retainer detail → business/offers/retainer-options.md

### `money/`, finance

```
money/
├── index.md                    live state, refreshed by weekly-cfo agent
├── analysis-2026-05-11.md      codex 10, the baseline analysis. archived as a checkpoint.
├── snapshot.md                 codex 06, working snapshot
├── tax-architecture.md         VAT/SIPP/ISA/EIS, the gap the rewrite skipped
├── 13-week-cashflow.md         13-week forward view (codex 10 control priority #10)
└── inbox/                      finance exports drop here
    └── README.md               codex finance-inbox/README.md
```

**Migrations:**
- codex/10-finance-analysis-2026-05-11.md → money/analysis-2026-05-11.md (verbatim, this is the truth)
- codex/06-financial-snapshot.md → money/snapshot.md
- rewrite/money/index.md → money/index.md (rewritten to match codex truth)
- codex/finance-inbox/ → money/inbox/
- NEW: money/tax-architecture.md (gap-filler, populated by accountant conversation)
- NEW: money/13-week-cashflow.md (gap-filler)

### `health/`, training, fuel, body

```
health/
├── index.md                    codex 09, profile + targets + sleep/diet
├── training-plan.md            RTTS Plan v2.0 from rewrite
├── fuel.md                     validated fuel protocol from rewrite
├── routines.md                 sleep/diet/recovery operating rules
└── research/                   evidence base, archived references
```

**Migrations:**
- codex/09-health-performance.md → health/index.md
- rewrite/training/index.md → health/training-plan.md (the v2.0 plan, kept)
- rewrite/training/fuel.md → health/fuel.md (kept, validated)
- rewrite/training/2026-05-10-rtts-first-principles-plan.md + academic-evidence-base.md → health/research/
- NEW: health/routines.md (sleep timing fix, diet defaults from codex)

### `content/`, audience, pipeline, voice

```
content/
├── strategy.md                 audience question, still genuinely open
├── pipeline.md                 ideas → drafts → queue → published
├── voice-dna.md                opener/closer/phrases used + never used (from agency email-writer)
└── publishing-rules.md         no slop, no em dashes, posture, status-risk handling
```

**Migrations:**
- agency/skills/email-writer/SKILL.md → content/voice-dna.md
- rewrite/CLAUDE.md voice section + agency/.claude/rules/voice.md → content/publishing-rules.md
- NEW: content/strategy.md, explicitly says "audience question open, hybrid voice per codex H10, status-risk framing per codex H8"
- NEW: content/pipeline.md, empty scaffold, populated by daily/weekly cadence

### `life/`, Maya, family, environment

```
life/
├── relationships.md            codex 07 + 16 sections, Maya, brothers, parents, NZ-friends
├── home-environment.md         codex 16, current setup + what helps/drags
├── attention-tools.md          codex 11, current tools + screen time + capture rule
└── nz-future.md                Takapuna Beach, the long arc
```

**Migrations:**
- codex/07-relationship-map.md + codex/16 sections → life/relationships.md (consolidated)
- codex/16-relationships-home-environment.md → life/home-environment.md
- codex/11-attention-and-tools.md → life/attention-tools.md
- codex/16 NZ sections → life/nz-future.md

### `learning/`, library, recall, research

```
learning/
├── library.md                  books, podcasts, references with status
├── recall-queue.md             quotes, lessons, drills for spaced recall
├── research-queue.md           codex 05, topics to investigate
└── weekly-brief/               rolling output dir
    └── 2026-05-XX-brief.md     weekly digests get dated and archived here
```

**Migrations:**
- codex/05-research-queue.md → learning/research-queue.md
- codex/17 sections on books/library → learning/library.md (combined with agency/memory/user_reading.md)
- NEW: learning/recall-queue.md (empty scaffold; codex says current note system is "fold corners, never return")
- NEW: learning/weekly-brief/ (populated by learning-brief agent)

### `campaigns/`, active pushes

```
campaigns/
├── lor-retainer.md             landing the £8.5-15k LOR retainer. live, the #1 priority.
├── lor-shell-beam-project.md   the £8-10k Ellison Institute documentary opportunity
├── golf-clubs.md               paused; Wave 1 sent, Wave 2 not actioned
└── (placeholders for additional pushes if added)
```

**Migrations:**
- rewrite/campaigns/golf-clubs.md → campaigns/golf-clubs.md (status: paused, audit lessons logged)
- NEW: campaigns/lor-retainer.md, explicit campaign for the £8.5-15k landing
- NEW: campaigns/lor-shell-beam-project.md, the Ellison Institute opportunity from codex 02

Notably NOT included: Site Comms, HWL AEO, Author Repurposing, faceless YouTube, retail algo, programmatic content, acquisitions. Per your "decide after architecture" answer, these stay parked in research/ until you decide to test one. The campaigns/ folder only carries active work.

### `council/`, the only skill carried forward

```
council/
└── SKILL.md                    multi-agent deliberation, carried verbatim from rewrite
```

Used for any Type-1 decision (irreversible, high-stakes). Pricing the LOR retainer, dropping a client, signing a contract, hiring. The rewrite carried this; we keep it. The other six skills from agency (creative-director, f1-analyst, processing-layer, etc.) stay archived.

### `agents/`, proactive scheduled work

```
agents/
├── README.md                   honest status table: wired vs drafted vs dead
├── agent-runner.sh             generic dispatcher from rewrite
├── morning-brief.md            daily brief generator, scheduled 06:30 weekdays
├── morning-brief.sh            daemon entry, from rewrite
├── refresh-health-data.sh      Apple Health import helper, from rewrite
├── weekly-review.md            Sunday 18:00, refreshes this-week.md
├── weekly-cfo.md               Friday 16:00, refreshes money/index.md
├── discovery-scan.md           Mon/Wed/Fri 14:00, appends to capture/inbox.md
├── learning-brief.md           Sunday 09:00, writes to learning/weekly-brief/
├── evening-reflection.md       weekday 19:00, appends to agents/_evening-log.md
└── _log.md                     append-only run log from rewrite
```

**Migrations:**
- rewrite/agents/* → agents/* (all five drafts kept)
- rewrite/agents/agent-runner.sh + morning-brief.sh + refresh-health-data.sh → agents/
- NEW: agents/README.md, honest status table updated after each phase
- NEW: agents/weekly-review.md (Sunday 45-min review producer, per codex system requirements)
- NEW: agents/learning-brief.md (per codex 12 research candidates + 17 brain library spec)

The wiring sequence in Phase 4 is explicit and prioritised below. The point of the codex MVP roadmap is the agents become the system. Five DRAFTED files that don't run is the failure mode the rewrite already proved.

### `capture/`, single trusted intake

```
capture/
├── inbox.md                    one place for tasks, ideas, learning notes, client obligations
├── voice-memos.md              transcribed captures (manual at first, automated later)
└── orders.md                   buy queue (from rewrite inbox/queue/orders.md)
```

**Migrations:**
- rewrite/inbox/feed.md + agency/inbox/* (Annette, Chinese Room, Vicki notes) → capture/inbox.md
- rewrite/inbox/queue/orders.md → capture/orders.md

Codex H11: *"Harrison's problem is not lack of tools, it is lack of one trusted intake."* This folder is the answer to that. Daily check-in produces entries here. Discovery agent appends. Voice memos transcribe in. Single intake.

### `research/`, one-off reports + landscape reads

```
research/
├── README.md                   index with dates and status (active/superseded/archived)
├── 2026-04-29-skills-and-mcps.md         from rewrite
├── 2026-04-29-training-research.md       from rewrite
├── 2026-05-10-operator-deep-dive.md      from rewrite, still load-bearing
├── 2026-05-10-archetypes-first-principles.md   from rewrite
├── 2026-05-10-operator-case-studies.md   from rewrite
├── 2026-05-10-wedges.md                  from rewrite
├── 2026-05-10-synthesis-original.md      from rewrite, marked "context only"
├── 2026-05-11-five-lanes-banker-read.md  my synthesis, marked "deferred per codex"
└── (future reports dated and indexed)
```

**Migrations:**
- rewrite/research/* → research/ (all kept, status flagged per the codex re-anchor)
- HWL META/RESEARCH-SYNTHESIS.md → research/2026-05-11-five-lanes-banker-read.md (renamed honestly)
- HWL META/AUDIT.md stays at root as the audit-of-record

### `spec/`, the design docs that drive the build

```
spec/
├── command-center.md           codex 12, the dashboard design
├── system-requirements.md      codex 18, failure modes + first-version spec
├── mvp-roadmap.md              codex 19, Phase 0 to Phase 5
└── integrations-access-plan.md codex 20, staged connector plan
```

**Migrations:**
- codex/12-command-center-spec.md → spec/command-center.md
- codex/18-system-requirements.md → spec/system-requirements.md
- codex/19-mvp-roadmap.md → spec/mvp-roadmap.md
- codex/20-integrations-access-plan.md → spec/integrations-access-plan.md

These four files are the build brief. Everything in `agents/` references them. Everything in the Command Center implementation traces back to them.

### `.archive/`, frozen material

```
.archive/
├── README.md                   what's in each snapshot, when frozen, why
├── 2026-04-30-agency/          full hwlstudio-ai-agency tree (with 3.9GB projects/ optional)
├── 2026-05-10-rewrite/         full hwlstudio-rewrite tree (minus what migrated)
└── 2026-05-11-codex/           full hwlstudio-codex tree (minus what migrated)
```

Everything from the three source folders survives in archive. No file is destroyed. The migration is non-destructive at the file level; what changes is which file is canonical.

---

## 3. CLAUDE.md, the new schema

The schema is shorter than any previous version. Reproduced here for review:

> # Harrison OS
>
> Personal operating system for Harrison Living. HWL Studio cashflow engine. Audience, content, health, money, family.
>
> ## Read on session start
>
> 1. today.md
> 2. self/profile.md
> 3. self/operating-theory.md (the 21 hypotheses; especially H7, H11, H21)
>
> That's it. The rest is data, read on-demand.
>
> ## Push behaviours
>
> - When Harrison asks you to build a system: check whether the current system is being executed first. Three previous rebuilds is the diagnostic.
> - Auto-execute: drafts, calendar holds, file ops, research, internal notes.
> - Wait for tap: outgoing emails, payments over £40, posts, anything irreversible touching shared systems.
>
> ## Voice
>
> - No em dashes.
> - No engagement bait, no AI slop, no motivational fluff.
> - Specific over vague. Named people, real numbers, real dates.
> - When pushing back, push back. Don't soften.
>
> ## Hard nos
>
> - No JARVIS. No persona.
> - No new retainer clients without Council deliberation.
> - No scope creep without repricing.
> - No "build me a system to do X" capitulation without first checking what exists.
> - No daily-note ritual or wiki maintenance.
>
> ## Routing
>
> - Strategic decision (pricing, client direction, "should I"): council/SKILL.md.
> - Client work: business/clients/{lor,creepers,baw,colin-fisher}.md.
> - Money question: money/index.md, money/analysis-2026-05-11.md baseline.
> - Training/health: health/training-plan.md, health/fuel.md.
> - Anything else: handle directly. No skill-routing theatre.
>
> ## File status table (honest)
>
> Maintained per phase. Updated on every wire/unwire.

This file lives at the root. ~50 lines. Less ceremony than the rewrite's CLAUDE.md (174 lines).

---

## 4. today.md, the live brief

Replaces the rewrite's manually-updated today.md and becomes the daily output of the morning-brief agent.

The codex 18 first-useful-version spec is canonical:

1. Date + sleep + readiness
2. Top three outcomes for today
3. Calendar / deep work block
4. Training for today (from health/training-plan.md current week)
5. Client obligations (open threads in business/clients/*.md)
6. Money / admin warning (any flag from money/index.md)
7. Meals (from health/routines.md defaults; can override)
8. Learning block (one item from learning/recall-queue.md or library.md)
9. One piece of wisdom (drawn from self/influences-voice.md books quote bank)
10. Soft self-respect reminder (per codex 15 grounding script)

Render target: phone-readable, ~600-1000 chars in the Telegram digest version, full version in today.md for laptop reading.

---

## 5. The Phase 0 to Phase 5 sequence

From spec/mvp-roadmap.md, applied to HWL META:

### Phase 0: tomorrow useful

Daily brief works today, manually if needed. Output: today.md gets a real draft tomorrow morning, whether or not the agent is scheduled yet. **Ships as part of Phase 3 build.**

### Phase 1: morning-brief agent wired end-to-end

The single agent that has 5 logged runs already. Apple Health schema fixed, Strava + Google Calendar wired (or noted as skipped per codex 20 Gmail 404 troubleshooting). Delivers to today.md + Telegram digest. **Phase 4 work.**

### Phase 2: weekly-review + check-in store

Sunday 18:00 agent that pulls today.md files from the week, refreshes this-week.md, produces the 7-section weekly review per codex 18. Check-in store (markdown daily logs initially) starts populating. **Phase 4-5 work.**

### Phase 3: web Command Center

Local static HTML/JS dashboard reading the markdown files. Eight modules per codex 12 (Today, Money, Clients, Content, Learning, Health, Relationship, Attention). Lives at HWL META/spec/dashboard/ or similar local path. **Deferred to v1.1.**

### Phase 4: integrations

Calendar (read), Email (read), Slack (read), Finance exports (manual), Health (Apple Health export bridge), Telegram (push). Staged per codex 20 access levels. **Phase 4 work, parallel with Phase 1.**

### Phase 5: TestFlight phone app

End of June target per codex. Daily brief + check-in + notifications + weekly review + Command Center + learning brief + capture inbox. **Deferred to v1.2, post-validation of Phases 1-4.**

---

## 6. Honest agent-wiring sequence (Phase 4 detail)

The agency taught a lesson: drafting agents without wiring them is a complete waste. The rewrite repeated it (5 of 6 agents DRAFTED, never SCHEDULED). v1 of HWL META wires one agent fully end-to-end before drafting the next.

Order:

1. **morning-brief**, first agent. Already has 5 logged runs and a working .sh. Wiring task: fix the Apple Health schema mismatch, decide on Telegram-push vs Codex-heartbeat delivery, schedule via launchd. Acceptance: 7 consecutive days of today.md generated without intervention.

2. **weekly-review**, second agent. Less time-critical, but the most leverage for breaking the rebuild loop. Sunday 18:00. Acceptance: 2 consecutive weeks of this-week.md with 7-area reality check.

3. **weekly-cfo**, third agent. Requires Xero MCP reinstated (was removed 26 Mar per rewrite WORKING.md). Friday 16:00. Acceptance: 2 consecutive Fridays of money/weekly.md with cash position + receivables chase list + Monday action.

4. **learning-brief**, fourth agent. Sunday 09:00. Outputs to learning/weekly-brief/. Pulls from learning/research-queue.md and Exa MCP for new releases. Acceptance: 4 consecutive Sundays of usable brief.

5. **discovery-scan**, fifth agent. Mon/Wed/Fri 14:00. Appends to capture/inbox.md (not a separate feed file). Acceptance: only when 1-4 are stable.

6. **evening-reflection**, sixth agent. Deferred until check-in store is structured (Phase 2). Drafted but explicitly NOT scheduled until then.

The agents/README.md table tracks state honestly: DRAFTED → SCHEDULED → RUNNING-DEGRADED → RUNNING-CLEAN → MIGRATED-TO-APP.

---

## 7. What from my synthesis stays alive

You parked the lane decision until after architecture, which is the right call. The synthesis isn't wasted; it's archived as `research/2026-05-11-five-lanes-banker-read.md` with one paragraph at the top reframing it: *"This was the 'what verified income lanes exist for someone with Harrison's profile' read. Useful for sanity-check on EV. NOT a strategy doc, NOT the personal answer. The personal answer is in self/ and business/. Use this when revisiting a side bet."*

Specifically file-able lanes:
- Vertical AI for construction (Site Comms etc.) → reference if you decide to test a vertical play
- Premium niche newsletter for senior comms → reference for content/strategy.md when the audience question gets resolved
- Acquisitions (Acquire.com / Empire Flippers etc.) → reference if capital-deployment thesis activates
- Faceless YouTube + clipping → archived as low-fit per codex influences/voice (Casey Neistat tattoo, taste filters)
- Retail algo trading → archived. The boring baseline (max ISA into VWRP) lives in money/tax-architecture.md
- World Cup / event-driven → archived. The codex doesn't surface this as live ambition.

Lanes that survive as ACTIVE in business/offers/ rather than research/:
- Flagship Augmented Strategic Content Engine (codex 13 + my synthesis Site Comms / Blueprint convergence)
- £45k Blueprint product page (rewrite)
- £8.5k/£11k/£15k LOR retainer options (codex 02 + 13)

---

## 8. Failure modes addressed (mapped to codex H1-H21)

| Failure | Addressed by | Where |
|---|---|---|
| Manual prompting kills it (H21) | morning-brief agent ships in Phase 1 before anything else | agents/morning-brief.* |
| Used competence to outrun finance admin (H7) | weekly-cfo agent + 13-week-cashflow + money/inbox/ | money/* + agents/weekly-cfo.md |
| One trusted intake missing (H11) | capture/inbox.md is the only intake | capture/ |
| Cathedral before capture | Phase 0 = today.md works tomorrow, full structure built after | spec/mvp-roadmap.md |
| Status-risk fear blocks publishing (H8) | content/publishing-rules.md explicitly says "no I-just-started content, field-notes posture only" | content/publishing-rules.md |
| Audience too narrowly forced (H10) | content/strategy.md keeps the question open until 5k subs signal arrives | content/strategy.md |
| Self-attack masquerading as discipline (H15 call-out rules) | weekly-review agent includes a grounding-line per codex 15 | agents/weekly-review.md |
| Engineered serendipity gap (H18) | life/home-environment.md tracks weekly Soho House + coffee shop blocks | life/home-environment.md |
| Single-niche-too-early pressure (H19) | content/strategy.md states "marketing is the wrapper, content/trust/narrative is the substance" | content/strategy.md |
| Storage locker instead of recall engine (H20) | learning/recall-queue.md + spaced recall via learning-brief agent | learning/* |

---

## 9. What happens to the source folders

After Phase 3 builds the new structure:

- **hwlstudio-codex/**, content migrated to HWL META. Folder copy frozen to HWL META/.archive/2026-05-11-codex/. Original folder at /Users/harrison/hwlstudio-codex/ left alone (you may keep using Codex sessions; just know the canonical home is HWL META).
- **hwlstudio-rewrite/** (currently at HWL META/hwlstudio-rewrite/), content migrated, folder copy frozen to HWL META/.archive/2026-05-10-rewrite/. The folder at the HWL META root gets deleted after migration verified.
- **hwlstudio-ai-agency/** (currently at HWL META/hwlstudio-ai-agency/), folder copy frozen to HWL META/.archive/2026-04-30-agency/ except for the 3.9GB projects/ video tree, which gets moved to a separate location of your choosing (external drive, cold storage). The folder at the HWL META root gets deleted after migration verified.

Net: HWL META becomes the single root. ~14 active folders + ~3 spec files + ~3 meta files + 1 archive. All historical material survives in .archive/.

---

## 10. What's explicitly NOT in v1

Naming so we don't drift:

- No iOS / TestFlight app (that's Phase 5).
- No Command Center web dashboard (Phase 3 deferred to v1.1; markdown is the interface until then).
- No new MCP wiring beyond the rewrite's existing partial set (morning-brief uses what works; everything else stays as drafts).
- No HWL AEO, Site Comms, newsletter, acquisitions, trading, clipping, World Cup product. All filed.
- No Xero integration today (Xero MCP needs reinstating; reach the accountant first per money/index.md control priority #2).
- No Buffer / social-posting automation. content/pipeline.md is markdown for now; posting is manual.
- No automated daily voice-memo transcription. capture/voice-memos.md is manual.
- No new persona, no JARVIS, no startup ritual longer than three files.

Things explicitly happening in v1 (the contract):

- The 22 codex files become the spine of HWL META.
- The rewrite's training/fuel/clients/council/agents migrate in cleanly.
- The agency archives cleanly with no orphan files.
- One agent (morning-brief) gets wired end-to-end and runs unattended for 7 consecutive days as the v1 acceptance criterion.
- today.md and this-week.md become living documents fed by agents.
- capture/inbox.md is the one trusted intake.
- The Stones Build 62-day public commitment is killed formally; its health substance lives in health/training-plan.md, its publish target dies (per your decision).

---

## 11. Decision required before Phase 3 build

Five things to confirm:

1. **Folder shape.** Is the 14-folder structure in §1 the shape you want? If you want fewer top-level folders (e.g. life/ merges into self/, or content/ merges into business/), say so before I move files.

2. **CLAUDE.md cut.** ~50 lines is short. The rewrite's was 174. Is the short version fine, or do you want the longer push-behaviours / hard-nos / routing detail to stay near full length?

3. **Codex folder treatment.** Migrate content into HWL META + archive the source snapshot in `.archive/`, leaving `/Users/harrison/hwlstudio-codex/` untouched so you can keep using Codex sessions? Or migrate everything including the source folder?

4. **3.9GB agency projects/ tree.** Move to .archive/2026-04-30-agency/projects/ inside HWL META (keeps it accessible but doubles HWL META size to ~8GB) or move to external storage / different location?

5. **First agent to wire after migration.** Confirm morning-brief is the right first agent. Alternative: weekly-review first because it gets you the "system that pushes back on rebuilds" surface fastest. My recommendation is morning-brief because it has 5 logged runs and a working .sh; lowest-risk wiring.

Once these five are answered, Phase 3 (the actual build) starts. Estimated work: 2-3 hours of file operations + 1-2 hours of CLAUDE.md + today.md + agents/README.md drafting + 1-2 hours of agent fix work for Phase 4.

---

**End of architecture.** No files moved or deleted yet. Awaiting sign-off.
