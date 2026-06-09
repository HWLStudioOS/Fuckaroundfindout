#!/bin/bash
# content-engine.sh, daemon entry point
# Runs Mondays at 07:00 via launchd (com.hwl.content-engine.plist)
# Manually invokable: ./content-engine.sh

set -e

HWL_META_DIR="/Users/harrison/HWL META"
PROMPT_FILE="$HWL_META_DIR/agents/content-engine.md"
LOG_FILE="$HWL_META_DIR/agents/_log.md"
STDOUT_LOG="$HWL_META_DIR/agents/_stdout.log"
STDERR_LOG="$HWL_META_DIR/agents/_stderr.log"

# Ensure PATH includes Homebrew + Claude
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"

cd "$HWL_META_DIR"

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the content-engine agent running unattended on Harrison's Mac Mini. Execute the workflow described below in full: read every context file listed in the agent prompt, find the strongest unposted idea in capture/inbox.md, draft this week's content package, push it to Telegram for Harrison to review.

If capture/inbox.md is empty or has fewer than 3 candidate ideas, send the inbox-dry message instead of inventing one.

If a step fails, continue and surface the failure in the Telegram message. Do not exit early.

Use Read, Write, Edit, and Bash tools as needed. The Telegram bot token + chat ID live in /Users/harrison/HWL META/.config/telegram.config.json.

CRITICAL: NO EM DASHES. Replace any em dash with a comma, full stop, or rephrase. The script post-processes as a safety net but cleaner LLM-side prose is better.

---

$(cat "$PROMPT_FILE")"

# Run Claude in print mode with Sonnet 4.6
{
  echo ""
  echo "=== content-engine.sh run at $(date) ==="
  echo "$PROMPT" | claude \
    --model claude-sonnet-4-6 \
    --print \
    --permission-mode bypassPermissions \
    --add-dir "$HWL_META_DIR"
} >> "$STDOUT_LOG" 2>> "$STDERR_LOG"

# Post-process: kill any em dashes that slipped through into files the agent typically writes
for f in "$HWL_META_DIR/content/captions/this-week.md" \
         "$HWL_META_DIR/content/this-week-script.md" \
         "$HWL_META_DIR/agents/_log.md"; do
  if [ -f "$f" ]; then
    perl -CSD -i -pe 's/\xe2\x80\x94/,/g' "$f"
  fi
done

exit 0
