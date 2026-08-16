# Agents, Status Table

Honest inventory of every scheduled agent. Updated after every wire / unwire / status change. Never reference an agent as live when it isn't.

## Runtime incident, 2 to 3 August 2026

The Claude OAuth session expired before the 2 August learning brief. Learning brief, weekly review, morning brief, content engine, campaign chaser, discovery scan and evening reflection then failed before doing useful work. The old wrappers left the only useful diagnosis in one shared stdout file, and some job-specific evidence was missing.

Claude-backed entry points now use `agents/agent-runtime.sh`. Before any prompt work they call `claude auth status --json`, without opening a login flow. A logged-out session exits 78, records `AUTH_REQUIRED` in `agents/_log.md`, writes the latest result to `.jarvis-runtime/agent-runs/<job>/latest.json`, and points to job-specific logs. Harrison must restore an expired session interactively with `claude auth login`. An unattended workflow must not attempt that login itself.

This hardening does not add, replace or reload any schedule. Existing launchd jobs remain the only production schedules.

## Runtime incident, 3 to 6 August 2026

The Claude CLI session expired again. weekly-review (3 Aug 20:56), morning-brief (4, 5, 6 Aug), campaign-chaser (5 Aug), discovery-scan (5 Aug) and evening-reflection (4, 5 Aug) all recorded `AUTH_REQUIRED` before doing useful work, same failure shape as 2-3 Aug. `auth-proof` succeeded 6 Aug 12:37, and every job has run clean since. The 3 Aug weekly-review failure left a 2-week gap in `agents/_review-log.md`, retro-covered by the 9 Aug run. Root cause (why the session keeps expiring within days rather than lasting weeks) has not been diagnosed; worth a direct look before this happens a third time.

## Status legend

- **DRAFTED**, prompt exists. Not scheduled. Not running.
- **SCHEDULED**, launchd job exists or cron line set. Hasn't proven 7-day clean.
- **RUNNING-DEGRADED**, running but with data-source skips or known bugs.
- **RUNNING-CLEAN**, running, all sources working, output reliable.
- **AUTH-BLOCKED**, still scheduled, but Claude cannot start until Harrison restores the interactive session.
- **MIGRATED-TO-APP**, replaced by the TestFlight/iOS app surface (Phase 5).

## v1 priority queue (per Harrison's "all three in parallel" call)

| Agent | File | Schedule | Status | Acceptance |
|---|---|---|---|---|
| morning-brief | `agents/morning-brief.md` + `.sh` | 06:30 weekdays | RUNNING-CLEAN. Clean weekday runs on 7, 10, 11, 12, 13 and 14 Aug, all with a verifier correction pass. | 6/14 consecutive clean weekdays since the 7 Aug restart. The long pole for v1. |
| weekly-review | `agents/weekly-review.md` | Sun 18:00 | RUNNING-CLEAN. This 16 Aug run is the second consecutive clean Sunday after the 9 Aug retro run. | **2/2 consecutive clean Sundays, hits its own acceptance bar** as of this run. Second of the three v1 agents to do so. |
| weekly-cfo | `agents/weekly-cfo.md` | Fri 16:00 | RUNNING-CLEAN. 31 Jul, 7 Aug and 14 Aug all completed with Xero unreachable + manual snapshot fully done. | **3/2 consecutive clean Fridays, ahead of its own acceptance bar.** First of the three v1 agents to reach it, still holding. |

**v1 ships when all three hit acceptance simultaneously.**

> As of 16 August 2026: weekly-cfo and weekly-review have both reached their own acceptance criteria. morning-brief is the remaining gap, 6/14 consecutive clean weekdays since its 7 Aug restart, needs 8 more clean weekdays with no auth or source-accuracy break to bring v1 home.

## Secondary queue (post-v1)

| Agent | File | Schedule | Status | Notes |
|---|---|---|---|---|
| content-engine | `agents/content-engine.md` + `.sh` | Mon 07:00 | RUNNING-CLEAN. The 10 Aug run completed after authentication was restored. | The substance bank was dry for at least the third confirmed Monday. This is an input drought, not a runtime failure. |
| learning-brief | `agents/learning-brief.md` | Sun 09:00 | RUNNING-CLEAN. 9 Aug ran clean, 8 items, 5 drills. | Earlier clean runs remain historical. |
| discovery-scan | `agents/discovery-scan.md` | Mon/Wed/Fri 14:07 | RUNNING-CLEAN. 7 Aug ran clean (6 items, 1 buyable queued), first clean run since the outage. | Earlier consecutive clean runs remain historical. |
| campaign-chaser | `agents/campaign-chaser.md` | Mon/Wed/Fri 10:07 | RUNNING-CLEAN. 7 Aug ran clean, first clean run since the outage. | The content-quality acceptance count remains at zero. |
| evening-reflection | `agents/evening-reflection.md` | Weekdays 19:07 | RUNNING-CLEAN. 6 and 7 Aug both ran clean after the outage. | Not in v1 acceptance scope. |

## Infrastructure jobs (not agents, but scheduled)

| Job | File | Schedule | Status | Notes |
|---|---|---|---|---|
| linear-sync | `linear/sync.js` + `sync.sh` | hourly | RUNNING-CLEAN. Duplicate markers made HWL-191 alternate todo and done hourly from 9 to 10 Aug. PR #20 deployed the ownership repair. | Live 06:55 proof created fresh issues, closed two completed issues and made zero HWL-191 state writes. Watch the next scheduled hour for the second proof. |

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

- Run log: `agents/_log.md` (append-only, one truthful wrapper result per run, plus agent-written detail where applicable).
- Per-job stdout: `agents/logs/<job>.stdout.log`.
- Per-job stderr: `agents/logs/<job>.stderr.log`.
- Latest machine-readable result: `.jarvis-runtime/agent-runs/<job>/latest.json`.
- Historical compatibility streams: `agents/_stdout.log` and `agents/_stderr.log`.
- Evening reflections (when wired): `agents/_evening-log.md`.

Exit 78 means Claude authentication needs Harrison. Other non-zero exits retain the underlying CLI or wrapper failure code. A zero exit means the wrapper reached its explicit success condition. For morning brief that includes the verifier send sentinel, not merely completion of the draft stage.

## Update rhythm for this file

Every Sunday during weekly review. Status changes get a one-line entry in `agents/_log.md`.
