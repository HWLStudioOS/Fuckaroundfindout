# HWL META: External Reviewer Brief

Review date: 3 August 2026

Security baseline: `ba02f91`, `Complete system security hardening`

## Executive summary

HWL META is Harrison Living's private, local-first personal operating system. It combines HWL Studio delivery, cashflow, clients, content, health, family, research and automation in one Git repository.

Markdown is the durable authored record. Ignored SQLite databases store mutable events, tasks, runs, queues and approvals. Launchd is the only production scheduler. Claude handles deployed operational workflows on a Mac mini. Codex is used for engineering, audit and controlled maintenance.

The repository also contains:

- A private production dashboard called Board Room.
- A deployed Better at Work summer tracker.
- A draft rebuild of the Better at Work public site.
- Telegram-based capture and task intake.
- Garmin health ingestion and local health analysis.
- Bidirectional Markdown and Linear synchronisation.
- A Python foundation for safer actions, approvals and recovery.
- CI, dependency monitoring, secret scanning and deployment controls.

The architecture was materially hardened on 3 August. The main remaining work is operational proof. Several Claude-powered schedules are safely blocked by expired authentication, and the Jarvis safety foundation is not yet the mandatory gateway for every external action.

This repository concentrates personal, financial, health, family and client information. Reviewers should treat the entire tree as private and minimise extracted data.

## Source-of-truth hierarchy

Use this precedence when documents disagree:

1. `today.md`
2. `this-week.md`
3. `SYSTEM-STATUS.md`
4. Live-state sections within each domain
5. Historical notes and archives

`README.md` and `HOME.md` are navigation aids. Some older navigation and health-plan references remain stale. Live files override them.

`CLAUDE.md` contains the canonical operating rules, routing, approval policy and writing conventions. `AGENTS.md` is the short entry point for non-Claude agents.

## Repository map

| Area | Purpose |
|---|---|
| Root control files | Current day, current week, system status, operating rules and target architecture |
| `self/` | Profile, preferences, values and operating theory |
| `business/` | HWL Studio, clients, offers, delivery and commercial operations |
| `money/` | Current financial overrides, historical snapshots, tax and cashflow scaffolding |
| `health/` | Active training plan, Garmin data, history and generated health state |
| `content/` | Strategy, pipeline, publishing rules, voice guidance and assets |
| `life/` | Family, home, environment and attention |
| `learning/` and `research/` | Reading, briefs, investigations and reference material |
| `campaigns/` | Current and historical outreach programmes |
| `capture/` | Trusted intake and processing state |
| `agents/` | Prompts, wrappers, launchd definitions, status files and log contracts |
| `jarvis_core/` | Local-first Python primitives for tasks, actions, approvals, queues and recovery |
| `linear/` | Bidirectional Markdown and Linear synchronisation |
| `board-room/` | Private Next.js operational dashboard |
| `.github/` | CI workflows and Dependabot configuration |
| `spec/`, `council/`, `workshops/` | Designs, deliberations and workshop artefacts |
| `output/` | Generated documents and media |
| `.archive/`, `codex/`, `tmp/` | Frozen, captured, historical or temporary material, not active truth |

## Runtime architecture

The intended operating path is:

```text
Capture or scheduled trigger
  -> authenticated agent wrapper
  -> task, run or event record
  -> policy and approval decision
  -> domain file or queue update
  -> verification and receipt
  -> Board Room or status projection
  -> nightly Git backup
```

Key design choices:

- Launchd is the sole scheduler. Duplicate cron, Codex or second launchd schedules are prohibited.
- Markdown remains human-readable durable state.
- Ignored SQLite databases hold mutable operational state.
- Scheduled wrappers check Claude authentication before work begins.
- Authentication failures exit safely and write explicit status records.
- Interrupted Telegram work is quarantined as `needs_review`, not silently replayed.
- Board Room reconciles append-only remote edits into the local weekly plan.
- `jarvis_core` provides safety primitives, but does not yet provide a universal external-action executor.

## Automation estate

Schedules use the Mac mini's local timezone.

| Process | Schedule | State on 3 August 2026 |
|---|---:|---|
| Morning brief | Weekdays, 06:30 | Authentication blocked |
| Weekly review | Sunday, 18:00 | Authentication blocked |
| Weekly CFO | Friday, 16:00 | Authentication blocked, Xero unavailable |
| Content engine | Monday, 07:00 | Authentication blocked |
| Learning brief | Sunday, 09:00 | Authentication blocked |
| Discovery scan | Monday, Wednesday, Friday, 14:07 | Authentication blocked |
| Campaign chaser | Monday, Wednesday, Friday, 10:07 | Authentication blocked |
| Evening reflection | Weekdays, 19:07 | Authentication blocked |
| Linear sync | Hourly | Running cleanly |
| Garmin health sync | 06:15, 11:00 and 14:00 | Scheduled |
| Nightly backup and Board refresh | 22:30 | Active |
| Telegram inbound poller | Every 120 seconds | Active |
| Telegram task agent | Persistent service | Active |

Claude OAuth expired on 2 August. Wrappers now fail closed before touching handoff files. Reauthentication is blocked at Anthropic's hCaptcha and requires Harrison to complete the browser step.

The main unattended workflows must complete two consecutive clean weeks before acceptance. Manually rebuilt daily and weekly files do not count as scheduled successes.

## Deployed applications

### Board Room

Board Room is a private production Vercel application at `https://the-board-room-nine.vercel.app`.

Live controls include:

- Fail-closed Basic Authentication across pages, API routes and static assets.
- Independent API authentication.
- Exact same-origin checks for mutations.
- Nonce-based Content Security Policy.
- Private `no-store` caching, `noindex`, HSTS and frame denial.
- Append-only private remote storage for live edits.
- Live smoke results of 401 without credentials, 200 with credentials and 403 for invalid mutation origins.

The current code also bounds mutation bodies by actual streamed bytes. Its pipeline uses a frozen dependency install, a low-threshold audit, lint, 16 tests, a production build, staged secret scanning and deployment from the exact pushed SHA in a clean detached checkout. The audit reports no known vulnerabilities.

That final streamed-body patch and locked deployment path are on `main`. Their production deploy is intentionally deferred until the generated Board snapshot and its authored source files are aligned by the normal backup. The existing production security deployment remains live.

### Better at Work summer tracker

The summer tracker is deployed at `https://betteratwork-summer.vercel.app`.

Reads are intentionally public. Writes require an edit key and exact same-origin requests, JSON input and bounded payloads. Security headers are live. Its low-threshold dependency audit reports no known vulnerabilities.

### Better at Work public site

The rebuilt public site is on the separate `codex/baw-frontier-site` branch. The current branch head is `b8add37`.

It uses patched PostCSS and Sharp packages, a complete cross-platform lockfile and immutable CI action pins. Clean install, content verification, type checking, the 98-page production build and low-threshold dependency audit pass locally and in GitHub Actions.

Production remains unchanged pending client approval. Existing design work in that worktree remains uncommitted and was preserved.

## Safety and permissions

The operating policy distinguishes low-risk internal work from consequential external action.

Agents may generally perform drafts, research, internal filing and reversible local updates. Explicit approval is required for:

- Sending external messages.
- Client-facing communication.
- Publishing content.
- Spending or moving more than £40.
- Irreversible changes to shared external systems.

Telegram intake now adds:

- Private-chat and sender verification.
- Separation of forwarded third-party material from Harrison's own instructions.
- Redacted task fingerprints in logs.
- A durable queue and conservative restart recovery.
- Owner-only permissions on local state files.

Scheduled Claude jobs and the Telegram task agent now use Claude's normal `auto` permission mode. No live path retains `bypassPermissions`. The project-local permanent command allowlist is empty.

The target design in `JARVIS-FOUNDATION.md` uses typed actions, policy decisions, authenticated approvals, leases, receipts, verification and rollback. It is only partly enforced. Legacy connectors are not yet forced through one typed gateway, and recorded approval actor names are not cryptographic identity proof.

## Testing and supply-chain controls

Current validation includes:

- 58 passing Python tests.
- Python testing and compilation on versions 3.9 and 3.14 in CI.
- 16 passing Board Room tests, plus lint and two local production builds.
- Shell, JavaScript, JSON and launchd plist checks.
- Better at Work tracker audit and syntax and configuration checks.
- Pinned health-ingestion dependencies, `pip check` and OSV scanning.
- Exact HTTPS destination validation for optional hosted health ingestion.
- Immutable commit pinning for every third-party GitHub Action.
- Weekly Dependabot monitoring for Board Room, the tracker, health dependencies and GitHub Actions.
- Full-history gitleaks scans across all 129 commits on `main` and the Better at Work branch, with no Git-history secrets found.
- A blocking staged-secret scan in the nightly backup.
- Commit, push and remote-SHA verification before Board deployment.

GitHub CI, Board Room CI and Better at Work summer CI passed for security baseline `ba02f91`. The public-site branch CI also passed for `b8add37`.

The latest doctor run reports 15 passes, no failures and two warnings. The warnings are expired Claude authentication and a deliberately preserved dirty working tree.

## Current operating truth

### Finance

Harrison corrected the finance state on 3 August 2026:

- Invoicing and finance administration are current.
- About £7,000 is owed across Better at Work and Creepers combined. No split has been provided.
- About £7,000 is expected from LOR during August.
- This is the complete current invoice and receivables picture.
- Older estimates of £21,000 to £22,000 unbilled are superseded and must not be reused.
- Exact current bank, card, reserve and PAYE balances have not been refreshed. Older snapshots are historical only.
- VAT registration is resolved.

### Client delivery

- **Creepers:** Design Journal proof and review variants are complete internally. Asset-library planning and the pot-recycling fallback content are complete. Remaining work concerns stock verification, Chelsea footage state and confirmation of the next shoot.
- **Better at Work:** Better Moments 4 and the Laura package are complete and quality checked. Season 5 brand and site work is ready for approval. Caroline Webb preparation for 13 August is complete.
- **LOR:** No live invoice or purchase-order chase remains. About £7,000 is expected in August. Open items are production scheduling questions.
- **Danny Wicks:** A £1,250 plus VAT scope-boundary draft awaits approval. Substantial editing is blocked until scope is confirmed in writing.
- **Year One:** A decision is required on whether the completed eight-page pack replaces the three promised Loom recordings.
- **Squiggly:** A monthly production offer of £3,600 to £4,400 has been sent. Farringdon days are separate. The outcome is pending.
- **Golf outreach:** The old outreach plan is closed. A rights-cleared pilot brief exists, but no outreach is authorised.

### Health

The active programme is the eight-week Long + Strong block, running from 27 July to 20 September 2026.

It targets four runs, two full-body strength sessions and one rest day each week, with no current race anchor. Week two targets 28 kilometres. Garmin supplies current and historical activity data, with local enrichment for load and trends.

The older RTTS ultra plan is retired, even where stale references remain in historical navigation files.

## Known blockers and residual risks

1. **Dormant credentials:** An ignored trading-bot archive contains an old Kraken API credential and a separate old Telegram bot token. No matching process or schedule is active. The archive is restricted to Harrison's account, but both credentials remain valid until Harrison revokes them at the providers.
2. **Dormant vulnerable environment:** The archived trading environment has 108 known advisories across 21 packages. It must not be run. Rebuild it from a minimal pinned environment if the project returns.
3. **Claude authentication:** Most content and review schedules are safely blocked until OAuth is restored.
4. **Operational acceptance:** Core unattended workflows have not demonstrated two consecutive clean weeks.
5. **Safety enforcement gap:** The approval and action foundation is not yet mandatory for every connector and external mutation.
6. **Xero integration:** Weekly CFO automation cannot obtain live accounting data.
7. **Other connectors:** Buffer requires separate OAuth. Gmail identity must be verified live. Granola export is constrained by its current plan.
8. **Document drift:** Root navigation and historical documents contain stale claims. Live-state precedence must be respected.
9. **Deployment integration:** Better at Work production deployment remains locally controlled because the Vercel GitHub integration is unavailable.
10. **Private-data concentration:** The repository combines personal, financial, health, family and client material. Access control, backup discipline and redaction remain critical.

## Suggested review focus

An external review should prioritise:

- Forcing every consequential external action through one typed, authenticated approval gateway.
- Approval identity, receipts, rollback and independent verification.
- Provider-side revocation and complete removal of dormant credentials.
- Recovery after crashes, restarts and partial remote writes.
- Separation between active truth, generated projections and historical material.
- Reproducibility of local deployments and eventual replacement of unavailable hosted integrations.
- Restoration and observation of scheduled automation until acceptance criteria are met.
- Privacy boundaries across business, finance, health and family data.

## Reviewer verification commands

Run these from a clean checkout before formal sign-off:

```bash
python3 -m unittest discover -s tests -v
python3 scripts/doctor.py
actionlint .github/workflows/*.yml
find agents linear -type f -name '*.sh' -print0 | xargs -0 shellcheck
uvx pip-audit --requirement agents/health-requirements.txt --no-deps --disable-pip --vulnerability-service osv
cd board-room
pnpm install --frozen-lockfile
pnpm audit --audit-level low
pnpm run lint
pnpm test
```

Do not print environment files, Keychain values, ignored configuration files or archive credential contents into a review transcript.
