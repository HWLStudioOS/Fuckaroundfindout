#!/bin/bash
# morning-brief.sh, daemon entry point
# Runs at 06:30 weekdays via launchd (com.hwl.morning-brief.plist)
# Manually invokable: ./morning-brief.sh
#
# Two-stage loop (doer/verifier split, per Osmani "loop engineering"):
#   Stage 1  morning-brief.md         drafts today.md + the Telegram digest candidate. DOES NOT SEND.
#   Stage 2  morning-brief-verify.md  re-checks the draft's falsifiable claims against ground
#                                     truth, surgically corrects today.md, then sends the
#                                     (corrected) digest and writes a send sentinel + log line.
# The verifier holds the send gate, so the drafter can no longer ship its own over-claims and
# false misses (the failure that made briefs wrong after Dublin, _log.md 2026-06-25).
#
# Fallback: if Stage 2 produces no send sentinel (it crashed before sending), this script sends
#           the raw candidate tagged "[unverified]" so a brief still lands on the phone.

set -e

HWL_META_DIR="/Users/harrison/HWL META"
BRIEF_PROMPT="$HWL_META_DIR/agents/morning-brief.md"
VERIFY_PROMPT="$HWL_META_DIR/agents/morning-brief-verify.md"
LOG_FILE="$HWL_META_DIR/agents/_log.md"
STDOUT_LOG="$HWL_META_DIR/agents/_stdout.log"
STDERR_LOG="$HWL_META_DIR/agents/_stderr.log"
TODAY_FILE="$HWL_META_DIR/today.md"
CANDIDATE="$HWL_META_DIR/agents/_brief-candidate.txt"
SENT_SENTINEL="$HWL_META_DIR/agents/_brief-sent.json"
CONFIG="$HWL_META_DIR/.config/telegram.config.json"

# Ensure PATH includes Homebrew + Claude
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"

cd "$HWL_META_DIR"

# Clear last run's handoff files so a stale candidate/sentinel can't be mistaken for this run's.
rm -f "$CANDIDATE" "$SENT_SENTINEL"

# The mini's early-morning jobs have fired before the network/DNS was ready,
# producing whole-day data gaps (Garmin + Linear ENOTFOUND in the logs). Wait up
# to ~90s for DNS to actually resolve before running the brief.
for i in $(seq 1 18); do
  if nslookup api.linear.app >/dev/null 2>&1 || ping -c1 -t2 1.1.1.1 >/dev/null 2>&1; then
    break
  fi
  if [ "$i" -eq 18 ]; then
    echo "$(date) | morning-brief | WARN: network not up after 90s wait" >> "$LOG_FILE"
  fi
  sleep 5
done

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

# Run a prompt through Claude in print mode (Sonnet 4.6 for daemon work).
# $1 = stage label for the stdout log header, $2 = full prompt text.
run_stage () {
  {
    echo ""
    echo "=== morning-brief $1 at $(date) ==="
    echo "$2" | claude \
      --model claude-sonnet-4-6 \
      --print \
      --permission-mode bypassPermissions \
      --add-dir "$HWL_META_DIR"
  } >> "$STDOUT_LOG" 2>> "$STDERR_LOG"
}

# Strip any em dashes that slipped through (safety net, LLM-side rewrite is cleaner).
strip_emdash () {
  [ -f "$1" ] && perl -CSD -i -pe 's/\xe2\x80\x94/,/g' "$1"
}

# --- Stage 1: draft (no send) -------------------------------------------------
BRIEF_PROMPT_TEXT="It is now ${NOW}. You are running unattended on Harrison's Mac Mini. Execute the morning brief workflow described below in full: read every listed context file, pull whatever live data you can reach, write today.md, and write the composed Telegram digest to agents/_brief-candidate.txt. DO NOT send anything to Telegram, a separate verifier stage checks your claims and sends. Append your draft line to the log.

If a step fails, continue and surface the failure in the brief. Do not exit early.

Use the Read, Write, Edit, and Bash tools as needed.

---

$(cat "$BRIEF_PROMPT")"

run_stage "stage 1 draft" "$BRIEF_PROMPT_TEXT"
strip_emdash "$TODAY_FILE"
strip_emdash "$CANDIDATE"

# --- Stage 2: verify + send ---------------------------------------------------
VERIFY_PROMPT_TEXT="It is now ${NOW}. You are running unattended on Harrison's Mac Mini. The morning-brief drafter has just written today.md and the candidate digest at agents/_brief-candidate.txt. Execute the verifier workflow below: independently re-check the brief's falsifiable claims against ground truth, surgically correct today.md and the candidate where a claim is wrong, then send the corrected digest to Telegram and write the sentinel agents/_brief-sent.json plus a log line.

You are a fact-checker, not a second brief writer. Do not touch tone, priority order, or the Lens. Only correct falsifiable claims. The send gate is yours: the drafter did not send, so you must.

Use the Read, Write, Edit, and Bash tools as needed.

---

$(cat "$VERIFY_PROMPT")"

run_stage "stage 2 verify+send" "$VERIFY_PROMPT_TEXT"
strip_emdash "$TODAY_FILE"
strip_emdash "$CANDIDATE"

# --- Stage 3: fallback send ---------------------------------------------------
# If the verifier never wrote a send sentinel, it failed before sending. Send the raw
# candidate so a brief still lands, clearly tagged unverified.
if [ ! -f "$SENT_SENTINEL" ] && [ -f "$CANDIDATE" ]; then
  TOKEN=$(/usr/bin/jq -r '.telegram.botToken' "$CONFIG" 2>/dev/null)
  CHAT_ID=$(/usr/bin/jq -r '.telegram.chatId' "$CONFIG" 2>/dev/null)
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] && [ -n "$CHAT_ID" ] && [ "$CHAT_ID" != "null" ]; then
    BODY="$(cat "$CANDIDATE")

[unverified: verifier stage did not complete, claims unchecked]"
    curl -s -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
      -d "chat_id=${CHAT_ID}" \
      --data-urlencode "text=${BODY}" >> "$STDOUT_LOG" 2>> "$STDERR_LOG"
    echo "$(date '+%Y-%m-%dT%H:%M:%S%z') | morning-brief | FALLBACK send, verifier stage produced no sentinel" >> "$LOG_FILE"
  else
    echo "$(date '+%Y-%m-%dT%H:%M:%S%z') | morning-brief | FAIL, no sentinel and telegram config unreadable, nothing sent" >> "$LOG_FILE"
  fi
fi

# Exit cleanly
exit 0
