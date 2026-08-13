#!/bin/bash
# pattern-lab.sh, daemon entry point
# Runs daily at 17:00 via launchd (com.hwl.pattern-lab.plist)
# Manually invokable: ./pattern-lab.sh

set -Eeuo pipefail

HWL_META_DIR="${HWL_META_DIR:-/Users/harrison/HWL META}"
PROMPT_FILE="$HWL_META_DIR/agents/pattern-lab.md"
LEDGER_FILE="$HWL_META_DIR/health/observations.md"
RUNTIME_FILE="$HWL_META_DIR/agents/agent-runtime.sh"

if [ ! -f "$RUNTIME_FILE" ]; then
  echo "Agent runtime not found: $RUNTIME_FILE" >&2
  exit 69
fi

# shellcheck source=agents/agent-runtime.sh
source "$RUNTIME_FILE"
hwl_runtime_init "pattern-lab" "$HWL_META_DIR"

if [ ! -f "$PROMPT_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "prompt file not found: agents/pattern-lab.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

if [ ! -f "$LEDGER_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "test ledger not found: health/observations.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"
cd "$HWL_META_DIR"

hwl_claude_auth_preflight || exit $?

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the pattern-lab agent running unattended on Harrison's Mac Mini. Execute the workflow in agents/pattern-lab.md in full.

THE BOUNDARY, FIRST: you are not a coach. You never prescribe a session, a load, a rest day, or tell him to back off or push. You never edit health/training-plan.md; that is Harrison's file. He has an ITB and patellar history and a real race calendar, so an agent guessing at training changes could do actual harm. You produce an observation with numbers attached so HE can decide.

First read health/observations.md and close any observation whose prediction window has passed: did it hold or break, and what did it teach. Results before new observations.

Then read 4 to 8 weeks from health/history.json and health/data/, and compare the shape against the block intent in health/training-plan.md. Look for sessions repeatedly coming in under or over prescription and where in the session it happens, readiness or HRV trending against load rather than with it, sleep debt accumulating, and anything that changed direction in the last fortnight.

Surface ONE observation, the most load-bearing, stated so it could be wrong: across this period, this measured pattern with the numbers, and if the plain reading is right I would expect this specific thing within this window. ALWAYS include the counter-read, the innocent explanation, and always state the sample size. Three data points is a coincidence with ambition.

Name the cheapest thing that would confirm or kill it, usually watching the next two sessions of that type. Never 'do this instead'. If a pattern looks clinically relevant, say it is worth qualified eyes and stop rather than inventing a mechanism.

Append to health/observations.md and send ONE Telegram message leading with any closed observation. If Garmin has a gap say the gap is there; a missing day is not a zero.

If a step fails, continue and surface the failure in the Telegram message. Do not exit early."

set +e
claude --print --permission-mode acceptEdits "$PROMPT" \
  >> "$HWL_JOB_STDOUT_LOG" 2>> "$HWL_JOB_STDERR_LOG"
CLAUDE_EXIT=$?
set -e

if [ "$CLAUDE_EXIT" -ne 0 ]; then
  if [ "$CLAUDE_EXIT" -eq "$HWL_EXIT_AUTH_REQUIRED" ]; then
    hwl_runtime_set_result "auth_required" "Claude authentication expired during the pattern-lab run"
    hwl_alert_auth_required
  else
    hwl_runtime_set_result "failed" "claude exited ${CLAUDE_EXIT}; no test proposed"
  fi
  hwl_runtime_note "RUN_FAILED" "$HWL_RUN_DETAIL"
  exit "$CLAUDE_EXIT"
fi

hwl_runtime_set_result "succeeded" "pattern-lab completed; see health/observations.md"
exit 0
