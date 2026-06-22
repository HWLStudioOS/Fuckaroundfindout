# Next Actions

## Immediate

1. Open Claude Code in this workspace:

```bash
cd /Users/harrison/hwlstudio-codex
claude
```

2. Ask Claude to read `CLAUDE.md` and then start with:

```text
Read CLAUDE.md, HANDOFF_2026-05-11.md, and the Harrison OS files named there. Then help me build the local Google Calendar bridge first.
```

## First Build Target

Build a local Google Calendar bridge before Gmail.

Goal:

- Read tomorrow's calendar.
- Produce a daily schedule block.
- Feed the Harrison OS morning brief / command center.

Constraints:

- Use read-only calendar scope first.
- Store credentials and tokens only in ignored local paths such as `.secrets/` or `.tokens/`.
- Do not store credentials, tokens, or private OAuth material in Markdown.

## Then

- Add Gmail read-only bridge for Laing O'Rourke/client follow-ups.
- Build daily check-in logs.
- Build first local Command Center UI.
- Add Telegram/email delivery after the daily brief format is proven.
