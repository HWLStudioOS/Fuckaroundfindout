# Scout trades amend-or-fold decision pack

- **Prepared:** night-shift job, dated 14 August 2026, against live repo state as of 13 August 2026
- **Status:** internal admin document, not advice. No recommendation, no market opinion, no price commentary is given below. All decisions are Harrison's, untouched.
- **Scope:** the five scout positions bought outside `money/investment-strategy-2026-08-03.md` between 4 and 7 August 2026: SPCX, NVDA, SNDK, MU, PLTR.
- **Timing note:** the strategy doc sets Monday 10 August as the earliest SPCX review date (`money/investment-strategy-2026-08-03.md:217`). `capture/inbox.md:67` shows a calendar hold for "14:30 market session with Claude... scout trades amend-or-fold against `money/investment-strategy-2026-08-03.md`" under a "Monday 10 August to-dos" list. As of this pack's 14 August date that is four days past that Monday session with no written verdict found anywhere in the repo (see Part 3). `today.md` itself does not use the word "overdue" about this review; its one "overdue" mention (`today.md:57`) is about an unrelated Harrison Living launch capture.

---

## Part 1: What the strategy document's own decision rule says

Direct search of `money/investment-strategy-2026-08-03.md` for the words "amend," "fold" and "scout" returns zero matches. The document never uses "amend-or-fold" language itself. That framing comes from three other files, quoted here so the source is clear:

- `capture/inbox.md:67`: "14:30 market session with Claude, calendar hold is set: scout trades amend-or-fold against `money/investment-strategy-2026-08-03.md`."
- `money/spcx-review-pack-2026-08-10.md:50`: "Either amend the doc with a capped scout sleeve that legitimises small exploratory positions, or fold these three into the 92/6/2 machine when it goes green. Decide once, in writing, Monday."
- `money/index.md:27`: "Open decision: amend the strategy with a capped scout sleeve, or fold these into the plan when it goes green."

What the strategy document itself actually specifies, verbatim, with line references:

**The growth bucket structure**, `money/investment-strategy-2026-08-03.md:18`: "**Harrison growth bucket:** money not needed for at least five years. Target **92% global equities, 6% Bitcoin and 2% direct SpaceX**. The bot gets 0% through 3 August 2027."

**The sleeve table**, `money/investment-strategy-2026-08-03.md:189-194`:

| Holding | Target | No-new-buy level | Monthly trim trigger | Vehicle |
|---|---:|---:|---:|---|
| Global equity index | 92% | Not applicable | Not applicable | Vanguard FTSE Global All Cap Accumulation |
| Bitcoin | 6% | 7% | Above 7.5%, trim to 7% | Kraken Pro spot BTC/GBP |
| SpaceX | 2% | 2.5% | Above 3%, trim to 2.5% | Trading 212 real SPCX share |
| Trading bots | 0% | 0% | 0% through 3 August 2027 | No current vehicle |

**SpaceX execution rule**, `money/investment-strategy-2026-08-03.md:213-217, 225`: "No order before earnings and the unlock. The earliest review is Monday 10 August, after two full post-unlock trading sessions. Read the filed results first. The thesis passes only if: [five gates, lines 217-224]... If disclosure is inadequate, buy nothing." The vehicle rule at line 130 and repeated at line 235: "Use the Stocks and Shares ISA instrument," i.e. Trading 212, not a taxable general investment account.

**Sandisk rule**, `money/investment-strategy-2026-08-03.md:239, 245, 247`: "No SNDK order today." "The earliest review is Monday 17 August, after results, Investor Day and two full post-event sessions." "If both SPCX and SNDK later pass written theses, they share the existing 2% direct single-stock sleeve. SNDK is not added on top of the 92/6/2 allocation... Until then, SNDK's direct target is 0%."

**NVDA, MU, PLTR:** none of these three tickers appears anywhere in `money/investment-strategy-2026-08-03.md`, confirmed by direct search. There is no sleeve, target, vehicle or execution rule for any of them in the document at all.

**Kill switches**, `money/investment-strategy-2026-08-03.md:480-488`, pause all new investment if any is true: VAT/Corporation Tax/PAYE/NIC provision below 100% of estimate; operating balance below floor; a card statement not payable in full; the month's £50,000 glidepath transfer not made; a client receipt counted before landing; ISA records unreconciled; Kraken security or tax records incomplete.

**Permanent bans**, `money/investment-strategy-2026-08-03.md:490-498`: borrowed investment money; CFDs, spread bets, options, futures or margin; altcoin rotation; yield products, crypto lending or staking; SpaceX tokens or private allocations; live use of the archived bot environment; moving company money informally into personal accounts.

---

## Part 2: Recorded facts per position

All five buys are personal money in Harrison's own accounts, not company money, per `money/index.md:27`: "This is personal money and does not touch any company balance."

**SPCX**
- 2.28357191 shares at $117.36 average, $268 cost. Bought 4 August 2026, 14:30 BST, Revolut General Investment (taxable, personal).
- Sources: `money/day-one-inventory-2026-08-05.md:30`, `money/index.md:27`, `money/spcx-review-pack-2026-08-10.md:5`.
- Two factual deviations from the doc: bought same-day as Q2 earnings, against the "no order before earnings and the unlock" rule (line 213); held in a taxable Revolut account rather than the Trading 212 Stocks and Shares ISA the doc specifies (lines 130, 235).

**NVDA**
- 0.63249315 shares at $211.86, $134 cost. Bought 4 August 2026, 14:30 BST, Revolut General Investment (taxable).
- Sources: `money/day-one-inventory-2026-08-05.md:31`, `money/index.md:27`.
- No sleeve exists for this ticker in the strategy doc, per Part 1.

**SNDK**
- 0.0492647 shares at $1,360, $67 cost. Bought 4 August 2026, 14:30 BST, Revolut General Investment (taxable).
- Sources: `money/day-one-inventory-2026-08-05.md:32`, `money/index.md:27`.
- Bought same-day as the doc's explicit "No SNDK order today" instruction (line 239). Sandisk's Investor Day was 13 August per the doc (line 241); the doc's own 17 August review has not yet occurred in the repo.

**MU (Micron)**
- $50 bought 7 August 2026 at the US market open. Exact share count, fill price and GBP cost basis are **not in the repo**.
- Source: `money/index.md:23` only, which states directly: "Exact shares, broker fill prices and GBP cost basis still need the Revolut statement for CGT records. Do not substitute a published opening quote for the actual broker fill." Account/platform not recorded.
- No sleeve exists for this ticker in the strategy doc.

**PLTR (Palantir)**
- $50 bought 7 August 2026 at the US market open. Same gap as MU: no share count, fill price or GBP cost basis recorded anywhere.
- Source: `money/index.md:23` only, same caveat verbatim. Account/platform not recorded.
- No sleeve exists for this ticker in the strategy doc.

**Broker-unverified aggregate figures (flagged explicitly in the repo itself, not just by this pack):**
- "Roughly £500" deployed last week across all scout trades: `today.md:12`, `today.md:49`, `this-week.md:75`, `money/index.md:11`. No repo file computes this as a sum from the individual buys above; it is Harrison's own verbal figure.
- Portfolio "up about 20%": `today.md:12`, `today.md:49`, `money/index.md:11`. `today.md:49` states directly this has "not been reconciled against broker positions or GBP cost basis." `money/index.md:11` states "The return is broker-unverified and the exact GBP cost basis remains incomplete."
- Even the more detailed SPCX/NVDA/SNDK figures above, despite their precision, are never marked in the repo as checked against an actual broker statement. The day-one inventory worksheet's own checkbox to do this is unticked (see Part 3).

---

## Part 3: What is missing to decide, and exactly where to get it

1. **MU and PLTR broker fills.** Exact shares, execution price, timestamp, GBP cost basis, and which platform/account they were bought in are all absent. Get from: the Revolut statement or trade confirmation export for 7 August 2026 (or whichever broker was actually used, since the account is not recorded). `money/index.md:23` already names this exact gap.

2. **GBP cost basis for CGT on all five positions.** Only USD figures exist for SPCX, NVDA, SNDK; MU and PLTR have neither currency recorded. Get from: broker statement export covering 4 and 7 August 2026 trade dates.

3. **Current mark-to-market value of all five positions in GBP.** Get from: broker app portfolio view or statement, dated today. This is an open, unticked checkbox in the repo's own worksheet: `money/day-one-inventory-2026-08-05.md:34`, "Mark the three above to market in GBP today: £______."

4. **Verification of the "£500 deployed" and "up about 20%" figures Harrison reported.** Get from: the same broker statement, reconciled line by line against the five buys above.

5. **Completion of the day-one inventory worksheet**, `money/day-one-inventory-2026-08-05.md`, sections C and D. Every line is an unticked checkbox, including total portfolio value A, P0, M, S, G and A2. Without these the strategy doc's own shortfall mechanism, "buy only a positive shortfall" (`money/investment-strategy-2026-08-03.md:167`), cannot be run against any of these five tickers.

6. **A written record of the Monday 10 August SPCX five-gate review.** `money/spcx-review-pack-2026-08-10.md` prepared the five gates and supporting evidence for that session (lines 18-33) and closed with "Verdict all five gates in writing" (line 45). No file in `money/` or `capture/` records an actual verdict. Either the calendared session did not happen, or it happened and was never logged. Get from: Harrison directly.

7. **The SNDK 17 August review has not yet occurred** per any repo file. Today's pack date, 14 August, is three days ahead of that date. Investor Day input exists (13 August, per the doc) but the review itself is not due under the doc's own rule yet.

8. **No existing plan text to check NVDA, MU or PLTR against.** Since none of the three has a sleeve anywhere in `money/investment-strategy-2026-08-03.md`, an "amend" decision for these three would be new plan text, not a check against something that already exists. There is nothing further to look up here; this is a structural gap, not a missing data point.

---

## Part 4: Decision box, per ticker

Untouched. Harrison's call only.

**SPCX**
Decision: [ ] Amend   [ ] Fold   [ ] Hold
Notes:


**NVDA**
Decision: [ ] Amend   [ ] Fold   [ ] Hold
Notes:


**SNDK**
Decision: [ ] Amend   [ ] Fold   [ ] Hold
Notes:


**MU**
Decision: [ ] Amend   [ ] Fold   [ ] Hold
Notes:


**PLTR**
Decision: [ ] Amend   [ ] Fold   [ ] Hold
Notes:

