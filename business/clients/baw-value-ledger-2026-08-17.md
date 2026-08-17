# Better at Work value ledger, 17 August 2026

For the 11:00 reprice call with Cathal. Evidence first, feelings nowhere. Read-only build; nothing sent, nothing edited elsewhere.

Sources: `business/clients/baw.md`, `business/clients/baw/*` (summer-plan, roadmap, content plans, production folders, deliverables), `money/index.md`, `money/weekly.md`, `SYSTEM-STATUS.md` lines 46 to 47, `git log codex/baw-frontier-site`, live tracker JSON at `betteratwork-summer.vercel.app/api/data` (v48), Gmail threads INV-0394 / INV-0397 / INV-0399, Granola 5 Aug meeting, `agents/_log.md`.

---

## 1. What BaW actually pays

| Invoice | Issued | Paid | Lines | Net | VAT | Gross | Source |
|---|---|---|---|---|---|---|---|
| INV-0394 | 29 May | 3 Jun ("Paid today H") | Monthly Content Retainer | £1,500 | 0% | £1,500 | Gmail thread 19e8db9844ec693f; `money/index.md` 3 Jun entry |
| INV-0397 | 29 Jun | 7 Jul ("Now paid sir, thanks for the great work") | Retainer £1,500 + Production Support (Podcast Studio Recordings) £400 | £1,900 | 0% | £1,900 | Gmail thread 19f3c8f4c42ad3bb. Note `money/index.md` logs this as £1,500; the invoice was £1,900 |
| INV-0399 | 29 Jul | 7 Aug ("thanks for another great month") | Monthly Content Retainer £1,500 | £1,500 | 20% = £300 | £1,800 | Gmail thread 19fdbbbea0c842a5; `money/weekly.md` line 34; £675 sweep done 9 Aug (`money/index.md` line 15) |

- Three months received: **£4,900 net** (£4,500 retainer + £400 studio support), £5,200 gross.
- Retainer is **£1,500 net/month**, invoiced end of month via Xero. VAT applied for the first time on INV-0399 (HWL's first VAT return is due 7 Sept, `money/weekly.md`).
- Cathal's ask (7 Aug, verbatim): "see what can be cut back on your side to get me to a monthly cost including VAT of max 1500. Happy to then talk through any impacts of this." That is **£1,250 net**, a 16.7% cut on the retainer. He forwarded a Level Up Leads auto-invoice 20 minutes earlier; he is reviewing every podcast supplier.
- Cathal's own framing of the summer (7 Jul, INV-0397 thread): "This is the first time I am paying to have someone on when show off (as Phoebe always took the time off) so I am keen to see if this makes a difference." He set the assessment point himself: **early September**. The 6 Jul Superstars meeting recorded "Budget: lean summer, retainer untouched" (`summer-plan-2026.md`).
- Invoice address change requested to Eastwood, Granville Road, Weybridge KT13 0QJ. His email domain is `betteratwork.com.au`. Which entity is on the invoice is unresolved (`baw.md` line 22).
- The "draft reply sitting in Gmail" in `baw.md` line 24 **does not exist**. `list_drafts` for cathal / Better at Work returned nothing. The reprice content lives in `baw.md` lines 17 to 25 and `agents/_log.md` (7 Aug reprice entry).

---

## 2. What HWL delivered, June to 17 August 2026

Two lanes, kept separate on purpose. **Lane A** is retainer scope (episode packaging, LinkedIn, reports, season planning, and the summer engine Cathal signed off on 6 Jul). **Lane B** is the Season 5 brand system and website rebuild, which `baw.md` line 23 says "stays a separately priced project" and which has never been priced to Cathal.

### June (Season 4 running, main show edits)

| Date | Deliverable | Scale | Evidence |
|---|---|---|---|
| 12 to 18 Jun | Roger Martin episode: 1:33:00 master split into two parts at 46:40, cold-open rankings, Cathal pickup list, captions/titles, launch package; Part 1 live 18 Jun, links emailed to Roger's office | 2 episodes' worth of packaging | `baw/roger-martin-launch.md`; Gmail 19ec0fc7c9240ca4 (sent 18 Jun) |
| June | Other Season 4 weekly releases packaged (33 releases catalogued in the S4 directory; individual June dates not verified one by one) | est. 1 to 2 further episodes | `baw/season-4-student-directory-2026-07-15.md` |
| 15 Jun | Monthly performance report Issue 05 (May/Jun): PDF + HTML off 11 CSV exports (Acast, LinkedIn, YouTube) | 1 report | `baw/data-2026-05/Better-at-Work-Issue-05-May-Jun-2026.pdf`, `report.html` |
| June | Cathal LinkedIn ghostwriting, caption variants, guest correspondence (Roger's team, Caroline Webb thread), 3 client calls (22, 24, 26 Jun) | recurring | `agents/_log.md` 16 Jun, 22 to 26 Jun; Gmail |
| June | Studio recording production support (billed separately at £400 on INV-0397) | studio days | INV-0397 |

### July (Season 4 wrap, summer engine solo)

| Date | Deliverable | Scale | Evidence |
|---|---|---|---|
| 6 Jul | Superstars strategy meeting: prep doc, meeting record, Summer Plan, Roadmap to S5, Season 5 Summer Plan PPTX, Sum Up template redesign (S3E16 HTML/PDF), B@W HQ static site | 3 strategy docs + deck + template | `baw/superstars-prep-2026-07-06.md`, `summer-plan-2026.md`, `roadmap-summer-2026.md`, `BaW-Season5-Summer-Plan.pptx`, `BaW-PodSumUp-Redesign-S3E16.*` |
| 7 Jul, upgraded 14 Jul, hardened 3 Aug | **Summer progress tracker**, Cathal-facing web app with live Redis persistence, weekly tasks, numbers, feed plan | live at betteratwork-summer.vercel.app, API v48 today | git 6428817, 0259875, 54ee50a; `SYSTEM-STATUS.md` line 46 |
| 7 to 9 Jul | Season 4 wrap episode: 36:32 edited master, 5 hard cuts + 9 tightens, launch package, published Thu 9 Jul; wrap launch clips | 1 episode + clips | `baw/s4-wrap-launch.md`; tracker W1 |
| 13 to 16 Jul | **Better Moments #1, Helen Tupper**: 13:31 of tape cut to 11:23 mini-episode with fresh cold open, live on Acast 16 Jul 06:00 | 1 mini-episode + shorts | `baw/best-bits-01-tupper.md`; `content-plan-2026-07-20.md` line 17 |
| 14 Jul | Two-week content plan; Season 4 student directory (4-page A4, 33 releases) | 2 docs | `content-plan-2026-07-14.md`, `season-4-student-directory-2026-07-15.md` |
| 18 Jul | Work-meme lane pilot (hard stop meme, 1080x1350 + reusable HTML source) | 1 asset + template | `baw/work-meme-hard-stop-2026-07-18.*` |
| 20 Jul | Roger value carousel, 7 frames, exported | 7 PNGs | `baw/exports/roger-strategy-carousel-2026-07-20/` |
| 23 Jul | **Better Moments #2, Roger Martin**: mastered audio, video/social cuts, IG/YouTube/LinkedIn artwork, micromanagement short, ManyChat flow spec, 4 handoff ZIPs, published 12:30 | 1 mini-episode + package | `baw/production/better-moments-02-roger-martin-2026-07-23/`; `agents/_log.md` 22 to 23 Jul |
| 26 Jul | Roger Martin **Sum Up** built and email-gated, Mailchimp test traffic sent | 1 lead magnet + funnel | `baw.md` 31 Jul state; tracker W2 |
| Jul | Sum Up #2 (Helen Tupper) and #3: tracker W3 marks both done; repo has export evidence only for Roger. Do not overclaim on the call | | tracker JSON W3 |
| Jul | Funnel: lead capture wired to email, Sum Up downloads gated, Better Careers checkout (tracker W3, done) | plumbing | tracker JSON W3 |
| 27 Jul | Better Bits newsletter (Roger "what would have to be true" tool + Sum Up feedback ask), UTM/link QA | 1 issue | `baw/newsletter-2026-07-27.md` |
| Jul | Newsletters: wrap issue (W1), Cathal's old LinkedIn newsletter ported to Mailchimp and sent (w/c 13 Jul), season-lessons issue | 3 further issues/drafts | tracker FEED; `content-plan-2026-07-20.md` |
| 27 to 30 Jul | **Better Moments #3, Russell Beck**: 8-slide IG carousel + 8-slide LinkedIn carousel + 3 launch graphics, transcripts, teaser reel; carousel live 28 Jul, reel 29 Jul, launch post 30 Jul on @betteratworkpod | 1 mini-episode + package | `baw/production/better-moments-03-russell-beck-2026-07-27/`; `baw.md` 31 Jul |
| mid Jul | Acast Marketplace + Tipalti set up on HWL side (Cathal's payout details still outstanding) | ops | `baw.md` 31 Jul; Gmail 16 to 17 Jul |
| Jul | 2 shorts/week, Cathal LinkedIn posts, Monday WhatsApp stand-ups, weekly Cathal-only progress email (his 7 Jul ask), brand refresh first directions (W2) | recurring | tracker W2 to W4; `roadmap-summer-2026.md` |
| **Lane B** 14 Jul, 27 Jul | Website: redesign brief, FAFO scope, frontier pilot + upsell doc (priced at £20k + VAT internally, never sent); frontier prototype built 14 Jul; production build fix 27 Jul | 3 docs + prototype | `baw/website-*.md`; git 6820651, e080e2f |

### August, 1 to 17

| Date | Deliverable | Scale | Evidence |
|---|---|---|---|
| 3 Aug | **Better Moments #4, Laura Gassner Otting**: 8 IG + 8 LinkedIn carousel PNGs, 3 launch graphics, 19 SVG sources, brand-tokens.json + artwork generator, transcripts, teaser captions, EDL, QC, publish checklists | 1 mini-episode + full package | `baw/production/better-moments-04-laura-gassner-otting-2026-08-03/` |
| 3 Aug | Summer tracker security hardening deployed 20:43 (edit-key writes, same-origin, headers, clean audit) + CI audit job | ops | `SYSTEM-STATUS.md` lines 36, 46 |
| 5 Aug | Christine Lampard listener-questions one-pager (TV opportunity) | 1 page | `baw/christine-lampard-listener-questions-2026-08-05.md`; Granola 5 Aug |
| 5 Aug | HL x CQ call: brand refresh walkthrough (palette, type, logo contrast, carousel system), site features (in-page player, AI show notes, episode search, Better Careers page, 63/58/64 categorised archive), Acast revenue live | call | Granola 5 Aug |
| 11 to 14 Aug | **Better Moments #5, Jennifer Moss**: 9:50 picture + audio masters, rebuilt from Riverside source (v2), 8 + 8 carousels, 3 launch graphics, transcripts v1 + v2, EDLs, Better Bits draft, LinkedIn clip copy for Cathal | 1 mini-episode + package | `baw/production/better-moments-05-jennifer-moss-2026-08-11/`; `baw.md` lines 9 to 15 |
| 13 Aug | Jennifer Moss **48-second AI-adoption reel captioned and published on @betteratworkpod** (two exports rejected first) | 1 reel, 3 exports | `baw.md` line 15; `agents/_log.md` 13 Aug |
| 13 Aug | Caroline Webb recording brief (S5 opener) | 1 prep pack | `baw/caroline-webb-prep-2026-08-13.md` |
| Aug | Newsletters #5, #6 drafts, 2 shorts/week, stand-ups | recurring | tracker W5 (done), W6 |
| **Lane B** 3 to 11 Aug | **Website**: public site draft 3 Aug + 6 CI/security commits; review draft 6 Aug with approved mark, 85-episode Acast snapshot, **Better Careers Stripe Checkout wired end to end (dormant, awaiting keys and Cathal's price/refund decisions)**; preview with Cathal 9 Aug; final pass 11 Aug at cce3f68: 93 routes 200, **101-page production build**, accessibility fixes, mobile hero. Branch: 15 commits, 47 files, 10,827 lines | a whole website | `SYSTEM-STATUS.md` line 47; `baw.md` lines 27 to 33; `git log codex/baw-frontier-site` |
| **Lane B** 5 to 14 Aug | **Season 5 brand system** in Figma Brand Playground: 23 component sets, 107 variants, 51 variables, logo contrast pass, episode artwork system, YouTube/IG/LinkedIn templates, guest launch kit, question bank; brand deck outline 5 Aug; **Season 05 Brand + Website deck FINAL (PPTX + PDF) 14 Aug** | design system + 12-slide deck | `baw/brand-deck-outline-2026-08-05.md`; `baw/deliverables/Better-at-Work-Season-05-Brand-and-Website-2026-08-14-FINAL.pptx`; `baw/season5-brand-website-deck-2026-08-14.pdf` |

Not done (tracker W5/W6, honest gaps): miniseries call-out posts on both LinkedIn profiles, trailer script, filming day, launch-date back-plan, Acast payout details (his). Long Jennifer Moss Better Moment still gated on host approval. Sum Ups #2/#3 evidenced only in the tracker.

---

## 3. Value it

Rates: **£550/day editing**, **£950/day on-location filming** (memory ref, day rates 19 May; no filming days evidenced in the window, the £400 studio support was billed below this rate). **£600/day for strategy, design and web build is an assumption**, not a quoted HWL rate. Day counts are output-based studio equivalents, deliberately low. Nobody logged hours; the hourly trial in `baw.md` has no timesheet.

### June (Lane A only)

| Item | Days | Rate | £ |
|---|---|---|---|
| S4 episode edits + packaging (Roger x2 parts, 1 further release, conservative) | 2.25 | 550 | 1,238 |
| Monthly report Issue 05 (11 CSVs, PDF + HTML) | 1.0 | 600 | 600 |
| LinkedIn ghostwriting, captions | 0.5 | 550 | 275 |
| Calls, guest correspondence, season planning | 0.5 | 600 | 300 |
| **June total** | **4.25** | | **≈ £2,400** |

Paid £1,500 net (+ £400 studio support billed separately). Ratio about 1.6x. **June does not support a £5k claim.**

### July (Lane A)

| Item | Days | Rate | £ |
|---|---|---|---|
| S4 wrap: 36:32 master, clips, package | 1.0 | 550 | 550 |
| Better Moments #1 Tupper | 0.75 | 550 | 413 |
| Better Moments #2 Roger (audio + video + artwork + short + handoffs) | 1.0 | 550 | 550 |
| Better Moments #3 Russell (2 carousels, 3 graphics, reel) | 1.0 | 550 | 550 |
| Superstars prep + summer plan + roadmap + PPTX + Sum Up template | 1.0 | 600 | 600 |
| Summer tracker app + persistence backend + upgrades | 1.0 | 600 | 600 |
| Roger Sum Up built + gated, funnel plumbing (lead capture, gating, Better Careers checkout) | 0.75 | 600 | 450 |
| Roger carousel (7 frames) + student directory + meme lane | 0.75 | 600 | 450 |
| Brand refresh first directions | 0.5 | 600 | 300 |
| Newsletters x4 (draft/port/QA) | 1.0 | 550 | 550 |
| LinkedIn ghostwriting + shorts captions | 0.5 | 550 | 275 |
| Acast/Tipalti, stand-ups, weekly progress email, dashboard updates | 0.5 | 550 | 275 |
| **July Lane A** | **9.75** | | **≈ £5,560** |

Haircut 25% for AI leverage and generous day counts: **£4,200 to £5,600**. Paid £1,500. Ratio 2.8x to 3.7x. **July supports the claim on its own.**

Lane B July: website scoping (3 docs) + frontier prototype + build fix, 2.0 days at £600 = **£1,200**, unbilled.

### August, 1 to 17 (Lane A)

| Item | Days | Rate | £ |
|---|---|---|---|
| Better Moments #4 Laura, full package + artwork generator | 1.0 | 550 | 550 |
| Better Moments #5 Jennifer Moss, 9:50 masters, rebuild v2, carousels, 48s reel x3 exports, published | 1.5 | 550 | 825 |
| Legacy artwork system restore | 0.25 | 550 | 138 |
| Christine Lampard one-pager + Caroline Webb prep | 0.5 | 600 | 300 |
| Tracker hardening + CI | 0.5 | 600 | 300 |
| Newsletters #5/#6, Better Bits draft, LinkedIn clip copy | 0.75 | 550 | 413 |
| Stand-ups, reprice admin | 0.25 | 550 | 138 |
| **Aug Lane A to date** | **4.75** | | **≈ £2,660** |

In 2.5 weeks. Tracks to roughly **£4,000 to £4,500** for the full month if W7 to W8 lands (Better Moments #6/#7, Webb packaging, trailer). Paid £1,500 net.

Lane B August: brand system + deck 4.0 days, website draft/review/Stripe/accessibility/final pass 4.0 days, 8 days at £600 = **£4,800**, unbilled. Lane B total July + August ≈ **£6,000 at cost-day rates**. HWL's own price for design, build and launch was £20,000 + VAT with a £15,000 floor (`website-frontier-pilot-and-upsell-2026-07-14.md` lines 302, 334); the 6 Aug posture softened that to "happy with a few thousand, July £15k floor not real, anchor high, never slide into retainer" (memory: BaW site pricing posture).

### The honest summary

| Month | Paid net | Lane A (retainer scope) | Lane B (brand + site, unbilled) | Total delivered |
|---|---|---|---|---|
| June | £1,500 (+£400 studio) | ≈ £2,400 | 0 | ≈ £2,400 |
| July | £1,500 | £4,200 to £5,600 | ≈ £1,200 | £5,400 to £6,800 |
| Aug (to 17th) | £1,500 | ≈ £2,660, tracking £4,000+ | ≈ £4,800 | ≈ £7,500 |
| **3 months** | **£4,900** | **£9,300 to £10,700** | **≈ £6,000** | **£15,000 to £17,000** |

- **Retainer-scope work alone averages about £3,500 to £4,000 a month** against £1,500 paid. Not £5k. June was £2.4k. The £5k+ month is real in July and August, but only because the summer engine replaced main-show editing (Cathal's own words: "the time not needed for editing main show") and because the brand and website lane is running on top, unpriced.
- **The £5k belief is right on total, wrong on category.** If Harrison says "I do £5k of work for you" and Cathal hears "on the retainer", Cathal can fairly point at June. If Harrison says "the retainer runs at roughly 2.5x what you pay, and there is a separate £6k+ of brand and website work sitting in your inbox as a preview that we have not priced yet", that is defensible line by line.
- The floor in `baw.md` line 21 (~10 hrs/week ≈ £2,900+ at £550/day) still holds as the minimum. £1,250 net would be under half of the floor.
- Biggest risk on this call: Cathal treats the website and brand system as included, agrees a cap, and HWL has just given away a £6k to £20k project inside a £1,250 retainer. `baw.md` line 23 already says do not let that happen.

---

## 4. The call frame

Order matters. Two agreed questions first, then the ledger, then options. Calm, numbers, no defence.

**1. VAT question, ask it straight.**
"Quick one before anything else. Is Better at Work VAT registered? Because if you are, you claim the £300 back and your real cost never moved. The £1,500 cap incl VAT is a £250 cut on a bill that already costs you £1,500. If you're not registered, then fair enough, the VAT is a real 20% jump on your side and we should talk about it properly."
If registered: the reason for the ask disappears. Hold price, no scope change, done.
If not: move to question 2.

**2. Entity question.**
"Which entity should the invoice go to? The address you sent is Weybridge, but you run on betteratwork.com.au. If the customer is the Australian business, Fazila needs to check whether UK VAT even applies to a B2B service supplied to Australia. It may not. That could remove the whole problem rather than shrink the scope. I'll get her a straight answer this week." (Not tax advice, Fazila confirms. Note the Weybridge address suggests a UK invoicing party; the answer is not obvious.)

**3. The ledger, plain.**
"On the numbers. You set the test yourself on 7 July: first time paying someone through the show being off, assess in early September. Since then, five Better Moments produced, four in the feed, the Jennifer Moss reel published Thursday, six newsletters, the summer dashboard live, Roger's Sum Up gated, Acast Marketplace set up, the Christine and Caroline prep packs. At studio rates that's roughly £4k to £5.5k a month of retainer work in July and August against £1,500. June was lighter, about £2.4k, because it was straight episode packaging. On top of that, separately, is the Season 5 brand system and the 101-page website with Better Careers checkout wired. That's a project. It's not in the retainer, and I've never priced it to you, and I should have. That's on me."

**4. Options, two, not five.**
- **Hold.** £1,500 net stays through the September checkpoint you set. We assess value then with the numbers in the dashboard, not now, mid-experiment. Season 5 brand and site is priced separately as its own project. Anchor: the build cost me weeks; a few thousand for launch and handover is fair, and I'd rather agree that as a number than have it blur into the retainer. (Memory 6 Aug: happy with a few thousand, anchor high, never slide into retainer.)
- **Cap.** If £1,250 net is a hard ceiling, the rate doesn't move, the scope does: keep episode packaging and Better Moments, retire the monthly report (the dashboard replaced it), drop the LinkedIn ghostwriting, fold season planning into the fortnightly call. That's the `baw.md` cut. Brand and site still separate. He said "happy to talk through any impacts", so name the impacts, don't hide them.

**Close.** "Tell me which of those you'd rather, and I'll confirm the VAT and entity answer with Fazila and put it in writing this week." Then stop talking.

**What not to say**
- Not "you don't realise how much I do." He asked for a scope review, he did not accuse anyone. Show the ledger, let him do the maths.
- No martyrdom, no hours, no "I've been working weekends." Output at rates, nothing else.
- Don't say £5k flat. Say "£4k to £5.5k in July and August, June was £2.4k." Precision reads as truth; a round number reads as a feeling.
- Don't discount the same scope. If the number moves, the scope moves (`website-frontier-pilot-and-upsell` line 334; `baw.md` line 21).
- Don't lead with the website as leverage. It lands harder as a separate, calmly named project than as a bargaining chip.
- Don't reference the Level Up Leads forward. He's cutting suppliers; that's his business.
- Don't promise the long Jennifer Moss Better Moment or Sum Ups #2/#3 as shipped. Tracker says done, repo evidence is thin. Say "produced" for what is produced and "live" only for what is live.

**One line if it gets tight:** "The rate is already under the floor for the scope. I'd rather cut scope than pretend the number works."
