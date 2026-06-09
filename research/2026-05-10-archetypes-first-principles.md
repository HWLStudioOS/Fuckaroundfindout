# Semi-Passive Business Archetypes Unlocked by 2024-26 AI Capabilities

**Date:** 2026-05-10
**Brief:** Map the new business surface area opened by AI capabilities reaching production maturity in 2024-26. Solo operator, 12 months, 6-10 hrs/week, £15-40k capital, no audience, no employees, target £11k MRR.

---

## What actually changed in 2024-26 (the capability ledger)

Before sketching archetypes, name the shifts. Each archetype below leans on at least one of these:

1. **Frontier LLMs reliable enough for production single-shot tasks.** Claude Sonnet 4.6 / Opus 4.7, GPT-5, Gemini 2.5. Tool use works. JSON-mode works. Structured outputs are dependable. This collapsed multi-week engineering jobs into one-evening prototypes.
2. **Agent loops + MCP standardisation.** Anthropic's Model Context Protocol (Nov 2024) became the standard interface between agents and tools. As of May 2026 there are ~318 MCP servers in the Claude Code marketplace alone; thousands more across the ecosystem.
3. **Computer-use agents.** Anthropic's Computer Use (Oct 2024), OpenAI's Operator (Jan 2025), Google's Gemini 2.5 Computer Use (Oct 2025) cleared 70%+ on browser benchmarks. Means: an agent can drive any web app that has no API.
4. **AI coding assistants doing real engineering.** Claude Code, Cursor, Codex, Devin. A solo operator can ship and maintain genuinely complex software.
5. **Image/video generation at parity.** Midjourney v7, Sora 2, Veo 3, Flux Pro. Production-grade visuals without a creative director.
6. **Voice cloning + sub-second TTS.** ElevenLabs v3, Cartesia Sonic, Vapi/Retell stacks. Natural-sounding voice agents priced at $0.07-$0.15/minute.
7. **Multimodal models with cheap vision.** Document OCR, screenshot understanding, video QA. PDFs, scans, and screenshots become structured data inputs.

Anything that was viable pre-2024 (Notion templates, normal SaaS, Zapier consulting) is excluded. We want archetypes whose central engine couldn't run before this stack existed.

---

## Ranked archetypes

Ranking is by my honest probability that this specific archetype, run by a generic-but-skilled solo operator with the constraints given, hits £11k MRR in 12 months. None of these are slam dunks.

| # | Archetype | P(£11k/mo in 12mo) |
|---|-----------|--------------------|
| 1 | Single-workflow vertical AI agent (boring industry) | **35%** |
| 2 | AI voice receptionist for trades, sold by zip code | **30%** |
| 3 | Productised "AI ops" implementation for SMBs | **28%** |
| 4 | Computer-use agent for a workflow with no API | **22%** |
| 5 | Vertical data product (scrape + LLM enrich + sell access) | **20%** |
| 6 | Niche MCP / agent-tool with usage-based pricing | **12%** |
| 7 | Multi-language podcast/video clone factory | **10%** |
| 8 | Programmatic SEO arbitrage with proprietary data | **8%** |

Detail follows.

---

## 1. Single-workflow vertical AI agent for a boring regulated industry

**One-line.** A narrow agent that automates one painful, repetitive workflow inside a specific vertical (e.g. prior-authorisation submissions for physical therapy clinics, lien waiver chasing for sub-contractors, CQC inspection prep for UK care homes), priced per outcome or per seat.

**Why it became viable in 2024-26.** Two things had to be true together: (a) an LLM had to follow a 40-page payer policy or regulatory standard reliably enough that the customer trusts the output without re-reading it, and (b) tool-use / browser automation had to be solid enough to actually file the form. Both crossed the threshold around Claude 3.5 Sonnet (mid-2024) and have only got better. Pre-2024 you could automate the data shuffling but not the judgment call inside it.

**First £1k MRR path.**
- Week 1-2: Pick one vertical you can call into (prior-auth for PT, dental insurance verification, UK lettings deposit dispute prep, etc). Choose it because you know one customer who'll take a call.
- Week 3-6: Build a Claude/GPT-5 agent that ingests one document type and outputs the deliverable. Wrap in a basic web app (Next.js + Supabase + Vercel). No multi-tenant complexity. Each customer gets their own deployment.
- Week 7-10: Get 1-2 customers on a "we'll do it manually with the agent in the loop" pilot at £400-600/month. Free trial for one cycle, then paid.
- Realistic: 12-16 weeks to first £1k MRR.

**Scaling to £11k/month.** ACVs land between £6k and £18k/year (£500-1,500/month). To hit £11k MRR you need ~12-20 customers. Acquisition: cold outbound (Apollo + Instantly + manual touch on each lead) into a tightly-defined ICP, plus a single landing page. Conversion of 2-5% on cold outbound at this ACV is realistic if the demo lands. Churn in vertical SaaS at this size historically runs 3-5% monthly. Most operators stall around 8-10 customers because they can't run support and sales simultaneously.

**Capital needs.** £15-25k covers it.
- LLM/API spend: £200-600/month at 12 customers (Claude API, embeddings, OCR).
- Infra: £150/month (Vercel, Supabase, Resend, Stripe, monitoring).
- Outbound stack: £400/month (Apollo £100, Smartlead £150, domains/inboxes £150).
- Cold-call dialler / SDR-style tooling if needed: £200/month.
- One-off legal review of contract template: £1,500.
- Insurance (UK professional indemnity for any regulated workflow): £600-1,200/year.

**Failure modes.**
1. Picked a vertical that looks niche but is actually competitive (legal, real estate). The good niches sound boring on purpose.
2. Built before talking to 10 operators in the vertical. Result is a beautiful agent solving a problem that ranks 7th on the customer's priority list.
3. Single-customer concentration. Lose the anchor and the business halves overnight.

**Real example.** A widely-cited operator in the AI builder community runs an AI prior-auth agent for physical therapy clinics. Reported $41k MRR after 14 months as a solo founder. Pricing model: ~$5 per authorisation, ~200/month per clinic = ~$1k/clinic/month. Ten clinics = $10k MRR. (Anonymous in public reporting; surfaced via industry round-ups in late 2025 / early 2026.)

**P(£11k/mo in 12 months): 35%.** Highest in the list because (a) the model is proven multiple times, (b) ACVs are large enough that 10-15 customers gets you there, (c) the moat compounds with workflow data.

---

## 2. AI voice receptionist sold to local trades (HVAC, plumbing, dental, vet, salons), licensed by zip code

**One-line.** A white-label Vapi/Retell voice agent that books appointments and triages emergencies, sold to single-location trade businesses for £200-400/month, with one operator covering a metro area.

**Why it became viable in 2024-26.** ElevenLabs v3 voices crossed the uncanny line. Vapi (founded 2024) and Retell pricing dropped to $0.07/min. A voice agent that sounds like a person, books into Calendly/Jobber, and routes emergencies, costs the operator ~£0.20 per call inclusive of LLM and voice. Margin is 80%+. None of this stack existed in workable form before mid-2024.

**First £1k MRR path.**
- Week 1: Pick one trade (HVAC, plumbing, dental). Build one voice agent on Retell + a calendar integration. Test by calling your own number 50 times.
- Week 2-4: Door-knock or cold-call 100 local businesses in one UK city. Pitch: "I'll set up an AI receptionist that books your jobs after-hours, free for 14 days, then £249/month."
- Week 5-8: 4 paying customers at £249 = £1k MRR. 12-16 weeks realistic.

**Scaling to £11k/month.** £250 ACV means ~45 customers. This is the chokepoint. Three paths:
- Stay local, keep cold-calling: caps around 20-30 customers before the operator burns out on support.
- Move upmarket: dental groups, vet chains, multi-location HVAC franchises at £600-1,200/month. Need 10-18 of these.
- White-label to existing local marketing agencies (one agency = 5-15 sub-clients). Sell the agency 5 seats at £150/seat.

**Capital needs.** £8-15k.
- Retell/Vapi: pass-through, ~£40/customer/month at average call volume.
- Twilio numbers: £2/number/month.
- Backend: £100/month.
- Door-to-door / outbound: £300-500/month.
- Demo phone numbers and a slick landing page per vertical: £1,500 one-off.

**Failure modes.**
1. The market is already loud. AgentZap, Trillet, NextPhone, Dialzara, Newo and dozens of others are doing this. Your wedge has to be vertical depth (you understand HVAC dispatch logic better than they do) or geography (you're in their town and they trust you).
2. Carrier compliance (UK Ofcom CLI, US TCPA) trips you up at scale.
3. Customers churn at 8-10% monthly because the AI handles a call wrong and they panic.

**Real examples.** Dialzara, Smith.ai, AgentZap, NextPhone, Trillet are all live. Solo agency operators on r/AIagency and YouTube routinely report 5-15 trades clients at £200-500/month. The space is crowded but the demand is also genuine and growing.

**P(£11k/mo in 12 months): 30%.** Mechanically possible. The real risk is sales velocity and churn, not technology.

---

## 3. Productised "AI ops" implementation for SMBs

**One-line.** A fixed-scope, fixed-price retainer that installs and runs AI agents (Claude Code-built internal tools, Zapier+MCP automations, custom Claude.ai Projects, voice agents, vertical chat assistants) inside a small business that doesn't have an internal tech team. £1,500-3,500/month, 4-8 clients.

**Why it became viable in 2024-26.** Claude Code and Cursor mean one operator can ship custom internal tools per client in a day or two. MCP turned every SaaS in the customer's stack into something an agent can drive. Pre-2024 this was a 2-3 person dev shop. Now it's a solo operator with 6 hrs/week per client.

**First £1k MRR path.**
- Week 1-3: Build 2-3 case studies for free or at cost. Document everything.
- Week 4-8: Pitch on LinkedIn and via warm intros. Land 1 client at £1k-1.5k/month. 8-12 weeks realistic.

**Scaling to £11k/month.** ACVs of £2k/month means 5-6 clients. Acquisition is the bottleneck and it's almost entirely warm intros, LinkedIn POVs, and "look what I built for X" content. Churn is the second bottleneck because "AI ops" has no native renewal logic. Build a productised retention layer (monthly business review, automation health report, new use-case discovery) so renewal is the default.

**Capital needs.** £5-10k.
- Subscriptions stack: Claude Max, ChatGPT Pro, n8n Cloud, Zapier, Supabase, Vercel = £400/month.
- LLM API spend on client work: £200-500/month.
- Brand and one website: £1,500.
- Legal MSA template: £1,000.

**Failure modes.**
1. You become a body shop. Hours scale linearly. Cap clients hard at 6 or productise harder.
2. Scope explodes. Each client thinks "AI ops" includes whatever they want it to. Write a brutal scope-of-services doc.
3. AI labs ship the feature your custom build was wrapping. Stay close to the integrations layer (their data, their workflows), not the model layer.

**Real examples.** Plenty. Sarah Chen's "AI design agency" hit $420k ARR in 8 months at 25hr/week (widely-cited 2025 case study; details vary by source). Chris's content automation agency reportedly hit $2M ARR with three to six clients at $1.5-2.5k/month. The shape is well-established.

**P(£11k/mo in 12 months): 28%.** High demand, low capital, but high sales effort and capped by your hours. It's a job that pays well, not a passive business. Bumped down because the brief asks for *semi-passive* and this drifts toward agency without strict productisation.

---

## 4. Computer-use agent for a workflow with no API

**One-line.** A managed agent that drives a legacy or no-API web app on the customer's behalf (e.g. submitting claims into a 1998-era insurance portal, pulling daily pricing out of a wholesale supplier's password-protected site, reconciling deliveries inside a council procurement portal), priced per task or per seat.

**Why it became viable in 2024-26.** Anthropic's Computer Use (Oct 2024) and Google's Gemini 2.5 Computer Use (Oct 2025) both crossed the "good enough for production on narrow workflows" threshold. The point is not general computer use, which is still flaky, but a specific 12-step flow you've recorded, scripted around, and hardened.

**First £1k MRR path.**
- Week 1-2: Pick a workflow you've personally watched a friend or contractor do. Record it. Time it. Confirm it costs them at least 2 hrs/week.
- Week 3-6: Build the agent on Claude Computer Use + Browserbase or equivalent. Add monitoring, retry logic, screenshot logging.
- Week 7-12: Sell the workflow as a service. Don't sell software access yet. Charge £400-800/month per customer for "we run this for you."
- 12-16 weeks to first £1k MRR.

**Scaling to £11k/month.** £600 ACV means ~18 customers. The challenge is that each customer's portal is slightly different. Either pick one portal that 100+ customers all use (e.g. a specific UK building control portal, a specific NHS supplier portal), or build a "we'll automate any portal for £2k/month" managed offering at higher ACV.

**Capital needs.** £15-25k.
- Browserbase or similar headless infra: £200-500/month.
- Claude Computer Use API: £300-800/month at 18 customers (vision tokens are expensive).
- Proxies and IP rotation if needed: £200/month.
- Error monitoring and screenshot storage: £100/month.
- Legal review for ToS exposure on each portal: £2,000-4,000 across the year.

**Failure modes.**
1. The portal owner adds a captcha or changes UI. Your business breaks weekly.
2. Terms of Service: many portals explicitly forbid automated access. You're fine until you're not.
3. Vision token costs scale with screenshot count. A single complex flow can be £0.50-£2 per run; if customers expect to run it 200x/day, your gross margin disappears.

**Real example.** Thin on named, named operators yet (this is genuinely new). The closest public examples are Browser Use, Browserbase, and Anchor Browser as infrastructure layers. Solo operators are starting to layer narrow vertical agents on top, but most are pre-revenue or under £5k MRR. **This is signal: the cost-of-experiment is high, the failure mode is brittle, but moat is strong if you survive.**

**P(£11k/mo in 12 months): 22%.** Lower than the above three because the brittleness risk is real and there's no proven solo operator playbook yet.

---

## 5. Vertical data product: scrape + LLM enrich + sell access

**One-line.** Pick one industry where decisions are made on bad public data (UK planning applications, US federal grant opportunities, FCC tower filings, EU tender notices, NHS procurement awards). Scrape it weekly, enrich it with LLM analysis (summarise, score, tag, predict), sell access for £49-499/month.

**Why it became viable in 2024-26.** LLMs at $1-3/million input tokens make enrichment of 100k records/month a £100-300 expense. Before 2024, the same pipeline would cost £20k+ in labelling or £100k+ in custom NLP. Vector search and semantic retrieval are commodity. Cheap multimodal models can read PDFs, scanned filings, and document images.

**First £1k MRR path.**
- Week 1-2: Pick the dataset. Validate that 50+ paying buyers exist (search "X intelligence" newsletters, paid Substacks, niche LinkedIn groups).
- Week 3-6: Build the scraper, enrichment pipeline (Claude or Gemini Flash), and a simple search UI. Email digest is fine for v1.
- Week 7-10: Free for 30 days, then £49-99/month. Push it to industry forums, niche subreddits, LinkedIn.
- Realistic: 14-20 weeks to first £1k MRR. Slower than vertical agents because price-per-customer is lower.

**Scaling to £11k/month.** Two pricing tiers. £49/month self-serve (need 100-150 customers). £499/month "API access + custom alerts" tier for power users (need 10-15 of those mixed with 80 self-serve). Acquisition is content-led: a free weekly digest with "want the full data? Subscribe." This is genuinely passive once it works, but the customer count required is high and B2B SEO timing is brutal.

**Capital needs.** £10-20k.
- Scraping infra (proxies, headless browsers): £200-400/month.
- LLM enrichment: £200-500/month.
- Database + search (Postgres, Meilisearch or Typesense): £100/month.
- Beehiiv/ConvertKit + landing page: £100/month.
- Original research / domain SME consultations: £2,000.

**Failure modes.**
1. The data is too easy to replicate. If anyone with Claude Code can rebuild your pipeline in a weekend, you have no moat. Pick data that requires authenticated access, OCR of scanned filings, or genuine human judgment in tagging.
2. The buyers don't exist. Many "intelligence" datasets sound valuable but the buyers want a database, not a subscription.
3. Source site changes its layout monthly. You spend 5 hrs/week on maintenance instead of growth.

**Real examples.** Levels.fyi (compensation data, ~$5M ARR but co-founded). BuiltWith (web tech intelligence). RegASK (regulatory intelligence). Recent solo-founder examples include AI grant-finders for nonprofits, planning-application alerters for UK property developers, and government-tender feeds in EU markets. Most settle around £3-15k MRR after 12-18 months.

**P(£11k/mo in 12 months): 20%.** Achievable but slow. SEO and content compound, which means month 9-12 is when growth accelerates, sometimes after the runway runs out.

---

## 6. Niche MCP server / agent tool with usage-based pricing

**One-line.** Build and sell a single MCP server (or skill/plug-in) that does one thing AI agents can't easily do: e.g. UK Companies House structured pulls, Companies House director graph traversal, Lexis Nexis lookups, NHS BNF drug interactions, MLS feed parsing. Sell to other AI builders for $19-149/month or $0.01-0.10 per call.

**Why it became viable in 2024-26.** MCP standardised in Nov 2024. By May 2026 the Claude marketplace alone has ~318 servers; thousands more across other agent runtimes. Most are free; a small but growing minority charge. Demand from agent builders is increasing as the agent layer matures.

**First £1k MRR path.**
- Week 1-2: Pick a data source / capability that a building agent developer would pay for. Best candidates: legal/regulatory data, payments rails, niche industry feeds, complex multi-step workflows that need context.
- Week 3-4: Build the MCP server. Distribute via mcpservers.org, Smithery, MCP Market.
- Week 5-12: Marketing is brutal because the audience is distributed. Cross-post on r/ClaudeAI, r/MCP, MCP Discord, build-in-public on X. Optimise for "AI builders Googling for X."
- Realistic: 16-24 weeks to first £1k MRR. Most fail at this step.

**Scaling to £11k/month.** At $19/month tier you need ~580 customers. At $149/month tier you need ~75. Most successful MCP servers target builders, which is a tiny addressable market. Realistic ceiling for a single MCP server is probably $5-10k MRR within 12 months. To hit £11k you'd want a portfolio of 3-5 servers under one brand.

**Capital needs.** £5-10k.
- Hosting (likely serverless): £50-200/month.
- Source data / API costs (this is the killer if your MCP wraps a paid data source): £200-2,000/month depending on what you're wrapping.
- Marketing: £200-500/month, mostly content.

**Failure modes.**
1. The market expectation is "free." Of ~318 MCP servers in the Claude marketplace as of May 2026, only a handful charge. Convincing builders to pay is genuinely hard.
2. AI labs ship the feature natively. Anthropic added X, OpenAI added Y, your wrapper is dead.
3. Distribution is fundamentally harder than for a SaaS aimed at end-users; the buyer is technical and price-sensitive.

**Real examples.** WHOFFAgents charges $19/mo as a deliberate experiment. Most others either bundle MCPs into a larger tool (Smithery, mcpbundles) or treat them as free distribution for an underlying paid SaaS.

**P(£11k/mo in 12 months): 12%.** I'd love this archetype to be higher. It's elegant. But the unit economics on solo MCP plays don't yet support £11k MRR for most operators. Worth doing as a *moat* alongside another archetype, not as the main bet.

---

## 7. Multi-language podcast / video clone factory

**One-line.** Take an existing creator's English content and produce same-voice, same-face, lip-synced versions in 10-20 languages. Rev-share or fixed retainer with the creator (£1k-3k/month per creator, plus 20% of new-language ad revenue).

**Why it became viable in 2024-26.** ElevenLabs v3 voice cloning crossed the natural-prosody line in 2024. Sora 2 and HeyGen now do convincing lip-sync. YouTube's multi-language audio tracks (rolled out broadly in 2024) and Spotify's "voice translation" beta let creators publish multi-language audio under one channel. Mr Beast publicly demonstrated the workflow at scale. Pre-2024 the cost per minute of dubbed content was £200+; now it's £2-10.

**First £1k MRR path.**
- Week 1-3: Find 1 creator with 50k-500k subscribers in a category with international demand (productivity, finance, health, language learning, niche hobbies). Pitch: "I'll dub your back catalogue into Spanish, Portuguese, German, and Hindi for free in exchange for ad-revenue split + £500/month maintenance."
- Week 4-8: Deliver. Get the channel monetising in those languages.
- Week 9-12: Use that case study to land 2 more creators on retainer.
- Realistic: 16-24 weeks to first £1k MRR.

**Scaling to £11k/month.** Two routes.
- 5 retainer clients at £1.5k/month + 20% rev share = £7.5k base + variable. Achievable but creator acquisition is the bottleneck.
- Run your own multi-language YouTube channels in dead-easy categories (compilations, voiceover-only explainers). This is the unit economics path of operators like Elia Putzolu and others reporting $5-30k/month from automated faceless YouTube networks. Adds capital intensity (one workstation rendering Sora outputs constantly).

**Capital needs.** £15-30k.
- ElevenLabs Pro / Studio: £200-500/month.
- HeyGen or Sora API for lip-sync: £300-800/month.
- Cloud GPU / Runway for batch processing: £400-1,000/month.
- Translation QA (human reviewer per language for at least the first 6 months): £500-1,500/month.
- Outreach to creators: minimal.

**Failure modes.**
1. Creators don't trust giving up their voice. Many have been burned by deepfake licensing already.
2. YouTube and Spotify can change their multi-language policies overnight.
3. Quality varies by language. Hindi and Portuguese voice models are great; smaller languages drag the channel's reputation.

**Real examples.** Mr Beast's dubbing operation. RVC-based YouTube networks reportedly hitting $30k+/month. Spotify's pilot voice-translation programme with The Diary of a CEO and others (2024). Several agencies (Camb.ai, Speechki, Papercup) operate at scale; solo plays have less visibility but exist on Indie Hackers and faceless-YouTube communities.

**P(£11k/mo in 12 months): 10%.** Capital-intensive, requires creator trust, and the business is at the mercy of platform policy. Possible but fragile.

---

## 8. Programmatic SEO arbitrage with proprietary data + LLM enrichment

**One-line.** Identify a high-intent search category (e.g. "{plant species} care guide UK," "{NHS trust} CQC inspection results 2026," "{city} {trade} cost calculator"), generate 5,000-50,000 unique pages with proprietary data + LLM-written analysis, monetise via affiliate / lead gen / ads.

**Why it became viable in 2024-26.** Cheap structured generation. A 10k-page site that would have cost £80k in writers in 2022 now costs £200 in API spend. Google's March 2024 helpful-content update killed thin AI content but rewards genuinely-useful pages with unique data and structure. Operators who layer real datasets and primary-source citations on top of LLM writing are still ranking.

**First £1k MRR path.**
- Week 1-3: Pick a niche where ad/affiliate RPM is genuinely high (insurance, finance, legal, B2B software comparisons, health).
- Week 4-8: Build the data backbone (this is the moat). Generate, deploy on Webflow/Astro/Next.
- Week 9-24+: Wait. SEO takes 4-9 months to compound.
- Realistic: 24-40 weeks to first £1k MRR. Often longer.

**Scaling to £11k/month.** At ad RPM of $20-50 per 1,000 visits, you need 220k-550k monthly visits. At affiliate conversion of 1% with £30 commission, you need ~37k visits/month. Both are achievable but timing is unreliable. Salesforge ($0 to $3M ARR in 2 years via programmatic SEO) and Zapier (~$140M ARR from ~70k integration pages) are the upside cases. Most solo programmatic SEO sites die under 1k visits/day.

**Capital needs.** £10-20k.
- Hosting + CDN: £100/month.
- Data acquisition / scraping: £300-500/month.
- LLM generation: £500-1,500 one-off per refresh.
- Backlinks / digital PR: £2,000-5,000 (the part most operators skip).
- Domain authority via guest posts: £200-500/month.

**Failure modes.**
1. Google update wipes you out (March 2024, August 2024, March 2025 spam updates each killed huge programmatic sites).
2. Pages rank but don't convert. SEO is necessary but not sufficient.
3. Maintenance cost (data refresh, schema changes) eats your margin.

**Real example.** Detailed.com tracks dozens of solo-built programmatic SEO sites. Most successful ones (Carrd-built directories, AI tool aggregators, B2B alternative-to pages) do exist, but the survivor bias is severe; for every site at $10k/month there are 50 at $0.

**P(£11k/mo in 12 months): 8%.** The 12-month timer is the killer. Programmatic SEO works but on an 18-36 month curve. Including for completeness because it's a real archetype, but I wouldn't bet the runway on it.

---

## Cross-cutting observations

**The 12-month timer is the hardest constraint.** Most genuinely passive AI businesses (data products, programmatic SEO, content-driven marketplaces) hit cash compound after month 12-18. The £11k/12-month constraint pushes the operator toward higher-ACV B2B service-flavoured plays, where 10-15 customers can clear the bar.

**6-10 hrs/week is incompatible with a customer count above ~25.** Anything that needs 30+ customers needs either a platform (which takes longer to build) or hours you don't have. This rules out most prosumer SaaS. It favours boring B2B at £500-2,000/month ACV.

**The single biggest moat available to a solo operator in 2026 is workflow knowledge of a boring vertical.** The model layer is commoditised. Distribution is brutal. What competitors can't easily copy is "I have spent 200 hours watching dental front-desk staff, and I have built the workflow they actually do, not the workflow you'd think they do." That insight only comes from being inside the vertical.

**Capital concentrates the bet rather than buying time.** £15-40k buys you tools, infra, outbound stack, legal templates, and 6 months of runway on subs. It does not buy you customers. Customers come from picking a tight niche and grinding outbound or warm intros.

**Best two-archetype bet for the actual constraints.** If forced to pick: archetype #1 (vertical agent) as the primary swing, with archetype #6 (a single related MCP server) built alongside as a moat artefact and a free distribution channel into the agent-builder community.

---

## Sources

- [Hitting $30k MRR with an AI marketing product, Indie Hackers](https://www.indiehackers.com/post/tech/hitting-30k-mrr-with-an-ai-marketing-product-n59ORJCYjnZC61Q096UL)
- [Vertical SaaS AI Agents 2026, Automaiva](https://automaiva.com/vertical-saas-ai-agents-2026/)
- [15 AI Agent Startup Ideas That Made $1M+ in 2026, Presta](https://wearepresta.com/ai-agent-startup-ideas-2026-15-profitable-opportunities-to-launch-now/)
- [Anthropic computer use launch](https://www.anthropic.com/news/3-5-models-and-computer-use)
- [Pricing an MCP Server in 2026, dev.to](https://dev.to/whoffagents/pricing-an-mcp-server-in-2026-why-we-charge-19mo-when-the-market-average-is-0-nig)
- [MCP Servers Are the New SaaS, dev.to](https://dev.to/krisying/mcp-servers-are-the-new-saas-how-im-monetizing-ai-tool-integrations-in-2026-2e9e)
- [AI Receptionist Cost 2026, NextPhone](https://www.getnextphone.com/blog/ai-receptionist-cost)
- [Voice AI White-Label Pricing Breakdown 2026, Trillet](https://www.trillet.ai/blogs/voice-ai-white-label-pricing-breakdown-2026)
- [Retell AI Pricing 2026](https://www.retellai.com/pricing)
- [VoiceAIWrapper](https://voiceaiwrapper.com/)
- [Programmatic SEO Case Studies, Gracker AI](https://gracker.ai/blog/10-programmatic-seo-case-studies--examples-in-2025)
- [Salesforge programmatic SEO case study, Surfer SEO](https://surferseo.com/blog/salesforge-seo-growth-study/)
- [Firecrawl pricing](https://www.firecrawl.dev/)
- [Best AI Web Scraper Tools 2026, Apify](https://use-apify.com/blog/best-ai-web-scraper-2026)
- [Top AI Voice Cloning Tools for Business 2025, Retell AI](https://www.retellai.com/blog/best-ai-voice-cloning-platforms-2025)
- [AI-generated podcasts flood the market, Tech Xplore](https://techxplore.com/news/2025-12-ai-generated-podcasts-traditional-hosts.html)
- [AiSDR Pricing Breakdown 2026, MarketBetter](https://www.marketbetter.ai/blog/aisdr-pricing-breakdown-2026/)
- [Levels.fyi profile, Crunchbase](https://www.crunchbase.com/organization/levels-fyi)
- [Claude Code Pricing 2026, Verdent](https://www.verdent.ai/guides/claude-code-pricing-2026)
- [Solo Founder SaaS Metrics, SoftwareSeni](https://www.softwareseni.com/solo-founder-saas-metrics-from-0-to-10k-mrr-in-6-months-with-realistic-timelines/)
