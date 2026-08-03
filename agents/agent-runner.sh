#!/bin/bash
# agent-runner.sh <agent-name>
# Generic dispatcher for scheduled daemon agents.
# Each launchd job invokes this with the agent name. The agent's prompt
# lives in agents/<name>.md. Output is logged, em dashes are stripped post-hoc.

set -Eeuo pipefail

AGENT_NAME="${1:-}"
if [ -z "$AGENT_NAME" ]; then
  echo "Usage: agent-runner.sh <agent-name>"
  exit 64
fi

case "$AGENT_NAME" in
  ''|*[!A-Za-z0-9_-]*)
    echo "Invalid agent name: $AGENT_NAME" >&2
    exit 64
    ;;
esac

HWL_META_DIR="${HWL_META_DIR:-/Users/harrison/HWL META}"
PROMPT_FILE="$HWL_META_DIR/agents/${AGENT_NAME}.md"
RUNTIME_FILE="$HWL_META_DIR/agents/agent-runtime.sh"

if [ ! -f "$RUNTIME_FILE" ]; then
  echo "Agent runtime not found: $RUNTIME_FILE" >&2
  exit 69
fi

# shellcheck source=agents/agent-runtime.sh
source "$RUNTIME_FILE"
hwl_runtime_init "$AGENT_NAME" "$HWL_META_DIR"

if [ ! -f "$PROMPT_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "prompt file not found: agents/${AGENT_NAME}.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"

cd "$HWL_META_DIR"

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the ${AGENT_NAME} agent running unattended on Harrison's Mac Mini. Execute your workflow described below in full. Use Read, Write, Edit, and Bash tools as needed. Telegram bot token + chat ID live in /Users/harrison/HWL META/.config/telegram.config.json.

CRITICAL: NO EM DASHES. Replace any em dash (,) with a comma, full stop, or rephrase. The script post-processes as a safety net but cleaner LLM-side prose is better.

If a data source is unreachable (MCP not wired, file not present), note it and continue. Do not block on a single broken integration.

---

$(cat "$PROMPT_FILE")"

hwl_run_claude "run" "$PROMPT"

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

hwl_runtime_set_result "succeeded" "Claude completed and output post-processing finished"
exit 0
