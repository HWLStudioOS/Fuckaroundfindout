# 13-Week Cash Forecast

**Status:** scaffold. Populated by `agents/weekly-cfo.md` once wired (target: 2 consecutive Friday refreshes for v1 acceptance).

## Current inflow baseline, 4 August 2026

- £5,340 from Creepers landed on 4 August.
- Harrison moved £4,000 into the combined tax reserve, taking it to £9,200.
- £1,800 from Better at Work is expected on 4 August but had not landed at the morning update.
- About £7,000 from LOR is expected during August.
- No other current receivable or unbilled-work obligation was reported.
- Exact opening operating cash, card balances, VAT provision, Corporation Tax provision and weekly outflows were not refreshed, so a defensible 13-week table cannot yet be calculated.

This baseline supersedes the 3 August combined Better at Work and Creepers estimate and the 31 July generated estimate of £21,000 to £22,000 unbilled. It does not convert the expected £8,800 into received cash.

The codex Finance Analysis (file 10) lists "build a 13-week cash view before making product/course or hiring decisions" as a control priority. This file gets it on the system.

## Why 13 weeks

Long enough to see Q-shape patterns (LOR pay cycles, BaW/Creepers retainers, big seasonal spend like Chelsea or visa renewals). Short enough to be useful for actual decisions like editor hire, course launch, retainer commitment.

## Required inputs (each Friday)

- Starling business statement balance (live).
- Business credit card balance (live).
- Open invoices by client, by age, with expected pay date.
- Expected next 13 weeks of inflow by client.
- Fixed business costs (subscriptions, vehicle, accountant, etc.).
- Variable costs forecast (editor hire if active, equipment, travel).
- Tax reserve target progression.
- Owner draw planned (£1,047 salary + dividends).
- Joint personal cash + rent through joint account.

## Output format

Week-by-week table. 13 columns. Five rows:
1. Opening cash (Starling business).
2. Inflows expected.
3. Outflows expected.
4. Closing cash.
5. Tax reserve cumulative.

Below the table, two paragraphs:
- Bottom line: cash position at week 13, tax buffer status, one risk to watch.
- Monday action: one specific thing to do first thing Monday.

## Acceptance criterion

A simple agent-produced refresh on Fridays. Honest about gaps. Doesn't fabricate forecasts where information is missing; explicitly says "unknown, ask Harrison" instead.

## When the agent runs

Friday 16:00 local. Reads `money/index.md` + `money/snapshot.md` + open invoice records. Calls Xero MCP if available, else flags Xero unreachable and proceeds with manual data. Writes to `money/weekly.md` (will be added). Telegram digest under 200 chars.

See `agents/weekly-cfo.md` for the full prompt.
