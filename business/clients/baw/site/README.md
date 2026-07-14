# Better@Work frontier prototype

A clean-room Next.js redesign for Better@Work. This is a conviction prototype for the Season 5 client conversation, not a migration of the current WordPress build.

## What is working

- Responsive homepage with a new editorial design system
- Persistent Acast-backed audio player
- Structured episode archive and eight complete episode routes
- Work Problem Finder with grounded, deterministic archive retrieval
- Better Leadership Season 5 landing page
- Better Careers conversion page
- About page, newsletter and lead-form prototype states
- PodcastSeries and PodcastEpisode structured data
- Sitemap, robots and social metadata

The prototype forms do not store or send data. Stripe, Kit, Sanity and analytics are intentionally not connected until the direction is approved.

## Local use

```bash
npm ci
npm run dev
```

Production checks:

```bash
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

## Content model

Episode data currently lives in `src/lib/content.ts`. The production build should move the same shape into Sanity and ingest canonical episode metadata from the public Acast RSS feed.

## Production path

1. Approve the brand and information architecture.
2. Audit and migrate the full episode archive.
3. Connect Sanity, Stripe, Kit and first-party analytics.
4. Replace prototype actions with live checkout, forms, transcripts and downloads.
5. Validate redirects from the current WordPress URL set.
6. Launch on the existing domain, with WordPress retained only as a rollback during DNS cutover.
