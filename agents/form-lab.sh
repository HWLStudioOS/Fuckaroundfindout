#!/bin/bash
# form-lab.sh, daemon entry point
# Runs daily at 17:00 via launchd (com.hwl.form-lab.plist)
# Manually invokable: ./form-lab.sh

set -Eeuo pipefail

HWL_META_DIR="${HWL_META_DIR:-/Users/harrison/HWL META}"
PROMPT_FILE="$HWL_META_DIR/agents/form-lab.md"
LEDGER_FILE="$HWL_META_DIR/content/pipeline.md"
RUNTIME_FILE="$HWL_META_DIR/agents/agent-runtime.sh"

if [ ! -f "$RUNTIME_FILE" ]; then
  echo "Agent runtime not found: $RUNTIME_FILE" >&2
  exit 69
fi

# shellcheck source=agents/agent-runtime.sh
source "$RUNTIME_FILE"
hwl_runtime_init "form-lab" "$HWL_META_DIR"

if [ ! -f "$PROMPT_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "prompt file not found: agents/form-lab.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

if [ ! -f "$LEDGER_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "test ledger not found: content/pipeline.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"
cd "$HWL_META_DIR"

hwl_claude_auth_preflight || exit $?

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the form-lab agent running unattended on Harrison's Mac Mini. Execute the workflow in agents/form-lab.md in full.

THE RULE THAT GOVERNS EVERYTHING: you never supply Harrison's subject matter. Containers only. content/system.md sets this and he has vetoed assigned topics before. If you find yourself writing that Harrison should make something about a topic, you have failed; say so instead.

First read capture/inbox.md and content/pipeline.md for Harrison-authored substance: his Telegram replies, voice-note transcripts, anything in his own words. If the bank holds unshaped substance, that is your material. If the bank is empty, do NOT look for topics; pick the single most interesting structural device you saw and ask him one line: the device, and what has he got that it would carry.

Then check content/form-watchlist.md and look at recent PUBLIC output from those creators. Public surfaces only: uploads, public posts, newsletters, RSS, official APIs. No scraping gated content, no automated account access, no circumventing platform terms. Isolate the structural DEVICE from its subject: the shape of the opening in beats, the cut pattern, how a series is framed, how the closer lands, the packaging. State the device so it could apply to a completely different subject. If you cannot state it that way you have described a post, not a device.

Then honestly test whether the best device fits the strongest capture. Most pairings will not fit. Say so rather than forcing one. When one fits, build the shape in HIS phrasing: the opening, the beat structure, what he needs to film or type and how long, and the target surface.

Send ONE Telegram message: the device named in a sentence, whose work it came from, the capture it would carry, the shaped opening. One pairing only, never a shortlist. Never publish. Do not touch content/creative-tests.md, that is creative-lab client work.

If a step fails, continue and surface the failure in the Telegram message. Do not exit early."

set +e
claude --print --permission-mode acceptEdits "$PROMPT" \
  >> "$HWL_JOB_STDOUT_LOG" 2>> "$HWL_JOB_STDERR_LOG"
CLAUDE_EXIT=$?
set -e

if [ "$CLAUDE_EXIT" -ne 0 ]; then
  if [ "$CLAUDE_EXIT" -eq "$HWL_EXIT_AUTH_REQUIRED" ]; then
    hwl_runtime_set_result "auth_required" "Claude authentication expired during the form-lab run"
    hwl_alert_auth_required
  else
    hwl_runtime_set_result "failed" "claude exited ${CLAUDE_EXIT}; no test proposed"
  fi
  hwl_runtime_note "RUN_FAILED" "$HWL_RUN_DETAIL"
  exit "$CLAUDE_EXIT"
fi

hwl_runtime_set_result "succeeded" "form-lab completed; see content/pipeline.md"
exit 0
