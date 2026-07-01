# Ship Shelf

Built but NOT shipped. Elon seed, rank-1 lesson: "Innovation is not the problem. Execution is the problem." (The Book of Elon, p81.) Judge by what ships, not what is built.

Each item ages every Friday until it goes live or gets killed. An item leaves this shelf ONLY on a verified positive signal: its done-signal CONTENT check passes, OR Harrison explicitly replies "shipped <item>" / "kill <item>" (Telegram replies land in `capture/inbox.md` and are authoritative). Deployment is NEVER inferred from log prose. Absence of a signal ages the item, it never asserts a miss. (This honours the evidence rule the morning-brief verifier was built on, 28 Jun.)

2026-07-01 correction: the original "URL returns 200" signal false-greened Legibility Diagnosis. `hwlstudio.com` is an SPA, so `/#diagnosis` returns 200 whether or not the feature exists. Signals are now content-based. Both items below remain UNSHIPPED (16 days on the shelf as of today).

Cap: 3 items. Only genuinely built-and-verified things belong here, never prototypes or "in progress".

| item | first-seen | deploy command | done-signal |
|---|---|---|---|
| Legibility Diagnosis | 2026-06-15 | `cd ~/hwlstudio-site && git checkout legibility-diagnosis && npx vercel deploy --prod` then merge to main | the string `diagnosis` appears in the prod homepage HTML or its referenced JS bundle (fetch `https://www.hwlstudio.com/`, grep it, then grep each `/assets/*.js` it references). A bare 200 on `/#diagnosis` proves nothing. |
| AI Content Engine | 2026-06-15 | `cd ~/hwl-content-engine && npx vercel deploy --prod --yes` | its live Vercel prod URL returns 200 AND the page HTML contains the product name (whole-site 404 → real content is the flip that counts; currently 404) |

## Shipped / killed (history)

(none yet)
