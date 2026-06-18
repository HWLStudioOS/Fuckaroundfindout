#!/bin/bash
# morning-brief.sh, daemon entry point
# Runs at 06:30 weekdays via launchd (com.hwl.morning-brief.plist)
# Manually invokable: ./morning-brief.sh

set -e

HWL_META_DIR="/Users/harrison/HWL META"
PROMPT_FILE="$HWL_META_DIR/agents/morning-brief.md"
LOG_FILE="$HWL_META_DIR/agents/_log.md"
STDOUT_LOG="$HWL_META_DIR/agents/_stdout.log"
STDERR_LOG="$HWL_META_DIR/agents/_stderr.log"

# Ensure PATH includes Homebrew + Claude
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"

cd "$HWL_META_DIR"

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

PROMPT="It is now ${NOW}. You are running unattended on Harrison's Mac Mini. Execute the morning brief workflow described below in full: read every listed context file, pull whatever live data you can reach, write today.md, send the Telegram digest, append to the log.

If a step fails, continue and surface the failure in the brief. Do not exit early.

Use the Read, Write, Edit, and Bash tools as needed. The bot token + chat ID live in /Users/harrison/HWL META/.config/telegram.config.json.

---

$(cat "$PROMPT_FILE")"

# Run Claude in print mode with Sonnet 4.6 for daemon work
{
  echo ""
  echo "=== morning-brief.sh run at $(date) ==="
  echo "$PROMPT" | claude \
    --model claude-sonnet-4-6 \
    --print \
    --permission-mode bypassPermissions \
    --add-dir "$HWL_META_DIR"
} >> "$STDOUT_LOG" 2>> "$STDERR_LOG"

# Post-process: kill any em dashes that slipped through the prompt
# Replaces ", " (spaced em dash) with ", " and bare "," with ","
TODAY_FILE="$HWL_META_DIR/today.md"
if [ -f "$TODAY_FILE" ]; then
  perl -CSD -i -pe 's/\xe2\x80\x94/,/g' "$TODAY_FILE"
fi

# Exit cleanly
exit 0
