# linear/

Mobile-access layer over HWL META. Markdown is the source of truth. Linear is the read/write UI when you're away from the mini.

**Start here:** [SETUP.md](SETUP.md) — 60 seconds, one human step.

## How it works

- `config.json` declares which markdown files map to which Linear team + project.
- `bootstrap.js` creates teams, projects, and labels in Linear (idempotent).
- `import.js` does the one-shot first migration (existing tasks → Linear issues, IDs back-stamped into the markdown as `<!-- linear:CLI-7 -->`).
- `sync.js` runs hourly, polls both directions:
  - new `- [ ]` items in tracked markdown → new Linear issues
  - state flips on linked issues → markdown checkbox flips, delta appended to `_deltas.md`
- `_deltas.md` is read by the morning-brief agent so overnight Linear changes surface in tomorrow's brief.

State lives in `.state.json`. It's safe to delete: re-run `bootstrap.js` then `import.js` and link markers in the markdown prevent duplicate creation.

## Why polling, not webhooks

Webhooks need a public HTTPS endpoint. The mini doesn't have one without ngrok/Cloudflare tunnel. Polling every hour is dumb and recoverable. If hourly latency hurts, swap in a webhook receiver later.

## Files

| File | Role |
|---|---|
| `config.json` | Team + source-glob mapping |
| `bootstrap.js` | One-shot: create teams, projects, labels |
| `import.js` | One-shot: migrate existing tasks |
| `sync.js` | Hourly cron, bidirectional |
| `sync.sh` | Wrapper, loads `.env` |
| `install.sh` | Wires the launchd job |
| `launchd/com.hwl.linear-sync.plist` | Hourly schedule |
| `lib/linear.js` | Linear GraphQL client |
| `lib/markdown.js` | Parser + task-list mutation helpers |
| `lib/log.js` | Append to `_log.md` + stdout |
| `_deltas.md` | Generated, read by morning-brief |
| `_log.md` | Generated, every sync run |
| `.state.json` | Generated, gitignored, ID map |
| `.env` | Gitignored, holds `LINEAR_API_KEY` |
