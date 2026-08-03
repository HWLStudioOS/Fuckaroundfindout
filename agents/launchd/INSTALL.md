# Agent Install Instructions

Read this at the Mac Mini. Should take 20-30 minutes. The result: three scheduled agents running unattended.

Everything below assumes you're logged in as `harrison` on the Mac Mini and have Claude Code installed at `/Users/harrison/.local/bin/claude` (or wherever your `claude` binary is, adjust PATH in the plists if different).

---

## Pre-flight (5 min)

```bash
# 1. Confirm Claude Code is on PATH
which claude
# Expect: a path like /Users/harrison/.local/bin/claude or /opt/homebrew/bin/claude

# 2. Confirm the unattended session is authenticated
claude auth status --text
# Expect: logged in. If not, run `claude auth login` here in the interactive terminal.

# 3. Confirm HWL META mounts cleanly
ls "/Users/harrison/HWL META/agents/"
# Expect: a list including morning-brief.sh, agent-runner.sh, README.md, etc.

# 4. Make all .sh files executable
chmod +x "/Users/harrison/HWL META/agents/"*.sh

# 5. Confirm Telegram config is present without printing the token
/usr/bin/jq -e \
  '(.telegram.botToken | type == "string" and length > 0) and (.telegram.chatId != null)' \
  "/Users/harrison/HWL META/.config/telegram.config.json" >/dev/null \
  && echo "Telegram config present"
```

If any of the above fails, stop. Fix the breakage before continuing.

---

## Step 1: smoke-test morning-brief manually (5 min)

Before scheduling, prove it can run once.

```bash
cd "/Users/harrison/HWL META"
./agents/morning-brief.sh
```

Wait for it to finish (1-3 minutes typically). Then check:

```bash
# Did it produce output?
tail -50 "/Users/harrison/HWL META/agents/logs/morning-brief.stdout.log"

# Did it write today.md?
head -20 "/Users/harrison/HWL META/today.md"

# Did it append to the log?
tail -5 "/Users/harrison/HWL META/agents/_log.md"

# Did the Telegram digest arrive on your phone?
# (Check WhatsApp / Telegram. If it didn't arrive, check stderr.)
tail -50 "/Users/harrison/HWL META/agents/logs/morning-brief.stderr.log"
```

**Acceptance for Step 1:** today.md is rewritten, log line appended, Telegram message received. If any of those three fail, debug before scheduling.

**Common failure modes:**

- **"claude: command not found"** → PATH issue. Fix in `agents/morning-brief.sh` line 14 PATH export.
- **Exit 78 or `AUTH_REQUIRED`** → run `claude auth login` interactively as Harrison, then confirm `claude auth status --text`. The scheduled job will not open a login flow.
- **"Telegram error 401"** → bot token wrong or revoked. Check `/Users/harrison/HWL META/.config/telegram.config.json` and rotate token in BotFather if needed.
- **"apple-health schema mismatch" in today.md** → expected for first runs; the agent should now self-discover and either succeed or note "skipped: apple-health" explicitly. If you see a hard crash instead, the schema discovery itself is failing; run `bash /Users/harrison/HWL META/agents/refresh-health-data.sh` to refresh from a current iPhone export.
- **"Skipped: Strava / Gmail / Calendar / Granola"** → expected. These MCPs are partially or fully unwired. Not a blocker for acceptance.

---

## Step 2: install the launchd plists (5 min)

```bash
# Copy all three to LaunchAgents
cp "/Users/harrison/HWL META/agents/launchd/com.hwl.morning-brief.plist" ~/Library/LaunchAgents/
cp "/Users/harrison/HWL META/agents/launchd/com.hwl.weekly-review.plist" ~/Library/LaunchAgents/
cp "/Users/harrison/HWL META/agents/launchd/com.hwl.weekly-cfo.plist" ~/Library/LaunchAgents/

# Load them
launchctl load ~/Library/LaunchAgents/com.hwl.morning-brief.plist
launchctl load ~/Library/LaunchAgents/com.hwl.weekly-review.plist
launchctl load ~/Library/LaunchAgents/com.hwl.weekly-cfo.plist

# Verify they're scheduled
launchctl list | grep com.hwl
# Expect three lines:
#   -   0   com.hwl.morning-brief
#   -   0   com.hwl.weekly-review
#   -   0   com.hwl.weekly-cfo
# The middle column being "0" means it's loaded but hasn't run yet. That's fine.
```

**Schedules:**

- `com.hwl.morning-brief` — Mon-Fri 06:30 local.
- `com.hwl.weekly-review` — Sundays 18:00.
- `com.hwl.weekly-cfo` — Fridays 16:00.

---

## Step 3: wake-on-schedule check (5 min)

launchd jobs only fire when the Mac is awake. If you put the Mac Mini to sleep, the 06:30 brief won't ship.

**Two options:**

**Option A: never let it sleep.**

```bash
sudo pmset -a sleep 0
# Set sleep to never. Display can still sleep, machine stays up.
```

This is what the original system did per the rewrite. Mac Mini in always-on mode.

**Option B: wake schedule.**

```bash
sudo pmset repeat wakeorpoweron MTWRF 06:25:00
sudo pmset repeat wakeorpoweron F 15:55:00 wakeorpoweron U 17:55:00
```

Wake 5 minutes before each scheduled job. Requires admin password.

**Recommendation:** Option A is simpler. Mac Mini hardware is built for always-on. Power draw is negligible.

---

## Step 4: first scheduled run validation (next morning)

Tomorrow at 06:30 the brief should run on its own. After 09:00 check:

```bash
# Was today.md updated this morning?
ls -la "/Users/harrison/HWL META/today.md"
# Expect: modified today around 06:30-06:32.

# Log entry?
tail -3 "/Users/harrison/HWL META/agents/_log.md"

# Telegram on your phone?
# Should have arrived between 06:30 and 06:33.
```

If yes: morning-brief is running. Repeat the check daily. Acceptance is 14 consecutive RUNNING-CLEAN weekdays.

If no: check `agents/logs/morning-brief.stderr.log` and `.jarvis-runtime/agent-runs/morning-brief/latest.json`. The latest record distinguishes auth, verifier, CLI and wrapper failures.

---

## Step 5: log the install (1 min)

Append one line to `/Users/harrison/HWL META/agents/_log.md`:

```
YYYY-MM-DD HH:MM | system | Phase 4 install: 3 plists loaded, morning-brief smoke-test passed, scheduled
```

Update `/Users/harrison/HWL META/agents/README.md` status table:

- morning-brief: change status from `RUNNING-DEGRADED (5 logs, last 6 May)` to `SCHEDULED, awaiting first auto-run`.
- weekly-review: change from `DRAFTED` to `SCHEDULED, awaiting Sun 17 May`.
- weekly-cfo: change from `DRAFTED` to `SCHEDULED, awaiting Fri 15 May`.

---

## Step 6 (added 19 May): wire the content-engine agent

The content-engine agent drafts the week's content package every Monday morning: one field-note reel script + one LinkedIn editorial + (alternate weeks) one cinematic essay outline. Output pushes to Telegram. See `agents/content-engine.md` for the prompt.

### Smoke test (3 min)

```bash
cd "/Users/harrison/HWL META"
chmod +x agents/content-engine.sh
./agents/content-engine.sh
```

Wait 1-3 minutes. Check:

```bash
tail -50 agents/logs/content-engine.stdout.log
```

Expected behaviour right now: `capture/inbox.md` is empty, so the agent will send the "inbox is dry" Telegram message and stop cleanly. That's the correct first-run behaviour. Once you start populating `capture/inbox.md` with daily observations, the agent has material to draft from.

### Schedule it

```bash
cp "/Users/harrison/HWL META/agents/launchd/com.hwl.content-engine.plist" ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.hwl.content-engine.plist
launchctl list | grep com.hwl.content-engine
# Expect:    -   0   com.hwl.content-engine
```

**Schedule:** `com.hwl.content-engine`, Mondays 07:00 local. Fires 30 min after the morning brief so it can read the freshly-written `today.md`.

### Rollback if needed

```bash
launchctl unload ~/Library/LaunchAgents/com.hwl.content-engine.plist
rm ~/Library/LaunchAgents/com.hwl.content-engine.plist
```

---

## Rollback (if anything breaks badly)

```bash
# Unload all three
launchctl unload ~/Library/LaunchAgents/com.hwl.morning-brief.plist
launchctl unload ~/Library/LaunchAgents/com.hwl.weekly-review.plist
launchctl unload ~/Library/LaunchAgents/com.hwl.weekly-cfo.plist

# Remove
rm ~/Library/LaunchAgents/com.hwl.morning-brief.plist
rm ~/Library/LaunchAgents/com.hwl.weekly-review.plist
rm ~/Library/LaunchAgents/com.hwl.weekly-cfo.plist

# Restore wake/sleep defaults
sudo pmset -a sleep 10
```

The HWL META markdown layer continues to work as a manual vault. You haven't lost anything by rolling back.

---

## Manual invocation (any time)

If you ever want to force a run:

```bash
# Morning brief now
bash "/Users/harrison/HWL META/agents/morning-brief.sh"

# Weekly review now
bash "/Users/harrison/HWL META/agents/agent-runner.sh" weekly-review

# Weekly CFO now
bash "/Users/harrison/HWL META/agents/agent-runner.sh" weekly-cfo
```

Useful for catching up after a travel day or testing changes to the prompt.

---

## Acceptance criteria for v1 of HWL META

- **morning-brief:** 14 consecutive weekdays RUNNING-CLEAN. First scheduled run after install + 13 consecutive successful runs after.
- **weekly-review:** 2 consecutive Sundays RUNNING-CLEAN. First scheduled run on the Sunday after install + 1 more.
- **weekly-cfo:** 2 consecutive Fridays RUNNING-CLEAN, OR 2 consecutive of "Xero unreachable" with manual snapshot path actually used. First scheduled run on the Friday after install + 1 more.

Estimated v1 acceptance window: 14 days after install. If install happens Wed 13 May, v1 acceptance possible Wed 27 May.

---

## Known unfinished work

- Xero MCP needs reinstating (priority for weekly-cfo acceptance).
- Gmail + Google Calendar MCPs are 404 in the current Codex setup; the Google API bridge or export route is the fallback, not blocking for v1.
- Apple Health schema discovery now self-heals or skips cleanly; previous "5 of 5 skipped" should drop to "0-2 of 5 skipped" after the prompt update.
- Telegram bot token is currently at `.config/telegram.config.json` in plain text. Rotate it in BotFather and update the file when you have a quiet 5 minutes.

When v1 acceptance hits, the next phase is the web Command Center (v1.1) per `spec/mvp-roadmap.md` Phase 3.
