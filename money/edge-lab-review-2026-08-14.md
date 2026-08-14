# Edge Lab review, 14 August 2026

Internal continue/adjust/stop review of the edge-lab paper trading experiment, requested by Harrison after his own read that it has not been working well. This reviews the experiment, not the market. It makes no live-capital recommendation and proposes no trades. Every book is paper. The decision is Harrison's.

All figures come from read-only queries of `/Users/harrison/edge-lab/state/paper.sqlite` and `paper-macro.sqlite` on 14 August 2026, cross-checked against `state/report.log`, `research/edge-lab-g2a-review-2026-07-27.md`, `money/investment-strategy-2026-08-03.md` and `agents/_log.md`. One labelling note first: the books are denominated in US dollars ($10,000 paper each, `fills.cost_usd`). The morning briefs print the same values with £ signs. The numbers tie exactly (14 Aug brief crypto 9,684 / 9,450 / 9,164 are the 00:00 UTC daily closes in this database), the currency label is wrong.

## 1. What the experiment is

Built 4 July 2026 after an eight-agent research sweep (`research/verdict-2026-07-04.md`) found zero verified cases of an LLM beating a market with audited real money, and slow momentum as the only edge family that survives retail costs. Claim under test: Fable 5 on a disciplined loop, mechanical execution, hard risk limits, beats (a) doing nothing and (b) simple momentum rules, net of costs.

Two arenas, three $10,000 paper books each:

- **Crypto**: Kraken spot BTC/ETH/SOL/XRP, 4-hour bars, 44 to 50bp per side modelled costs. Control buys and holds equal weight. Rules is a multi-horizon TSMOM ensemble. Fable is the model, k=3 self-consistency, every 4 hours.
- **Macro**: SPY/QQQ/EFA/GLD/TLT daily, 10bp per side, next-open fills. Same three books, Fable daily.

Promotion ladder: G1 build (passed 4 Jul), G2a process gate (two clean weeks, 95%+ Fable coverage, first blood £250 to £500 live on a pass), G2b edge gate (bootstrapped 90% CI on daily active returns excludes zero, survives 2x costs), G3 scale.

## 2. What actually happened

Six weeks elapsed (4 July to 14 August, 41 days). No halts, no daily-loss-cap firings, no risk-engine misfires in either arena. Kill switch drilled 4 July. Observed crypto spreads at or under model (BTC 0bp observed vs 4bp modelled, ETH 0/4, SOL 1/10, XRP 0/10).

### Crypto arena

Equity at the latest mark (14 Aug 04:00 UTC):

| Book | Equity | Total return | Max drawdown | Fills | Fees | Extra churn |
|---|---:|---:|---:|---:|---:|---:|
| Control | $9,636.97 | -3.63% | -7.15% | 4 | $46.78 | none (entry only) |
| Rules | $9,428.07 | -5.72% | -6.51% | 44 | $185.41 | 2.9x book |
| Fable | $9,134.49 | -8.66% | -9.13% | 44 | $225.72 | 3.8x book |

Weekly closes (Sunday 00:00 UTC, control / rules / fable): 5 Jul 10,059 / 10,061 / 9,997. 12 Jul 9,798 / 9,859 / 9,765. 19 Jul 9,938 / 9,841 / 9,699. 26 Jul 10,124 / 9,758 / 9,594. 2 Aug 9,798 / 9,490 / 9,264. 9 Aug 9,846 / 9,532 / 9,264. 14 Aug 9,637 / 9,428 / 9,134.

Fable has been bottom of the table every week since 12 July. Control has led every week since 19 July. Doing nothing beat both active books. Fee decomposition: rules trails control by 2.09 points, of which 1.39 points is extra fees. Fable trails control by 5.03 points, of which 1.79 points is extra fees. Fable's own recent decision logs mostly conclude that nothing clears the 0.94% round-trip cost bar and hold. The book has converged to inactivity; the cadence mostly generated churn cost early, then model calls with no trades.

Positive days (win-rate proxy; per-trade win rate is not derivable, fills are rebalance legs, not round trips): control 22/39, rules 21/39, fable 18/39.

### Macro arena

Equity at the latest close (13 Aug):

| Book | Equity | Total return | Max drawdown | Fills | Fees |
|---|---:|---:|---:|---:|---:|
| Control | $10,204.54 | +2.05% | -3.86% | 5 | $9.99 |
| Rules | $10,225.60 | +2.26% | -3.90% | 8 | $11.59 |
| Fable | $10,045.79 | +0.46% | -3.01% | 12 | $14.27 |

Weekly closes (Friday, control / rules / fable): 10 Jul 9,971 / 10,000 / 10,028. 17 Jul 9,793 / 9,815 / 9,862. 24 Jul 9,741 / 9,751 / 9,812. 31 Jul 9,789 / 9,834 / 9,860. 7 Aug 10,166 / 10,173 / 10,025. 13 Aug 10,205 / 10,226 / 10,046.

Rules has led control on every marked day except 29 July. The margin is 21 basis points after six weeks, well inside noise (t = +0.2). Fable led both books through the whole July drawdown (defensive tilt worked), then missed the early-August rally and has been last since 3 August. Positive days: control 15/29, rules 14/27, fable 13/27.

### Reliability record

The Fable engine failed on 35 of 244 crypto bars (14%) and 5 of 28 macro decisions (18%). Error windows: 7 to 9 July (10 crypto errors), 2 to 6 August (24 crypto, 3 macro, coinciding with the Claude CLI login failures noted in `money/investment-strategy-2026-08-03.md`), and one more on 13 August. Root cause is still in the code: `edgelab/fable.py:149-150` does `re.search(r"\{.*\}", raw).group(0)` with no None check and no retry, so any CLI failure throws `AttributeError` and the book holds by default. Git log shows no fix was ever committed; the only commit since 5 July is the 27 July digest-metric fix. The 27 July review's line "Repaired, no recurrence" was wrong. The failure went quiet for three weeks and came back.

Consequence: during error windows the Fable book was frozen while prices moved. Roughly one bar in seven of the crypto Fable series measures uptime, not judgment. The comparison is contaminated, in an unknown direction.

## 3. What the experiment's own gates said

- **G1** passed 4 July.
- **G2a** was reviewed 27 July (first clean 14-day window completed 23 July, errors having stopped 9 July). Verdict recorded in `research/edge-lab-g2a-review-2026-07-27.md`: process pass, capital stays unarmed. Crypto coverage was 83/83 and macro 9/9 in that trailing window. First blood (£250 to £500 on a pass, per DESIGN.md) was not armed: Harrison had £940.52 of Monzo Flex due within five days against £800 unrestricted business cash. The review also caught and fixed a digest bug that had been counting FABLE_ERROR rows as coverage.
- **On today's data G2a would fail.** The current 14-day digest window shows crypto Fable coverage 58/83 (70%) and macro 6/9 (67%), both far below the 95% gate. Lifetime coverage is 86% crypto, 82% macro.
- **G2b** was set for 31 August (eight weeks), criteria: bootstrapped 90% CI on Fable minus Rules and Fable minus Control excludes zero, survives 2x costs, no process regression. As of today no comparison in either arena excludes zero (section 4), and the process-regression clause is already breached by the August error burst. For crypto Fable to reach significance by 31 August it would need roughly +16 points of excess return over control inside the remaining fortnight, from a book currently at -5.3% excess. G2b cannot realistically pass on 31 August.
- **The governing money document has already ruled on the ladder's top rungs.** `money/investment-strategy-2026-08-03.md` sets trading bots to 0% live capital through 3 August 2027, records Edge Lab's 3 August standings, and defines a 10-gate ladder for any future bot (including six further months of error-free paper, 100 independent trades, more than one volatility regime). DESIGN.md's press schedule (G2b pass arms £500 doubling monthly) is therefore void for at least 12 months. Whatever the paper books do, no result can move money before August 2027. The experiment's only possible outputs until then are information and gate-7 evidence.

## 4. Can this design produce a decidable answer?

Daily active-return statistics through 14 August (10,000-draw bootstrap, 90% CI, basis points per day):

| Comparison | n days | Mean bp/d | Cum excess | t | 90% CI | Excludes zero |
|---|---:|---:|---:|---:|---|---|
| Crypto Fable minus Control | 39 | -13.7 | -5.34% | -1.07 | [-34.9, +6.6] | no |
| Crypto Fable minus Rules | 39 | -4.5 | -1.76% | -1.06 | [-11.5, +2.3] | no |
| Crypto Rules minus Control | 39 | -9.2 | -3.66% | -0.70 | [-30.9, +11.6] | no |
| Macro Fable minus Control | 27 | -6.0 | -1.61% | -0.97 | [-16.1, +3.7] | no |
| Macro Fable minus Rules | 27 | -6.7 | -1.81% | -1.27 | [-15.7, +1.6] | no |
| Macro Rules minus Control | 27 | +0.8 | +0.20% | +0.23 | [-5.0, +5.9] | no |

Nothing is significant. Everything Fable touches points down, but not decisively. Now the forward arithmetic, using the observed daily active vols, one-sided 90% detection:

- **Crypto Fable vs Control needs about 9,200 trading days, roughly 25 years, to confirm a true 5%-a-year edge.** Active vol vs a fully invested control is 80bp a day because the comparison mixes market beta with skill. A full year of data can only resolve an edge of about 25% a year. This comparison is undecidable for any plausible effect. Same for Rules vs Control in crypto (27 years).
- **Fable vs Rules is the decidable-ish comparison**: about 2.8 years in crypto and 2.1 years in macro for a true 5%-a-year edge. One year resolves only edges above roughly 7 to 8% a year.
- **Macro Rules vs Control needs about 10 months** for a 5%-a-year edge, but the literature prior (about 0.4 net Sharpe, the reason this book exists) implies a smaller, slower effect than that.

Blunt version: at this cadence and sample, the experiment cannot answer its headline question ("does Fable beat doing nothing") on any horizon shorter than decades, and can only answer its useful question ("does Fable add anything over dumb maths") after 2+ years of clean data. Six weeks was never going to decide anything. The nightly digest has been reporting daily wiggles of an undecidable series, which is why the brief verifier has twice had to strip false narratives from it (28 July: wrong summary plus missed gate decision; 14 August: a false "rules moved ahead for the first time" novelty claim).

What six weeks did legitimately establish: the harness runs unattended (ticks, cost model, risk engine, backups, kill switch all behaved); modelled costs were honest against observed spreads; fee drag at 4-hour crypto cadence is real and large (2.26% of the Fable book in six weeks); an LLM loop without retry hardening silently converts auth outages into position decisions; and the forward data is consistent with the 4 July research verdict's null.

## 5. What the experiment costs to keep running

- **Compute**: about 21 headless Fable 5 CLI calls a day (crypto 6 bars x k=3 = 18, macro 3), roughly 650 a month, drawing on the same subscription rate limits as every other agent. The 2 to 6 August outage showed the coupling: when auth failed everywhere, this experiment silently degraded. Crypto accounts for 86% of the calls.
- **Jobs**: three launchd daemons (hourly paper tick, macro 22:45, digest 21:30 with sqlite backups), all currently loaded and exiting 0.
- **Attention**: a two-arena, roughly 40-line Telegram digest every night, a line in every morning brief, and recurring verifier labour (12 Aug figure verification, 28 Jul and 14 Aug corrections). This is the largest real cost. Daily reporting invites daily interpretation of noise.
- **Market money at risk**: zero, and none possible before 3 August 2027.

## 6. Recommendation

Split by arena, because the data splits by arena. The decision is Harrison's; these are the review's reads, with reasons and reversal conditions.

### Crypto arena: stop

Retire all three crypto books and the 4-hour loop. Reasons:

1. The headline comparison (anything vs control) is statistically undecidable at this cadence within decades. It cannot produce a verdict, only noise.
2. The Fable book is last every week since 12 July, paid the most fees, and its own decision log says the cost bar blocks nearly every trade. The arena's structure (44 to 50bp per side, 4-hour bars) mostly measures fee drag, and that result is already in.
3. It consumes 86% of the lab's model calls and produced the contaminated series (14% error bars).
4. A pass could not move money before August 2027 anyway.

Keep the database and logs; the decision log was always the product. Archive with a closing note. This does not touch the separate personal Bitcoin sleeve in the investment strategy, which is not part of edge-lab and not reviewed here.

### Macro arena: adjust, and continue only in the adjusted form

The macro arena is nearly free to run (3 model calls a day, $12 to $14 of modelled fees in six weeks) and hosts the one comparison with a genuine literature prior. But continuing unchanged means more nightly noise about an undecidable series. Conditions for continuing:

1. Fix the engine: None-guard and retry with backoff around the CLI call in `edgelab/fable.py` (the 149-150 parse), so an auth failure is a retry, not a position decision. This is a small Codex job. No fix, no continuation.
2. Digest weekly, not nightly. Keep the G2a/G2b evidence block. Drop the morning-brief line to gate events only (halt, error streak, review due).
3. Label the books in dollars everywhere they are reported.
4. Re-point the question in writing: the decidable comparison is Fable vs Rules (and Rules vs Control as the slow literature check). Drop Fable vs Control from the pass criteria as undecidable; record that as a design amendment at the 31 August review.
5. Pre-register the horizon: one review a year from now, aligned to the 3 August 2027 strategy review, with the stated expectation that even then only a large edge (roughly 7%+ a year vs rules) would be resolvable. If that information is not worth three model calls a day and one weekly digest line, stop this arena too. A written close-out beats a zombie daemon.

### The 31 August G2b review

Hold the date, but as the formal decision point for this review's recommendations, not as an edge test. On current data G2b cannot pass its own bar (no CI excludes zero, process regression already on the record), and nothing achievable in a fortnight changes that.

### What evidence would change these answers

- **Restart or upgrade**: a clean, error-free run in which the bootstrapped 90% CI for Fable minus Rules excludes zero on the positive side and survives 2x modelled costs, sustained over 8+ weeks. That is the design's own G2b bar, and it remains the right one.
- **Faster kill of the macro arena**: another engine-error streak after the fix, any risk-engine misfire, or a decisive negative Fable-minus-Rules CI at 8+ weeks of clean data.
- **Nothing before 3 August 2027 changes the live-capital position**, which is set by `money/investment-strategy-2026-08-03.md`, not by this experiment.

## Bottom line

The infrastructure worked. The measurement was honest. The answer so far is the null the 4 July research predicted: no evidence Fable adds anything over rules or over doing nothing, in either arena, and the crypto design cannot reach an answer on any useful horizon. Harrison's instinct that it has not been working is correct on performance, and doubly correct on the part he could not see: the engine has been silently degraded for about one bar in seven, and the gate system's top rungs were already switched off by his own money strategy. Stop crypto, slim macro down to cheap instrumentation or stop it too, and bank the real yield: the harness pattern, the cost model, and six weeks of evidence that discipline was never the missing ingredient.
