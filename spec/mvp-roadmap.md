# MVP Roadmap

**Canonical source:** `/Users/harrison/hwlstudio-codex/harrison-os/19-mvp-roadmap.md`

## Architecture thesis

Hybrid:
- Markdown files as durable memory.
- Small app as daily interface.
- Proactive message layer for daily / weekly prompts.
- Optional integrations for calendar, email, Slack, health, finance, tasks.

The memory can live locally, but the experience must not feel local / manual.

## What Codex (the CLI / Claude Code session) can do natively

- Maintain markdown memory files.
- Analyze files and statements.
- Draft daily / weekly prompts and reviews.
- Run local scripts.
- Build a local app.
- Create recurring thread wakeups (Codex-native or via launchd).
- Use available connectors when explicitly connected and invoked.

## What Codex cannot do natively without infrastructure

- Send arbitrary Telegram messages (needs a bot + backend).
- Send emails (needs SMTP/API layer).
- Call Harrison's mobile (needs telephony service).
- Pull Bevel / Whoop / Apple Health without an export / API / shortcut bridge.
- Ship an iPhone app without Apple developer / TestFlight workflow.

## Phase 0: tomorrow useful

Daily operating brief works tomorrow even if full automation doesn't exist yet.

Minimum:
- Codex-native daily heartbeat or manual morning run.
- Daily check-in template.
- Daily plan template.
- Read from current memory.
- Ask for missing live inputs.
- Produce: today's top 3, deep work block, training prompt, meal plan, learning block, money / client reminder, one grounding line.

**Status in HWL META v1:** today.md scaffold exists. `agents/morning-brief.md` is the daemon prompt. Phase 0 = morning-brief manually run produces today.md.

## Phase 1: proactive message layer

Harrison receives useful prompts without opening a blank chat.

Options:
- Codex heartbeat into the thread.
- Telegram bot (token in `hwlstudio-ai-agency/ccpa.config.json`).
- Email digest.
- Slack DM to self.

**Recommendation:** Telegram first (already working per rewrite morning-brief.md). Email as backup.

## Phase 2: daily check-in store

Every day creates structured memory.

Capture: date, sleep, energy, mood, training, work focus, money stress, relationship/life, learning, wins, avoidance, tomorrow's next action.

Storage: markdown daily logs initially in `agents/daily-checkins/YYYY-MM-DD.md`. JSON / SQLite later if building an app.

## Phase 3: Command Center web app

Browser-accessible dashboard before native phone app. Eight views per `spec/command-center.md`.

Stack: static HTML/JS for fastest prototype. Next.js or similar for richer. SQLite for local structured data.

**Recommendation:** static / local first. Add framework / backend only once the daily workflow is proven.

## Phase 4: integrations

Priority order:
1. Calendar.
2. Email / Superhuman source.
3. Slack.
4. Linear / tasks.
5. Finance exports / Xero.
6. Health data export.
7. Telegram / push notifications.

Integration rule: connect only what improves a weekly decision or daily action. Avoid integration theatre.

## Phase 5: private phone app

Target by end of June 2026. Private iPhone app via TestFlight if feasible.

Core features: daily brief, check-in, notifications, weekly review, Command Center, learning brief, capture inbox.

Nice-to-have: voice memo capture, health data integration, calendar view, Telegram / email fallback.

## v1 acceptance (HWL META specific)

**Phase 4 work (the wiring) starts after Phase 3 build completes.** v1 ships when:
- morning-brief: 14 consecutive weekdays RUNNING-CLEAN.
- weekly-review: 2 consecutive Sundays RUNNING-CLEAN.
- weekly-cfo: 2 consecutive Fridays RUNNING-CLEAN (or "Xero unreachable" with manual snapshot completed both times).

Estimated v1 acceptance window: 14 consecutive days from first scheduled morning-brief run. So if launchd job goes live Wed 13 May, v1 acceptance possible Wed 27 May.
