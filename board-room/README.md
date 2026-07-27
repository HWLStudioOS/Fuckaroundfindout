# The Board Room

The Board Room is Harrison Living's editable view of every open loop in the operating system.

## How it works

- `this-week.md` is the canonical task source.
- `today.md` supplies daily progress and recently closed work.
- `scripts/generate-board-data.mjs` parses both files before every local or Vercel build.
- `priority-overrides.json` holds deliberate ranking decisions. Tasks without an override use the automatic scoring rules.
- Task edits and completion events are written to a private Vercel Blob store and applied immediately in the live dashboard.
- The existing nightly backup reconciles those events into `this-week.md`, refreshes the committed snapshot before its Git push, then triggers the Vercel production deployment after a successful push. There is no second scheduler.
- Direct CLI deployments use the committed board snapshot because Vercel only uploads the project directory.

## Local development

```bash
pnpm install
pnpm run dev
```

The local site is available at `http://localhost:3000`.

## Checks

```bash
pnpm run lint
pnpm test
```

## Access

The production dashboard has no login. Anyone with the URL can view and edit its tasks. Live edits appear immediately. The existing nightly backup reconciles them into the Markdown source of truth before rebuilding the dashboard.
