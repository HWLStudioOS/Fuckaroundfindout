#!/bin/bash
# content-engine.sh, daemon entry point
# Runs Mondays at 07:00 via launchd (com.hwl.content-engine.plist)
# Manually invokable: ./content-engine.sh

set -Eeuo pipefail

HWL_META_DIR="${HWL_META_DIR:-/Users/harrison/HWL META}"
PROMPT_FILE="$HWL_META_DIR/agents/content-engine.md"
LOG_FILE="$HWL_META_DIR/agents/_log.md"
RUNTIME_FILE="$HWL_META_DIR/agents/agent-runtime.sh"

if [ ! -f "$RUNTIME_FILE" ]; then
  echo "Agent runtime not found: $RUNTIME_FILE" >&2
  exit 69
fi

# shellcheck source=agents/agent-runtime.sh
source "$RUNTIME_FILE"
hwl_runtime_init "content-engine" "$HWL_META_DIR"

if [ ! -f "$PROMPT_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "prompt file not found: agents/content-engine.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

# Ensure PATH includes Homebrew + Claude
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"

cd "$HWL_META_DIR"

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the content-engine agent running unattended on Harrison's Mac Mini. Execute the workflow described below in full: read every context file listed in the agent prompt, find the strongest Harrison-authored capture in capture/inbox.md (his own Telegram replies and voice-note transcripts, per the substance rule), draft this week's content package from his words, write it to content/pipeline.md, push it to Telegram for Harrison to review.

If there is no Harrison-authored capture from the past 7 days, send the one-line empty-bank message from the substance rule and stop. Article summaries and discovery-scan items are never substance.

If a step fails, continue and surface the failure in the Telegram message. Do not exit early.

Use Read, Write, Edit, and Bash tools as needed. The Telegram bot token + chat ID live in /Users/harrison/HWL META/.config/telegram.config.json.

CRITICAL: NO EM DASHES. Replace any em dash with a comma, full stop, or rephrase. The script post-processes as a safety net but cleaner LLM-side prose is better.

---

$(cat "$PROMPT_FILE")"

# The shared runtime checks auth before any prompt work, captures per-job logs and
# propagates Claude's exit status back to launchd.
hwl_run_claude "content package" "$PROMPT"

# Shell-side success record. The 22 and 29 Jun runs completed but the model skipped its
# _log.md append, leaving zero evidence a run happened. Failed runs exit before this line.
echo "$(date '+%Y-%m-%dT%H:%M:%S%z') | content-engine | content package completed (full output in agents/logs/content-engine.stdout.log)" >> "$LOG_FILE"

# Post-process: kill any em dashes that slipped through into files the agent typically writes
for f in "$HWL_META_DIR/content/captions/this-week.md" \
         "$HWL_META_DIR/content/this-week-script.md" \
         "$HWL_META_DIR/agents/_log.md"; do
  if [ -f "$f" ]; then
    perl -CSD -i -pe 's/\xe2\x80\x94/,/g' "$f"
  fi
done

hwl_runtime_set_result "succeeded" "Claude completed, run evidence recorded and output post-processing finished"
exit 0
