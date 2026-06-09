# Agents, Status Table

Honest inventory of every scheduled agent. Updated after every wire / unwire / status change. Never reference an agent as live when it isn't.

## Status legend

- **DRAFTED**, prompt exists. Not scheduled. Not running.
- **SCHEDULED**, launchd job exists or cron line set. Hasn't proven 7-day clean.
- **RUNNING-DEGRADED**, running but with data-source skips or known bugs.
- **RUNNING-CLEAN**, running, all sources working, output reliable.
- **MIGRATED-TO-APP**, replaced by the TestFlight/iOS app surface (Phase 5).

## v1 priority queue (per Harrison's "all three in parallel" call)

| Agent | File | Schedule | Status | Acceptance |
|---|---|---|---|---|
| morning-brief | `agents/morning-brief.md` + `.sh` | 06:30 weekdays | RUNNING-DEGRADED (Apple Health stale 39d, Strava not wired, Linear missing). Pipeline fix 2 June unblocked runs. 3 runs confirmed since fix (3, 4, 5 Jun). | 0/14 RUNNING-CLEAN. Blocked on Apple Health export. |
| weekly-review | `agents/weekly-review.md` | Sun 18:00 | RUNNING-DEGRADED (first live run since retro 18 May; W19+W20 missed. Strava absent, health stale). | 1/2 consecutive Sundays. Run 1: 2026-06-07. |
| weekly-cfo | `agents/weekly-cfo.md` | Fri 16:00 | RUNNING-DEGRADED (Xero unreachable, manual snapshot used both runs: 18 May retro + 5 June). Manual snapshot criterion met both runs. | 1/2 consecutive Fridays. Run 1: 2026-06-05. |

**v1 ships when all three hit acceptance simultaneously.**

## Secondary queue (post-v1)

| Agent | File | Schedule | Status | Notes |
|---|---|---|---|---|
| learning-brief | `agents/learning-brief.md` (NEW) | Sun 09:00 | DRAFTED | Pulls from learning/research-queue.md + recall-queue.md |
| discovery-scan | `agents/discovery-scan.md` | Mon/Wed/Fri 14:00 | DRAFTED | Appends to capture/inbox.md (not separate feed.md) |
| campaign-chaser | `agents/campaign-chaser.md` | Mon/Wed/Fri 10:00 | DRAFTED | Moves campaigns/* forward or flags drift |
| evening-reflection | `agents/evening-reflection.md` | Weekdays 19:00 | DRAFTED, deferred | Waits until daily check-in store exists (Phase 2 of MVP roadmap) |

## Infrastructure jobs (not agents, but scheduled)

| Job | File | Schedule | Status | Notes |
|---|---|---|---|---|
| linear-sync | `linear/sync.js` + `sync.sh` | hourly | DRAFTED, awaits API key. Setup steps in `linear/SETUP.md`. | Bidirectional poll between markdown and Linear. Writes deltas to `linear/_deltas.md` which morning-brief now reads. |

## Known infrastructure issues to address

- **Apple Health MCP schema mismatch.** Caused 5 of 5 logged morning-brief runs to skip Apple Health. Fix: `agents/refresh-health-data.sh` produces the CSV; column casts in `agents/morning-brief.md` queries need verification against the actual exported schema.
- **Gmail MCP 404.** Codex 20 notes: plugin enabled in config.toml, .app.json connector IDs present, but no live link_id. ChatGPT app/settings don't show Gmail in Harrison's case (per codex 20, may be a plan/region restriction). Fallback: build a direct local Google API bridge using Harrison-owned OAuth credentials, or use forwarding/ICS as a simpler first bridge.
- **Google Calendar MCP same as Gmail.** Same 404, same fallback.
- **Strava MCP.** Listed in rewrite's CLAUDE.md allowlist, status unclear in current sessions. Verify before relying on it.
- **Granola MCP.** Free tier, route transcripts via export-to-vault rather than live MCP.
- **Xero MCP.** Removed 26 March 2026 (rewrite WORKING.md). Needs reinstating before `weekly-cfo` can hit acceptance. Decision: Lich Fields conversation about Xero access first (codex money/index.md control priority #1: reconcile Xero).
- **Telegram bot token.** Lives at `/Users/harrison/HWL META/.config/telegram.config.json` (still active per rewrite agents/morning-brief.md line 79). Used by morning-brief for the daily push.

## Wiring sequence (the explicit acceptance criteria)

### morning-brief

1. Fix Apple Health schema. Verify `health_query` calls return non-empty results for: latest weight, RHR 7-day avg, last 5 runs, body fat last reading, sleep last night.
2. Verify Telegram bot token still works (curl test, expect `"ok": true`).
3. Schedule via launchd: `com.hwl.morning-brief.plist` runs `/Users/harrison/HWL META/agents/morning-brief.sh` at 06:30 weekdays.
4. Update `morning-brief.md` paths from `/Users/harrison/HWL META/` to `/Users/harrison/HWL META/`.
5. Run 7 consecutive weekdays. Each log entry must show ≥9 of 12 sources succeeding.
6. Acceptance: 14 consecutive weekdays RUNNING-CLEAN.

### weekly-review

1. Draft `agents/weekly-review.md` (covered below).
2. Schedule via launchd Sundays 18:00.
3. Output: refreshed `this-week.md` for the coming week + summary of the week just ended.
4. Acceptance: 2 consecutive Sundays of clean output.

### weekly-cfo

1. Reinstate Xero MCP (or note "Xero unreachable" in output and use manual snapshot).
2. Schedule via launchd Fridays 16:00.
3. Output: refreshed `money/index.md` + Telegram 200-char digest.
4. Acceptance: 2 consecutive Fridays of clean output, OR 2 consecutive of "Xero unreachable + manual snapshot used" with the manual snapshot actually completed.

## When degraded becomes a kill

Any agent that's RUNNING-DEGRADED for 3 consecutive runs without a fix attempt gets paused. Manual prompting kills the OS (codex H21). Bad output from a degraded agent is worse than no output.

## Where the logs live

- Run log: `agents/_log.md` (append-only, one line per run).
- stdout: `agents/_stdout.log`.
- stderr: `agents/_stderr.log`.
- Evening reflections (when wired): `agents/_evening-log.md`.

## Update rhythm for this file

Every Sunday during weekly review. Status changes get a one-line entry in `agents/_log.md`.
