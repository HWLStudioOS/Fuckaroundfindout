# System Status

Current engineering handoff for Harrison, Claude, and Codex. Read this on session start. Update it only when system architecture, rollout state, automation ownership, or safety boundaries change. Daily business state stays in `today.md` and the domain files.

Last updated: 10 August 2026

## Operating model

- Claude is the currently deployed operator. It handles Telegram and scheduled workflows running through launchd on the Mac mini.
- Codex is the engineer and auditor. It develops in a separate worktree or branch, runs tests and diagnostics, then merges reviewed commits.
- Git and Markdown hold authored knowledge and durable handoffs.
- Ignored SQLite databases hold mutable events, tasks, runs, queue leases, proposals, and approvals.
- Claude and Codex are separate workers. Sharing a repository does not give either agent the other agent's conversation or in-memory state.

## Automation ownership

Launchd remains the only production scheduler for the existing workflows. Do not create Codex, cron, or second launchd schedules for the same job.

The Board Room refresh is part of `com.hwl.nightly-backup`, not a separate schedule. Live edits are stored as append-only events in a private Vercel Blob store. The backup reconciles those events into `this-week.md`, generates `board-room/app/generated-board.json`, runs a frozen dependency install, low-threshold audit, lint, 16 tests and a production build. It stages the backup only after validation, blocks secrets with gitleaks, requires a successful commit and push, then verifies the pushed SHA against `origin/main`. Deployment repeats validation in a clean detached checkout and uses the exact locked Vercel CLI. Deploy-side validation runs the board generator in verify-only frozen-snapshot mode (`HWL_BOARD_FROZEN_SNAPSHOT=1`): it recomputes the board from the committed sources, fails if the committed snapshot has drifted, and writes nothing, so the checkout stays byte-identical to the pushed commit. The deploy is still refused if validation mutates the checkout. An unauthenticated production request must return 401. Git backup and Vercel deployment failures remain separately labelled.

Codex-side automation is intentionally deferred until the action gateway is connected. The first suitable Codex automation is a read-only engineering audit that runs tests, runs `scripts/doctor.py`, reviews agent failures, and reports findings without editing business state or sending externally. It must not overlap morning-brief, weekly-review, weekly-cfo, Telegram, health sync, backup, or campaign schedules.

## Installed foundation

`main` includes the Jarvis safety and durability foundation and the 3 August security and reliability sweep.

Verified on the Mac mini:

- 58 automated tests pass on system Python. The original Jarvis suite and the new automation, health-ingest and Telegram security contracts remain green.
- The Board Room has 16 passing behaviour and security tests. Its production build, lint and low-threshold dependency audit pass with no known vulnerabilities.
- `scripts/doctor.py` reports 16 passed, 1 warning and 0 failures on 10 August. The warning is the deliberately preserved live working paths.
- The morning brief withholds unchecked content if its verifier fails.
- Telegram intake has a durable SQLite queue, private chat and sender checks, redacted task logging, restart recovery, `needs_review` quarantine for interrupted work, and explicit separation of forwarded third-party material from Harrison's own instructions.
- The active health environment is pinned in `agents/health-requirements.txt`. The pypdf pin moved to 6.15.0 after CVE-2026-71870 and CVE-2026-71852 turned the health dependency audit red. The Mac mini environment was upgraded to 6.15.0 on 10 August and `pip check` passes. Pillow 12.3.0 remains clean per the same audit. Hosted ingestion requires a complete token, exact HTTPS URL and exact hostname allowlist.
- `jarvis_core/` provides event, run, task, action, approval, and work queue primitives.
- CI validates Python 3.9 and 3.14, shell, JavaScript, JSON and property-list files. Separate path-filtered jobs enforce the Board Room audit, lint, tests and build, the Better at Work summer tracker audit and configuration checks, and the pinned health dependency audit. Every third-party GitHub Action is pinned to an immutable commit. Dependabot monitors all three dependency surfaces and GitHub Actions weekly.

## Live rollout state

- The foundation and coordination handoff are on GitHub `main`. CI passed for the foundation push and the following nightly backup.
- Nightly backup was manually reconciled on 27 July after five misleading failure reports. `agents/nightly-backup.sh` records the exact push, fetch, rebase or retry error and exits non-zero on a real failure instead of labelling every failure as a merge conflict. On 10 August the live worktree was safely rebased onto the merged system repair after its runtime changes were committed. No live state was discarded.
- The private, editable Board Room was security-hardened on 3 August and refreshed in production on 10 August from the pushed weekly snapshot. Every page, API and static asset fails closed behind constant-time Basic Auth. API reads authenticate independently. Mutations require an authenticated exact same-origin request. Production sends a nonce CSP, private no-store caching, noindex, frame denial and same-origin resource controls. The 10 August smoke test returned 401 without credentials and 200 with credentials, with the live API serving the 10 to 16 August board. The username is `harrison`; the 32-character password remains in macOS Keychain under service `The Board Room`.
- The Board Room's `brace-expansion`, PostCSS and locked Vercel CLI transitive advisories are patched. `pnpm audit --audit-level low` reports no known vulnerabilities.
- The nightly Board Room deploy was blocked on 4 and 5 August because deploy-side validation restamped the tracked snapshot. Frozen-snapshot verification fixed that on 6 August. The 6 to 9 August deploys were then blocked by js-yaml GHSA-5p4m-2wfm-xmqj and nanoid GHSA-2v37-7h3g-55p8. PR #12 merged both dependency patches at 06:44 on 10 August. Its post-merge Board Room check exposed two unrelated, state-dependent test defects when the new weekly board arrived: a hard-coded requirement for two completions at the start of a week, and inconsistent ordering for equal scores. PR #20 merged the repair at 07:53 on 10 August with every branch and pull-request check green. Audit, lint, all 16 tests and the production build pass. Production was refreshed on 10 August with the current weekly snapshot after a clean-checkout validation and successful authenticated live-state check.
- The Better at Work summer tracker was hardened and deployed at 20:43 BST on 3 August. Writes now require the edit key, exact same-origin requests, JSON content and bounded payloads. Browser security headers are live and its dependency audit reports no known vulnerabilities.
- The separate Better at Work public-site branch was finished for Cathal's end-of-week review on 6 August. It adopts the approved original outlined mark across masthead, footer, icon and social preview, refreshes the Acast snapshot to 85 episodes including Better Moments #4, and wires Better Careers checkout end to end: a Stripe Checkout API route, buy buttons and a noindex confirmation page. Checkout is dormant with truthful cannot-take-payment states until `STRIPE_SECRET_KEY` and `STRIPE_CHECKOUT_PRICE_ID` are set; price, currency, refund terms and fulfilment remain undecided client decisions. Content verification, typecheck, the 99-page build and low-threshold audit pass locally and in GitHub Actions. A same-day polish pass verified the site against the Brand Playground Figma variables, repaired feed whitespace and markdown artefacts at render time, reweighted the Work Problem Finder toward the visitor's own words, added a branded 404, and corrected the dead Spotify and YouTube footer links. The protected Vercel preview was redeployed from the merged commit and still fails closed behind Vercel SSO. The branch remains unmerged to `main` and production at betteratwork.net is unchanged. A pre-merge safety stash of the previously uncommitted brand alignment sits in the `HWL META-baw-site` worktree, superseded by commit `81e680c`.
- Vercel could not attach the repository because the Vercel account has no GitHub login connection. The existing nightly backup therefore owns the refresh and production deployment path through the locally linked Vercel project. No additional scheduler was created.
- Morning brief, verifier, weekly review and campaign chaser source rules were corrected on 27 July. They must verify the connected Gmail identity, check live Creepers and Better at Work dashboards, validate draft claims against Gmail, use only the canonical training plan, and diagnose a failure before escalating it.
- Publication-source precedence was corrected on 31 July after the Creepers calendar falsely contradicted content that was already live. Planning dashboards now govern planned work and queue order only. Harrison's explicit correction, the live social post or Buffer's published record governs whether content shipped. The existing Buffer MCP needs re-authentication before it can provide unattended published and failed-post checks. No new scheduler was created.
- Buffer was audited read-only on 3 August. The existing project-local endpoint is correctly registered at `https://mcp.buffer.com/mcp`, but Claude reports `Needs authentication` and Codex reports `Not logged in`. The morning brief and verifier already contain published, scheduled and failed-post checks from commit `ff82ad4`. On 4 August Harrison cancelled the Buffer OAuth task. No re-authentication or channel inventory is planned. Unattended Buffer-backed published and failed-post checks stay disabled, and briefs must not claim them. Keep `com.hwl.morning-brief`; do not add a Buffer-specific scheduler.
- The main Claude CLI OAuth session expired before the 2 August learning brief. Learning brief, weekly review, morning brief, content engine, campaign chaser and discovery scan then failed through 3 August. Current `today.md` and `this-week.md` were rebuilt manually and are not evidence of successful scheduled runs.
- Every Claude-backed wrapper now runs a non-interactive auth preflight before touching handoff files or attempting agent work. Authentication failures exit 78, write per-job stdout and stderr, record an atomic latest-run JSON under `.jarvis-runtime/agent-runs/`, and preserve the real CLI exit code. A live weekly-review probe at 20:56 correctly exited 78 with `auth_required` and performed no workflow work. Scheduled Claude runs now use Claude's current `auto` safety mode instead of blanket permission bypass.
- Claude authentication was restored on 6 August. `claude auth status --text`, the 10 August doctor run and every scheduled Claude-backed job since the repair confirm the session is live. Buffer remains a separate, deliberately unaddressed OAuth gap.
- The stale-state incident on 27 July and the OAuth outage beginning 2 August are failed acceptance runs. Acceptance remains reset until all three v1 agents complete two clean unattended weeks.
- `com.hwl.telegram-agent` was moved from blanket `bypassPermissions` to Claude's current `auto` safety mode and restarted at 21:15 BST on 3 August. Its existing restricted deny profile remains in force. The private durable queue was empty and no task was interrupted. The capture-only Telegram path now requires both an allowlisted sender and matching private chat, and all Telegram state files are mode 0600.
- Full gitleaks scans of all 129 commits on `main` and the Better at Work branch found no secrets in Git history. Staged backups are now blocked if gitleaks detects a secret.
- A dormant ignored trading-bot archive contains an old Kraken API credential and a separate old Telegram bot token. No matching process or schedule is active. Its tree, virtual environment and credential files are restricted to Harrison's account. The credentials still need owner-side revocation and replacement. The dormant virtual environment has 108 known advisories across 21 packages and must not be reactivated.
- The next non-command task is the first live proof that the new process persists before acknowledgement, writes only a task fingerprint to logs and completes successfully under auto mode.
- The 14 July morning brief used the fail-closed verifier path and sent Telegram message 536 after checking 30 claims and correcting one. The missing Monday 13 July run should be monitored for recurrence.
- Pre-restart Telegram logs still contain legacy task previews. They are ignored by Git; future task logs should use fingerprints.
- Linear sync entered an hourly flap on HWL-191 from 9 to 10 August because `today.md` and `this-week.md` carried the same marker with opposite checkbox states. PR #20 gives each issue one state-recorded owning Markdown file, makes duplicate or stale markers fail closed, prevents unmarked Today tasks creating duplicate issues, and adds CI coverage. Five stale collision issues were cancelled. A live 06:55 sync created fresh HWL-247 to HWL-255 issues, closed HWL-231 and HWL-244, and made zero HWL-191 state writes. Agent prompts now forbid inventing or recycling Linear markers.
- No Codex automation has been created.

## Safety boundary

The foundation is not yet a hard permission boundary around Claude.

- There is no generic action executor.
- Scheduled Claude wrappers and the user-driven Telegram agent now use Claude's current `auto` safety mode. No live agent path retains `bypassPermissions`, and the project-local permanent permission allowlist is empty.
- The old Kraken and Telegram credentials in the ignored archive are contained locally but remain valid until Harrison revokes them at their providers.
- Email, messaging, calendar, file, and other connectors are not yet routed through typed Jarvis adapters.
- Approval actor names in the current CLI are unauthenticated assertions and must not authorise a real external side effect.
- Do not describe a legacy action as approval-gated merely because a proposal can be recorded in the ledger.

## Next implementation sequence

1. Revoke the old Kraken API credential and old Telegram bot token found in the ignored trading-bot archive. Keep the archive dormant until it is rebuilt from a fresh, audited environment.
2. Watch the restored morning-brief and weekly-review acceptance streaks. Authentication is live, but output accuracy and session longevity remain separate checks.
3. Watch the next hourly Linear run for a second zero-flap receipt. The repair is deployed and the stale collision issues are closed.
4. Skipped. Harrison cancelled the Buffer OAuth task on 4 August. No Buffer re-authentication or channel inventory is planned.
5. Confirm the next non-command Telegram task appears in the durable queue lifecycle and logs only its fingerprint.
6. Add dry-run typed adapters for one reversible internal action first.
7. Add authenticated approval ingress, execution leases, destination receipts and independent verification.
8. Route external actions through the gateway one adapter at a time. Remove broad legacy permissions only when the replacement path is proven.
9. After the gateway is enforcing policy, consider one read-only Codex engineering audit automation.

## Coordination rules

Before any system change:

1. Run `git status --short --branch`.
2. Do not discard, stage, or commit unrelated working changes.
3. Use a separate worktree or branch for substantial changes.
4. Run the relevant tests and `scripts/doctor.py`.
5. Merge one scoped commit.
6. Update this file if rollout state or safety boundaries changed.

Full architecture and rollback guidance: `JARVIS-FOUNDATION.md`.
