# Integrations And Access Plan

Date started: 2026-05-11.

## Principle

Do not connect everything blindly.

Connect systems in the order that makes Harrison OS more alive, useful, and safe:

1. Read context.
2. Summarize and remind.
3. Draft actions.
4. Ask Harrison before sending, paying, posting, deleting, or changing anything important.

## Access Levels

### Level 1: Read-Only Context

Safe first step.

- Calendar read.
- Email search/read.
- Slack search/read.
- File/statement reads.
- Task/project reads.
- Health data imports/exports.

Use for:

- Daily brief.
- Weekly review.
- Client status.
- Meeting prep.
- Learning reminders.
- Late invoice detection.

### Level 2: Drafting

Useful once read-only works.

- Draft email replies.
- Draft Slack messages.
- Draft invoice follow-ups.
- Draft client updates.
- Draft calendar plans.
- Draft posts/content.

Rule:

- Harrison approves before send/post.

### Level 3: Controlled Writes

Only after trust is built.

- Create tasks.
- Create calendar holds.
- Save notes.
- Update dashboards.
- Send low-risk reminders.

Rule:

- Clear categories only. No ambiguous client, money, tax, legal, or relationship writes without approval.

### Level 4: High-Risk Actions

Keep human-approved.

- Send client emails.
- Send public posts.
- Pay money.
- Move money.
- Delete data.
- Commit legal/tax decisions.
- Message Maya/family on Harrison's behalf.
- Change client commitments.

## Priority Integrations

### 1. Calendar

Purpose:

- Build daily schedule.
- Protect deep work.
- Add training/learning blocks.
- Prepare weekly review.

Needed for:

- Morning brief.
- Weekly planning.
- Avoiding fantasy schedules.

Local bridge (built 2026-05-11):

- Script: [tools/calendar-bridge/cal.py](../tools/calendar-bridge/cal.py).
- Runtime: Python via `uv run` with PEP 723 inline deps. No venv, no system pollution.
- Scope: `https://www.googleapis.com/auth/calendar.readonly` only.
- Secrets path (gitignored, never in Markdown):
  - `.secrets/google_oauth/client_secret.json` — OAuth Desktop client.
  - `.secrets/google_oauth/token.json` — cached user token, written `0600`.
- Default behaviour: tomorrow, Europe/London, primary calendar, prints structured JSON plus a Markdown schedule block.
- Useful flags: `--date today|tomorrow|YYYY-MM-DD`, `--tz`, `--calendar`, `--format json|markdown|both`.
- First-run setup (one time, manual): Google Cloud project → enable Calendar API → OAuth consent screen (External, add Harrison as Test user) → Credentials → Create OAuth client ID (Desktop app) → download JSON → save as `.secrets/google_oauth/client_secret.json`. First run opens a browser tab once; the refresh token is then cached for silent reuse.
- Status as of 2026-05-11: script runs end-to-end at `--help` and errors cleanly when the client secret is missing. Awaiting Harrison to drop in the OAuth client JSON for first authorized run.
- Next step after first authorized run: feed the JSON output into the daily brief generator before any MCP abstraction.

Codex Google Calendar connector update (2026-05-25):

- The Google Calendar app connector is now authenticated as `harrison@hwlstudio.com`.
- Codex successfully read calendar events for 2026-05-25 and 2026-05-26.
- Morning briefs in Codex can now use live calendar data without the local OAuth bridge.
- The local bridge remains unauthorised and is only needed if the OS must run outside Codex or via a standalone service.

Codex Gmail and Granola update (2026-05-27):

- Gmail connector is now available read-only within Codex and successfully returned recent client-thread context for Laing O'Rourke, Better At Work, and Creepers.
- This is enough to improve daily briefs with recent incoming requests and follow-up promises.
- No write action should occur through Gmail without Harrison's explicit approval.
- Granola connector returned that the 2026-05-26 Kerri/Harrison catch-up occurred, but the recorded transcript was unrelated audio and no reliable summary existed.
- Meeting notes cannot be treated as authoritative unless capture quality is verified; important call actions need written confirmation when recording fails.

### 2. Email / Superhuman Source

Purpose:

- Extract client obligations.
- Find Laing O'Rourke open threads.
- Track invoice follow-ups.
- Draft proactive updates.

Needed for:

- Client Command Center.
- Late invoice rhythm.
- Weekly client status.

### 3. Slack

Purpose:

- Read business/project context where relevant.
- Capture tasks and decisions from Slack.
- Draft updates if needed.

Current status:

- Slack tools are exposed in this session through the Slack plugin.

### 4. Linear / Task System

Purpose:

- Give Harrison one trusted task/project layer.
- Track client delivery, personal OS, content, and app build.

Status:

- Linear is a good candidate, but should only be installed/connected if Harrison wants Linear to become the actual task layer.

### 5. Finance / Xero / Bank Exports

Purpose:

- Track cash, receivables, business card, tax buffer, and spending patterns.

Current status:

- CSV statements have already been analyzed.
- Xero/API access would be useful later, but accountant-reviewed numbers matter more than live but messy data.
- Xero MCP setup started on 2026-05-18:
  - Codex MCP config has an enabled `xero` server entry.
  - Launcher: [tools/xero-mcp/start-xero-mcp.sh](../tools/xero-mcp/start-xero-mcp.sh).
  - Credential template: [tools/xero-mcp/mcp.env.example](../tools/xero-mcp/mcp.env.example).
  - Secrets path, gitignored: `.secrets/xero/mcp.env`.
  - Safety: Codex MCP allowlist exposes read/list/reporting tools only; no create/update/delete/payment/reconcile writes.
  - Xero credentials were validated against the token endpoint and found one Xero connection.
  - Automation `xero-finance-review` is active, scheduled every other day at 08:45 Europe/London.

### 6. Health Data

Purpose:

- Sleep, readiness, training, HRV, resting heart rate, race prep.

Likely paths:

- Apple Health export.
- Bevel export if available.
- Whoop/Oura/Garmin style export/API if used.
- iOS Shortcuts bridge later.

2026-05-31 update:

- Harrison wants Strava or Garmin Connect connected so training can be tracked consistently.
- No Strava or Garmin connector is currently exposed in Codex.
- Practical next step: evaluate Strava OAuth/API versus Garmin Connect export or unofficial/local library bridge.
- Preference should be read-only import first: activities, distance, time, elevation, heart rate, training load where available, and notes.
- Local Strava bridge scaffolded at [tools/strava-bridge/strava.py](../tools/strava-bridge/strava.py) with setup notes at [tools/strava-bridge/README.md](../tools/strava-bridge/README.md).
- Verification: script help works with `python3`; activity import is blocked until `.secrets/strava/client.json` exists and OAuth exchange is completed.
- Harrison confirmed Garmin already auto-syncs activities to Strava, so the first implementation path is Garmin -> Strava -> Harrison OS.
- Connected 2026-05-31:
  - OAuth completed successfully.
  - Token saved to `.secrets/strava/token.json`.
  - Connected athlete: Harrison Living.
  - First successful import returned 18 activities across the last 14 days: 91.6 km and 12.8 moving hours.
- Security cleanup 2026-05-31:
  - Initial Strava authorization was revoked after the client secret appeared in chat/screenshot context.
  - Local Strava `client.json` and `token.json` were removed.
  - Harrison rotated the Strava client secret in Strava.
  - Fresh client secret was saved locally from the macOS clipboard without being pasted into chat.
  - Fresh OAuth completed successfully with `read,activity:read_all`.
  - Verification import returned 8 activities across the last 7 days: 52.6 km and 5.9 moving hours.
  - Local Strava files are `0600`.

### 7. Telegram / Email / Push Delivery

Purpose:

- Make the OS show up outside Codex.

Paths:

- Telegram bot with backend.
- Email digest via SMTP/API.
- Slack DM to self.
- Private app push notifications.

Recommendation:

- Prove the morning brief content inside Codex first.
- Then build Telegram/email delivery once the brief format is clearly useful.

## Current Available Connector Signals

- Slack and GitHub tools are available in the current session.
- Slack read-only smoke test completed on 2026-05-11:
  - Current Slack profile resolved as Harrison in the HWL workspace.
  - Email shown by Slack: harrison@hwlstudio.com.
- Gmail and Google Calendar skills were installed locally, but callable Gmail/Calendar tools did not surface in this thread as of 2026-05-11.
- 2026-05-11 troubleshooting note:
  - Gmail plugin is enabled in `/Users/harrison/.codex/config.toml`.
  - Google Calendar plugin is enabled in `/Users/harrison/.codex/config.toml`.
  - Both plugins have local `.app.json` connector IDs.
  - Unlike Slack, neither has a live `link_id`/tool cache in the current session.
  - Harrison saw 404 errors while trying to connect them.
  - Working interpretation: plugin bundles are present, but the account connection/auth route is failing before a live link is created.
- Linear is not currently an active plugin in this session; it can be requested/installed later if Harrison explicitly wants it.

## Recommended Next Step

Start with read-only Calendar and Email once their connector tools are surfaced in Codex.

Reason:

- Calendar tells the OS what today can realistically hold.
- Email tells the OS what clients and invoices actually need.
- Together, they make the daily brief and weekly review much more alive.

Second step:

- Connect Slack only if material work happens there.

Current practical fallback:

- Slack can be used immediately.
- For Calendar/Gmail, Harrison may need to connect or enable the Google Calendar/Gmail app connectors in Codex, then ask Codex to search again for the tools.
- If Codex's connector button keeps returning 404, try connecting Gmail and Google Calendar from ChatGPT web/mobile app settings, then fully restart Codex and start/search tools again. Official OpenAI docs say connected services can carry over between ChatGPT and Codex.

2026-05-11 follow-up:

- Harrison cannot see Gmail or Google Calendar in ChatGPT app/settings either.
- Official OpenAI docs say app directory visibility depends on plan/workspace, and some apps may not be available in EEA, GB, or Switzerland depending on partner/service availability.
- Official docs also say apps are not available with Pro models, so connection/use should be checked from a normal GPT-5 chat/app settings surface rather than a Pro-model-only context.
- Working fallback: do not block Harrison OS on the managed OpenAI Google connector. If needed, build a direct local Google API bridge/MCP for Gmail and Calendar using Harrison-owned OAuth credentials, or use exports/forwarding/ICS as a simpler first bridge.
- Harrison then explicitly mentioned `google-calendar@openai-curated` in chat. Codex recognized the plugin capability, but calendar read/list/search tools still did not surface. This further suggests the skill/plugin is present but the live account/tool link is missing.
- On 2026-05-25, the Google Calendar connector did surface and successfully returned Harrison's live calendar. Gmail status remains unverified.
- On 2026-05-27, Gmail also surfaced and returned read-only client mail context. Granola surfaced but produced an unreliable transcript for the Kerri/Laing O'Rourke catch-up.

Third step:

- Decide whether Linear is the task home.

Fourth step:

- Build Telegram/email bridge after we know the brief/review format is worth pushing.
