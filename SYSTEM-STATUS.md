# System Status

Current engineering handoff for Harrison, Claude, and Codex. Read this on session start. Update it only when system architecture, rollout state, automation ownership, or safety boundaries change. Daily business state stays in `today.md` and the domain files.

Last updated: 27 July 2026

## Operating model

- Claude is the currently deployed operator. It handles Telegram and scheduled workflows running through launchd on the Mac mini.
- Codex is the engineer and auditor. It develops in a separate worktree or branch, runs tests and diagnostics, then merges reviewed commits.
- Git and Markdown hold authored knowledge and durable handoffs.
- Ignored SQLite databases hold mutable events, tasks, runs, queue leases, proposals, and approvals.
- Claude and Codex are separate workers. Sharing a repository does not give either agent the other agent's conversation or in-memory state.

## Automation ownership

Launchd remains the only production scheduler for the existing workflows. Do not create Codex, cron, or second launchd schedules for the same job.

The Board Room refresh is part of `com.hwl.nightly-backup`, not a separate schedule. The backup generates `board-room/app/generated-board.json` before committing and pushing, then deploys the private Vercel project after a successful push. A Vercel failure is logged separately and does not misreport the Git backup as failed.

Codex-side automation is intentionally deferred until the action gateway is connected. The first suitable Codex automation is a read-only engineering audit that runs tests, runs `scripts/doctor.py`, reviews agent failures, and reports findings without editing business state or sending externally. It must not overlap morning-brief, weekly-review, weekly-cfo, Telegram, health sync, backup, or campaign schedules.

## Installed foundation

Local `main` includes commit `0ffe1e0`, `Build Jarvis safety and durability foundation`.

Verified on the Mac mini:

- 39 automated tests pass on system Python 3.9.
- `scripts/doctor.py` reports 16 passed, 0 warnings, 0 failures in the clean engineering worktree.
- The morning brief withholds unchecked content if its verifier fails.
- Telegram intake has a durable SQLite queue, private chat and sender checks, redacted task logging, restart recovery, and `needs_review` quarantine for interrupted work.
- `jarvis_core/` provides event, run, task, action, approval, and work queue primitives.
- CI validates Python 3.9 and a current Python, shell, JavaScript, JSON, and property-list files.

## Live rollout state

- The foundation and coordination handoff are on GitHub `main`. CI passed for the foundation push and the following nightly backup.
- Nightly backup was manually reconciled on 27 July after five misleading failure reports. Local and remote `main` are synchronised. `agents/nightly-backup.sh` now records the exact push, fetch, rebase or retry error and exits non-zero on a real failure instead of labelling every failure as a merge conflict.
- The private, read-only Board Room is live at `https://the-board-room-nine.vercel.app`. It ranks the canonical weekly board, separates waiting, scheduled and parked loops, and records partial work as in motion. Production access uses Basic Auth. The username is `harrison`; the generated password is stored in macOS Keychain under service `The Board Room`.
- Vercel could not attach the repository because the Vercel account has no GitHub login connection. The existing nightly backup therefore owns the refresh and production deployment path through the locally linked Vercel project. No additional scheduler was created.
- Morning brief, verifier, weekly review and campaign chaser source rules were corrected on 27 July. They must verify the connected Gmail identity, check live Creepers and Better at Work dashboards, validate draft claims against Gmail, use only the canonical training plan, and diagnose a failure before escalating it.
- The stale-state incident on 27 July is a failed acceptance run. The brief resurrected published work, a cancelled meeting, an abandoned race, non-existent drafts and a campaign target that had already been hit. Acceptance progress resets until the next clean weekday run.
- `com.hwl.telegram-agent` was restarted at 10:37 BST on 14 July. The new restricted-mode process is live and its private durable queue database was created successfully.
- The queue was empty immediately after restart. The next non-command task is the first live proof that the new process persists before acknowledgement and writes only a task fingerprint to logs.
- The 14 July morning brief used the fail-closed verifier path and sent Telegram message 536 after checking 30 claims and correcting one. The missing Monday 13 July run should be monitored for recurrence.
- Pre-restart Telegram logs still contain legacy task previews. They are ignored by Git; future task logs should use fingerprints.
- No Codex automation has been created.

## Safety boundary

The foundation is not yet a hard permission boundary around Claude.

- There is no generic action executor.
- Legacy Claude runners retain their existing permissions, including the current `bypassPermissions` configuration where used.
- Email, messaging, calendar, file, and other connectors are not yet routed through typed Jarvis adapters.
- Approval actor names in the current CLI are unauthenticated assertions and must not authorise a real external side effect.
- Do not describe a legacy action as approval-gated merely because a proposal can be recorded in the ledger.

## Next implementation sequence

1. Confirm the next non-command Telegram task appears in the durable queue lifecycle and logs only its fingerprint.
2. Watch the next weekday morning brief because the Monday 13 July run was missed.
3. Add dry-run typed adapters for one reversible internal action first.
4. Add authenticated approval ingress, execution leases, destination receipts, and independent verification.
5. Route external actions through the gateway one adapter at a time. Remove broad legacy permissions only when the replacement path is proven.
6. After the gateway is enforcing policy, consider one read-only Codex engineering audit automation.

## Coordination rules

Before any system change:

1. Run `git status --short --branch`.
2. Do not discard, stage, or commit unrelated working changes.
3. Use a separate worktree or branch for substantial changes.
4. Run the relevant tests and `scripts/doctor.py`.
5. Merge one scoped commit.
6. Update this file if rollout state or safety boundaries changed.

Full architecture and rollback guidance: `JARVIS-FOUNDATION.md`.
