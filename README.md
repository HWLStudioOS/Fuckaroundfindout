# HWL META

Harrison Living's personal operating system. v1, built 11 May 2026.

This is the single root. Everything you do, track, plan, or learn from runs through here.

## What lives where

| Folder | Contains |
|---|---|
| `self/` | Identity, operating theory, psychology, influences, learning preferences. References to canonical codex files. |
| `business/` | HWL Studio: clients, offers, delivery workflows, sales positioning. |
| `money/` | Cash position, tax architecture, finance analysis, statement inbox. |
| `health/` | Training plan (RTTS 50K), fuel, sleep, body. |
| `content/` | Audience strategy, pipeline, voice DNA, publishing rules. |
| `life/` | Maya, family, environment, NZ arc, attention/tools. |
| `learning/` | Library, recall queue, research queue, weekly briefs. |
| `campaigns/` | Active outreach. LOR retainer is the priority push. |
| `council/` | Multi-agent deliberation skill for Type-1 decisions. |
| `agents/` | Scheduled prompts that make the OS proactive. |
| `jarvis_core/` | Durable event, task, run, proposal, approval, and queue primitives. No live action executor yet. |
| `capture/` | One trusted intake for tasks, ideas, voice memos, orders. |
| `research/` | One-off reports, operator deep dives, lane analyses. |
| `spec/` | Command Center design docs and MVP roadmap. |
| `.archive/` | Frozen historical material: agency, rewrite, codex snapshots. |

## What lives at the root

- `README.md` (this file)
- `CLAUDE.md` (schema, read on every session)
- `SYSTEM-STATUS.md` (current Claude/Codex engineering handoff and rollout state)
- `JARVIS-FOUNDATION.md` (safety architecture, boundaries, rollout, and rollback)
- `today.md` (live daily brief, refreshed by morning-brief agent)
- `this-week.md` (weekly review surface, refreshed Sundays)
- `AUDIT.md` (historical audit, 11 May)
- `RESEARCH-SYNTHESIS.md` (banker's read on side income lanes, deferred per codex)
- `ARCHITECTURE.md` (v1 design doc, 11 May)

## Source of truth

Most files in `self/`, `business/`, `money/`, `life/`, `learning/`, `spec/` reference canonical versions at `/Users/harrison/hwlstudio-codex/harrison-os/`. The codex folder remains the live capture surface where new ChatGPT-Codex sessions write. HWL META is the routing and operating layer.

Git and Markdown hold durable authored context. Mutable runtime state belongs in ignored SQLite databases and generated runtime files. Claude and Codex share the repository, but they are separate workers and must coordinate through committed changes and `SYSTEM-STATUS.md`, not concurrent edits to the same file.

## v1 acceptance criterion

Three agents (morning-brief, weekly-review, weekly-cfo) run unattended for 2 consecutive weeks without manual intervention or degraded output. When that ships, v1 is done.

## The principle

Cathedral-before-capture killed three previous rebuilds. This one ships the daily brief first. The folder structure is whatever the brief actually reads from.
