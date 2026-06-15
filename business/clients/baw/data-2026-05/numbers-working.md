# BaW Report — Data Working File

Report period: **1 May – 15 June 2026** (rolling through today). Issue No. 05.
Coverage: Podcast (Acast + Spotify + Apple) · YouTube · LinkedIn · Instagram.
Build: Figma → PDF. Prior issue (Apr) was HTML→PDF, Chromium/Skia.

## Source provenance (what we have locally vs must pull)

Local files in `~/Downloads` (pulled 5 May, cover 1 Apr – 5 May + history):

- **YouTube Studio export** = `Content 2026-04-01_2026-05-05 Better@Work Podcast.zip`
  (unzipped to `acast-apr/` — misnamed folder, contents are YouTube: `Table data.csv` per-video totals, `Chart data.csv` per-video daily, `Totals.csv` daily engaged-views).
- **Spotify for Creators exports** (`BetterAtWorkwithCathalQuinlan_*`):
  - `OnSpotify_4-1-2026--5-5-2026.csv` — daily Plays / Consumption hours / Followers
  - `Streams_4-1-2026--5-5-2026.csv` — daily Streams
  - `AudienceSize_4-1-2026--5-5-2026.csv` — daily Audience size
  - History: `OnSpotify_11-1-2024--8-1-2025` (pre-HWL), `OnSpotify_8-1-2025--4-1-2026` (S4), `StreamsAndDownloads_all-time`, `EpisodeRankings_all-time`, `GeoLocationAllPlatforms_8-1-2025--4-1-2026`, `Apps_8-1-2025--4-1-2026`, `Devices_8-1-2025--4-1-2026`.

**No Acast export exists locally.** April report's Acast numbers (downloads, country geo, app split) were read live or not saved. → MUST pull Acast fresh for 1 May–15 June.

## STILL TO PULL (1 May – 15 June 2026)

- [x] **Acast** — DONE (exports 5–9, pulled 15 Jun). Results below.
- [x] **Spotify for Creators** — DONE (13 CSVs, pulled 15 Jun). Results below. Outstanding: period-unique audience tile (read from dashboard, not in CSVs).
- [x] **YouTube Studio** — DONE (Content zip 5-1→6-15). Results below. Note: export used "Views" not "Engaged views" (April led on engaged views).
- [ ] **LinkedIn**: follower growth + top posts (confirm: Cathal personal page vs "Better at Work" company page).
- [ ] **Instagram** @betteratworkpod: follower count + public post engagement.

## BASELINES (confirmed from local files, reconcile to April PDF)

### April 2026 finals
- **Spotify**: Plays **216** · Consumption hours **54.7** · Followers end **739** (start 735, **+4**) · daily peak 30 Apr (18 plays).
- **YouTube** (Apr 1–May 4 window): Engaged views **1,206** · Views **2,140** · Watch hrs **33.8** · Unique viewers **1,104** · New viewers **1,079** · Subs **+5** · Impressions **4,729** · CTR **2.41%** · Avg %viewed **16.08%** · Stayed-to-watch **52.87%**.
  - Top YT by engaged: Prisoners 583 (987 views, 57.1% avg viewed), Groupiness 253, Ask for a raise 60, Sunday Scaries 56, 3 Skills [long] 55, Ex-Tesla [long] 53.
- **Acast** (from April PDF, no local file): period downloads 869 (Apr 8–30), ~1,133 projected full-month; platform split Apple 574/60%, Spotify 179/19%, Other 110/11%, Overcast 31/3%, Chrome 26/3%; geo AU 288/32%, US 235/26%, UK 154/17%, IE 61/7%, FR 55/6%.

### Comparison baselines
- **Pre-HWL Omny avg/month**: 710 downloads (Nov 2024–Aug 2025).
- **HWL Spotify era avg/month**: 818 all-platform streams (Oct 2025–Mar 2026).
- **Spotify S4 avg plays**: 363/mo (Oct 25–Mar 26); pre-HWL Spotify avg 210/mo; S4 low Dec 2025 = 249.
- **All-time monthly best**: Mar 2023 = 1,572 downloads.

### Spotify all-platform — app split (8/2025–4/2026, "V2 all-time")
Apple 57.3% · Spotify 30.0% · Web 4.4% · Overcast 2.45% · Other 5.8%.

### Spotify all-platform — geo (8/2025–4/2026)
AU 34.3% · UK 22.6% · US 19.3% · IE 10.4% · CA 2.4% · NZ 2.0% · rest <1%.

### Spotify all-time episode ranking (top)
1 Helen Tupper 341 · 2 Smart Conflict 247 · 3 Future of Work 2030 245 · 4 Zach Mercurio 240 · 5 Gassner-Otting 203 · 6 Tasha Eurich 203 · 7 Nieto-Rodriguez 196. (#22 = 112; "100+ = top 22 of 4-yr catalogue".)

### May 1–5 partial (Spotify, for continuity check)
Plays 39 (12/10/7/6/4) · Consumption 8.55h · Followers →740 by 4 May. YouTube daily engaged 1 May–4 May: 4/4/6/4 (post-launch lull).

## METRIC CAVEATS (must appear in report)
- **Spotify "Plays" redefined 11 June 2026** to a 30-sec standard. Our window straddles it → plays before/after 11 June are NOT the same definition. Flag explicitly; do not compute a clean MoM on plays across the boundary.
- **Acast downloads ≠ Spotify plays**: downloads = any RSS fetch (incl. passive); plays = 60s+ active (pre-11 June). Like-for-like only vs Omny downloads.
- **Unique listeners / audience size** is a deduplicated period figure — read from dashboard, never sum the daily CSV.
- May coverage is now a FULL month on Acast (April was only 23 days, Apr 8–30, post-migration) → first clean full-month Acast comparison.

## ACAST RESULTS — 1 May to 14 June 2026 (45 days; exports 5–9, pulled 15 Jun)

File map: export(5)=daily downloads · export(6)=per-episode downloads · export(7)=daily listeners · export(8)=app/client split · export(9)=country.

- **Total downloads: 1,297.** May full month (1–31): **929**. June 1–14: 368.
  - vs pre-HWL Omny baseline 710/mo → May **+31%**. First clean FULL month on Acast.
  - April caveat: 869 over 23 days (Apr 8–30), not a clean full-month compare. Day-rate Apr ~37.8/day (launch-dense window) vs May ~30/day.
- **New episodes in window (all cleared 100+ downloads):**
  - Leidy Klotz — "3 Things Every Office Steals From You" — 28 May — **179** (top)
  - Wendy Smith — "Why Smart Leaders Stop Making Clear Choices" — 14 May — **165**
  - Q&A with Annette — "Pet Shop Rabbits, Hope, and Big Career Moves" — 7 May — **153**
  - Listener Questions S4 E29 — "Finish Nothing" — 21 May — **135**
  - Listener Questions — "Why Your Office Feels Wrong" — 11 Jun — **105** (3 days, pacing well)
  - Carry-over: Jennifer Moss — "Yoga / Burnout" — 30 Apr — 106 (in-window)
  - GAP: no episode the week of 4 June (28 May → 11 Jun = 2-week gap). Flag, do not assume cause. Roger Martin recorded 12 Jun, not yet published.
- **Platform split (of 1,297):** Apple 703 (**54%**), Spotify 281 (**22%**), Other 97 (7.5%), Chrome 62 (4.8%), Overcast 35 (2.7%), Undefined iOS 33, Edge 23, rest small.
  - Spotify share UP vs April (19% → 22%) — eases April's Spotify-discoverability worry. Caveat: Acast app-attributed downloads ≠ Spotify-for-Creators plays.
- **Geography (of 1,297):** AU 396 (**30.5%**), UK 275 (**21.2%**), US 258 (**19.9%**), IE 81 (6.2%), HK 62 (**4.8%**), Canada 26 (2.0%), Taiwan 25 (1.9%), Spain 15, Belgium 14, Denmark 13.
  - France bright-spot FADED (Apr 55 / 6% → May–Jun 6 / 0.5%) — transient, as April suspected. **Hong Kong (4.8%) + Taiwan (1.9%) emerged** instead.
  - UK (21.2%) still closing on AU (30.5%); US strong (19.9%).
- **Daily listeners:** weekly launch spikes ~72–79, baseline ~10–25. Healthy pulse + long tail (same shape April flagged). Daily-unique, not summable to a period figure.

NOTE on period label: Acast data is complete through **14 June** (today 15 Jun is partial). Label report window "1 May – 14 June 2026" for honesty, or keep "to 15 June" with a footnote.

## SPOTIFY FOR CREATORS — 1 May to 15 June 2026 (13 CSVs, pulled 15 Jun)

- **Plays: May 279** (full month). Period (1May–15Jun) 364. **vs April 216 = +29%.**
  - April was the "broke its floor" month (216, below S4 low of 249). May 279 is back above the floor and tracking toward the S4 avg (363). **The April Spotify worry reversed.** May is entirely pre-11-June, so like-for-like vs April (both 60s+ play definition).
- **Consumption hours: May ~70.3** (period ~90.7). vs April 54.7 = **+28%**. Tracks the plays recovery.
- **Followers: end ~744–745** (peak 745, 11–13 Jun). +4 in May (739→743), ~+5–6 over the 45 days. STILL SLOW velocity vs the "+7 to +12 typical" April flagged → continued soft spot.
- **Show-page impressions (closes April's open gap): ~2,632 over 5/15–6/13** (Spotify only retains ~30 days). New eps driven by **Home feed**, evergreen by **Search**. Top by impressions: Leidy Klotz 185 (Home 139), LQ S4E29 165 (Home 115), Wendy Smith 164 (Home 133); evergreen Tasha Eurich 72 (Search 59), Antonio 71 (Search 46).
- **Top by consumption time:** Wendy Smith 12.94h, Jennifer Moss 12.29h, Leidy Klotz 8.18h, LQ S4E29 5.73h, Q&A Annette 5.15h.
- **Completion rates:** Ex-Tesla 63%, Marcus Collins 50%, LQ Jun11 45%, Jennifer Moss 40%, Wendy Smith 38%, Q&A Annette 36%, LQ S4E29 25%, Leidy Klotz 20% (long ep, sampled not finished).
- **Spotify-only geo:** AU 47.8%, IE 17.3%, US 14.0%, UK 11.8% (skews far more AU/IE than the Acast all-platform picture; small sample).
- Comments: 0 across the period.

## AUDIENCE DEMOGRAPHICS — NEW (Spotify, not in April report)

- **Gender: Female 69.9% · Male 22.1% · Non-binary 1.8% · Not specified 6.3%.**
- **Age: 45–59 = 68.4% · 35–44 = 19.5% · 28–34 = 6.3% · 60+ = 4.0% · 23–27 = 1.8%.**
- **Core ICP, now visible: women aged 45–59.** Returning listeners dominate daily segments (loyal core; modest new-listener inflow). Small sample (Spotify subset), label as such.

## YOUTUBE — 1 May to 14 June 2026 (Content zip)

- **Views 2,338** (May 2,179 + Jun 1–14 159). **Watch hours 65.6** (vs April 33.8 = ~2x). **Subscribers +10** (vs April +5 = 2x). **Impressions 6,068. CTR 3.18%** (vs April 2.41%). All up.
- **Standout short: "Your Office is Lying to You??" (pub 27 May) — 1,184 views, 14.71% CTR.** The new "Prisoners are happier." Drove the 28 May spike (940 views in one day). "Why should we share goals?" (30 May) 412 views.
- **Long-form drives watch hours:** Jennifer Moss 16.3h, Q&A Annette 8.4h, The Only 3 Skills [evergreen] 6.1h, LQ Jun11 4.3h, Antonio 4.3h. Shorts drive views, longs drive watch time (same split as April).
- METRIC NOTE: this export reports **Views**, not **Engaged views** (April's headline metric = 1,206 engaged). Either re-pull engaged views for parity, or pivot May report to Views and footnote the change.

## SYNTHESIS — the May narrative

Recovery + resilience. (1) April's loudest worry (Spotify "broke its floor", 216 plays) REVERSED: plays +29%, consumption +28%. (2) First clean full month on Acast: 929 downloads, +31% on the Omny baseline. (3) Held the number despite a missing episode week (28 May → 11 Jun gap) = resilience. (4) YouTube accelerating: watch hours + subs doubled, new viral short (1,184 views / 14.7% CTR). (5) Audience now legible: women 45–59 core. Soft spots that persist: Spotify follower velocity still slow (+4/mo); the content gap (missing week). France faded as predicted; HK + Taiwan emerged.

## STILL TO PULL — social
- [x] **LinkedIn** — DONE. Cathal personal profile, AggregateAnalytics xlsx (5 sheets). Results below.
- [x] **Instagram** — DONE (Insights screenshots, ~30 Apr–13 Jun). Results below. GAP: absolute follower count not shown (only net +17).
- [ ] **Spotify period-unique audience** tile (the "132"-equivalent for May–Jun) — minor, dashboard read.

## LINKEDIN — Cathal Quinlan personal profile, 1 May to 15 June 2026 (AggregateAnalytics xlsx)

- **Impressions 21,869 · Members reached 8,167 · Engagements 665 (~3.0% engagement rate).**
- **Followers: 4,070 total (15 Jun); +134 in the period** (+103 in May alone, ~100/mo). Steady ghostwriting-driven growth (was ~2,700 Nov 2025).
- **Top posts by reach:** "new episode is live, asking nicely" (7 May) 5,203; "wrap up our season" (5 Jun) 2,627; "making our podcast is mostly..." (20 May) 2,203; "business schools teach the wrong thing" (14 May) 1,980; "look who's finally in the same room, Annette" (11 Jun) 1,212.
- **Top posts by engagement:** "wrap up our season" (5 Jun) 114; "asking nicely" (7 May) 106; "business schools..." (14 May) 104; "making our podcast..." (20 May) 61; "instinct in meetings" (13 May) 49.
- **Newsletter relaunched** → closes April's "newsletter overdue" item. "the newsletter is back" post (2 Jun, 710 impressions, 20 eng). The Better Bits is live again.
- **Audience (ghostwriting ICP proof):** Location Sydney 27% / London 15% / Melbourne 6% / NYC 4% / Dublin 2%. Seniority Senior 34% / Director 19% / CXO 7% / VP 6% / Owner 5% (≈40% senior decision-makers). Industry Financial Services 17% / Consulting 9% / Banking 9%. Companies: Westpac, Laing O'Rourke, Goldman Sachs, CommBank.
- Read: strongest proof-of-HWL-work surface. 21.9k reach, steady follower growth, senior finance/consulting audience in the show's core cities (AU + UK). Mirrors the podcast geo.

## INSTAGRAM — @betteratworkpod (Cathal Quinlan), ~30 Apr to 13 Jun 2026 (Insights screenshots)

- **Views 9,433** (Stories 3.5K / Posts 3.3K / Reels 2.6K). **Accounts reached 1,628. Net followers +17. Interactions 409** (Posts 162, Stories 158, Reels 89). Profile visits 194, bio-link taps 4.
- **73.5% of views from followers, 26.5% non-followers** → low discovery, mostly serving the existing base.
- Top posts: "wrap up Season 4" 975 views (59 likes, 7 comments, top eng); reel "the space where we work in 2026" 886; "meet in California tomorrow" 527; "most companies redesigning offices" 483; "summer long weekend" 411 (32 likes, 10 shares).
- Read: thinnest channel. Active and consistent, but small reach, +17 followers and 4 bio-link taps = not yet a growth or traffic driver. Frame as "early".
- GAP: absolute follower count not in screenshots (only net +17). Optional to grab.

## ALL DATA COMPLETE — 15 Jun. Ready to design. Channels: Acast · Spotify · YouTube · LinkedIn · Instagram.
