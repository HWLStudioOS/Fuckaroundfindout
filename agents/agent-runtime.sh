#!/bin/bash
# Shared runtime for Claude-backed scheduled agents.
#
# This file is sourced by the job entry points. It provides:
# - a non-interactive Claude authentication preflight
# - one stdout and stderr log per job, plus the historical shared logs
# - an atomic latest-run status record under ignored runtime state
# - one truthful completion line in agents/_log.md
# - exact exit-code propagation back to launchd

umask 077

HWL_EXIT_UNAVAILABLE=69
HWL_EXIT_SOFTWARE=70
HWL_EXIT_AUTH_REQUIRED=78

hwl_runtime_timestamp() {
  date '+%Y-%m-%dT%H:%M:%S%z'
}

hwl_runtime_safe_name() {
  printf '%s' "$1" | tr -c 'A-Za-z0-9_-' '_'
}

hwl_runtime_compact_detail() {
  printf '%s' "$1" | tr '\n|' '  ' | tr -s ' '
}

hwl_runtime_note() {
  local level="$1"
  local message="$2"
  local line
  line="$(hwl_runtime_timestamp) | ${HWL_AGENT_NAME} | ${level} | $(hwl_runtime_compact_detail "$message")"
  printf '%s\n' "$line" >> "$HWL_JOB_STDERR_LOG" || true
  printf '%s\n' "$line" >> "$HWL_SHARED_STDERR_LOG" || true
  return 0
}

hwl_runtime_write_status() {
  if [ -z "${HWL_RUNTIME_PYTHON:-}" ]; then
    return 0
  fi

  if ! HWL_STATUS_PATH="$HWL_RUN_STATUS_FILE" \
      HWL_STATUS_JOB="$HWL_AGENT_NAME" \
      HWL_STATUS_RUN_ID="$HWL_RUN_ID" \
      HWL_STATUS_STARTED_AT="$HWL_RUN_STARTED_AT" \
      HWL_STATUS_FINISHED_AT="${HWL_RUN_FINISHED_AT:-}" \
      HWL_STATUS_STATE="$HWL_RUN_STATE" \
      HWL_STATUS_EXIT_CODE="$HWL_RUN_EXIT_CODE" \
      HWL_STATUS_DETAIL="$HWL_RUN_DETAIL" \
      HWL_STATUS_STDOUT_LOG="$HWL_JOB_STDOUT_LOG" \
      HWL_STATUS_STDERR_LOG="$HWL_JOB_STDERR_LOG" \
      "$HWL_RUNTIME_PYTHON" - <<'PY'
import json
import os
from pathlib import Path


path = Path(os.environ["HWL_STATUS_PATH"])
payload = {
    "job": os.environ["HWL_STATUS_JOB"],
    "run_id": os.environ["HWL_STATUS_RUN_ID"],
    "started_at": os.environ["HWL_STATUS_STARTED_AT"],
    "finished_at": os.environ["HWL_STATUS_FINISHED_AT"] or None,
    "status": os.environ["HWL_STATUS_STATE"],
    "exit_code": int(os.environ["HWL_STATUS_EXIT_CODE"]),
    "detail": os.environ["HWL_STATUS_DETAIL"],
    "stdout_log": os.environ["HWL_STATUS_STDOUT_LOG"],
    "stderr_log": os.environ["HWL_STATUS_STDERR_LOG"],
}
temporary = path.with_name(".{}.{}.tmp".format(path.name, os.getpid()))
temporary.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
os.replace(str(temporary), str(path))
PY
  then
    printf '%s | %s | WARN | could not write latest-run status to %s\n' \
      "$(hwl_runtime_timestamp)" "$HWL_AGENT_NAME" "$HWL_RUN_STATUS_FILE" \
      >> "$HWL_JOB_STDERR_LOG" || true
  fi
  return 0
}

hwl_runtime_set_result() {
  HWL_RUN_STATE="$1"
  HWL_RUN_DETAIL="$2"
}

hwl_runtime_finish() {
  local exit_code="$1"
  local audit_line
  trap - EXIT

  if [ "$HWL_RUN_STATE" = "running" ]; then
    if [ "$exit_code" -eq 0 ]; then
      HWL_RUN_STATE="succeeded"
      HWL_RUN_DETAIL="completed"
    else
      HWL_RUN_STATE="failed"
      HWL_RUN_DETAIL="wrapper exited without a more specific diagnosis"
    fi
  fi

  HWL_RUN_EXIT_CODE="$exit_code"
  HWL_RUN_FINISHED_AT="$(hwl_runtime_timestamp)"
  hwl_runtime_write_status

  audit_line="${HWL_RUN_FINISHED_AT} | ${HWL_AGENT_NAME} | $(printf '%s' "$HWL_RUN_STATE" | tr '[:lower:]' '[:upper:]') | exit=${exit_code}; run=${HWL_RUN_ID}; $(hwl_runtime_compact_detail "$HWL_RUN_DETAIL"); logs=agents/logs/${HWL_AGENT_NAME}.stdout.log,agents/logs/${HWL_AGENT_NAME}.stderr.log"
  printf '%s\n' "$audit_line" >> "$HWL_AGENT_AUDIT_LOG" || true

  if [ "$exit_code" -ne 0 ]; then
    hwl_runtime_note "EXIT" "${HWL_RUN_STATE}, exit ${exit_code}: ${HWL_RUN_DETAIL}"
  fi
  exit "$exit_code"
}

hwl_runtime_init() {
  local agent_name="$1"
  local repository_root="$2"

  case "$agent_name" in
    ''|*[!A-Za-z0-9_-]*)
      printf 'Invalid agent name: %s\n' "$agent_name" >&2
      return 64
      ;;
  esac

  HWL_AGENT_NAME="$agent_name"
  HWL_META_DIR="$repository_root"
  HWL_AGENT_LOG_DIR="${HWL_AGENT_LOG_DIR:-$HWL_META_DIR/agents/logs}"
  HWL_AGENT_STATE_DIR="${HWL_AGENT_STATE_DIR:-$HWL_META_DIR/.jarvis-runtime/agent-runs/$HWL_AGENT_NAME}"
  HWL_AGENT_AUDIT_LOG="${HWL_AGENT_AUDIT_LOG:-$HWL_META_DIR/agents/_log.md}"
  HWL_SHARED_STDOUT_LOG="${HWL_SHARED_STDOUT_LOG:-$HWL_META_DIR/agents/_stdout.log}"
  HWL_SHARED_STDERR_LOG="${HWL_SHARED_STDERR_LOG:-$HWL_META_DIR/agents/_stderr.log}"
  HWL_JOB_STDOUT_LOG="$HWL_AGENT_LOG_DIR/${HWL_AGENT_NAME}.stdout.log"
  HWL_JOB_STDERR_LOG="$HWL_AGENT_LOG_DIR/${HWL_AGENT_NAME}.stderr.log"
  HWL_RUN_STATUS_FILE="$HWL_AGENT_STATE_DIR/latest.json"
  HWL_RUNTIME_PYTHON="${HWL_RUNTIME_PYTHON:-$(command -v python3 2>/dev/null || true)}"
  HWL_RUN_STARTED_AT="$(hwl_runtime_timestamp)"
  HWL_RUN_ID="$(date '+%Y%m%dT%H%M%S%z')-$$"
  HWL_RUN_FINISHED_AT=""
  HWL_RUN_STATE="running"
  HWL_RUN_EXIT_CODE=0
  HWL_RUN_DETAIL="started"

  mkdir -p "$HWL_AGENT_LOG_DIR" "$HWL_AGENT_STATE_DIR"
  touch "$HWL_AGENT_AUDIT_LOG" "$HWL_SHARED_STDOUT_LOG" "$HWL_SHARED_STDERR_LOG" \
    "$HWL_JOB_STDOUT_LOG" "$HWL_JOB_STDERR_LOG"
  hwl_runtime_write_status
  hwl_runtime_note "START" "run ${HWL_RUN_ID}"
  trap 'hwl_runtime_finish $?' EXIT
}

hwl_resolve_claude() {
  if [ -n "${HWL_CLAUDE_BIN:-}" ]; then
    if [ -x "$HWL_CLAUDE_BIN" ]; then
      HWL_RESOLVED_CLAUDE_BIN="$HWL_CLAUDE_BIN"
      return 0
    fi
    hwl_runtime_set_result "runtime_unavailable" "configured Claude executable is not executable"
    hwl_runtime_note "RUNTIME_UNAVAILABLE" "$HWL_RUN_DETAIL"
    return "$HWL_EXIT_UNAVAILABLE"
  fi

  HWL_RESOLVED_CLAUDE_BIN="$(command -v claude 2>/dev/null || true)"
  if [ -z "$HWL_RESOLVED_CLAUDE_BIN" ]; then
    hwl_runtime_set_result "runtime_unavailable" "Claude CLI is not on PATH"
    hwl_runtime_note "RUNTIME_UNAVAILABLE" "$HWL_RUN_DETAIL"
    return "$HWL_EXIT_UNAVAILABLE"
  fi
  return 0
}

hwl_claude_auth_preflight() {
  local auth_output
  local auth_command_exit
  local auth_parse_exit
  local auth_method

  hwl_resolve_claude || return $?
  if [ -z "$HWL_RUNTIME_PYTHON" ]; then
    hwl_runtime_set_result "auth_preflight_failed" "python3 is unavailable, so Claude auth status could not be parsed safely"
    hwl_runtime_note "AUTH_PREFLIGHT_FAILED" "$HWL_RUN_DETAIL"
    return "$HWL_EXIT_SOFTWARE"
  fi

  if auth_output=$("$HWL_RESOLVED_CLAUDE_BIN" auth status --json 2>&1); then
    auth_command_exit=0
  else
    auth_command_exit=$?
  fi

  if auth_method=$(printf '%s' "$auth_output" | "$HWL_RUNTIME_PYTHON" -c '
import json
import sys

try:
    payload = json.load(sys.stdin)
except (TypeError, ValueError):
    raise SystemExit(2)
if not isinstance(payload, dict) or not isinstance(payload.get("loggedIn"), bool):
    raise SystemExit(2)
print(payload.get("authMethod") or "unknown")
raise SystemExit(0 if payload["loggedIn"] else 3)
'); then
    auth_parse_exit=0
  else
    auth_parse_exit=$?
  fi

  if [ "$auth_parse_exit" -eq 3 ]; then
    hwl_runtime_set_result "auth_required" "Claude CLI is not authenticated. Harrison must run 'claude auth login' interactively, then verify 'claude auth status --text'."
    hwl_runtime_note "AUTH_REQUIRED" "$HWL_RUN_DETAIL"
    return "$HWL_EXIT_AUTH_REQUIRED"
  fi

  if [ "$auth_parse_exit" -ne 0 ] || [ "$auth_command_exit" -ne 0 ]; then
    hwl_runtime_set_result "auth_preflight_failed" "Claude auth status did not return a valid logged-in result. No agent work was attempted."
    hwl_runtime_note "AUTH_PREFLIGHT_FAILED" "$HWL_RUN_DETAIL"
    return "$HWL_EXIT_SOFTWARE"
  fi

  hwl_runtime_note "AUTH_OK" "Claude authentication available via ${auth_method}"
  return 0
}

hwl_append_claude_output() {
  local stage="$1"
  local stdout_file="$2"
  local stderr_file="$3"
  local header
  header="=== ${HWL_AGENT_NAME} ${stage} at $(date) | run ${HWL_RUN_ID} ==="

  if ! {
    printf '\n%s\n' "$header"
    cat "$stdout_file"
  } >> "$HWL_JOB_STDOUT_LOG"; then
    return 1
  fi
  if ! {
    printf '\n%s\n' "$header"
    cat "$stdout_file"
  } >> "$HWL_SHARED_STDOUT_LOG"; then
    return 1
  fi

  if [ -s "$stderr_file" ]; then
    if ! {
      printf '\n%s\n' "$header"
      cat "$stderr_file"
    } >> "$HWL_JOB_STDERR_LOG"; then
      return 1
    fi
    if ! {
      printf '\n%s\n' "$header"
      cat "$stderr_file"
    } >> "$HWL_SHARED_STDERR_LOG"; then
      return 1
    fi
  fi
  return 0
}

hwl_run_claude() {
  local stage="$1"
  local prompt="$2"
  local safe_stage
  local stdout_file
  local stderr_file
  local claude_exit
  local failure_text

  hwl_claude_auth_preflight || return $?

  safe_stage="$(hwl_runtime_safe_name "$stage")"
  stdout_file="$HWL_AGENT_STATE_DIR/.${HWL_RUN_ID}.${safe_stage}.stdout.tmp"
  stderr_file="$HWL_AGENT_STATE_DIR/.${HWL_RUN_ID}.${safe_stage}.stderr.tmp"
  : > "$stdout_file"
  : > "$stderr_file"

  if "$HWL_RESOLVED_CLAUDE_BIN" \
      --model "${HWL_CLAUDE_MODEL:-claude-sonnet-5}" \
      --print \
      --permission-mode auto \
      --add-dir "$HWL_META_DIR" \
      > "$stdout_file" 2> "$stderr_file" <<< "$prompt"; then
    claude_exit=0
  else
    claude_exit=$?
  fi

  if ! hwl_append_claude_output "$stage" "$stdout_file" "$stderr_file"; then
    hwl_runtime_set_result "logging_failed" "could not persist Claude output for ${stage}"
    hwl_runtime_note "LOGGING_FAILED" "$HWL_RUN_DETAIL"
    rm -f "$stdout_file" "$stderr_file"
    return "$HWL_EXIT_SOFTWARE"
  fi

  if [ "$claude_exit" -ne 0 ]; then
    failure_text="$(cat "$stdout_file" "$stderr_file")"
    if printf '%s' "$failure_text" | grep -Eiq \
      'failed to authenticate|oauth session expired|could not be refreshed|not logged in|authentication required'; then
      hwl_runtime_set_result "auth_required" "Claude authentication expired after preflight during ${stage}. Harrison must run 'claude auth login' interactively."
      hwl_runtime_note "AUTH_REQUIRED" "$HWL_RUN_DETAIL"
      rm -f "$stdout_file" "$stderr_file"
      return "$HWL_EXIT_AUTH_REQUIRED"
    fi

    hwl_runtime_set_result "agent_failed" "Claude exited ${claude_exit} during ${stage}"
    hwl_runtime_note "AGENT_FAILED" "$HWL_RUN_DETAIL"
    rm -f "$stdout_file" "$stderr_file"
    return "$claude_exit"
  fi

  rm -f "$stdout_file" "$stderr_file"
  return 0
}
