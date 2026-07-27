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
| morning-brief | `agents/morning-brief.md` + `.sh` | 06:30 weekdays | RUNNING-DEGRADED. The 27 Jul brief repeated stale dashboard, draft, calendar, campaign and training state. The verifier corrected only two claims and still sent a materially wrong brief. Live-dashboard, Gmail-draft, canonical-training and diagnose-first rules added 27 Jul. | Acceptance reset to 0/14 clean weekdays on 27 Jul. |
| weekly-review | `agents/weekly-review.md` | Sun 18:00 | RUNNING-DEGRADED. The 26 Jul review fed the 27 Jul stale state: non-existent drafts, the closed new-client target and Bled mileage all survived. Live-dashboard, Edge Lab, Gmail-draft, canonical-training and diagnose-first rules added 27 Jul. | Acceptance reset to 0/2 on-schedule accurate Sundays. Next proof runs are 2 and 9 Aug. |
| weekly-cfo | `agents/weekly-cfo.md` | Fri 16:00 | RUNNING-DEGRADED (Xero still unreachable, manual snapshot used). Sixth run 24 July, same pattern, snapshot completed and flagged Starling's growing 26-day unconfirmed gap clearly. | 6/6 runs on the degraded-but-acceptable pattern (5 Jun, 12 Jun, 26 Jun, 3 Jul, 17 Jul, 24 Jul). ACCEPTANCE HIT (2/2 achieved 12 June). Now on extended run, no gaps. |

**v1 ships when all three hit acceptance simultaneously.**

> As of 27 July 2026: weekly-cfo is the cleanest of the three. Morning brief and weekly review both reset after the stale-state incident. v1 is not close to acceptance until the corrected live-source rules prove themselves over two clean weeks.

## Secondary queue (post-v1)

| Agent | File | Schedule | Status | Notes |
|---|---|---|---|---|
| learning-brief | `agents/learning-brief.md` | Sun 09:00 | RUNNING-CLEAN. Ran 14 Jun (msg_id=449) and 28 Jun (msg_id=487). 5 items, 4 drills each run, Telegram push confirmed. | 2/2 recent runs clean. Not formally in v1 acceptance scope. |
| discovery-scan | `agents/discovery-scan.md` | Mon/Wed/Fri 14:00 | RUNNING-CLEAN. Consistent Mon/Wed/Fri runs since 12 June. 4-5 items per run, appending to capture/inbox.md. | Multiple consecutive clean runs. Inbox is filling; drain is the open issue, not the agent. |
| campaign-chaser | `agents/campaign-chaser.md` | Mon/Wed/Fri 10:00 | RUNNING-DEGRADED. On 27 Jul it found Helen's genuine opportunity but still called the campaign overdue, created an unwanted Gmail draft and pushed another stale Telegram prompt. Campaign win and draft-authority rules corrected the same day. | 0 clean runs since the 27 Jul correction. Pause if the next three runs repeat the failure. |
| evening-reflection | `agents/evening-reflection.md` | Weekdays 19:00 | DRAFTED, deferred | Waits until daily check-in store exists (Phase 2 of MVP roadmap) |

## Infrastructure jobs (not agents, but scheduled)

| Job | File | Schedule | Status | Notes |
|---|---|---|---|---|
| linear-sync | `linear/sync.js` + `sync.sh` | hourly | RUNNING-CLEAN. API key and launchd job are live. | Bidirectional poll works. Board reconciled from 43 zombie Todos to 27 current issues on 27 Jul. |

## Known infrastructure issues to address

- **Apple Health MCP schema mismatch.** Caused 5 of 5 logged morning-brief runs to skip Apple Health. Fix: `agents/refresh-health-data.sh` produces the CSV; column casts in `agents/morning-brief.md` queries need verification against the actual exported schema.
- **Gmail identity drift.** Gmail is connected to `harrison@hwlstudio.com` as of 27 Jul. Every agent must call the profile endpoint instead of relying on a cached identity claim.
- **Google Calendar is reachable**, but cancellation email must be checked before treating a future meeting as live.
- **Strava and Garmin are reachable.** Use current readings, and label weekly-average HRV accurately when overnight data is absent.
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
