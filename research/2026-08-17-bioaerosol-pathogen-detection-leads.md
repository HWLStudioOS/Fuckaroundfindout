---
date: 2026-08-17
topic: Bioaerosol / airborne pathogen detection — lead-targeting brief
requested_by: Harrison Living
time_boxed: 30 min
---

# Bioaerosol and airborne pathogen detection: lead-targeting brief

## 1. Origin: why is this on Harrison's radar

Checked Gmail (120-day window, terms: bioaerosol, pathogen, aerosol, air sampling, biodetection, airborne), the HWL META repo (`grep -ri` across all `.md`, excluding node_modules), and Granola meeting notes for the same terms.

**Result: nothing found in any of the three.**

- Gmail search returned zero threads.
- Repo grep returned zero files.
- Granola's own query tool confirmed no meetings mention bioaerosol, pathogen detection, airborne sensors, or biosensor companies — it flagged that anything older than 30 days would need a plan upgrade to search, so a conversation before mid-July wouldn't show up, but nothing recent does either.

**Plain conclusion: there is no known contact, call, referral, or ad behind this.** This reads as a cold, speculative idea Harrison had this morning, not a warm lead or an existing conversation thread. Worth naming directly to him: whatever prompted the interest (a LinkedIn post, a news story, a conversation not captured anywhere) isn't in the system, so this brief is built from a standing start with no existing relationship to lean on.

## 2. The industry, mapped

Bioaerosol sampling and airborne pathogen detection splits into a few buyer-driven segments: pharma/cleanroom environmental monitoring (the most commercially mature), hospital and public-health air biosecurity, defence/CBRN threat detection, and agri/livestock pathogen air monitoring (newest, driven by avian flu). Real-time PCR-on-a-chip and metagenomic sequencing are the two competing detection approaches; most players are still hours-not-minutes on turnaround, which is itself a comms/positioning problem for anyone claiming "real-time."

### UK companies

| Company | HQ | What they make | Stage / funding | Comms need signal |
|---|---|---|---|---|
| **Agnos Biosciences** | London (NHM/Earlham Institute spin-out) | AirSeq — portable air sampler + nanopore DNA sequencing, unbiased pathogen ID (bacteria, viruses, fungi, pollen) | Just launched, 27 Jan 2026. BBSRC-backed, DARPA/US-funded R&D history. First-ever Natural History Museum venture spin-out. | Brand new company, brand new category ("DNA sequencing of the air"), no existing content library. CEO Simon Kim quoted in launch press. Textbook explainer-film and founder-LinkedIn gap. |
| **Kromek Group plc** | Sedgefield, County Durham | Real-time bio-sequencer + air sampling; new Bioaerosol Evaluation & Laboratory Testing Service | Public company (LSE: KMK). New bioaerosol chamber built July 2025 (DHS-funded programme); testing service launched ~Feb 2026. Prior $6m DARPA + $6m DHS contracts. | New commercial service needs positioning and an explainer for a fresh buyer type (labs validating other people's sensors), on top of existing investor-comms cadence. Likely already agency-served — see risks. |
| **Portal Biotech** | London / Abingdon | Single-molecule protein sequencer (nanopore-based); biosecurity application is real-time proteome analysis for threat ID | $35m Series A, 30 June 2025, led by NATO Innovation Fund + Earlybird. One of Europe's largest life-sciences-tools raises of the year. | Fresh nine-figure-adjacent raise, two distinct audiences to speak to (pharma/drug-discovery buyers and biosecurity/defence stakeholders) with one underlying platform. Needs a bridging narrative — the exact "make a complex sensor legible" problem. |
| **Sensio Air** | London | Real-time airborne particle/pathogen ID via "Large Particle Models," consumer/enterprise dashboard | $4.03m total funding across 3 rounds (last: $2m seed, 2022, Daikin-led). Headcount down 42.9% YoY (now ~3 people). | Shrinking team is a real caution flag — may not have current comms budget. Note as a lead, not a priority. |
| **Pharmagraph** | UK | iVAS Roam / iVAS Roam Lite — portable microbial (viable) air samplers for pharma/cleanroom | Established vendor, not VC-track. New product launch: iVAS Roam Lite, 23 June 2026. | New SKU launch is a real trigger, but this is an established industrial-equipment company, not a founder-led scale-up — sales cycle and buying process will look different. |
| **Cantium Scientific (MicroBio)** | UK | MicroBio MB1 bioaerosol sampler; UK distributor network | Established, mature product line. Minor product update (tripod mounting), Jan 2026. | Low urgency signal. Distributor-model business, thinner fit for founder-story content. |

### Europe

| Company | HQ | What they make | Stage / funding | Comms need signal |
|---|---|---|---|---|
| **Plair** | Geneva, Switzerland | RAPID-C+ — real-time viable/total particle counter for pharma cleanrooms, laser-based | Scale-up. bioMérieux invested CHF 1m+ and took a board seat, 30 March 2026. Earlier CHF 300k FONGIT loan (2023). | Major strategic-investor validation just landed; now scaling globally through bioMérieux's 160-country footprint. Product-interface/explainer content for a much bigger buyer base is the obvious next need. |
| **nawu diagnostics** | Grenoble, France | Portable microfluidic-cartridge reader for airborne respiratory pathogens (CEA-Leti spin-out); vet/livestock first, human diagnostics later | Founded 2025, 3 people. Actively fundraising — attended DxPx investor conference, Munich, Feb 2026. | Early-stage, investor-facing, founder (Fanny Turlure) already posting on LinkedIn but thin. Needs an investor-narrative explainer more than a product film yet. Lower budget likely. |
| **VAir (VAir Biotech)** | Palaiseau, France | Breath/aerosol analyzer for pre-symptomatic respiratory infection screening | Founded 2024, 1-10 people. €90k Bourse French Tech Emergence (2025) + €250k+ non-dilutive (Future of Health Grant, Bpifrance, WILCO Healthcare), reported Jan 2026. | Explicitly building partnerships through 2026, comms currently limited to LinkedIn text posts with emoji — a founder who clearly wants visibility but has no film/visual layer yet. Good low-budget-but-real fit. |
| **Spore.Bio** | Paris | Optical/ML microbiology testing (spectral signature + deep learning), food-safety-adjacent pathogen detection | $23m Series A, Feb 2025 (Singular-led), on top of an €8m pre-seed. Scaling 30 → 50 people through 2025. | Fast headcount growth after a real raise. Not airborne specifically (more surface/product testing) but same buyer language and same "explain the science fast" problem. Worth a mention, lower priority than the air-specific names. |
| **Bertin Technologies / Bertin Environics** | France / Finland (part of CNIM group) | Coriolis air samplers; ENVI BioScout 3-in-1 CBRN bioaerosol detector | Established, part of a larger industrial group. No recent funding signal found. | Low urgency — mature market comms already in place, sells through defence primes. |
| **Palas GmbH** | Karlsruhe, Germany | Aerosol/particle sensors (welas series), fine-dust and nanoparticle analyzers | Established (founded 1983), ~100 staff. No startup-stage signal. | Not a fit — mature industrial instrumentation company, not a founder-led comms buyer. |

### US (secondary, per brief)

| Company | HQ | What they make | Stage / funding | Comms need signal |
|---|---|---|---|---|
| **BioFlyte** | Massachusetts, US | BioTOF z200 — fieldable aerosol chem/bio-threat detection for critical infrastructure | $13m total raised (seed 2020, Series A 2022, Series B 2023, $5.4m). US Air Force SBIR Phase I (Feb 2025) and Phase II (Sept 2025) awards. DHS SAFETY Act Designation, Aug 2025. Recently appointed a VP of Product (Daniel Gussin). | Strong government-contract momentum and a fresh VP Product hire signal genuine product-marketing appetite. Useful comparator/reference case even though not a live UK/Europe target. |
| **Kipostech** | Delaware / Pennsylvania, US | Airborne pathogen neutralisation hardware for poultry houses (avian flu) | Early-stage, founded 2022. Active pilots at University of Delaware chicken colony houses through 2026. | Founder-led, agri-vertical, story-rich (bird flu is a live news topic) — early enough that budget is likely thin, but flagged as a model for the "agri pathogen air monitoring" sub-category the brief asked to map. |

### Industry bodies and events where these buyers gather

1. **Sensor+Test** (Nuremberg, Germany, annual) — the main European sensor trade fair; 348 exhibitors / 4,488 attendees from 24 countries in 2025. Runs alongside the ITG/GMA Sensoren und Messsysteme conference. General sensor audience, not bio-specific, but where hardware buyers and OEM partners are.
2. **Aerosols and Microbiology: Bridging Disciplines** (Microbiology Society, UK) — the 2nd edition is running in this space specifically, covers bioaerosol transport, detection tech and environmental/health applications. Closest thing to a dedicated UK bioaerosol-detection conference.
3. **UKHSA mSCAPE / UK Biological Security Strategy stakeholder network** — UKHSA's metagenomic Surveillance Collaboration and Analysis Programme (launched 30 Jan 2025) and the annual UK Biological Security Strategy Implementation Report (latest: July 2026) are the government-side convening points; NHS and academic partners (Birmingham, Edinburgh) sit alongside commercial vendors here.
4. **DASA (Defence and Security Accelerator) Open Calls and Themed Competitions** — MOD's standing innovation-funding mechanism; not bio-specific every cycle, but CBRN/biodetection challenges appear periodically. Cycle 4 of the current Open Call closed 13 Jan 2026, service reopens ahead of "UKDI Full Operating Capability" in July 2026.
5. **Biodetection Hub, University of Hertfordshire** — an active UK academic-industry bridge specifically for real-time bio/emissions detection; worth watching for events and partner-company mentions rather than treating as a conference itself.

## 3. Fit assessment for HWL

**What HWL would actually sell into this space:**
- Explainer films — translating a genuinely novel mechanism (DNA sequencing the air, single-molecule protein sequencing) into something a non-specialist buyer grasps in 90 seconds.
- Product/interface narrative — walking a hospital estates lead or pharma QC manager through what the dashboard shows and why it matters, not just what the hardware does.
- Investor/launch films — for the post-raise moment (Agnos, Portal Biotech, Plair are all sitting in one right now).
- Founder LinkedIn thought leadership — most of these founders are PhD-credentialed scientists with near-zero personal platform. That's a specific, ghostwriting-adjacent HWL strength.
- The single sharpest framing: **"make a complex sensor legible to a hospital procurement lead" (or MOD acquisition officer, or pharma QC director)** — that's a distinct skill from generic B2B video, and it's genuinely what most of these companies are missing.

**Price band:** Using the existing day-rate anchor (£950/day on-location, £550/day editing, per the LOR/Amanda quote), a single explainer film for this category — more R&D-heavy pre-production than a construction or gardening client, given the science needs distilling correctly — should sit higher than HWL's current client work. A reasonable opening band: **£4,000–£8,000 for a single anchor explainer film** (2-3 days on-location plus scripting/science-translation time), or **£1,500–£2,500/month for a founder LinkedIn ghostwriting retainer** run in parallel. Investor/launch films for a funded round (Portal Biotech-scale) could reasonably anchor higher, £8,000-£15,000, given what's actually at stake for them commercially.

**Two to three best-fit named targets:**

1. **Agnos Biosciences (London)** — best overall fit. Brand new (three weeks old at launch), zero existing content library, genuinely novel category that needs explaining, London-based (no travel premium), press-worthy halo (Natural History Museum). Angle: reach CEO Simon Kim with a specific point of view on the launch coverage — not "I do video," but a concrete observation about how the AirSeq story is currently being told (press releases and a static site) versus how it could land with a hospital or agri buyer on camera.

2. **Portal Biotech (London/Abingdon)** — best-funded fit. $35m in the bank as of mid-2025, two audiences to bridge (pharma partners and biosecurity/defence), and that bridging problem is exactly HWL's pitch. Angle: the NATO Innovation Fund headline is the hook — ask how they're currently explaining the biosecurity application to people who aren't proteomics scientists, since that's a different story than the drug-discovery one.

3. **Plair (Geneva)** — good fit but out-of-London, flag the travel cost. Just landed a strategic pharma investor (bioMérieux) and a board seat; about to scale into a much bigger buyer base through bioMérieux's global network. Angle: ask what content they're handing bioMérieux's 160-country sales force right now to sell RAPID-C+ into new markets — that's almost certainly a real, current gap.

**Risks and sensitivities:**
- **No warm path in.** Confirmed in step 1 — this is 100% cold outreach with no existing relationship, referral, or prior contact to lean on.
- **Long B2B sales cycles.** Hospital procurement and MOD/defence buying processes routinely run 12-24 months. This is not a fast-close category; treat as a medium-term pipeline bet, not a near-term cash fix.
- **Deep-tech, PhD-credentialed founders often genuinely don't rate comms spend.** Several of these companies (Agnos, Portal Biotech, nawu, VAir) are led by scientists first. The pitch needs to earn credibility on the science before it earns budget for the film.
- **Defence/CBRN procurement (DASA, MOD) runs through formal supplier frameworks.** A one-person studio can't easily get onto MOD panels; this segment is better approached as "help the company tell its civil-facing story," not as a route into defence contracting itself.
- **Kromek is public and likely already agency-served** for investor comms — treat as lower-priority despite the strong signal.
- **Travel/location.** Several of the strongest-signal companies (Plair, nawu, VAir) are outside London, which eats into the day-rate margin the £950 on-location figure assumes.
- **IP sensitivity.** Biosecurity and defence-adjacent companies may be cautious filming detail on camera even for a straightforward explainer — expect an NDA conversation before any shoot gets scoped.

## 4. Proposed first outreach step

**Who:** Simon Kim, CEO/co-founder, Agnos Biosciences (London).

**What hook:** Reference the specific press narrative — NHM's first-ever venture spin-out, AirSeq launched 27 Jan 2026 — and make one concrete, non-flattering observation: the current storytelling is press-release-and-static-site, not something that lands with a hospital procurement lead or an agri buyer who's never heard of nanopore sequencing. Lead with the observation, not a pitch.

**Which channel:** LinkedIn DM to Simon Kim directly (Agnos is too new to have a generic sales inbox worth cold-emailing; LinkedIn is where the launch conversation already happened). Keep it short, specific, no deck attached on the first message.

**Note:** per the standing rule on client-facing comms, this is a draft-and-hold — nothing gets sent without Harrison's sign-off. This brief stops at "here's the message to send," not "sent."

---

## Sources

- [New deep tech startup by Natural History Museum and Earlham Institute launches AirSeq](https://www.nhm.ac.uk/press-office/press-releases/new-deep-tech-startup-by-natural-history-museum-and-earlham-inst.html) — NHM, 27 Jan 2026
- [Detecting airborne pathogens by DNA sequencing](https://www.chemistryworld.com/news/detecting-airborne-pathogens-by-dna-sequencing/4023570.article) — Chemistry World, 20 May 2026
- [BBSRC-backed spin-out launches rapid DNA air sequencing technology](https://www.ukri.org/news/bbsrc-backed-spin-out-launches-rapid-dna-air-sequencing-technology/) — UKRI
- [Airborne Pathogen Detection & Bioaerosol Testing Services](https://www.kromek.com/product/bioaerosol-chamber/) — Kromek, Feb 2026
- [Kromek Group unveils cutting-edge lab to boost airborne virus detection](https://www.kromek.com/news/kromek-group-unveils-cutting-edge-lab-to-boost-airborne-virus-detection/) — Kromek, 4 Jul 2025
- [bioMérieux invests in Plair to strengthen pharma quality control](https://ggba.swiss/en/biomerieux-invests-in-plair-to-advance-environmental-monitoring-in-pharma/) — GGBa, 30 Mar 2026
- [nawu diagnostics company profile](https://nawudx.com/) — accessed 17 Aug 2026
- [Launch of startup nawu diagnostics to detect respiratory infections in 30 minutes](https://www.cea.fr/cea-tech/leti/english/Pages/What's-On/News/startup-nawu-diagnostics-to-detect-respiratory-infections-in-30-minutes.aspx) — CEA-Leti, 28 Mar 2025
- [VAir — Bourse French Tech Emergence](https://www.linkedin.com/posts/vair-biotech_turning-bold-ideas-into-real-world-impact-activity-7354863597086228481-1U7z) — VAir LinkedIn, 26 Jul 2025
- [VAir — New year, same mission](https://www.linkedin.com/posts/vair-biotech_new-year-same-mission-helping-healthcare-activity-7415917243722833920-GNfg) — VAir LinkedIn, 11 Jan 2026
- [Sensio AI company profile](https://sensioair.com/) — accessed 17 Aug 2026
- [NATO fund backs biotech startup in push to counter biological threats](https://www.reuters.com/sustainability/climate-energy/nato-fund-backs-biotech-startup-push-counter-biological-threats-2025-06-30/) — Reuters, 30 Jun 2025
- [Portal Biotech — company profile / HQ](https://www.portalbiotech.com/) and [NATO Innovation Fund announcement](https://www.nif.fund/news/nato-innovation-fund-leads-35-million-series-a-in-portal-biotech-alongside-earlybird-to-deliver-worlds-first-full-length-single-molecule-protein-sequencer/) — 30 Jun 2025
- [Spore.Bio raises $23M to apply machine learning to microbiology testing](https://techcrunch.com/2025/02/19/sporebio-raises-23m-to-apply-machine-learning-to-microbiology-testing/) — TechCrunch, 19 Feb 2025
- [Pharmagraph Launches iVAS Roam Lite](https://pharmagraph.co.uk/news/pharmagraph-launches-ivas-roam-lite-for-streamlined-cost-effective-portable-viable-air-sampling/) — Pharmagraph, 23 Jun 2026
- [Cantium Scientific / MicroBio MB1 tripod mounting update](https://www.cantiumscientific.com/) — accessed 17 Aug 2026
- [ENVI BioScout Bioaerosol Detector](https://www.environics.fi/cbrn-products/envi-bioscout/) — Bertin Environics
- [Palas GmbH company profile](https://theorg.com/org/palas-1) — accessed 17 Aug 2026
- [BioFlyte Raises $5.4M in Series B Financing](https://www.bioflyte.com/press-release/bioflyte-raises-5-4m-in-series-b-financing-to-protect-critical-infrastructure-from-airborne-biothreats/) — BioFlyte, Aug 2023; SBIR Phase I/II and DHS SAFETY Act Designation confirmed via [Tracxn profile](https://tracxn.com/d/companies/bioflyte/__GoeZ_JeknlxL-joPKGZcsQV_pV-En2BOXfZdzMalrPE), 2025-2026
- [Startup tests bird flu-fighting air tech in poultry houses](https://technical.ly/entrepreneurship/kipostech-bird-flu-air-tech-poultry-houses/) — Technical.ly, Kipostech
- [SENSOR+TEST 2026 exhibitor brochure](https://www.sensor-test.de/assets/en/Exhibitors/Application/SENSOR+TEST-2026_Exhibitor_Brochure_English.pdf) — accessed 17 Aug 2026
- [2nd Aerosols and Microbiology: Bridging disciplines](https://microbiologysociety.org/event//2nd-aerosols-and-microbiology--bridging-disciplines-to-advance-health---environmental-sustainability.html) — Microbiology Society
- [UKHSA launches new metagenomic surveillance for health security (mSCAPE)](https://www.gov.uk/government/news/ukhsa-launches-new-metagenomic-surveillance-for-health-security) — GOV.UK, 30 Jan 2025
- [UK Biological Security Strategy — Implementation Report, July 2025 - July 2026](https://www.gov.uk/government/publications/uk-biological-security-strategy-implementation-report-july-2025-july-2026/uk-biological-security-strategy-implementation-report-july-2025-july-2026) — GOV.UK
- [Competition: DASA Open Call for Innovation — CY2025 Cycle 4](https://www.gov.uk/government/publications/competition-defence-and-security-accelerator-dasa-open-call-for-innovation-cy2025-cycle-4) — GOV.UK
- [Towards real-time detection of industrial emissions — Biodetection Hub](https://biodetectionhub.herts.ac.uk/our-impact/towards-real-time-detection-of-industrial-emissions) — University of Hertfordshire

**Internal sources checked (no results):** Gmail (`search_threads`, 120-day window), HWL META repo (`grep -ri` across all `.md` files), Granola meeting notes (`query_granola_meetings`) — 17 Aug 2026.
