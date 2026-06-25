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
  if git push -q origin main 2>/dev/null; then
    echo "- $STAMP | nightly-backup | committed + pushed to origin" >> "$LOG"
  else
    # Push rejected almost always means the branch diverged because another
    # machine pushed since the last run (non-fast-forward), NOT auth. Reconcile
    # by rebasing local backups onto the remote, then retry. The tree is already
    # clean here (we committed above), so no stash is needed.
    git fetch -q origin 2>/dev/null
    if git rebase -q origin/main 2>/dev/null && git push -q origin main 2>/dev/null; then
      echo "- $STAMP | nightly-backup | committed + reconciled (rebase) + pushed to origin" >> "$LOG"
    else
      # Genuine conflict (e.g. both machines edited capture/inbox.md). Abort so the
      # repo is left clean and the NEXT run is not corrupted by committing markers.
      git rebase --abort 2>/dev/null || true
      echo "- $STAMP | nightly-backup | committed locally, PUSH FAILED: branches diverged with conflicts, manual merge needed" >> "$LOG"
    fi
  fi
else
  echo "- $STAMP | nightly-backup | committed locally, no origin remote configured" >> "$LOG"
fi
