# Night Shift

Fan out background sub-agents on tonight's open work so results are waiting before the 06:30 brief. Modelled on Boris Cherny's overnight fleet, scaled to HWL reality. See `spec/parallel-agents-playbook-2026-08-13.md`.

Arguments: optional focus, e.g. `/night-shift creepers proposal` limits the sweep to that.

Process:

1. Read `today.md`, `this-week.md` and `capture/inbox.md`. Build a candidate list of jobs that are:
   - genuinely useful by morning (research, drafts, analysis, file organisation, QC passes)
   - safe unattended: no sends, no money, no schedule or permission changes, nothing irreversible
   - parallel-safe: no two jobs write the same file
2. Show the list, one line each. Execute automatically. Anything send-shaped or money-shaped goes on a "needs Harrison" list instead of running.
   Stop-loss on every job: if a job has not produced its deliverable within about 15 minutes of agent time, it stops and reports what it has. No silent second attempts, no rebuild loops. Creative substance (which photos, which angle, what a post actually is) belongs to Harrison; a job that finds itself iterating on taste stops immediately and queues the decision instead. The 13 August Creepers carousel burned 50 minutes across three rejected rebuilds precisely this way.
3. Spawn each job as a background sub-agent, cap 5 per night. Use the stable where it fits: `client-researcher` for people/company research, `qc-verifier` for draft checks, `repo-scout` for internal state pulls. Model sonnet unless a job clearly needs more.
4. Worktree isolation is allowed for code jobs (cheap since restructure Phase 1 removed LFS, 13 Aug 2026). Jobs touching live state files never use worktrees, one writer per live file. All jobs write to distinct files. Any fetch inside a job is `git fetch origin main`, never bare, while pre-rewrite history remains on GitHub branches.
5. Each job writes its output where it belongs (client folder, spec/, capture/) and appends one line to `agents/_night-shift.md`: date, job, outcome, output path.
6. When all jobs land, post a summary: what ran, where outputs live, what is on the "needs Harrison" list. Then stop.

Hard rules: no sends of any kind. Never tick items in `today.md` or `this-week.md`, the morning brief owns completion claims. No em dashes in any output. Never duplicate work a launchd daemon already does overnight (backup, board room, health sync). Financial and identity documents (statements, payslips, passports, completed forms) never go in the repo, they go in `private/`, which is gitignored. The nightly backup fails closed if one is staged, which would block the whole night's commit. Any job that copies, archives or backs up media verifies every file by sha256 against `MEDIA-MANIFEST.json` (`scripts/fetch-media.sh --check`), never by file count or size. Matching counts have lied here before: unmaterialised LFS pointers copy as 134-byte stubs that look like a successful transfer.
