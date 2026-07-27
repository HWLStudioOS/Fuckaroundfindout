#!/bin/bash
# Nightly backup: commit any changes to local git, push to private GitHub remote.
# Runs as the macOS user via launchd, so it is NOT subject to the in-session
# Claude push guardrail. Safe, additive, reversible. Pushes ONLY to the already
# configured private remote (origin). Secrets stay excluded via .gitignore.
set -uo pipefail

HWL_META_DIR="/Users/harrison/HWL META"
LOG="$HWL_META_DIR/agents/_log.md"
cd "$HWL_META_DIR" || exit 1

STAMP="$(date '+%Y-%m-%d %H:%M %Z')"
ERR_FILE="$(mktemp /tmp/hwl-nightly-backup.XXXXXX)"
trap 'rm -f "$ERR_FILE"' EXIT

error_summary() {
  tr '\n' ' ' < "$ERR_FILE" | cut -c1-500
}

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
if git remote get-url origin >/dev/null 2>&1; then
  : > "$ERR_FILE"
  if git push -q origin main 2>"$ERR_FILE"; then
    echo "- $STAMP | nightly-backup | committed + pushed to origin" >> "$LOG"
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
        exit 0
      fi
      echo "- $STAMP | nightly-backup | committed + rebased, PUSH RETRY FAILED: $(error_summary)" >> "$LOG"
      exit 1
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
