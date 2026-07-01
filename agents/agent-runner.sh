#!/bin/bash
# agent-runner.sh <agent-name>
# Generic dispatcher for scheduled daemon agents.
# Each launchd job invokes this with the agent name. The agent's prompt
# lives in agents/<name>.md. Output is logged, em dashes are stripped post-hoc.

set -e

AGENT_NAME="$1"
if [ -z "$AGENT_NAME" ]; then
  echo "Usage: agent-runner.sh <agent-name>"
  exit 1
fi

HWL_META_DIR="/Users/harrison/HWL META"
PROMPT_FILE="$HWL_META_DIR/agents/${AGENT_NAME}.md"
STDOUT_LOG="$HWL_META_DIR/agents/_stdout.log"
STDERR_LOG="$HWL_META_DIR/agents/_stderr.log"

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Prompt file not found: $PROMPT_FILE" >> "$STDERR_LOG"
  exit 1
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"

cd "$HWL_META_DIR"

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the ${AGENT_NAME} agent running unattended on Harrison's Mac Mini. Execute your workflow described below in full. Use Read, Write, Edit, and Bash tools as needed. Telegram bot token + chat ID live in /Users/harrison/HWL META/.config/telegram.config.json.

CRITICAL: NO EM DASHES. Replace any em dash (,) with a comma, full stop, or rephrase. The script post-processes as a safety net but cleaner LLM-side prose is better.

If a data source is unreachable (MCP not wired, file not present), note it and continue. Do not block on a single broken integration.

---

$(cat "$PROMPT_FILE")"

{
  echo ""
  echo "=== ${AGENT_NAME} run at $(date) ==="
  echo "$PROMPT" | claude \
    --model claude-sonnet-5 \
    --print \
    --permission-mode bypassPermissions \
    --add-dir "$HWL_META_DIR"
} >> "$STDOUT_LOG" 2>> "$STDERR_LOG"

# Em dash safety net across files agents typically write
for f in "$HWL_META_DIR/today.md" \
         "$HWL_META_DIR/capture/inbox.md" \
         "$HWL_META_DIR/capture/orders.md" \
         "$HWL_META_DIR/money/weekly.md" \
         "$HWL_META_DIR/agents/_evening-log.md" \
         "$HWL_META_DIR/campaigns/golf-clubs.md"; do
  if [ -f "$f" ]; then
    perl -CSD -i -pe 's/\xe2\x80\x94/,/g' "$f"
  fi
done

exit 0
