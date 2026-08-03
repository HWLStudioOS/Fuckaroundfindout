# System Status

Current engineering handoff for Harrison, Claude, and Codex. Read this on session start. Update it only when system architecture, rollout state, automation ownership, or safety boundaries change. Daily business state stays in `today.md` and the domain files.

Last updated: 3 August 2026, 20:58 BST

## Operating model

- Claude is the currently deployed operator. It handles Telegram and scheduled workflows running through launchd on the Mac mini.
- Codex is the engineer and auditor. It develops in a separate worktree or branch, runs tests and diagnostics, then merges reviewed commits.
- Git and Markdown hold authored knowledge and durable handoffs.
- Ignored SQLite databases hold mutable events, tasks, runs, queue leases, proposals, and approvals.
- Claude and Codex are separate workers. Sharing a repository does not give either agent the other agent's conversation or in-memory state.

## Automation ownership

Launchd remains the only production scheduler for the existing workflows. Do not create Codex, cron, or second launchd schedules for the same job.

The Board Room refresh is part of `com.hwl.nightly-backup`, not a separate schedule. Live edits are stored as append-only events in a private Vercel Blob store. The backup reconciles those events into `this-week.md`, generates `board-room/app/generated-board.json`, runs a frozen dependency install, moderate audit, lint, 15 tests and a production build before committing and pushing. It deploys only after those checks and the Git push pass, then verifies that an unauthenticated production request returns 401. Git backup and Vercel deployment failures remain separately labelled.

Codex-side automation is intentionally deferred until the action gateway is connected. The first suitable Codex automation is a read-only engineering audit that runs tests, runs `scripts/doctor.py`, reviews agent failures, and reports findings without editing business state or sending externally. It must not overlap morning-brief, weekly-review, weekly-cfo, Telegram, health sync, backup, or campaign schedules.

## Installed foundation

Local `main` includes commit `0ffe1e0`, `Build Jarvis safety and durability foundation`.

Verified on the Mac mini:

- 48 automated tests pass on system Python 3.9 after the scheduled-runtime hardening. The original Jarvis suite remains green.
- The Board Room has 15 passing behaviour and security tests. Its production build, lint and moderate dependency audit pass.
- `scripts/doctor.py` reports 16 passed, 0 warnings, 0 failures in a clean authenticated engineering worktree. It now warns explicitly when Claude authentication is absent.
- The morning brief withholds unchecked content if its verifier fails.
- Telegram intake has a durable SQLite queue, private chat and sender checks, redacted task logging, restart recovery, and `needs_review` quarantine for interrupted work.
- `jarvis_core/` provides event, run, task, action, approval, and work queue primitives.
- CI validates Python 3.9 and 3.14, shell, JavaScript, JSON and property-list files. Separate path-filtered jobs now enforce the Board Room audit, lint, tests and build, plus the Better at Work summer tracker audit and configuration checks. Dependabot monitors both applications and GitHub Actions weekly.

## Live rollout state

- The foundation and coordination handoff are on GitHub `main`. CI passed for the foundation push and the following nightly backup.
- Nightly backup was manually reconciled on 27 July after five misleading failure reports. Local and remote `main` are synchronised. `agents/nightly-backup.sh` now records the exact push, fetch, rebase or retry error and exits non-zero on a real failure instead of labelling every failure as a merge conflict.
- The private, editable Board Room was security-hardened and deployed at 20:55 BST on 3 August. Every page, API and static asset now fails closed behind constant-time Basic Auth. API reads authenticate independently. Mutations require an authenticated exact same-origin request. Production sends a nonce CSP, private no-store caching, noindex, frame denial and same-origin resource controls. Live smoke tests returned 401 without credentials, 200 with credentials and 403 for missing-origin or cross-origin writes. The username is `harrison`; the 32-character password remains in macOS Keychain under service `The Board Room`.
- The Board Room's high-severity `brace-expansion` advisory from 3 August and its PostCSS advisory are patched. `pnpm audit --audit-level moderate` reports no known vulnerabilities.
- The Better at Work summer tracker was hardened and deployed at 20:43 BST on 3 August. Writes now require the edit key, exact same-origin requests, JSON content and bounded payloads. Browser security headers are live and its dependency audit reports no known vulnerabilities.
- The separate Better at Work public-site branch now uses patched PostCSS 8.5.25 and Sharp 0.35.3. Content verification, typecheck, its 98-page build and moderate audit pass. It remains an unmerged draft and production is unchanged.
- Vercel could not attach the repository because the Vercel account has no GitHub login connection. The existing nightly backup therefore owns the refresh and production deployment path through the locally linked Vercel project. No additional scheduler was created.
- Morning brief, verifier, weekly review and campaign chaser source rules were corrected on 27 July. They must verify the connected Gmail identity, check live Creepers and Better at Work dashboards, validate draft claims against Gmail, use only the canonical training plan, and diagnose a failure before escalating it.
- Publication-source precedence was corrected on 31 July after the Creepers calendar falsely contradicted content that was already live. Planning dashboards now govern planned work and queue order only. Harrison's explicit correction, the live social post or Buffer's published record governs whether content shipped. The existing Buffer MCP needs re-authentication before it can provide unattended published and failed-post checks. No new scheduler was created.
- Buffer was audited read-only on 3 August. The existing project-local endpoint is correctly registered at `https://mcp.buffer.com/mcp`, but Claude reports `Needs authentication` and Codex reports `Not logged in`. The morning brief and verifier already contain published, scheduled and failed-post checks from commit `ff82ad4`. The remaining work is Harrison's interactive Claude OAuth tap, followed by a read-only channel inventory and execution proof. Keep `com.hwl.morning-brief`; do not add a Buffer-specific scheduler.
- The main Claude CLI OAuth session expired before the 2 August learning brief. Learning brief, weekly review, morning brief, content engine, campaign chaser and discovery scan then failed through 3 August. Current `today.md` and `this-week.md` were rebuilt manually and are not evidence of successful scheduled runs.
- Every Claude-backed wrapper now runs a non-interactive auth preflight before touching handoff files or attempting agent work. Authentication failures exit 78, write per-job stdout and stderr, record an atomic latest-run JSON under `.jarvis-runtime/agent-runs/`, and preserve the real CLI exit code. A live weekly-review probe at 20:56 correctly exited 78 with `auth_required` and performed no workflow work.
- Claude login repair is currently stopped at Anthropic's hCaptcha. Until the account-owner CAPTCHA is completed, the scheduled Claude jobs will fail clearly and safely rather than produce misleading partial state. This is distinct from Buffer's own OAuth requirement.
- The stale-state incident on 27 July and the OAuth outage beginning 2 August are failed acceptance runs. Acceptance remains reset until all three v1 agents complete two clean unattended weeks.
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

1. Complete Anthropic's hCaptcha, finish `claude auth login`, and verify `claude auth status --text` before rerunning any Claude-backed job.
2. After authentication, run one read-only or send-free wrapper proof first, then watch the next weekday morning brief and its verifier receipt.
3. Complete Buffer's separate interactive OAuth and perform the existing read-only channel inventory. Do not add another scheduler.
4. Confirm the next non-command Telegram task appears in the durable queue lifecycle and logs only its fingerprint.
5. Add dry-run typed adapters for one reversible internal action first.
6. Add authenticated approval ingress, execution leases, destination receipts and independent verification.
7. Route external actions through the gateway one adapter at a time. Remove broad legacy permissions only when the replacement path is proven.
8. After the gateway is enforcing policy, consider one read-only Codex engineering audit automation.

## Coordination rules

Before any system change:

1. Run `git status --short --branch`.
2. Do not discard, stage, or commit unrelated working changes.
3. Use a separate worktree or branch for substantial changes.
4. Run the relevant tests and `scripts/doctor.py`.
5. Merge one scoped commit.
6. Update this file if rollout state or safety boundaries changed.

Full architecture and rollback guidance: `JARVIS-FOUNDATION.md`.
