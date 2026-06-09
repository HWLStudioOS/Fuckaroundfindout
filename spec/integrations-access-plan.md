# Integrations and Access Plan

**Canonical source:** `/Users/harrison/hwlstudio-codex/harrison-os/20-integrations-access-plan.md`

## Principle

Do not connect everything blindly. Connect systems in the order that makes Harrison OS more alive, useful, and safe:

1. Read context.
2. Summarise and remind.
3. Draft actions.
4. Ask Harrison before sending, paying, posting, deleting, or changing anything important.

## Access levels

### Level 1: read-only context

Safe first step. Calendar read, Email search/read, Slack search/read, file/statement reads, task/project reads, health data imports/exports.

Use for: daily brief, weekly review, client status, meeting prep, learning reminders, late invoice detection.

### Level 2: drafting

Useful once read-only works. Draft email replies, Slack messages, invoice follow-ups, client updates, calendar plans, posts/content.

**Rule:** Harrison approves before send / post.

### Level 3: controlled writes

Only after trust is built. Create tasks, calendar holds, save notes, update dashboards, send low-risk reminders.

**Rule:** clear categories only. No ambiguous client, money, tax, legal, or relationship writes without approval.

### Level 4: high-risk actions

Keep human-approved. Send client emails, public posts, payments, money movement, deletions, legal / tax decisions, messaging Maya/family on Harrison's behalf, changing client commitments.

## Priority integrations

### 1. Calendar
Purpose: build daily schedule, protect deep work, add training / learning blocks, prep weekly review.
**Status:** plugin in Codex config.toml, currently 404. Codex 20 fallback: build a direct local Google API bridge using Harrison-owned OAuth.

### 2. Email / Superhuman source
Purpose: extract client obligations, find LOR open threads, track invoice follow-ups, draft proactive updates.
**Status:** same 404 issue as Calendar.

### 3. Slack
Purpose: read business / project context, capture tasks and decisions, draft updates if needed.
**Status:** plugin exposed and working in current sessions. Smoke test 11 May confirmed Harrison's Slack profile resolves cleanly.

### 4. Linear / task system
**Status:** deferred. Only install if Harrison decides Linear is the task home. Default home is `capture/inbox.md` for now.

### 5. Finance / Xero / bank exports
**Status:** Xero MCP removed 26 March. Reinstating required for `agents/weekly-cfo.md` acceptance. CSV statements analyzed (codex 10); future drops go to `money/inbox/`.

### 6. Health data
Likely paths: Apple Health export, Bevel export, Whoop / Garmin export. iOS Shortcuts bridge later.
**Status:** Apple Health schema mismatch is the open issue. `agents/refresh-health-data.sh` is the import script. Fix needed for `agents/morning-brief.md` acceptance.

### 7. Telegram / email / push delivery
Paths: Telegram bot with backend (active, token in agency ccpa.config.json). Email digest via SMTP/API. Slack DM to self. Private app push.
**Status:** Telegram bot active and tested. Live.

## Current available connector signals

- Slack + GitHub tools live in current sessions.
- Gmail + Google Calendar plugins enabled in Codex config but no live link_id. 404 on connect.
- Linear not currently active.
- Telegram bot live via the existing ccpa.config.json token.

## Codex 20 troubleshooting note (11 May)

- Plugin bundles present but account connection / auth route failing before live link.
- Harrison can't see Gmail/Calendar in ChatGPT app/settings either. Per OpenAI docs, app directory visibility depends on plan / workspace. Some apps not available in EEA, GB, Switzerland depending on partner availability.
- Apps also not available with Pro models per official docs.
- **Working fallback:** don't block on managed OpenAI Google connector. Build a direct local Google API bridge using Harrison-owned OAuth credentials, or use exports / forwarding / ICS as a simpler first bridge.

## Recommended next steps

1. Start with read-only Calendar + Email once their connector tools surface in Codex / Claude Code, OR build the local Google API bridge.
2. Connect Slack only if material work happens there (currently most work is direct client emails + WhatsApp).
3. Decide whether Linear becomes the task home (default: stay with markdown intake).
4. Build Telegram / email bridge after we know the brief / review format is worth pushing (already partly done via the existing Telegram bot).

## v1 specific integration acceptance

For morning-brief: at minimum, Apple Health + Telegram working. Strava nice-to-have. Gmail / Calendar best-effort.

For weekly-review: at minimum, file reads + the morning-brief's data archive. Live integrations enhance but don't block.

For weekly-cfo: Xero reinstated, OR explicit "Xero unreachable" output with manual snapshot path. The output is the priority; the live data is secondary in v1.
