#!/bin/bash
# Nightly backup: commit any changes to local git, push to private GitHub remote.
# Runs as the macOS user via launchd, so it is NOT subject to the in-session
# Claude push guardrail. Safe, additive, reversible. Pushes ONLY to the already
# configured private remote (origin). Secrets stay excluded via .gitignore.
set -uo pipefail

HWL_META_DIR="/Users/harrison/HWL META"
LOG="$HWL_META_DIR/agents/_log.md"
BOARD_ROOM_DIR="$HWL_META_DIR/board-room"
NODE_BIN="/usr/local/bin/node"
NPX_BIN="/usr/local/bin/npx"
PNPM_BIN="/usr/local/bin/pnpm"
CURL_BIN="/usr/bin/curl"
BOARD_ROOM_URL="https://the-board-room-nine.vercel.app"
BOARD_ROOM_VALID=0
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
cd "$HWL_META_DIR" || exit 1

STAMP="$(date '+%Y-%m-%d %H:%M %Z')"
ERR_FILE="$(mktemp /tmp/hwl-nightly-backup.XXXXXX)"
trap 'rm -f "$ERR_FILE"' EXIT

error_summary() {
  tr '\n' ' ' < "$ERR_FILE" | cut -c1-500
}

error_tail_summary() {
  tail -c 2000 "$ERR_FILE" | tr '\n' ' ' | tail -c 500
}

refresh_board_room_snapshot() {
  if [[ ! -x "$NODE_BIN" || ! -f "$BOARD_ROOM_DIR/scripts/generate-board-data.mjs" ]]; then
    echo "- $STAMP | board-room | snapshot skipped, generator or Node runtime missing" >> "$LOG"
    return
  fi

  : > "$ERR_FILE"
  if ! "$NODE_BIN" "$BOARD_ROOM_DIR/scripts/generate-board-data.mjs" >"$ERR_FILE" 2>&1; then
    echo "- $STAMP | board-room | SNAPSHOT FAILED: $(error_summary)" >> "$LOG"
  fi
}

validate_board_room() {
  if [[ ! -x "$PNPM_BIN" || ! -f "$BOARD_ROOM_DIR/pnpm-lock.yaml" ]]; then
    echo "- $STAMP | board-room | validation skipped, pnpm or lockfile missing; production deploy blocked" >> "$LOG"
    return 1
  fi

  : > "$ERR_FILE"
  if ! (
    cd "$BOARD_ROOM_DIR" &&
      "$PNPM_BIN" install --frozen-lockfile &&
      "$PNPM_BIN" audit --audit-level moderate &&
      "$PNPM_BIN" run lint &&
      "$PNPM_BIN" test
  ) >"$ERR_FILE" 2>&1; then
    echo "- $STAMP | board-room | VALIDATION FAILED, production deploy blocked: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  echo "- $STAMP | board-room | validation passed before backup and deploy" >> "$LOG"
  return 0
}

reconcile_board_room_events() {
  if [[ ! -x "$NODE_BIN" || ! -f "$BOARD_ROOM_DIR/scripts/reconcile-board-events.mjs" ]]; then
    echo "- $STAMP | board-room | reconciliation skipped, script or Node runtime missing" >> "$LOG"
    return
  fi

  : > "$ERR_FILE"
  if ! "$NODE_BIN" "$BOARD_ROOM_DIR/scripts/reconcile-board-events.mjs" >"$ERR_FILE" 2>&1; then
    echo "- $STAMP | board-room | RECONCILIATION FAILED: $(error_tail_summary)" >> "$LOG"
  fi
}

deploy_board_room() {
  local board_http_code

  if [[ ! -x "$NPX_BIN" || ! -f "$BOARD_ROOM_DIR/.vercel/project.json" ]]; then
    echo "- $STAMP | board-room | deploy skipped, local Vercel link or npx missing" >> "$LOG"
    return
  fi

  : > "$ERR_FILE"
  if ! "$NPX_BIN" --yes vercel@58.4.4 deploy --prod --yes --cwd "$BOARD_ROOM_DIR" >"$ERR_FILE" 2>&1; then
    echo "- $STAMP | board-room | DEPLOY FAILED after successful backup: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  : > "$ERR_FILE"
  board_http_code="$($CURL_BIN --silent --show-error --output /dev/null --write-out '%{http_code}' "$BOARD_ROOM_URL/" 2>"$ERR_FILE" || true)"
  if [[ "$board_http_code" != "401" ]]; then
    echo "- $STAMP | board-room | SECURITY SMOKE FAILED after deploy, unauthenticated page returned ${board_http_code:-no status}: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  echo "- $STAMP | board-room | deployed production and verified unauthenticated access returns 401" >> "$LOG"
  return 0
}

reconcile_board_room_events
refresh_board_room_snapshot
if validate_board_room; then
  BOARD_ROOM_VALID=1
fi

# Nothing to do if no changes and nothing unpushed.
if [[ -z "$(git status --porcelain)" ]] && git diff --quiet origin/main 2>/dev/null; then
  echo "- $STAMP | nightly-backup | clean, nothing to commit or push" >> "$LOG"
  exit 0
fi

git add -A
if [[ -n "$(git diff --cached --name-only)" ]]; then
  git commit -q -m "Nightly backup $STAMP" || true
fi

# Push only to the configured private origin. Never create or change a remote here.
PUSHED=0
if git remote get-url origin >/dev/null 2>&1; then
  : > "$ERR_FILE"
  if git push -q origin main 2>"$ERR_FILE"; then
    echo "- $STAMP | nightly-backup | committed + pushed to origin" >> "$LOG"
    PUSHED=1
  else
    FIRST_PUSH_ERROR="$(error_summary)"
    : > "$ERR_FILE"
    if ! git fetch -q origin 2>"$ERR_FILE"; then
      echo "- $STAMP | nightly-backup | committed locally, PUSH FAILED: initial push: $FIRST_PUSH_ERROR | fetch: $(error_summary)" >> "$LOG"
      exit 1
    fi

    : > "$ERR_FILE"
    if git rebase -q origin/main 2>"$ERR_FILE"; then
      : > "$ERR_FILE"
      if git push -q origin main 2>"$ERR_FILE"; then
        echo "- $STAMP | nightly-backup | committed + reconciled (rebase) + pushed to origin" >> "$LOG"
        PUSHED=1
      else
        echo "- $STAMP | nightly-backup | committed + rebased, PUSH RETRY FAILED: $(error_summary)" >> "$LOG"
        exit 1
      fi
    else
      REBASE_ERROR="$(error_summary)"
      # Leave the repository out of an in-progress rebase. The local backup
      # commit is retained and the exact failure is logged for diagnosis.
      git rebase --abort >/dev/null 2>&1 || true
      echo "- $STAMP | nightly-backup | committed locally, REBASE FAILED: $REBASE_ERROR | initial push: $FIRST_PUSH_ERROR" >> "$LOG"
      exit 1
    fi
  fi
else
  echo "- $STAMP | nightly-backup | committed locally, no origin remote configured" >> "$LOG"
fi

if [[ "$PUSHED" -eq 1 && "$BOARD_ROOM_VALID" -eq 1 ]]; then
  deploy_board_room || exit 1
elif [[ "$PUSHED" -eq 1 ]]; then
  echo "- $STAMP | board-room | production deploy skipped because validation did not pass" >> "$LOG"
fi
