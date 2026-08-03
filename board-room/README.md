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

Create an ignored `.env.local` with the same required values used in production:

```dotenv
BOARD_ROOM_USER=your-private-username
BOARD_ROOM_PASSWORD=use-a-random-password-of-at-least-20-characters
BLOB_READ_WRITE_TOKEN=your-private-blob-token
```

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

Every production and preview route, including the board API and static assets, requires HTTP Basic authentication. `BOARD_ROOM_USER` and `BOARD_ROOM_PASSWORD` are mandatory and the application fails closed when either value is missing or invalid. The password must contain at least 20 characters. Use a generated value of 32 characters or more.

The API repeats the authentication check rather than relying on the route proxy. Mutations also require an exact same-origin `Origin` header. Missing, opaque and cross-origin mutation requests are rejected. Responses are private and non-cacheable, do not use wildcard CORS, and carry restrictive browser security headers.

`BLOB_READ_WRITE_TOKEN` remains mandatory for loading and saving live events. Live edits appear immediately. The existing nightly backup reconciles them into the Markdown source of truth before rebuilding the dashboard.
