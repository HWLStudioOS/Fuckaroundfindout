#!/bin/bash
# arsenal-watch.sh, daemon entry point
# Runs daily at 08:15 via launchd (com.hwl.arsenal-watch.plist)
# Manually invokable: ./arsenal-watch.sh

set -Eeuo pipefail

HWL_META_DIR="${HWL_META_DIR:-/Users/harrison/HWL META}"
PROMPT_FILE="$HWL_META_DIR/agents/arsenal-watch.md"
STATE_FILE="$HWL_META_DIR/life/arsenal.md"
RUNTIME_FILE="$HWL_META_DIR/agents/agent-runtime.sh"

if [ ! -f "$RUNTIME_FILE" ]; then
  echo "Agent runtime not found: $RUNTIME_FILE" >&2
  exit 69
fi

# shellcheck source=agents/agent-runtime.sh
source "$RUNTIME_FILE"
hwl_runtime_init "arsenal-watch" "$HWL_META_DIR"

if [ ! -f "$PROMPT_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "prompt file not found: agents/arsenal-watch.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

if [ ! -f "$STATE_FILE" ]; then
  hwl_runtime_set_result "configuration_error" "state file not found: life/arsenal.md"
  hwl_runtime_note "CONFIGURATION_ERROR" "$HWL_RUN_DETAIL"
  exit 66
fi

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/Users/harrison/.local/bin:$PATH"
cd "$HWL_META_DIR"

# better-email reads EMAIL_CREDENTIALS via ${HWL_EMAIL_CREDENTIALS} in .mcp.json.
# The secrets file is gitignored. Absent credentials degrade the run to public
# sources rather than failing it, because arsenal.com and @AFCBallots carry the
# ballot data and the inbox is only a backstop.
EMAIL_ENV_FILE="$HWL_META_DIR/.secrets/email.env"
if [ -f "$EMAIL_ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a; source "$EMAIL_ENV_FILE"; set +a
  hwl_runtime_note "EMAIL_CREDS_LOADED" "better-email credentials sourced from .secrets/email.env"
else
  hwl_runtime_note "EMAIL_CREDS_ABSENT" "no .secrets/email.env; running on public sources only"
fi

hwl_claude_auth_preflight || exit $?

# The agent writes its one outbound message here; the wrapper sends it after the
# run, because Claude under acceptEdits cannot curl.
OUTBOX_REL="agents/outbox/arsenal-watch-$(date +%F).md"
OUTBOX_FILE="$HWL_META_DIR/$OUTBOX_REL"
mkdir -p "$HWL_META_DIR/agents/outbox"

NOW=$(date '+%A %d %B %Y at %H:%M %Z')

PROMPT="It is now ${NOW}. You are the arsenal-watch agent running unattended on Harrison's Mac Mini. Execute the workflow in agents/arsenal-watch.md in full.

THE BOUNDARY, FIRST: you never enter a ballot, never buy a ticket, never touch Ticket Exchange checkout, and never log in to the Arsenal account. Arsenal work with Ticketmaster to block bot software and require supporters to prove they are not bots, so an automated purchase risks the membership itself. You read public pages and email, you alert, Harrison acts.

Run the renewal guard FIRST, before any ballot work. Continuous membership holds a Silver waiting list position commonly quoted at 15 to 20 years, and a lapsed renewal resets it to zero. That outranks every ballot. Check the membership state table in life/arsenal.md, and search hazza.living@gmail.com via the better-email MCP server for renewal notices, failed payment notices and card expiry warnings. If the better-email server is unavailable, say so in the message and continue on public sources; do not fail the run.

Then find open ballots: arsenal.com first as the authority, @AFCBallots on X as the richer trigger, the inbox as backstop. For each, extract fixture, open time, close deadline, result dates and price bands. The close deadline is the load-bearing field because the ballot is a random draw and entering early confers no advantage. If you cannot find a deadline, say so rather than guessing it.

Create calendar holds for each open ballot, one spanning the window and one twelve hours before the deadline, both with alarms. Calendar holds are auto-execute under CLAUDE.md. Check for an existing hold on that fixture first and do not duplicate.

Append one line per ballot to the Ballot log in life/arsenal.md, strictly between the BALLOT LOG START and BALLOT LOG END markers. Everything above those markers is Harrison's and you must not touch it. If the fixture table still carries the UNVERIFIED marker, rebuild it from arsenal.com and put the proposed replacement in the outbox message for Harrison to paste; do not edit the table yourself.

Then write ONE message to ${OUTBOX_REL}, overwriting whatever is there, ordered: renewal and card risk first, then ballots closing within 24 hours, then newly open ballots, then results, then any proposed fixture table.

If nothing is open, no renewal risk exists and nothing resolved, write NO file at all. Silence is correct. A daily no-news push trains him to ignore this channel, and it needs to still work on the day a renewal payment fails.

The wrapper sends the outbox file to Telegram after you exit, so do not attempt any send yourself and do not call curl. If a step fails, continue and surface the failure in the message. Do not exit early."

set +e
claude --print --permission-mode acceptEdits "$PROMPT" \
  >> "$HWL_JOB_STDOUT_LOG" 2>> "$HWL_JOB_STDERR_LOG"
CLAUDE_EXIT=$?
set -e

if [ "$CLAUDE_EXIT" -ne 0 ]; then
  if [ "$CLAUDE_EXIT" -eq "$HWL_EXIT_AUTH_REQUIRED" ]; then
    hwl_runtime_set_result "auth_required" "Claude authentication expired during the arsenal-watch run"
    hwl_alert_auth_required
  else
    hwl_runtime_set_result "failed" "claude exited ${CLAUDE_EXIT}; ballot state not refreshed"
  fi
  hwl_runtime_note "RUN_FAILED" "$HWL_RUN_DETAIL"
  exit "$CLAUDE_EXIT"
fi

if [ -s "$OUTBOX_FILE" ]; then
  if hwl_send_telegram "$(cat "$OUTBOX_FILE")"; then
    hwl_runtime_note "TELEGRAM_SENT" "outbox message delivered from ${OUTBOX_REL}"
    hwl_runtime_set_result "succeeded" "arsenal-watch completed; message sent from ${OUTBOX_REL}"
  else
    hwl_runtime_note "TELEGRAM_PARKED" "send failed; message parked at ${OUTBOX_REL}"
    hwl_runtime_set_result "succeeded" "arsenal-watch completed; send failed, message parked at ${OUTBOX_REL}"
  fi
else
  hwl_runtime_note "NO_OUTBOX_MESSAGE" "nothing open, no renewal risk, nothing resolved; silence is the designed output"
  hwl_runtime_set_result "succeeded" "arsenal-watch completed; quiet day, no message"
fi
exit 0
