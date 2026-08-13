# Night Shift

Fan out background sub-agents on tonight's open work so results are waiting before the 06:30 brief. Modelled on Boris Cherny's overnight fleet, scaled to HWL reality. See `spec/parallel-agents-playbook-2026-08-13.md`.

Arguments: optional focus, e.g. `/night-shift creepers proposal` limits the sweep to that.

Process:

1. Read `today.md`, `this-week.md` and `capture/inbox.md`. Build a candidate list of jobs that are:
   - genuinely useful by morning (research, drafts, analysis, file organisation, QC passes)
   - safe unattended: no sends, no money, no schedule or permission changes, nothing irreversible
   - parallel-safe: no two jobs write the same file
2. Show the list, one line each. Execute automatically. Anything send-shaped or money-shaped goes on a "needs Harrison" list instead of running.
3. Spawn each job as a background sub-agent, cap 5 per night. Use the stable where it fits: `client-researcher` for people/company research, `qc-verifier` for draft checks, `repo-scout` for internal state pulls. Model sonnet unless a job clearly needs more.
4. Do not use worktree isolation. Worktrees of this repo cost 2 to 4 GB each while media lives in Git; that lifts for code jobs once restructure Phase 1 (`spec/os-restructure-2026-08-13.md`) lands. Jobs touching live state files never use worktrees regardless. All jobs write to distinct files.
5. Each job writes its output where it belongs (client folder, spec/, capture/) and appends one line to `agents/_night-shift.md`: date, job, outcome, output path.
6. When all jobs land, post a summary: what ran, where outputs live, what is on the "needs Harrison" list. Then stop.

Hard rules: no sends of any kind. Never tick items in `today.md` or `this-week.md`, the morning brief owns completion claims. No em dashes in any output. Never duplicate work a launchd daemon already does overnight (backup, board room, health sync). Financial and identity documents (statements, payslips, passports, completed forms) never go in the repo, they go in `private/`, which is gitignored. The nightly backup fails closed if one is staged, which would block the whole night's commit.
