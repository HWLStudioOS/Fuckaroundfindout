---
owner: Harrison
agent: arsenal-watch (appends to the Ballot log only)
created: 2026-08-16
season: 2026/27
---

# Arsenal

Membership state, the tier ladder, and the ballot calendar. Harrison owns this file.
`arsenal-watch` may append to the Ballot log and nothing else.

## The one thing that actually matters

**Continuous membership is the asset, not any individual ballot.**

On joining, a Red Member is automatically added to the Silver Membership waiting
list, and the position holds only for as long as membership runs with **no breaks**.
The Silver wait is commonly 15 years and reportedly can exceed 20. A lapsed renewal
does not cost £38, it resets a two-decade queue position to zero.

So the highest-value automation here is not ballot alerts. It is a renewal guard that
cannot fail. Ballots are a nice-to-have on top.

## The ladder

### Red, current tier

- £38 per season.
- Ballot access for every home match, plus buy and sell on Ticket Exchange.
- Automatically placed on the Silver waiting list on joining, first come first served.
- **Ballot mechanics:** opens 4 to 6 weeks before a home fixture, window is normally
  **72 hours**, and it is a **random draw**. Arsenal state that entering early confers
  no advantage: odds are identical at any point in the window. You pre-authorise a card,
  pick two preferred price bands, may opt in to Any Remaining Areas, and may ballot as a
  group of up to four. If entries do not exceed supply, everyone who entered succeeds.
- Arsenal email all applicants but say explicitly it is your responsibility to check
  Box Office purchase history for the outcome. **Do not treat the email as the record.**

### Silver, the long wait

- Capped at roughly 30,000 members. Places open only when an existing member declines
  to renew, and they rarely do.
- Wait commonly cited at 15 years, with credible reports of 20 plus.
- Nothing to buy and nothing to accelerate. The only input is not breaking membership.

### Gold, the season ticket

- General admission season ticket. 19 home Premier League games plus home European
  group fixtures.
- Requires joining the **Season Ticket Waiting List**, which is separate from the Silver
  list. £50 adult, £25 junior, and the fee is redeemable against the first season ticket.
- Seats release only when a Gold member does not renew.
- **Not currently joined.** This is a live decision, see Open decisions below.

### Platinum, the money route

- Club Level season ticket covering all first team Premier League, European, FA Cup and
  League Cup home matches.
- Requires a **25 per cent non-refundable deposit**.
- **The waiting list is significantly shorter than Gold's.** This is the one rung where
  cash substitutes for two decades of queueing, which makes it the only tier with a
  realistic timeline attached to it.
- Contact: `clublevel@arsenal.co.uk`, or 0345 262 0001 option 2.

### The shape of it

The ladder is not linear. Red to Silver is pure time and cannot be bought. Gold is time
plus a £50 queue entry. Platinum skips most of the queue for money. If guaranteed seats
ever become the goal, Platinum is the only rung with a tractable path, and the deposit
is non-refundable so it is a real decision rather than an option to hold.

## Membership state

| Field | Value | Verified |
| --- | --- | --- |
| Tier | Red | 2026-08-16, Harrison |
| Account email | `hazza.living@gmail.com` | 2026-08-16, Harrison |
| Renewal date | **UNKNOWN, fill this in** | not verified |
| Auto-renew on | **UNKNOWN, confirm** | not verified |
| Card on file valid | **UNKNOWN, confirm** | not verified |
| Silver list position | unknown, held since first joined | not verified |
| Season Ticket Waiting List | not joined | 2026-08-16, Harrison |

Three unknowns above are the whole job. A dead card at allocation time loses a won
ballot, because registration pre-authorises and charges automatically on success.

## Signal sources

1. **[@AFCBallots](https://x.com/AFCBallots) on X.** Fan-run, self-described as the
   original Arsenal Ballot Alerts. Posts carry fixture, ballot open, **close deadline**,
   result dates, match date and price bands. Richer than Arsenal's own email, which
   announces the open but does not reliably front the deadline. Unofficial, so treat as
   the trigger and verify against Box Office before acting.
2. **arsenal.com ticket pages.** Authoritative. Ballot open and close dates are
   advertised there through the season.
3. **`hazza.living@gmail.com`** via the `better-email` MCP server. Backstop only.

Note: `arsenal.com`, `x.com` and most sports sites are blocked by the remote session's
network egress policy. All three sources are reachable from the Mac mini, which is where
`arsenal-watch` runs.

## Hard rules

- **Never automate ballot entry, checkout, or Ticket Exchange purchase.** Arsenal work
  with Ticketmaster specifically to block bot software and require supporters to prove
  they are not bots. Automating a purchase risks the membership and the ticket history.
  Monitoring and alerting only.
- Never store the Arsenal account password in this repo. Credentials live in
  `.secrets/`, which is gitignored.

## 2026/27 home fixtures

**UNVERIFIED.** Sourced from web search summaries on 16 August 2026, not from a primary
source, because arsenal.com and every fixture site tried were egress-blocked. Ten of
nineteen home games. `arsenal-watch`'s first run must rebuild this table from
arsenal.com and replace this block wholesale.

| Date | Opponent | Ballot window opens (est, fixture minus 5 weeks) |
| --- | --- | --- |
| Fri 21 Aug 2026, 20:00 | Coventry City | passed |
| Sat 5 Sep 2026 | Chelsea | passed, roughly 1 Aug |
| Sat 28 Nov 2026 | Manchester City | roughly 24 Oct |
| Festive period, date TBC | Manchester United | TBC |
| Sat 6 Feb 2027 | Liverpool | roughly 2 Jan |
| Sat 1 May 2027 | Tottenham Hotspur | roughly 27 Mar |
| Sat 8 May 2027 | Leeds United | roughly 3 Apr |
| Sat 15 May 2027 | Nottingham Forest | roughly 10 Apr |
| Sun 23 May 2027 | Everton | roughly 18 Apr |
| Sun 30 May 2027 | Brighton | roughly 25 Apr |

Nine home fixtures are missing from this table. Kick-off times move for television
selection, so a Saturday can become a Sunday or Monday.

## Ballot log

`arsenal-watch` appends here, newest first. One line per ballot: fixture, window open,
close deadline, whether entered, outcome.

<!-- BALLOT LOG START -->
<!-- BALLOT LOG END -->

## Open decisions

- **Join the Season Ticket Waiting List?** £50, redeemable against a first season ticket.
  It buys a queue position that only accrues while held, so the cost of waiting to decide
  is a year of seniority per year deferred. Cheap option on a very long-dated outcome.
- **Is Platinum ever the actual goal?** Given the trajectory in `self/profile.md`, the
  Club Level route is the only rung with a real timeline. Worth pricing once, not now.
  Not a Council matter, no client or cashflow exposure.
