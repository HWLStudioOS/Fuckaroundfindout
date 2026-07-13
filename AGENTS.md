# AGENTS.md

Instructions for Codex CLI (and any non-Claude agent) working in this repo.

There is one source of truth: **`CLAUDE.md`**. Read it first. Everything below is a short pointer so this file never drifts from it.

## The essentials

- This is Harrison Living's personal operating system. HWL Studio cashflow, audience, content, health, money, family.
- On session start read: `today.md`, `SYSTEM-STATUS.md`, `self/profile.md`, `self/operating-theory.md`. That's the whole startup. The rest is data, read on demand.
- Routing, push behaviours, hard nos, and the full schema all live in `CLAUDE.md`. Follow it exactly.
- Read `SYSTEM-STATUS.md` before changing agents, schedules, permissions, or Jarvis runtime code.
- Do not duplicate an existing launchd or Claude schedule with another agent platform.
- Inspect Git status first. Preserve unrelated working changes and use a separate worktree or branch for substantial engineering changes.

## Voice (non-negotiable)

- No em dashes. Ever. Commas or full stops.
- No engagement bait, no motivational fluff, no AI slop.
- Specific over vague. Named people, real numbers, real dates.
- British-inflected Kiwi. Short sentences. Quiet confidence.

## Where the codex source lives

`codex/` holds a snapshot of the canonical codex captures (the 11-round interview log and the numbered `harrison-os/` files). On the Mac mini the live capture surface is `~/hwlstudio-codex/`. See `README-macbook.md` for how the two relate.
