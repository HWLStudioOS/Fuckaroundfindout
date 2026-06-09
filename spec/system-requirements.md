# System Requirements

**Canonical source:** `/Users/harrison/hwlstudio-codex/harrison-os/18-system-requirements.md`

## Core requirement

The system must be proactive. Harrison OS fails if Harrison has to manually open sessions, prompt every check-in, keep a Mac Mini running as the only way for the system to work, close sessions to make sure memory is logged, or manually carry context between tools.

**The system should show up in Harrison's life.**

## Failure modes (per codex 18)

Harrison will stop using the system if:

- It feels manual.
- It requires daily prompting.
- It becomes another place to maintain.
- It produces generic summaries.
- It does not send useful messages / emails / notifications.
- It does not capture memory automatically enough.
- It creates complexity before solving daily usefulness.

## What makes it feel alive

- Receiving a message that's genuinely useful.
- Knowing his current goals and constraints.
- Reminding him before things break.
- Researching and synthesising without being asked every time.
- Helping him learn again.
- Turning data into next actions.

## Preferred home (hybrid, per codex)

- Markdown files as durable source of truth.
- Lightweight local/web app as interface.
- Possible Linear layer for projects/tasks (deferred).
- Email / Telegram / notification layer for proactive pushes.
- Eventually phone app, with TestFlight acceptable for private use.

## Daily check-in (15 min)

Purpose: extract core truth of the day, capture scores across life areas, turn the day into memory and next actions.

Potential questions:
- What is true today?
- Sleep score / sleep time?
- Body / readiness / training state?
- Mood / energy?
- What is the one thing that matters most today?
- What client obligation needs attention?
- What money / admin issue needs attention?
- What will you learn today?
- What will you do for Maya / relationship / life?
- Where might you avoid reality today?
- What does "enough" look like today?

## Weekly review (45 min)

Output: actions for the next week.

Review areas: Money. Health/training. Client work. Content. Relationship/life. Learning. Calendar. Attention.

Output structure: Top wins / Reality check / Risks / Late or at-risk obligations / Next week's top three outcomes / Client next actions / Money next actions / Training focus / Content commitment / Learning brief / One grounding reminder.

## Default tracking

- Fitness and training routine.
- Sleep / recovery (where data available).
- Learnings and new-to-Harrison information.
- New developments in AI, tech, science, fitness, entrepreneurship, culture, fashion, sport.
- Client work status.
- Money and receivables.
- Calendar and deep work blocks.
- Content pipeline.
- Relationship / life check-ins.

Harrison says nothing should be off-limits unless explicitly asked. Working safety rule: still treat health, finances, relationship, and private communications as sensitive. Summarise and act with care.

## First useful version (Harrison's spec)

Daily email / message / app notification with: sleep + health breakdown (Bevel / Whoop style), training prompt for the day, deep work block, meal plan (what to eat/cook and when), full day schedule, learning block, piece of wisdom, soft reminder to love himself.

**Reality check:** this is not small. The smallest shippable version starts with manual / available inputs and progressively connects real data sources. That's what `agents/morning-brief.md` is.

## End-of-June "holy shit" version (Harrison's target)

A phone app. Private App Store / TestFlight acceptable. Proactive notifications. Daily plan. Check-in capture. Weekly review. Learning brief. Command Center view.

This is Phase 5 of `spec/mvp-roadmap.md`. v1 of HWL META has to hit acceptance first (three agents RUNNING-CLEAN for 14 days).

## Product principles

- Proactive over passive.
- Useful over complete.
- One trusted intake before many dashboards.
- Memory updates automatically from check-ins.
- Final approval stays with Harrison for money, client comms, public posts, legal/tax, relationship comms.
- The OS should challenge Harrison without becoming another self-punishment machine (per codex 15 standards).
