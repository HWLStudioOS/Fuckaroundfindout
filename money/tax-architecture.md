# Tax Architecture

**Status:** working architecture. Cash position updated from Harrison's 4 August 2026 report. Longer-term investment and retained-earnings sections remain planning material, not accountant-approved instructions.

This was a gap in the rewrite (`hwlstudio-rewrite/money/index.md` didn't cover SIPP, ISA, EIS/SEIS, retained earnings). Codex Finance Analysis (file 10) names it as a control priority. This file gets it on the system.

## VAT

- Threshold: £90,000 rolling 12-month UK VAT-taxable turnover.
- Status: **registered effective 30 June 2026**.
- Registration administration is complete with Fazila at Litchfields. There is no live VAT-registration or missing-letter task.
- Apply the accountant-approved VAT treatment and compliant invoice template to supplies from the effective date.
- If the £5,340 Creepers receipt is a standard-rated £4,450 net invoice, it contains £890 of output VAT. Confirm against the invoice rather than inferring it from the bank receipt.
- If the expected £1,800 Better at Work receipt is a standard-rated £1,500 net invoice, it contains £300 of output VAT. Do not count it as cash until it lands. If Cash Accounting is not active, output VAT may already be due based on the invoice tax point.
- Company goods bought before registration, still held at registration and supported by valid VAT invoices may qualify for pre-registration input VAT recovery if bought within four years. The normal window for qualifying services is six months. Ask Litchfields to check the camera and production-equipment invoices for the first return. [HMRC pre-registration VAT guidance](https://www.gov.uk/charge-reclaim-record-vat/reclaim-vat-business-expenses)
- The exact current rolling-12-month turnover, Cash Accounting Scheme status and next return balance have not been reconciled. Verify those from Xero or Litchfields. Under Cash Accounting, output VAT normally follows customer payments and input VAT follows supplier payments. [HMRC Cash Accounting guidance](https://www.gov.uk/guidance/vat-cash-accounting-scheme-notice-731)

## Corporation Tax

- Due ~mid-2027 (first full year, Aug 2026 year-end).
- Working control: ring-fence 25% of VAT-exclusive revenue until the accounts produce a profit-based provision. Reserve VAT separately.
- Current combined VAT and Corporation Tax reserve: **£9,200**, reported by Harrison on 4 August after moving £4,000 from the Creepers receipt. The internal VAT and Corporation Tax split is unknown.
- Harrison's planning estimate is about £100,000 first-year revenue. He expects costs and qualifying asset relief may bring profit toward £75,000, but £75,000 is not yet verified taxable profit.
- On a full 12-month period, with no associated companies or relevant distributions, £75,000 of taxable profit produces provisional Corporation Tax of about **£16,125** under current marginal relief: `£75,000 x 25% - (£250,000 - £75,000) x 3/200`. £100,000 of taxable profit would produce about **£22,750**. Turnover is not taxable profit. [HMRC Corporation Tax rates and allowances](https://www.gov.uk/government/publications/rates-and-allowances-corporation-tax/rates-and-allowances-corporation-tax)
- A £20,000 Corporation Tax-only reserve corresponds to roughly £89,623 of taxable profit under those assumptions. A £20,000 combined VAT and Corporation Tax reserve may be a sensible temporary control, but it is not an estimate until the two liabilities are calculated separately.
- Qualifying company-owned camera and production equipment may qualify for a 100% deduction through Annual Investment Allowance. The allowance must be claimed and depends on qualifying expenditure and ownership. Accounting depreciation is not itself the tax deduction. Confirm the asset register, business use and claim with Litchfields. [HMRC Annual Investment Allowance](https://www.gov.uk/hmrc-internal-manuals/capital-allowances-manual/ca23081)
- If the first accounts cover more than 12 months, the company must file two Corporation Tax returns and has two payment deadlines. The £75,000 and £100,000 calculations above are illustrative single-period scenarios until Litchfields confirms the dates and profit allocation. [HMRC accounting periods](https://www.gov.uk/corporation-tax-accounting-period)
- The architectural preference remains separate tax, operating cash, owner pay and profit/buffer buckets. Implementation state should be confirmed from the accounts before presenting it as incomplete.

## PAYE / Salary

- Harrison confirmed finance administration is current on 3 August. The old PAYE activation and PAYE/NIC check tasks are superseded.
- Planned monthly salary: £1,047 (utilises personal allowance).
- Plus dividends on top.

## SIPP via Ltd contribution

**Planning gap.** Setup state has not been refreshed.
- The standard pension annual allowance is £60,000, subject to tapering, the Money Purchase Annual Allowance, existing inputs and available carry-forward.
- A company employer contribution is not limited by Harrison's director salary in the same way as a personal contribution, but deductibility depends on the wholly and exclusively test and commercial remuneration context.
- Pension money does not count toward the £50,000 accessible-cash target and is normally inaccessible until at least age 57 under the currently scheduled rules.
- **Decision needed:** obtain Litchfields' safe range, including zero, then compare a compatible SIPP's company-payment mechanics and fees. Do not start until the business tax and operating floors are full and the personal cash glidepath has been green for three months.

## ISA

**Gap.** Personal Vanguard ISA mentioned in codex as active.
- Allowance: £20k for Harrison in 2026/27 across all his ISA subscriptions. Maya's allowance is hers and requires her separate decision.
- All gains tax-free.
- **Current policy:** reconcile the live holding and every 2026/27 subscription, then use the global core and cash priorities in `money/investment-strategy-2026-08-03.md`.

## EIS / SEIS

**Not part of the current 12-month plan.**
- 30-50% income tax relief on qualifying investments.
- CGT deferral.
- Loss relief.
- **Risk:** capital lock-up, business failure rate.
- **Future action:** revisit only after the £50,000 cash target, company floors and diversified core are funded. Use a specialist adviser before any cheque.

## Retained earnings policy

**Not defined.**
- How much of profit retained in the company vs drawn as dividends?
- What return is the retained capital earning if not deployed?
- **Decision needed:** target retained earnings level (e.g. 3-6 months of fixed business costs), excess deployed via SIPP / ISA / investment portfolio.

## Self Assessment

- At the planned dividend level, Harrison must report them through Self Assessment. [HMRC dividend reporting](https://www.gov.uk/tax-on-dividends/how-to-report-tax-on-dividends)
- Litchfields handles.
- Harrison's personal tax on dividends is separate from HWL Studio's £9,200 VAT and Corporation Tax reserve. Confirm the personal provision before treating extracted cash as investable. [HMRC dividend tax](https://www.gov.uk/tax-on-dividends)

## Annual accounts

- Year-end August 2026 (first full year).
- Litchfields prepares and files Companies House return.

## Accountant decision, parked

The 2026-strategy.md archive recommended replacing Litchfields with a sharper firm specialising in solo founders and creators in Harrison's bracket. The codex carries the verbatim "verify by asking three operators in your bracket who they use." This remains parked and is not a current finance-admin task.

**Decision triggers a switch:** Litchfields fails to deliver on ongoing VAT compliance, does not surface SIPP or EIS structures, or does not engage on Harrison's actual income trajectory.

## Future Litchfields planning agenda

1. Confirm the routine VAT filing cadence and Cash Accounting Scheme status at the next ordinary review.
2. Refresh the VAT and Corporation Tax reserve requirement from reconciled accounts, including eligible pre-registration input VAT on equipment still held at 30 June 2026.
3. Review SIPP via Ltd setup.
4. Confirm owner draw and director-loan classification of mixed business card charges.
5. Define retained earnings strategy.
6. Review ISA and EIS or SEIS architecture as a longer-term decision.
