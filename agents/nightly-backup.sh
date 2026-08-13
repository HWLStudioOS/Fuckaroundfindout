#!/bin/bash
# Nightly backup: commit any changes to local git, push to private GitHub remote.
# Runs as the macOS user via launchd, so it is NOT subject to the in-session
# Claude push guardrail. Safe, additive, reversible. Pushes ONLY to the already
# configured private remote (origin). Secrets stay excluded via .gitignore.
set -uo pipefail
umask 077

HWL_META_DIR="/Users/harrison/HWL META"
LOG="$HWL_META_DIR/agents/_log.md"
BOARD_ROOM_DIR="$HWL_META_DIR/board-room"
NODE_BIN="/usr/local/bin/node"
PNPM_BIN="/usr/local/bin/pnpm"
CURL_BIN="/usr/bin/curl"
GITLEAKS_BIN="/opt/homebrew/bin/gitleaks"
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

# Financial and identity documents must never be committed. gitleaks matches
# credential patterns in text, so it cannot see inside a scanned bank statement
# or a filled identity form. On 12 August 2026 that blind spot let ASB bank
# statements and completed Milford KiwiSaver forms reach origin/main. This guard
# closes it by blocking on path instead of content.
#
# Scoped to document and image extensions on purpose: a Markdown note that
# mentions the Companies House confirmation statement is fine, a scanned PNG of
# a bank statement is not. Anything under private/ is blocked outright.
SENSITIVE_NAME_PATTERN='(bank|asb|starling|revolut|monzo|amex)[^/]*statement|statement[^/]*(bank|asb|starling|revolut|monzo|amex)|passport|payslip|kiwisaver|milford|driving[-_]?licence|drivers?[-_]?licen[cs]e|birth[-_]?cert|p60|p45'
SENSITIVE_EXTENSION_PATTERN='\.(png|jpe?g|pdf|heic|tiff?|webp|zip)$'

staged_sensitive_paths() {
  local staged
  staged="$(git diff --cached --name-only --diff-filter=ACMR)"
  [[ -z "$staged" ]] && return 0
  {
    printf '%s\n' "$staged" | grep -E '^private/'
    printf '%s\n' "$staged" \
      | grep -iE "$SENSITIVE_NAME_PATTERN" \
      | grep -iE "$SENSITIVE_EXTENSION_PATTERN"
  } | sort -u
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
      "$PNPM_BIN" audit --audit-level low &&
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
  local pushed_sha="$1"
  local board_api_http_code
  local board_http_code
  local deploy_root
  local deploy_worktree
  local deploy_board_dir
  local deploy_vercel_bin

  if [[ ! -x "$PNPM_BIN" || ! -f "$BOARD_ROOM_DIR/.vercel/project.json" ]]; then
    echo "- $STAMP | board-room | deploy skipped, local Vercel link or pnpm missing" >> "$LOG"
    return 1
  fi

  deploy_root="$(mktemp -d /tmp/hwl-board-deploy.XXXXXX)"
  deploy_worktree="$deploy_root/repository"
  deploy_board_dir="$deploy_worktree/board-room"

  : > "$ERR_FILE"
  if ! git worktree add --detach "$deploy_worktree" "$pushed_sha" >"$ERR_FILE" 2>&1; then
    rmdir "$deploy_root" 2>/dev/null || true
    echo "- $STAMP | board-room | DEPLOY BLOCKED, clean checkout failed: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  # HWL_BOARD_FROZEN_SNAPSHOT keeps the board generator in verify-only mode so
  # this validation cannot rewrite the tracked snapshot (generatedAt and
  # sourceCommit are stamped pre-commit and can never match a regeneration).
  : > "$ERR_FILE"
  if ! (
    cd "$deploy_board_dir" &&
      export HWL_BOARD_FROZEN_SNAPSHOT=1 &&
      "$PNPM_BIN" install --frozen-lockfile &&
      "$PNPM_BIN" audit --audit-level low &&
      "$PNPM_BIN" run lint &&
      "$PNPM_BIN" test
  ) >"$ERR_FILE" 2>&1; then
    git worktree remove --force "$deploy_worktree" >/dev/null 2>&1 || true
    rmdir "$deploy_root" 2>/dev/null || true
    echo "- $STAMP | board-room | DEPLOY BLOCKED, pushed checkout validation failed: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  if [[ -n "$(git -C "$deploy_worktree" status --porcelain)" ]]; then
    git worktree remove --force "$deploy_worktree" >/dev/null 2>&1 || true
    rmdir "$deploy_root" 2>/dev/null || true
    echo "- $STAMP | board-room | DEPLOY BLOCKED, validation changed the pushed checkout" >> "$LOG"
    return 1
  fi

  mkdir -p "$deploy_board_dir/.vercel"
  cp "$BOARD_ROOM_DIR/.vercel/project.json" "$deploy_board_dir/.vercel/project.json"
  deploy_vercel_bin="$deploy_board_dir/node_modules/.bin/vercel"
  if [[ ! -x "$deploy_vercel_bin" ]]; then
    git worktree remove --force "$deploy_worktree" >/dev/null 2>&1 || true
    rmdir "$deploy_root" 2>/dev/null || true
    echo "- $STAMP | board-room | DEPLOY BLOCKED, locked Vercel CLI is unavailable" >> "$LOG"
    return 1
  fi

  : > "$ERR_FILE"
  if ! "$deploy_vercel_bin" deploy --prod --yes --cwd "$deploy_board_dir" >"$ERR_FILE" 2>&1; then
    git worktree remove --force "$deploy_worktree" >/dev/null 2>&1 || true
    rmdir "$deploy_root" 2>/dev/null || true
    echo "- $STAMP | board-room | DEPLOY FAILED after successful backup: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  git worktree remove --force "$deploy_worktree" >/dev/null 2>&1 || true
  rmdir "$deploy_root" 2>/dev/null || true

  : > "$ERR_FILE"
  board_http_code="$($CURL_BIN --silent --show-error --dump-header "$ERR_FILE" --output /dev/null --write-out '%{http_code}' "$BOARD_ROOM_URL/" 2>>"$ERR_FILE" || true)"
  if [[ "$board_http_code" != "200" ]]; then
    echo "- $STAMP | board-room | PUBLIC READ SMOKE FAILED after deploy, page returned ${board_http_code:-no status}: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  if ! grep -qi '^x-robots-tag: .*noindex' "$ERR_FILE"; then
    echo "- $STAMP | board-room | SECURITY SMOKE FAILED after deploy, public page is missing the noindex header" >> "$LOG"
    return 1
  fi

  : > "$ERR_FILE"
  board_api_http_code="$($CURL_BIN --silent --show-error --output /dev/null --write-out '%{http_code}' "$BOARD_ROOM_URL/api/board" 2>"$ERR_FILE" || true)"
  if [[ "$board_api_http_code" != "200" ]]; then
    echo "- $STAMP | board-room | PUBLIC READ SMOKE FAILED after deploy, API returned ${board_api_http_code:-no status}: $(error_tail_summary)" >> "$LOG"
    return 1
  fi

  echo "- $STAMP | board-room | deployed production and verified passwordless page and API reads return 200 with noindex retained" >> "$LOG"
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

# Restructure Phase 2. today.md and this-week.md must not contradict each other.
# The HWL-191 flap on 9-10 August was one Linear marker in two files with
# opposite checkbox states, and the hourly sync flapped between them for a day.
# linear/lib/sync-policy.js stops that reaching Linear; this stops it reaching
# Harrison, who reads the Markdown every morning. Warn only: a contradiction is
# bad state, not a secret, so it must not block the backup of everything else.
if [[ -x "$NODE_BIN" && -f "$HWL_META_DIR/scripts/check-state-consistency.mjs" ]]; then
  : > "$ERR_FILE"
  if ! "$NODE_BIN" "$HWL_META_DIR/scripts/check-state-consistency.mjs" --quiet >"$ERR_FILE" 2>&1; then
    echo "- $STAMP | nightly-backup | STATE CONTRADICTION between today.md and this-week.md, backup continued: $(error_tail_summary)" >> "$LOG"
  fi
fi

git add -A
if [[ -n "$(git diff --cached --name-only)" ]]; then
  SENSITIVE_HITS="$(staged_sensitive_paths)"
  if [[ -n "$SENSITIVE_HITS" ]]; then
    git reset -q
    echo "- $STAMP | nightly-backup | BACKUP BLOCKED, financial or identity document staged: $(printf '%s' "$SENSITIVE_HITS" | tr '\n' ' ' | cut -c1-300)" >> "$LOG"
    exit 1
  fi

  if [[ ! -x "$GITLEAKS_BIN" ]]; then
    git reset -q
    echo "- $STAMP | nightly-backup | BACKUP BLOCKED, gitleaks is unavailable" >> "$LOG"
    exit 1
  fi

  : > "$ERR_FILE"
  if ! "$GITLEAKS_BIN" git --staged --redact --no-banner --no-color . >"$ERR_FILE" 2>&1; then
    git reset -q
    echo "- $STAMP | nightly-backup | BACKUP BLOCKED, staged secret scan failed: $(error_tail_summary)" >> "$LOG"
    exit 1
  fi

  : > "$ERR_FILE"
  if ! git commit -q -m "Nightly backup $STAMP" 2>"$ERR_FILE"; then
    git reset -q
    echo "- $STAMP | nightly-backup | COMMIT FAILED, nothing pushed or deployed: $(error_summary)" >> "$LOG"
    exit 1
  fi
fi

# Push only to the configured private origin. Never create or change a remote here.
PUSHED=0
PUSHED_SHA=""
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

if [[ "$PUSHED" -eq 1 ]]; then
  : > "$ERR_FILE"
  if ! git fetch -q origin 2>"$ERR_FILE"; then
    echo "- $STAMP | nightly-backup | DEPLOY BLOCKED, pushed commit could not be verified: $(error_summary)" >> "$LOG"
    exit 1
  fi
  PUSHED_SHA="$(git rev-parse HEAD)"
  if [[ "$PUSHED_SHA" != "$(git rev-parse origin/main)" ]]; then
    echo "- $STAMP | nightly-backup | DEPLOY BLOCKED, local HEAD does not equal origin/main" >> "$LOG"
    exit 1
  fi
fi

if [[ "$PUSHED" -eq 1 && "$BOARD_ROOM_VALID" -eq 1 ]]; then
  deploy_board_room "$PUSHED_SHA" || exit 1
elif [[ "$PUSHED" -eq 1 ]]; then
  echo "- $STAMP | board-room | production deploy skipped because validation did not pass" >> "$LOG"
fi
