---
date: 2026-08-14
generated: auto-generated 06:30
---

# Today, Friday 14 August 2026

## Pulse

Week 1 of Build + Engine (10-16 August) closes out. Yesterday shut down clean: Jennifer Moss's reel and the Creepers New Forest bee static both landed, the VO2 session came in as a genuine full 4x4, £1,800 August drawings and David's £550 salary both cleared. Today is Friday's STNDRD Pull plus an easy run, and Companies House director ID verification, a short self-serve task with a 2 September deadline it isn't close to. No calendar meetings today. LOR remains silent by Gmail for 16+ days with about £7,000 still expected this month and no PO or invoice raised. Two unrelated CI faults surfaced overnight, both diagnosed below and both Codex-track, not Harrison's job today.

## Yesterday wrap

Landed: Jennifer Moss's AI-adoption reel published on `@betteratworkpod`, the Creepers New Forest bee-pollination static published on `@creepersnursery` closing the nursery commitment, the optional Installation slot deliberately left empty after Rootball Check was rejected and Ferndale was archived as repeated material, the VO2 session delivered as a full 4 x 4 (Garmin logged three laps because the first wasn't lapped, Strava confirms 7.89km in 48:18), David's £550 August salary paid, and the £1,800 August drawings confirmed landed.

Not confirmed: whether David's revised Danny wrap-reel has landed. No Gmail evidence either way (this runs over WhatsApp), so it carries forward as the one live review rather than being marked done or missed.

No Linear deltas since yesterday's brief.

## Today

- [ ] Companies House director ID verification: complete via the gov.uk link with passport or driving licence, then send the resulting code to Fazila. Confirmation statement is due 2 September, so there's runway, but this is the day it was pencilled for.
- [ ] STNDRD Pull session plus easy run (Build + Engine week 1 adjustment). Lift first, run later where possible, aim for six hours between.
- [ ] Review David's revised Danny wrap-reel when it lands. Only live production review outstanding, and it's what's blocking Danny's £800 plus VAT payment confirmation.

## Awaiting response

- Danny Wicks: £800 plus VAT payment confirmation, blocked behind David's wrap-reel revision.
- Kerri and Emma (LOR): PO route and first invoice. No Kerri, Sarah Garside or Korena email in 5+ days checked, LOR silent 16+ days overall.
- Helen Tupper (Squiggly Careers): call confirmed 18 August, 10:15-11:00 Teams. Nothing needed before then.

## In flight

- Better at Work Season 5: website has sat with Cathal for review since 9 August, Stripe decisions stay gated behind his sign-off.
- Edge Lab: paper only, no live capital armed. Crypto control still leads (about £9,684) ahead of rules (£9,450) and fable (£9,164), all three down slightly overnight. Macro: rules (£10,226) leads control (£10,205), as it has for almost the whole book's history bar one brief day, fable trails (£10,046). Continue/adjust/stop is still an open call.
- Private edit studio: Netil House second room remains the front-runner against a £1,000 ceiling (£1,404/month all-in). Eat Work Art's Nikki offered viewing slots 11 and 13 August. Still no decision, still need Wi-Fi speed confirmed in writing, deposit, term, break clause and VAT treatment before signing.
- KiwiSaver: witnessing and ID certification done with Fazila. Tax verification via Raj at Litchfields remains separate and outstanding. No withdrawal initiated.
- Training: Build + Engine week 1 continues, golf Saturday at Richmond Park, tee 11:01, then a 75-minute easy long run Sunday.
- Two overnight CI faults, diagnosed and handed to Codex, see System below.

## Standing

Health: RHR 48, HRV 56 balanced, sleep 7.1h at score 82, all still yesterday's readings since the watch hadn't synced today's by 06:15 and today's readiness score isn't in yet. Weekly training load 603 with ACWR reading 0.72, Detraining, down from the block's 10 August Optimal 0.8 baseline after a lighter start to the week. Body weight is still last recorded 29 April, over 100 days stale.

Money: tax reserve computes to £9,875, still bank-unverified. About £7,000 from LOR remains expected in August with no PO or invoice raised, and LOR has gone quiet for 16+ days now bar one routine Fazila admin note. No spare personal cash, so the investing stance stays monitor-only. Companies House confirmation statement is due 2 September, today's ID verification keeps that on track well ahead of the deadline.

Clients: Creepers and BaW both closed their live commitments yesterday, nothing owed on either today. LOR is quiet, no chase forced today given the pattern of Kerri not reading notifications regularly. Squiggly Careers call is locked for 18 August.

System: health-sync ran clean through 06:15, though today's Garmin readiness hadn't synced yet at pull time. Nightly-backup committed and pushed at 22:30, but the Board Room production deploy was skipped. Diagnosis: `pnpm audit` inside `board-room/` finds one high-severity transitive vulnerability, nanoid below 3.3.18 pulled in via `@tailwindcss/postcss > postcss > nanoid` (GHSA-2v37-7h3g-55p8), which is what actually blocked the gate, not a code regression. Separately, the root CI workflow is also failing on its own fault: its checkout only sparse-checks `*.py`, `*.sh`, `*.js`, `*.mjs`, `*.json` and `pyproject.toml`, so `today.md` and `this-week.md` never land on the runner and the state-ownership contract tests can't find them, confirmed via the last three failed runs going back to the Restructure Phase 1 commit. Both are diagnosed, neither touched here. Both are Codex-track: bump or override nanoid to 3.3.18+ in the board-room pnpm lockfile, and add `today.md` and `this-week.md` to the CI checkout's sparse-checkout list. Gmail identity confirmed live as harrison@hwlstudio.com. 200+ unread mailbox-wide, a persistent backlog not a today problem; the recent batch is mostly newsletters, the golf tee-time confirmation, a Linear changelog and two GitHub CI-failure notices already diagnosed above, plus one real item: a 13 August Archer Street Studios viewing follow-up (James Guyer, stage-re.co.uk), relevant to the private edit studio search above. Zero Gmail drafts. No Granola meetings since yesterday. No calendar events today, one tee time tomorrow.

## Lens

Two genuine system faults surfaced overnight for the first time in a while. Neither is yours to fix, hand both to Codex rather than losing today's energy to them. The actual open work today is thin: a ten-minute ID check with weeks of runway, a prescribed training session, and one client thread with real teeth, Danny's payment sitting behind David's reel revision. If there's clean energy left after training, that's real space for the Harrison Living launch capture or the Film 001 story spine, both of which keep getting bumped for obligated work that, today, barely exists.
