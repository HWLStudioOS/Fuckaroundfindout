# Ship Shelf

Built but NOT shipped. Elon seed, rank-1 lesson: "Innovation is not the problem. Execution is the problem." (The Book of Elon, p81.) Judge by what ships, not what is built.

Each item ages every Friday until it goes live or gets killed. An item leaves this shelf ONLY on a verified positive signal: its done-signal URL returns 200, OR Harrison explicitly replies "shipped <item>" / "kill <item>". Deployment is NEVER inferred from log prose. Absence of a signal ages the item, it never asserts a miss. (This honours the evidence rule the morning-brief verifier was built on, 28 Jun.)

Cap: 3 items. Only genuinely built-and-verified things belong here, never prototypes or "in progress".

| item | first-seen | deploy command | done-signal |
|---|---|---|---|
| Legibility Diagnosis | 2026-06-15 | `cd ~/hwlstudio-site && git checkout legibility-diagnosis && npx vercel deploy --prod` then merge to main | `https://www.hwlstudio.com/#diagnosis` returns 200 |
| AI Content Engine | 2026-06-15 | `cd ~/hwl-content-engine && npx vercel deploy --prod --yes` | its live Vercel prod URL returns 200 |

## Shipped / killed (history)

(none yet)
