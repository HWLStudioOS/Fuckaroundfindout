#!/bin/bash
# creative-lab.sh, daemon entry point
# Runs daily at 17:00 via launchd (com.hwl.creative-lab.plist)
# Manually invokable: ./creative-lab.sh

set -Eeuo pipefail

HWL_META_DIR="${HWL_META_DIR:-/Users/harrison/HWL META}"
PROMPT_FILE="$HWL_META_DIR/agents/creative-lab.md"
LEDGER_FILE="$HWL_META_DIR/content/creative-tests.md"
RUNTIME_FILE="$HWL_META_DIR/agents/agent-runtime.sh"

if [ ! -f "$RUNTIME_FILE" ]; then
  echo "Agent runtime not found: $RUNTIME_FILE" >&2
  exit 69
fi

# shellcheck source=agents/agent-runtime.sh
source "$RUNTIME_FILE"
hwl_runtime_init "creative-lab" "$HWL_META_DIR"

if [ ! -f "$PROMPT_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "prompt file not found: agents/creative-lab.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

if [ ! -f "$LEDGER_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "test ledger not found: content/creative-tests.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"
cd "$HWL_META_DIR"

hwl_claude_auth_preflight || exit $?

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the creative-lab agent running unattended on Harrison's Mac Mini. Execute the workflow in agents/creative-lab.md in full.

Order matters. FIRST check content/creative-tests.md for any test with status proposed. If one exists it is awaiting Harrison's tap and you must NOT propose another; close any due results, note anything notable under the waiting entry, and stay silent unless you closed a result or the waiting test is over three days old. Then read the ledger and close any test whose signal window has passed, by checking what actually happened on the live grid and recording the verdict. Results before proposals, always.

Then run 'node scripts/client-calendar.mjs' and use ONLY its output to pick the slot. It reads each client's deployed live calendar and returns only slots that are open and in the future. Do NOT read the calendar CSVs; they are stale, 50 of 65 rows carry no status including past July dates, and a dry run on 13 August wasted itself proposing against a Thu 20 Aug slot that does not exist. The script also lists upcoming shoots: prefer a test capturable on a shoot already scheduled and name the dependency. If it returns no actionable slots, say so in one line and stop. Then, find current organic format-level evidence for that client's category, form one falsifiable hypothesis, and BUILD the actual variant for that slot: format spec, opening three seconds, caption in the client's voice, and what footage it can be built from.

Append it to content/creative-tests.md with status proposed, then send Harrison one Telegram message leading with any closed result, then the hypothesis, variant, cost, risk and what it replaces.

Hard rules, non-negotiable. One test, not a shortlist. Never publish anything; everything is one-tap gated. Never produce a reading list or a swipe file; if your output could be described as 'here are some ideas' you have failed and should say so instead. Never invent performance data. If every slot next week is already filled with committed material, say that in one line and stop. If the calendar or tone file is missing, name which and stop rather than assuming.

If a step fails, continue and surface the failure in the Telegram message. Do not exit early."

set +e
claude --print --permission-mode acceptEdits "$PROMPT" \
  >> "$HWL_JOB_STDOUT_LOG" 2>> "$HWL_JOB_STDERR_LOG"
CLAUDE_EXIT=$?
set -e

if [ "$CLAUDE_EXIT" -ne 0 ]; then
  if [ "$CLAUDE_EXIT" -eq "$HWL_EXIT_AUTH_REQUIRED" ]; then
    hwl_runtime_set_result "auth_required" "Claude authentication expired during the creative-lab run"
    hwl_alert_auth_required
  else
    hwl_runtime_set_result "failed" "claude exited ${CLAUDE_EXIT}; no test proposed"
  fi
  hwl_runtime_note "RUN_FAILED" "$HWL_RUN_DETAIL"
  exit "$CLAUDE_EXIT"
fi

hwl_runtime_set_result "succeeded" "creative-lab completed; see content/creative-tests.md"
exit 0
