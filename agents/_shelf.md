# Ship Shelf

Built but NOT shipped. Elon seed, rank-1 lesson: "Innovation is not the problem. Execution is the problem." (The Book of Elon, p81.) Judge by what ships, not what is built.

Each item ages every Friday until it goes live or gets killed. An item leaves this shelf ONLY on a verified positive signal: its done-signal CONTENT check passes, OR Harrison explicitly replies "shipped <item>" / "kill <item>" (Telegram replies land in `capture/inbox.md` and are authoritative). Deployment is NEVER inferred from log prose. Absence of a signal ages the item, it never asserts a miss. (This honours the evidence rule the morning-brief verifier was built on, 28 Jun.)

2026-07-01 correction: the original "URL returns 200" signal false-greened Legibility Diagnosis. `hwlstudio.com` is an SPA, so `/#diagnosis` returns 200 whether or not the feature exists. Signals are now content-based.

2026-07-05 (weekly review): ran the corrected content-based check on both remaining items. Legibility Diagnosis PASSED. Fetched `https://www.hwlstudio.com/`, the raw homepage HTML has no match, but its referenced bundle `/assets/index-Czs7SmBh.js` contains real feature content, not a stray word: nav button "Diagnosis", CTA copy "Run the diagnosis first" / "Run the diagnosis" / "Diagnose your legibility", a live scoring object (`Legibility diagnosis: ${z.score}/100 (${z.band})` with per-dimension breakdown), and a section titled "The Legibility Diagnosis". This is genuinely live in production, not a false green. Moved to history below. AI Content Engine checked (`https://hwl-content-engine.vercel.app/` returned HTTP 404) and confirmed never deployed (no `.vercel/project.json` in `~/hwl-content-engine`, no linked project). Remains unshipped.

2026-07-26 (weekly review): re-ran the check. `https://hwl-content-engine.vercel.app/` still returns HTTP 404. No Telegram "shipped"/"kill" reply logged since 7 Jul. Still unshipped, 41 days on the shelf.

Cap: 3 items. Only genuinely built-and-verified things belong here, never prototypes or "in progress".

| item | first-seen | deploy command | done-signal |
|---|---|---|---|
| AI Content Engine | 2026-06-15 | `cd ~/hwl-content-engine && npx vercel deploy --prod --yes` | its live Vercel prod URL returns 200 AND the page HTML contains the product name (whole-site 404 → real content is the flip that counts; currently 404) |

## Shipped / killed (history)

- **Legibility Diagnosis**, SHIPPED, confirmed 2026-07-05 (weekly review), 20 days on the shelf (first-seen 2026-06-15). Live on hwlstudio.com, content-verified in the prod JS bundle (see note above). Unblocks day-one task 1 of the new-client campaign (`campaigns/new-client-2026-07.md`), corrected there same day.
