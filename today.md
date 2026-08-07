---
date: 2026-08-07
generated: auto-generated 06:30
financial_truth_updated: 2026-08-06 (Revolut Savings move + scout-buy pattern, see money/index.md)
---

# Today, Friday 7 August 2026

## Pulse

Week 2 of Long + Strong, Friday is Strength B. Wednesday and Thursday both landed on plan. Client side is quiet by design, LOR is on hold until Kerri's back on the 17th, but the A-level results window closes before that so one sign-off email can't wait. Creepers has a hard Sunday deadline on the WeTransfer image picks. Cathal's fortnightly check-in is on the calendar at 11:30. The real story of the week is the drift between what Harrison says about the market (watch-only) and what he's actually doing (five personal trades in 48 hours), that decision is overdue.

## Yesterday wrap

Landed: BM4 live on Acast and YouTube with the teaser posted, Cathal's combined message sent (invoice, payout ask, photos), Michael/Creepers Surrey follow-up closed after Harrison's call with Anna, Long + Strong week 2 Thursday run done (4.33km at 10:00, close to the 5km prescribed). Board Room's mutation-guard fix from the 6th also shipped, the site was hardened for that specific failure mode, but a new, unrelated blocker (a dependency advisory) then blocked last night's deploy, see System below.

Still open, no positive signal either way since yesterday: logged-out playback proof on Acast/YouTube, the Creepers Sandringham post, Laurence's testimonial film, Laurence's WhatsApp reply, Danny's stall reply, the LOR hold, the market decision, and KiwiSaver verification. None of these are confirmed missed, just unconfirmed, carried below.

## Today

- [ ] Creepers: choose selects from the ranked 15-pick shortlist in `business/clients/creepers-prolandscaper-shortlist-2026-08-06.md`. All 431 delivered files were reviewed Thursday night and are downloaded locally, so the Sunday link expiry no longer bites. Rules stand: no houses, minimal buildings, sky edits fine, plants as hero. Two decisions ride along: request originals for the 4 low-res shortlist picks (Jason Ingram and Jo Kossak via Garden Club London, credit lines in their Credits.docx), and the rootball gap, zero rootball shots in the whole transfer, so either ask Anna and Michael for existing ones or shoot them at the Surrey visit. Ideas to Anna and Sam next week, final deadline 19 August. <!-- linear:HWL-239 -->
- [ ] LOR: route the A-level results posts to Emma for sign-off. Results day is Thursday 13 August and Kerri is away until the 17th, the posts die by default without a decision before then. <!-- linear:HWL-191 -->
- [ ] Danny Wicks: upload the full Ultimate Founder Day footage to the editor today. Hold the share link until the £800 plus VAT is confirmed. <!-- linear:HWL-200 -->
- [ ] Film the Laurence Year One testimonial. Months overdue, talk-to-camera, catch and cut, no script. <!-- linear:HWL-235 -->
- [ ] Investment strategy: decide amend-or-fold on the personal scout buys (SPCX, NVDA, SNDK, then MU, PLTR, five trades in 48 hours outside `money/investment-strategy-2026-08-03.md`). Either write a capped scout sleeve into the plan or stop. <!-- linear:HWL-228 -->

## Awaiting response

- Kerri and Emma (LOR): PO route and first invoice, Everton date and quote, new visit-one date once Kerri's back on the 17th.
- Anna and Sarah-Louise (Creepers): exact Surrey S4 shoot date, still pending.
- Cathal: Acast payout account details. Today's 11:30 check-in is a natural point to close this.

## In flight

- KiwiSaver withdrawal: verification via Litchfields (Raj) on withdrawal mechanics, the real PIE tax drag, and UK lump-sum tax treatment. Decision recorded, nothing filed yet.
- Reply to Laurence's last WhatsApp.
- Logged-out playback proof on Acast and YouTube for BM4, if not already done.
- Board Room: nightly deploy blocked again, this time by a newly flagged high-severity dependency advisory (GHSA-5p4m-2wfm-xmqj) during deploy-side validation, a different failure from the mutation-guard issue fixed on the 6th. The nightly backup still committed and pushed cleanly, nothing was lost, the live site just didn't update. Codex's lane per SYSTEM-STATUS.md.
- Squiggly Careers: production chat Tuesday 11 August, 16:15 to 17:00, Teams, with Helen, Sarah Ellis and Sarah Massie.

## Standing

Health: RHR 53 this morning, up from the 6-day average of 49. Sleep and HRV are still filling in from Garmin's later daily pulls (normal lag, not stale). Training load is ACWR 0.69, Baseline flags it "Detraining." Body weight last recorded 29 April, 100 days stale, re-weigh or re-export if you want a current number.

Money: tax reserve £9,200 sitting in Revolut Savings at about 3% AER. £1,800 from Better at Work still outstanding. About £7,000 from LOR expected in August, no PO yet. Personal investing has drifted from stated watch-only into five scout trades in 48 hours. KiwiSaver withdrawal decided, verification pending via Litchfields.

Clients: LOR on hold until the 17th but the results-day window is live now. Creepers active, Sunday image-pick deadline, hero film content queued through August. BaW active, Cathal check-in 11:30 today, Season 5 brand and site lane still open.

System: scheduled agents running clean since Thursday's auth fix (auth-proof and evening-reflection both succeeded with no corrections). Board Room deploy blocked again overnight on a fresh dependency advisory, see In flight.

## Lens

You've said watch-only on the market three times this week and traded five times anyway. Either the capped scout sleeve goes into the strategy today or the watch-only line stops being true. Same shape of problem on the Creepers picks, that WeTransfer link is gone Sunday, today decides it, not next week.
