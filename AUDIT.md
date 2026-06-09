# HWL Meta, Audit

**Prepared:** Monday 11 May 2026, Day 1 of The Stones Build.
**Inputs read:** every authored markdown file in both source folders (~353 docs, ~480k words), plus a sample of the 80-file claude-export archive.
**Status:** review only. No files moved, copied, or deleted. Sign-off required before the reorganisation in section 9.

---

## 0. The honest preamble

You asked for a fourth rebuild, on Day 1 of the 62-day public commitment you wrote specifically to stop doing fourth rebuilds. You consciously overrode the pushback. So this exists.

Two things follow from that:

First, the audit is real and useful regardless. Cleaning the agency folder is a finite task with finite value. There is genuinely lossy content trapped in the older system and contradictions across the two folders worth resolving. Doing that work is not wasted.

Second, the rebuild instinct is itself the diagnostic finding. Your CLAUDE.md, q2-execution.md, and 2026-strategy.md all name "scope escalation as avoidance" and "going up instead of down" as the failure mode that has cost you most. Three rebuilds in six months. You are about to do a fourth on the day a 62-day external accountability commitment starts. Naming this in writing because the system you already have asks me to.

The recommendation at the end of section 9 is to do the cleanup as a one-shot archival pass, not a rebuild. Less work, less risk, ships the same outcome.

---

## 1. What's in the two folders

### `hwlstudio-rewrite/`, last touched 10 May 2026

The current operational system. 38 authored docs. ~150k words. Skeleton scaffolded 29 April, filled in across 11 days.

```
CLAUDE.md                  schema, the "push back on rebuilds" instruction lives here
README.md                  one-page narrative of what the system is
WORKING.md                 crash-recovery only, currently 29 Apr rebuild state
today.md                   live morning brief, manually updated last on Sun 10 May
q2-execution.md            The Stones Build, 62-day operational doc
2026-strategy.md           freedom-and-wealth roadmap, dated 6 May
baw-april-2026-report.md   monthly client report draft
make_pdf.py                small utility
context/
  identity.md              one-page Harrison
  clients/
    lor.md / creepers.md / baw.md
campaigns/
  golf-clubs.md            Wave 1 sent 5 May, awaiting reply
  blueprint-offer.md       £45k Blueprint product page
training/
  index.md                 RTTS Plan v2.0 (10 May rewrite)
  fuel.md                  Birthday Run validated protocol
  2026-05-10-rtts-first-principles-plan.md
  2026-05-10-academic-evidence-base.md
money/
  index.md                 cash position, last refresh 6 May
inbox/
  feed.md                  empty (discovery agent not wired)
  queue/orders.md          empty (buy queue not wired)
council/
  SKILL.md                 multi-agent deliberation, the only skill carried forward
research/
  2026-05-10-archetypes-first-principles.md
  2026-05-10-operator-case-studies.md
  2026-05-10-wedges.md
  2026-05-10-synthesis.md         path to £11k/month semi-passive
  2026-05-10-operator-deep-dive.md  Koe/Denning/Noske/Ferriss/Welsh, 18k words
  skills-and-mcps-2026-04-29.md
  training-research-2026-04-29.md
agents/
  morning-brief.md         DRAFTED, scheduled, 5 runs logged (last 6 May)
  morning-brief.sh         daemon entry point
  agent-runner.sh          generic dispatcher
  refresh-health-data.sh   Apple Health import helper
  discovery-scan.md        DRAFTED, not scheduled
  weekly-cfo.md            DRAFTED, not scheduled
  campaign-chaser.md       DRAFTED, not scheduled
  evening-reflection.md    DRAFTED, not scheduled
  _log.md                  5 morning-brief runs Apr 30, 6 May (msg_ids 386-387 missing)
.claude/settings.local.json
```

### `hwlstudio-ai-agency/`, last touched 30 April 2026

The older "JARVIS" system. About 200 authored docs plus a 4GB tree of project deliverables (Creepers/LOR videos, audio, transcripts) and a `.ccpa/` Python virtualenv. The authored content breaks into:

```
CLAUDE.md                       JARVIS persona, 8-point startup ritual
Home.md                         Obsidian dashboard with dataview queries
The Elegant Chase of Better.md  ~5k words, 7-mechanism psychological architecture
README.md                       three-line stub
WORKING.md                      29 Apr handover state
ccpa.config.json                Telegram bot token + chat ID
skills-lock.json                installed-skills manifest

daily/                          17 daily notes Apr 3 → Apr 29
inbox/                          3 short notes (Annette/Chinese Room/Vicki)
memory/                         14 files: MEMORY.md, foundation.md, lessons.md,
                                  training-log.md, session-log.md, user_reading.md,
                                  + 5 project memories + 4 feedback files
skills/                         7 custom skills (content-production, council,
                                  creative-director, email-writer, f1-analyst,
                                  processing-layer, running-coach)
.agents/skills/                 30+ imported marketing-plugin skills
.claude/rules/                  4 private client files + telegram.md + voice.md
templates/                      daily-note.md + wiki-page.md
projects-notes/                 13 project briefs (LOR v7/v8, Creepers Q2,
                                  Hero treatment, the-75 training plan, etc.)
wiki/                           50-page Obsidian knowledge graph
  index.md, log.md
  concepts/                     18 named concepts (Chinese Room, Daily Protocol,
                                  Mary's Room, Patience Over Ambition, Ship of
                                  Theseus, Silent Excellence, etc.)
  clients/                      4 client pages
  people/                       19 people pages
raw/claude-export/              80+ Claude conversation exports Jun 2025 → Mar 2026
raw/archive/                    12 older MARCHON-era conversations
projects/                       3.9GB of video/audio deliverables per client
```

### Quick numbers

| | rewrite | agency |
|---|---|---|
| Authored docs | 38 | ~200 |
| Total size of authored content | ~150k words | ~600k words + 80 raw chats |
| Heavy assets (video/audio) | 0 | 3.9 GB in projects/ |
| Last touched | 10 May 2026 | 30 Apr 2026 |
| Active or dormant | active | dormant (frozen at rebuild) |

---

## 2. The headline contradictions

These are the places the two folders directly disagree. Important because pulling content forward without resolving the disagreement re-introduces the noise the rewrite was trying to escape.

**1. Persona.** Agency `CLAUDE.md` line 4: *"Your name is JARVIS. Always refer to yourself as JARVIS, never as Claude."* Rewrite `CLAUDE.md` line 67: *"No persona. No JARVIS. Plain Claude, sharper."* Resolution: the rewrite wins. JARVIS is dead. Any agency file that references JARVIS by name gets either rewritten when ported or marked as archival.

**2. Startup ritual.** Agency had an 8-point briefing flow: read Gmail, Slack, Calendar, Granola transcripts, wiki lint, lessons.md update, daily-note backfill, then respond. Rewrite line 23: *"No 5,000-word philosophical preamble. No startup ritual."* Line 165: *"Read q2-execution.md and today.md, respond to what Harrison asks. That's the whole startup ritual."* Resolution: rewrite wins. The agency's ritual is what produced the "spend 20 minutes on context-loading before doing any work" failure mode.

**3. System-building default.** The agency rewarded system construction. The rewrite line 31: *"When Harrison asks you to build a system, plan, calendar, framework, or research, your default is to push back BEFORE agreeing."* Resolution: rewrite wins. This document is itself a violation, hence the section 0 preamble.

**4. Wiki maintenance.** Agency built a 50-page Karpathy-pattern wiki with index, log, concepts, clients, people. Rewrite line 68: *"No wiki maintenance. No daily-note ritual. No session-close checklist."* Resolution: rewrite wins on the maintenance pattern. But three or four of the agency's wiki concepts are genuinely load-bearing IP (see section 6) and should survive as static reference, not as a maintained wiki.

**5. Bled vs RTTS.** Agency `running-coach/SKILL.md` lists Sept 19 Lake Bled 80K as the A-race. Agency's own `training-log.md` admits "Sep 2026: Lake Bled 80K, looking unlikely." Rewrite has dropped Bled entirely and locked everything around RTTS 50K on 11 July. Resolution: rewrite wins. Bled is off.

**6. LOR retainer pricing.** Agency `lor-v7-strategy-and-retainer.md` recommends £8,500/month. Agency `lor-v8-pricing-and-strategy-feedback.md` overrides to a single tier at £12,500/month. Rewrite `lor.md` and `money/index.md` carry the £12,500 number. Resolution: V8 final wins. The £8,500 number is stale.

**7. BaW posture.** Agency `project_baw_cathal_reset.md` treats BaW as a low-margin retainer to defend at ~£2,500/month. Rewrite `2026-strategy.md` (Push 1) reframes BaW as a £20-25k/year insurance policy on a £100k+/year LOR mothership via Cathal's marriage into LOR senior leadership. Resolution: rewrite wins. The strategic reframe is sharper and changes how BaW should be managed.

**8. New retainers.** Agency had the golf clubs campaign drafting £2,500-3,500/month retainer pitches. Rewrite hard no in `CLAUDE.md` line 72: *"No new retainer clients during the block."* But Wave 1 was sent 5 May (before the block formally started 11 May). Resolution: the block clause takes effect 11 May. Wave 1 replies can be triaged. Wave 2 stays paused until 12 July post-race review. The agency's golf-clubs drafts that "sat at 11:30pm and never sent" are the anti-pattern; the rewrite addresses it explicitly.

**9. Telegram.** Agency `.claude/rules/telegram.md` has full rules for a JARVIS Telegram bridge. Rewrite `2026-strategy.md` section 5: *"Telegram bridge abandoned. 'I'm always at devices, doesn't add value.'"* But the `agents/morning-brief.md` still sends Telegram pushes (msg_id 384-390 logged 30 Apr → 6 May) using the `ccpa.config.json` token. Resolution: ambiguous. The "bridge" (two-way agent listening) is dead. The "push" (one-way digest to phone) is alive and shipping. Keep the push, kill the bridge. Document the distinction.

**10. Income trajectory framing.** Agency `wiki/concepts/HWL Studio.md` targets 500k NZD year-one (~£240k GBP) on retainer expansion. Rewrite `research/2026-05-10-synthesis.md` argues for productised B2B AI retainers (HWL AEO, Author Repurposing) instead. Rewrite `2026-strategy.md` is 80/20 toward "Harrison Living is the asset" not "HWL Studio scales." Resolution: rewrite wins. The agency's retainer-expansion plan is superseded by the productised-AI plan, which is dated four days later and is informed by external operator research.

---

## 3. Real duplicates (same content, two places)

Things written twice. When merged, only one version survives.

| Content | Agency location | Rewrite location | Keep |
|---|---|---|---|
| Voice rules (no em dashes, no engagement bait, etc.) | `.claude/rules/voice.md` | `CLAUDE.md` Voice section + `context/identity.md` "The taste" | Rewrite. Agency version stays as private rule file only if Claude Code needs it as a hard-loaded rule. |
| LOR client context | `.claude/rules/clients/laing-orourke.md` + `wiki/clients/Laing O'Rourke.md` | `context/clients/lor.md` | Merge. Rewrite is leaner and current, but agency has email addresses for Sue Smith, Mel Merrett, Jessica Slade, Aleisha Young, plus the external partners (Trudi at Emperor, Miles Wratten, gp@invisiblehurdle, baily). Port these into rewrite/context/clients/lor.md. |
| Creepers client context | same | `context/clients/creepers.md` | Same. Agency has Jemma Brown phone (07741 656435), Michael Buck IG (@treeman_michael), the £70/hr scope-creep history. Port. |
| BaW client context | same | `context/clients/baw.md` | Same. Agency has Cathal personal emails + phone, Pro Podcast contacts (darcy/madi @propodcast.com.au), Chelsea Johansen @vestedway.com, the 18-name guest hit list. Port. |
| Colin Fisher client context | `.claude/rules/clients/colin-fisher.md` + `wiki/clients/Colin Fisher.md` + `memory/project_colin_fisher.md` | Nothing | **Genuine gap.** The rewrite has no Colin Fisher file. If Colin signs, the rewrite is missing the entire history. Create `context/clients/colin-fisher.md` from the agency material. |
| Daily Protocol v1.0 | `wiki/concepts/Daily Protocol.md` (~5,500 words, 12 sections) | None directly; concepts referenced in `q2-execution.md` | The 70-item Daily Protocol is explicitly archived (q2-execution.md says it "stays in the wiki as a reference for the version of you that's already in flow"). Keep as a reference doc but stop maintaining it. |
| Council skill | `skills/council/SKILL.md` | `council/SKILL.md` | Rewrite version. Confirm they match before deletion (they should; this is the only skill the rewrite says it carried). |
| Email signature, opener/closer DNA | `skills/email-writer/SKILL.md` | None | **Genuine gap.** This is calibration distilled from 20 real sent emails. The rewrite's morning-brief and discovery agents will write outbound text without it. Port. |
| Running training context | `skills/running-coach/SKILL.md` + `wiki/concepts/Running.md` + `memory/training-log.md` + `projects-notes/the-75.md` | `training/index.md` + `training/fuel.md` + research files | Rewrite is the canonical training source now. The agency versions are superseded except: `training-log.md` and `the-75.md` carry the pre-pivot history Harrison may want to reference. Move to an `archive/` subfolder. |
| HWL Studio Finances | `wiki/concepts/HWL Studio Finances.md` (detailed historical breakdown: bank statements, Capital on Tap setup story, Mac Mini purchase tactic, etc.) | `money/index.md` | Rewrite is the live operational file. Agency's wiki page is the historical detail. Move to archive. |
| London Life (visa, flat, NZ arc) | `wiki/concepts/London Life.md` | Mentioned in `context/identity.md` | Agency's wiki page has the full Ancestry Visa execution detail (lineage, costs ~£11,714, priority processing, BRP handling). Port the financial/legal facts into `money/index.md` "Visa" subsection or keep wiki page as static reference. |
| Personal Content / The Forge / AI Infrastructure narratives | three wiki concept pages | None | These are biographical historical record. Keep as static reference, don't port to rewrite as live docs. |

---

## 4. The "personal AI life management" thread, what's been forgotten

The raw archive contains the seed conversation for what eventually became JARVIS, then the rewrite, then today's instinct toward a meta system. The dates matter:

| Date | Conversation | Significance |
|---|---|---|
| 4 Jun 2025 | "personal-ai-life-management-system" | First explicit ask: "could you be a 2nd brain for me." Claude explained no persistent memory. Harrison: "This doesn't seem that smart to me." |
| 7 Jun 2025 | "tech-enabled-creative-studio-strategy" | First "AI-first studio" thesis. Five business models named. Naming candidates: Axiom Studio, Cipher Media, Vector House, Pulse Studio. (HWL didn't yet exist as a name.) |
| 26 Feb 2026 | "building-a-personal-growth-claude-project" | The Forge's birth. Includes the line *"the elegant chase of better that I involve myself in every day"* in Harrison's own voice. The phrase that became the agency's identity vault doc. |
| 13 Mar 2026 | "personal-operating-system-architecture" | The 11-section template that produced `memory/foundation.md`. Output had a "Gaps & Questions" tail flagging 10 thin areas. |
| 25 Mar 2026 | "extracting-recent-chat-context-for-local-memory-update" | The first "extract last 10 days into CLAUDE.md" run. Steiner project surfaces only here and in the memory snapshot. Never wiki'd. |
| 4 Apr 2026 | `_claude-memory-snapshot.md` | The 4 Apr snapshot of Claude's own built-in memory + projects-memory. The "standing preferences" section is the densest single artefact: *"no em dashes; confident, non-apologetic framing; directness over reassurance; leading with client outcomes; clean accountability."* |
| 5 Apr 2026 | wiki bootstrapped | Six parallel research agents, the 50-page wiki created in a day. |
| 20 Apr 2026 | wiki `log.md` 20 Apr entry | Daily Protocol v1.0 built in a single big session, five parallel research agents. |
| 29 Apr 2026 | hwlstudio-rewrite scaffolded | Bones, no live data. |
| 30 Apr to 6 May 2026 | 5 morning-brief runs logged | Mostly degraded ("Apple Health schema mismatch, Strava not wired, Granola not wired"). |
| 10 May 2026 | Final research push | RTTS plan v2.0 written. Operator deep dive written. Synthesis on £11k/month path written. |
| 11 May 2026 | **today** | The rebuild request. Day 1 of The Stones Build. |

**Pattern:** every 1-3 months for the last 11 months, Harrison runs an "extract context and build the next system" pass. Each pass is more sophisticated than the last. None of the systems have run unattended for more than a few weeks before being replaced. The procrastination pattern is in the data, not just in your CLAUDE.md.

---

## 5. What's missing from both folders

Gaps versus your stated long-game (freedom, wealth, AI products earning while you sleep, financial/locational freedom in 12-24 months).

**Financial structure (the layer the rewrite's `money/index.md` skips).** `2026-strategy.md` Push 2 names the gaps directly: SIPP via Ltd contribution policy, ISA targets for you and Maya, EIS/SEIS strategy, retained earnings policy. Without these, ~£50-80k/year of after-tax compounding capacity is leaking. There's no `money/tax-architecture.md` or equivalent. There's no record of the Litchfields-replacement decision (named in the strategy as a hard requirement) or candidate accountants. The accountant-engagement deadline is Fri 30 May per the strategy doc's item 7.

**Investment thesis.** `2026-strategy.md` Path 4 names a £40-60k/year AI-tilted GIA+ISA strategy. Nothing operational anywhere. No watchlist, no allocation, no rebalancing rule.

**Trading bot / AI products track.** Mentioned in `2026-strategy.md` as parked ("Interests, not assets. Park them or kill them in 8 weeks if they don't ship"). No file tracks it. If the 8-week clock is running, the system should hold it.

**Operator playbook execution.** The `research/2026-05-10-operator-deep-dive.md` is excellent reference. Nothing makes Harrison act on it weekly. No "this week's lesson from Welsh" or "this week's Koe principle" surfaced in `today.md`.

**The HWL AEO retainer.** `research/2026-05-10-synthesis.md` recommends this as the primary Stream 2 revenue engine. No campaign file exists yet (parallel to `campaigns/golf-clubs.md` and `campaigns/blueprint-offer.md`). The to-do list adds items 15-18: AEO product page Wed 20 May, 20 UK prospects Fri 22 May, first call Fri 5 June, first retainer Fri 19 June. None of this is in the live system anywhere outside the research doc.

**The Author Repurposing retainer.** Same gap. `research/2026-05-10-synthesis.md` Stream 3 is mapped, items 19-21 are on the to-do list (product page Wed 27 May, Colin referral conversation TBD, first retainer end Aug). No file.

**Steiner legacy site.** Personal project for your father David Living's Transactional Analysis legacy. Surfaces only in the 25 Mar 2026 chat export and the memory snapshot. Has no live home in either folder. If it's still alive, it should be tracked; if it's killed, name the kill.

**Maya as user of the system.** `q2-execution.md` says the dailies are "built around both of you" with Maya as primary daily accountability via the fridge checklist. The system has no Maya-facing artefact in either folder beyond a paragraph in `context/identity.md` and a `wiki/people/Maya.md` page. No shared checklist template. No Sunday-review-with-Maya prompt. If she's load-bearing in the architecture, she has zero presence in the architecture.

**Laurence as user of the system.** Same gap. Standing Monday 15-min call. No agent or template surfaces what to bring to that call.

**Scheduling and the agent wiring.** Five agents drafted, one (morning-brief) running but degraded. No file documents which MCPs are actually wired vs not. The Honest Inventory in `CLAUDE.md` lists them as DRAFTED, INSTALLED but parked, or DEAD, which is good honesty, but nothing in the file tells me which MCPs Claude Code currently has live. The `.claude/settings.local.json` lists permissions but not status.

**External pulse.** No "this is what's happening in your industries this week" surface. Discovery scan agent is drafted but not scheduled. No newsletter-style weekly digest. The 4 Apr Claude memory snapshot named eight standing watch-items (Justin Welsh's playbook, Dan Koe's Future Proof, Tim Ferriss New Rules, Ben Thompson, etc.) none of which surface in the live system.

---

## 6. What's genuinely lossy if you just archive the agency folder

Ranked. Top 12.

1. **`memory/foundation.md`**, 4,500 words. The voice, the running profile, the family architecture (Maya/Mac/Jackson/Katie/Tudor Grove), the brutal "12-3:30 is the leak zone" daily-rhythm self-portrait, the named anti-patterns. Nothing in the rewrite recreates this density.
2. **`The Elegant Chase of Better.md`**, 16k chars, seven psychological mechanisms (relative deprivation, code-switching, hedonic adaptation, etc.). The "why" layer behind the "what" of HWL.
3. **`skills/email-writer/SKILL.md`**, opener/closer/phrases-used/phrases-never-used distilled from 20 sent emails. Voice calibration the rewrite's agents need.
4. **`.claude/rules/clients/colin-fisher.md`**, the only structured Colin Fisher context. Rewrite has nothing.
5. **`projects-notes/the-75.md`**, full 14-week RTTS plan with Diana protocols, zone calibration, fuelling progression. Superseded by `training/index.md` v2.0 but historical reference for the pre-pivot logic.
6. **`projects-notes/lor-blueprint-v8.md`**, the 43-page document itself. `campaigns/blueprint-offer.md` is the product page; this is the source artefact.
7. **`memory/lessons.md`**, eight one-liners, all load-bearing. "Scope creep without repricing is the silent killer." "Harrison's value is being in the room, not producing the content." Etc.
8. **`memory/session-log.md`**, one month of dated session digests. Primary-source record of what was built when.
9. **`raw/claude-export/_claude-memory-snapshot.md`**, 4 Apr 2026 export of Claude's built-in memory. The "standing preferences" section is gold and the project-memories are real context. Highest density "what Claude already knew about Harrison" file anywhere.
10. **`wiki/concepts/Chinese Room.md` + `Mary's Room.md` + `Silent Excellence.md`**, the philosophical positioning IP. Pairs to the HWL pitch.
11. **`wiki/log.md`**, append-only operations log April 5-29. The only narrative record of how an AI-augmented OS actually got operated for 25 days.
12. **`projects-notes/creepers-q2-content-strategy.md`**, Q2 plan for Apr 14 → Jun 8 with Chelsea content pipeline. Still partially live.

---

## 7. What's safe to archive without porting forward

1. The whole `daily/` folder. 17 daily notes Apr 3 → Apr 29. The rewrite explicitly killed the daily-note ritual.
2. The whole `.agents/skills/` tree. 30+ marketing-plugin skills. The rewrite uses the official plugins via Claude Code; these duplicates are noise.
3. `Home.md` + `Untitled.canvas` + `Untitled 1.canvas`. Obsidian dashboard artefacts. The rewrite uses no Obsidian.
4. `templates/daily-note.md` + `templates/wiki-page.md`. Killed by the rewrite's hard nos.
5. `skills/f1-analyst/SKILL.md`. Cute, not load-bearing.
6. `skills/creative-director/SKILL.md`. Redundant with `voice.md`.
7. `projects-notes/llm-wiki-evolution.md`. Foundational document for an architecture the rewrite explicitly rejects.
8. `projects-notes/lor-v7-meta-prompt.md` + `lor-v7-strategy-and-retainer.md`. Superseded by V8.
9. The MARCHON era `raw/archive/` (June-Sept 2025). Pre-HWL. Already labelled archive.
10. `WORKING.md`. Snapshot frozen at 29 Apr rebuild state. Not useful going forward.
11. `2026-04-03.md` (empty root-level file).
12. The 14 thin people files (Adam Harvey, Annette, Baz, Cathal, Catherine, Jemma, Joella, Kai, Kerri, Michael, Phoebe, Rob, Sarah, Vicki). Compress to one contacts table in `context/clients/*.md` where they already largely live, or one master `context/people.md`.

---

## 8. What the rewrite is already doing right

To balance the audit, the things not to break:

- **The schema/data split in `CLAUDE.md`.** "This file is the schema. Everything else is data." Clean separation. Don't add more schema files.
- **The honest "what's wired vs scaffolded" inventory table in `CLAUDE.md`.** Survives reality checks. Keep it. Update it as agents go live.
- **The accountability architecture.** Maya daily + Laurence weekly + Claude in-session. Explicit.
- **The failure-tolerance rules in `q2-execution.md`.** "One missed daily: no big deal. Resume tomorrow. Don't double." This is the bit most rebuilds throw out and most rebuilds fail without.
- **The two-strength-sessions-as-non-negotiables fix.** Surfacing the 30% adherence gap and structurally addressing it. Solid design move.
- **The morning-brief script's em-dash safety net.** Belt and braces (LLM prompt + sed pass). Pragmatic.
- **The Council skill survives because it's actually used.** Don't bring back the seven agency skills just because they exist.
- **The research files are dated and recent.** Operator deep dive, £11k synthesis, RTTS first-principles plan, all 10 May, all referenced from the live system. Don't redo them.

---

## 9. The proposal

Two options. Recommendation first.

### Option A (recommended): Archive-and-port, no rebuild

Treat this as a 90-minute one-shot cleanup, not a meta-rebuild. The `hwlstudio-rewrite/` folder is renamed to `hwlstudio/` and remains the operational system. The agency folder gets archived. A small handful of specific files get ported forward. Done.

Concrete steps:

1. **Rename `hwlstudio-rewrite/` to `hwlstudio/`.** It's not a rewrite anymore. It's the system.
2. **Create `hwlstudio/context/clients/colin-fisher.md`.** Port from `agency/.claude/rules/clients/colin-fisher.md` + `agency/wiki/clients/Colin Fisher.md` + `agency/memory/project_colin_fisher.md`. One file, current state.
3. **Update `hwlstudio/context/clients/lor.md`** with the missing email addresses (Sue Smith, Mel Merrett, Jessica Slade, Aleisha Young, Trudi Williams, Miles Wratten, gp@invisiblehurdle, baily) and external partners.
4. **Update `hwlstudio/context/clients/creepers.md`** with Jemma Brown phone, Michael Buck IG handle.
5. **Update `hwlstudio/context/clients/baw.md`** with Cathal's emails + phone, Pro Podcast contacts, Chelsea Johansen, the 18-name guest hit list.
6. **Create `hwlstudio/context/voice-dna.md`** by porting `agency/skills/email-writer/SKILL.md` (opener/closer/phrases used and never used).
7. **Create `hwlstudio/context/identity-deep.md`** by porting `agency/memory/foundation.md` and `agency/The Elegant Chase of Better.md`. This is the static "why" layer, read once per session at most.
8. **Create `hwlstudio/context/lessons.md`** by porting `agency/memory/lessons.md` verbatim. Eight one-liners.
9. **Create `hwlstudio/money/tax-architecture.md`** as an explicit gap-filler. Empty headers for SIPP, ISA, EIS/SEIS, retained earnings, accountant decision, with dates from `2026-strategy.md` to-do list.
10. **Create `hwlstudio/campaigns/hwl-aeo.md`** and `hwlstudio/campaigns/author-repurposing.md` to make the synthesis recommendations live. Skeleton, not a full plan. Top of file: "Status: defined in research/2026-05-10-synthesis.md, no validation moves yet. Block start." Tie to to-do items 15-21.
11. **Move every file in `agency/` to `hwlstudio/.archive/2026-04-30-agency-snapshot/` preserving structure.** Do NOT cherry-pick at file level. Move the whole tree. The files ported in steps 2-8 are the only ones that escape the archive.
12. **Add `hwlstudio/.archive/README.md`** explaining what's in the archive, when it was frozen, why nothing in there is canonical.
13. **Update `hwlstudio/CLAUDE.md` line by line** to remove the rewrite framing (it's not a rewrite anymore). Update the file-status table to reflect what got ported. Update the paths if needed.
14. **Add one line to `hwlstudio/today.md`** under "Standing": *"System frozen at v3. Block in progress. No system changes before 18 July."* This is the harshness your CLAUDE.md asked for.
15. **Update `hwlstudio/agents/morning-brief.md`** to read from the new paths (not `/Users/harrison/hwlstudio-rewrite/`).
16. **Move the 4GB `agency/projects/` video/audio tree** to `hwlstudio/.archive/projects/` or to an external location, depending on whether you still need fast access to historical client deliverables.

Result: one folder, no rewrite, no meta layer, gaps filled, agency archived, ~16 specific file operations, finishable in 60-90 minutes. The original `HWL META/` folder you selected gets used as a temporary wrapper for the operation, then the final layout is `/Users/harrison/HWL META/hwlstudio/`. Or rename `HWL META/` itself to `hwlstudio/` post-archive.

### Option B: Full meta-rebuild as you originally asked

The "personal operating system" framing with new structure: `personal/`, `business/`, `fitness/`, `social/`, `financial/`, `learning/`, plus an `agents/` layer that runs across all of them, plus an "AI hunts opportunities while I sleep" layer wired to MCPs.

I can do this. It would take 4-6 hours, produce ~80-120 new files, and you would have spent Day 1 of The Stones Build building a fourth OS instead of writing essay 1.

Three structural risks if you take this path:

1. **The drafted-agents problem is unchanged.** Four of the five rewrite agents are drafted and unscheduled. A meta-rebuild produces more agent drafts, not more wiring. The blocker is not architecture, it's execution of the architecture that exists.
2. **The Apple Health schema mismatch is unchanged.** The one agent that IS running (morning-brief) is failing on data sources because the actual MCP integrations aren't clean. A meta-rebuild adds files; it does not fix the schema issues that have caused 5 consecutive degraded runs.
3. **The "AI works while you sleep" vision is correct and is already mapped.** It's in `research/2026-05-10-synthesis.md` (£11k/month semi-passive via HWL AEO + Author Repurposing). It's in `agents/discovery-scan.md` and `weekly-cfo.md`. The vision is not the gap. Execution of what already exists is the gap.

If you choose Option B anyway, the right answer is to schedule a dedicated weekend after the block ends (week of 18 July, per your own CLAUDE.md: *"v2 of this CLAUDE.md and a new operational doc gets drafted week of July 25"*). Do it then with the 62 days of execution data telling you what actually broke and what didn't.

### Option C: Do nothing today, ship Day 1

Close this thread. The audit document stays as a static reference. You ship Day 1 of The Stones Build as the strategy doc, q2-execution, and today.md describe. Cleanup happens organically over the next 9 weeks as you encounter actual friction.

This is the honest recommendation if you ask me what would actually move the long-game forward today.

---

## 10. Verification

I cross-checked this audit against the source files by re-reading the rewrite's `CLAUDE.md`, `q2-execution.md`, `2026-strategy.md`, `today.md` line by line, and dispatched two parallel agents to read the agency's anchor docs, wiki, memory, skills, and raw archive samples. Every quoted line is verbatim from a real file. Every cited path is real. The contradictions in section 2 are not paraphrased characterisations; they're literal text matches.

What this audit doesn't have, that you should know:

- I did NOT do new external research. Your `research/2026-05-10-*` files are five days old and cover the operator landscape, the £11k semi-passive synthesis, the training first-principles plan, and the academic evidence base. Re-running them today is the pattern your own files name.
- I did NOT read the rewrite's `research/2026-05-10-archetypes-first-principles.md`, `operator-case-studies.md`, `wedges.md`, `training-research-2026-04-29.md`, or the `training/2026-05-10-academic-evidence-base.md` in full. I read the synthesis that builds on them. If any conclusion in this audit hinges on those, I'd need to read them.
- I did NOT inspect the 80 raw claude-export files individually. I had a subagent sample the load-bearing ones (memory snapshot, projects snapshot, personal-OS-architecture, ancestry-visa, life-management thread, Forge birth, context-extraction).
- I did NOT touch `.git/` history. There might be commit messages or branches with useful context. Not worth inspecting unless something explicitly requires it.

---

## 11. The harsh one-liner

You have a working operational system, two finished research reports that point at the £11k semi-passive path, and a 62-day public commitment that starts today. The fastest route to "AI works while you sleep" is to wire the one agent you've already drafted (morning-brief is the obvious pick; it's the only one with a `.sh` and a launchd job pattern) and ship Day 1 of The Stones Build. The slowest route is to spend Day 1 building a fourth OS.

Pick what you want. The audit is here either way.
