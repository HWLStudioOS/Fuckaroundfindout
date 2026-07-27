# Edge Lab G2a review, 27 July 2026

## Decision

**Process gate passes. Capital stays unarmed. Paper experiment continues to the eight-week G2b review on 31 August 2026.**

This is not a kill. It is also not evidence of an edge yet. The system is running cleanly and the two arenas disagree on performance.

## Process evidence

| Check | Crypto | Macro | Read |
|---|---:|---:|---|
| Successful Fable outputs, latest 14 days | 83 / 83 | 9 / 9 | Pass |
| Fable engine errors, latest 14 days | 0 | 0 | Pass |
| Latest historical error | 9 Jul 08:00 UTC | 8 Jul 00:00 UTC | Repaired, no recurrence |
| Observed spreads versus model | BTC 0/4 bp, ETH 0/4, SOL 1/10, XRP 0/10 | Not applicable | Pass |
| Active halts | None | None | Pass |
| Kill switch | Drilled 4 Jul | Drilled 4 Jul | Pass |

The digest had a measurement bug: it counted `FABLE_ERROR` rows as model coverage because they were auditable decision records. That did not affect fills or risk controls, but it flattered the process line. `edgelab/report.py` now reports successful outputs in the latest 14 days and shows errors separately.

## Performance evidence

### Crypto, through 27 July

- Control: $10,111.05, **+1.11%**.
- Rules: $9,744.70, **-2.55%**.
- Fable: $9,586.77, **-4.13%**.
- Fable versus control cumulative excess: **-5.52%**, t = -1.4 across 135 intervals.

Fable is last. It has also paid the most fees, $165 versus $124 for rules and $47 for control. There is no crypto edge signal worth funding.

### Macro, through 24 July

- Fable: $9,812.28, **-1.88%**.
- Rules: $9,751.13, **-2.49%**.
- Control: $9,740.55, **-2.59%**.
- Fable versus control cumulative excess: **+0.72%**, t = 0.8 across 15 intervals.

Fable leads the comparison, but every book is negative and the sample is tiny. This is interesting, not investable.

## Why no live first-blood allocation now

G2a proves the machinery, not the return claim. The design allows £250 to £500 after a process pass, but Harrison has £940.52 of Monzo Flex due within five days and only £800 in unrestricted business cash. Arming a speculative book during that cash sequence would be poor capital allocation and requires Harrison's explicit money tap in any case.

## Next gate

Continue both paper arenas unchanged. Review G2b on 31 August, after at least eight weeks of forward data. The promotion test remains:

- Bootstrapped 90% confidence intervals for Fable minus Rules and Fable minus Control exclude zero.
- The result survives double modelled costs.
- No process regression, unexplained decision or risk-engine failure.

Until then, the honest line is: the bot is running, process is clean, crypto Fable is losing, macro Fable is narrowly leading, and no live capital is armed.
