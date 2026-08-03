# Better at Work public-site draft

A clean-room Next.js redesign for Better at Work. This is the Season 5 public-site draft, not yet a replacement for the current WordPress build.

## What is working

- Responsive homepage using the locked Season 5 masthead, live mark and seal
- Persistent Acast-backed audio player
- Normalised snapshot of all 84 episodes in the canonical public Acast RSS feed
- Static episode routes for the full archive
- Working archive topic filters and four real topic collections
- Timestamp links that start the persistent player at the selected moment
- Work Problem Finder with grounded, deterministic archive retrieval
- Better Leadership Season 5 landing page
- Better Careers conversion page
- About page and truthful unavailable states for services that need credentials
- One production transcript and one finished Sum Up connected where source files exist
- Environment-aware canonicals, PodcastSeries and PodcastEpisode structured data
- Sitemap, robots, generated seal icon and a dedicated social preview

The draft does not store form data, accept payment or pretend to complete those actions. Stripe, Kit, a CMS and analytics remain intentionally disconnected.

## Local use

```bash
npm ci
npm run dev
```

Production checks:

```bash
npm run verify:content
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

## Content model

The canonical feed snapshot lives in `src/data/acast-episodes.json`. Rich editorial overrides and deterministic topic classification live in `src/lib/content.ts`.

Refresh the public archive with:

```bash
npm run sync:acast
```

Set `NEXT_PUBLIC_SITE_URL` to the final public origin before production. Vercel preview builds fall back to their own deployment URL. Local builds use `http://localhost:3000`.

## Production path

1. Confirm the final domain and production service owners.
2. Connect Kit, checkout, contact routing and first-party analytics.
3. Decide whether the checked-in archive remains sufficient or needs a CMS workflow.
4. Validate redirects from the current WordPress URL set.
5. Launch on the existing domain, with WordPress retained as rollback during DNS cutover.
