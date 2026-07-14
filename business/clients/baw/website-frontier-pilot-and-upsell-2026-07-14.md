# Better@Work frontier website pilot and upsell

**Date:** 14 July 2026  
**Purpose:** Internal commercial and delivery plan  
**Working offer:** Better@Work Digital Platform, designed and managed by HWL Studio

## The call

Build a private, greenfield conviction prototype. Pitch the working product to Cathal only when it feels exceptional.

Do not ask for permission to explore. Do not touch the live site, connect customer data or take payments. The public Better@Work material is enough to prove the creative and product idea.

If Cathal buys it, complete the production system as a separate paid project. If he does not, HWL still owns a strong web-design case study and a reusable delivery method.

## Current commercial position

Better@Work currently pays HWL **£1,500 per month**. That covers podcast packaging, Cathal's LinkedIn, reporting and season-planning support. The July receipt was £1,900 because it included £400 of production support.

Website strategy, brand refresh, platform design, development, commerce, migration and ongoing optimisation are not in the current scope. This is a clean new offer.

Do not absorb it into the £1,500 retainer.

## What we are selling

Do not sell "a new website" or "an AI website".

Sell an **owned audience and commercial platform** that:

- Makes Better@Work's archive useful and discoverable.
- Turns social, podcast and search visitors into an owned email audience.
- Routes career intent to Better Careers.
- Routes organisational intent to Better Leadership and speaking.
- Gives Cathal and Annette an excellent public expression of the show they now make.
- Gives HWL the ability to improve conversion, search visibility and product journeys every month.

The visual transformation earns attention. The publishing and conversion system earns the fee.

## The five-day internal pilot

Cap unpaid speculative work at five focused days.

### Day 1: Product and art direction

- Lock the positioning hierarchy.
- Choose the final creative route.
- Set typography, colour, motion, image treatment, spacing and component principles.
- Select real Season 4 content for the prototype.
- Define the demo journey and what will not be built yet.

### Day 2: Homepage

- Responsive navigation and hero.
- Latest episode and persistent-player entry.
- Start-here topic paths.
- Cathal and Annette as the show's two voices.
- Better Bits, Better Careers and Better Leadership routes.
- Proof and a clear final conversion.

### Day 3: Episode experience

- One premium episode page.
- Audio, chapters, takeaways, transcript moments and sources.
- Related Sum Up and related episodes.
- Dynamic share treatment.
- Contextual calls to action.

### Day 4: Work Problem Finder

- Prototype natural-language search across a curated set of episode summaries and takeaways.
- Return grounded results with episode and transcript citations.
- Prototype "email this playlist" and interest tagging.
- Build one topic or start-here collection to show the archive system.

### Day 5: Commercial and taste pass

- Show Better Careers and Stripe checkout direction.
- Test mobile, keyboard, performance and reduced motion.
- Remove generic sections and unearned claims.
- Deploy a password-protected Vercel preview.
- Record the production scope and the pitch walkthrough.

### Stop rule

At the end of day five, ask one question: would this be an exceptional public HWL case study even if Cathal says no?

If the answer is no, stop. More pages will not rescue weak art direction or a weak product idea.

## Frontier product definition

"Frontier" does not mean using every new service. It means the experience could not have been built by re-skinning a 2021 WordPress template.

### 1. Persistent listening

Audio continues as the visitor moves between episode, topic and resource pages. Progress is remembered locally. The player has chapters, speed and accessible controls. It never autoplays.

### 2. Work Problem Finder

The visitor describes a real work problem. The site finds relevant B@W material by meaning, not only exact keywords.

The result is not an ungrounded advice bot. It returns:

- Relevant episodes.
- Exact takeaways.
- Transcript moments or chapters.
- Sum Ups and resources.
- Clear source links.
- A useful next action.

The visitor can email the collection to themselves and choose whether to receive Better Bits. Career, leadership and team interests become explicit first-party signals rather than guessed tracking.

### 3. The archive as a knowledge product

Every episode becomes structured material:

- Idea.
- Problem.
- Guest.
- Topic.
- Takeaways.
- Transcript.
- Sources.
- Related resource.
- Appropriate commercial path.

This makes 79 episodes compound instead of disappearing down a feed.

### 4. Contextual conversion

No generic pop-up across every page.

- Career content leads to a career Sum Up, Better Bits career tagging and Better Careers.
- Leadership content leads to the Better Leadership series, organisational proof and enquiry.
- Stress, conflict and team content leads to the most relevant resource or playlist.
- Guest pages encourage sharing and referral.

The site should sell by being useful and specific.

### 5. Visual editing without a page builder

Sanity gives Cathal or HWL live preview and click-to-edit fields. Layout, accessibility and performance remain protected by the coded design system.

### 6. Dynamic distribution assets

Episode and topic pages generate their own branded Open Graph images. Links shared into LinkedIn, Slack, WhatsApp and email look deliberate without a manual artwork request.

## Production stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Frontend | Next.js App Router and TypeScript | Server-rendered publishing, strong metadata control and an excellent Vercel path |
| Hosting | Vercel Pro | Preview deployments, CDN, ISR, Cron, analytics and rollback |
| CMS | Sanity Growth | Structured content, visual editing, webhooks and semantic dataset search |
| Podcast | Acast RSS | Existing source of audio and distribution, imported automatically |
| Commerce | Stripe Checkout | Better fit than Shopify for a small digital-product catalogue |
| Audience | Kit Creator | Tags, segments, sequences, RSS campaigns and creator-focused list growth |
| Transactional email | Resend | Reliable form and fulfilment email from the Next.js application |
| Analytics | Vercel Web Analytics and Speed Insights | Low-friction first-party measurement with custom events |
| Search | Sanity dataset embeddings plus exact search | Semantic discovery without another search vendor |
| Source control | Private GitHub repository | Auditability, previews, rollback and clean ownership |

Use current stable package versions when production begins. Do not freeze the build today to version numbers that may change before client approval.

## Why Stripe, not Shopify

Better Careers is a digital product, not a retail operation.

Stripe Checkout supports one-time payments, subscriptions, local payment methods, adaptive pricing, tax configuration, discounts and checkout upsells. It gives us signed webhook events for fulfilment and attribution.

Shopify becomes sensible if B@W develops a real catalogue, inventory, physical fulfilment, complex merchandising or a dedicated commerce team. Until then it adds a second CMS and more theme logic for no useful gain.

## Search and answer optimisation

Do not sell AEO as secret markup. Google now explicitly describes generative-AI visibility as an extension of strong SEO. The useful advantage comes from making B@W's original material crawlable, clear, sourced and easy to retrieve.

### Technical foundation

- Server-rendered or incrementally regenerated public HTML.
- One canonical URL, title, description and H1 per page.
- Dynamic sitemap, robots rules and Open Graph images.
- Structured data for PodcastSeries, PodcastEpisode, Person, Organisation, Product, Article and Breadcrumb where supported by visible content.
- Fast Core Web Vitals and accessible semantic HTML.
- No important content hidden behind a player, client-only JavaScript or PDF.
- Clean redirects from every useful WordPress URL.

### Answer units

Every enriched episode should answer:

1. What is the core idea?
2. What problem does it help with?
3. What did the guest or hosts actually say?
4. What can someone try next?
5. Which sources support it?

Use transcripts, named speakers, timestamps, books, research links and explicit publication dates. This is useful for visitors and makes a page easier for retrieval systems to cite.

### Crawler policy

Allow Googlebot, Bingbot and OAI-SearchBot to access public editorial pages. OpenAI treats search discovery separately from training, so B@W can allow OAI-SearchBot while making an independent choice about GPTBot. Do not accidentally block legitimate search crawlers with a firewall challenge.

An `llms.txt` file can be included as an experimental convenience. It must not be sold as a ranking lever.

### Measurement

Track Google Search Console, the new generative-AI reporting when available to the property, Bing, ChatGPT referrals, landing pages and actual conversions. The outcome is qualified audience and revenue, not a vanity "AI visibility score" from a third-party tool.

## Conversion architecture

### Discovery

- LinkedIn posts and clips.
- YouTube.
- Podcast apps and guest sharing.
- Google, Bing and AI search.
- Direct referrals.

### First useful action

- Play an episode.
- Search a work problem.
- Read takeaways.
- Save or email a playlist.
- Download a Sum Up.

### Permission

- Join Better Bits.
- Choose topic interests.
- Submit a listener question.
- Request the relevant resource.

### Nurture

- A short welcome sequence that proves value.
- Weekly Better Bits.
- Topic-specific follow-up based on explicit interest.
- New-series and product announcements.

### Commercial action

- Buy Better Careers through Stripe.
- Enquire about Better Leadership.
- Enquire about speaking.

Do not create fake scarcity, mystery pricing or aggressive exit pop-ups. Senior people notice when a funnel is trying too hard.

## Migration and legacy shutdown

We do not need the legacy code. We do need the records.

### Export once

- WordPress pages and posts.
- Media library and original files.
- Yoast metadata, canonicals and redirects.
- WooCommerce products, orders and customers.
- Gravity Forms definitions and submissions.
- Newsletter subscribers, consent dates, tags and suppression list.
- Existing analytics and Search Console access.
- Domain and DNS control.
- Privacy, terms, refund and data-retention policies.

### Protect

- Financial and customer records remain securely archived for the required retention period.
- Suppressed and unsubscribed contacts are migrated as suppressions, not silently re-subscribed.
- Existing purchase access continues or receives a documented replacement.
- Legacy URLs receive deliberate redirects.

### Shut down

- Cut DNS to Vercel only after migration, form, payment and redirect tests pass.
- Keep SiteGround read-only for 30 to 60 days.
- Export a final encrypted archive.
- Cancel hosting and remove WordPress when the rollback window closes.

## Pitch strategy

Do not invite Cathal into an abstract design discussion. Show him the product.

Suggested opening:

> Cathal, I kept looking at the website and realised it represents the show from two years ago, not the business you and Annette are building now. So I built the direction I think Better@Work should take. This is a working private prototype, not a moodboard. It turns the archive into something people can actually use, gives Better Careers and Better Leadership a proper commercial path, and is built to be found in search and AI answers. If you want HWL to finish, migrate and manage it, here is the scope.

Then demonstrate, in order:

1. Homepage clarity.
2. Persistent listening.
3. One beautiful episode page.
4. Work Problem Finder.
5. Better Careers path.
6. The editing and publishing experience.
7. The migration and shutdown plan.
8. The commercial proposal.

Do not lead with Next.js, Sanity or AI. The client is buying a better business surface and a managed outcome.

## Price recommendation

### Recommended managed option

**Design, build and launch: £20,000 plus VAT**

Payment schedule:

- 40% on signature.
- 40% on approved production beta.
- 20% before domain cutover.

**Managed digital platform: £1,500 per month plus VAT**

- Six-month initial term from launch.
- Platform monitoring and dependency maintenance.
- CMS and publishing support.
- One meaningful improvement release each month.
- Conversion and journey review.
- Search Console and answer-visibility review.
- Performance and accessibility regression checks.
- Monthly commercial dashboard.
- Quarterly roadmap and experiment decision.

The existing £1,500 content retainer remains separate. If both continue, B@W becomes a **£3,000 per month HWL client** after launch.

Third-party platform fees are paid directly by Cathal and are not deducted from HWL's management fee.

### Handover option

**£25,000 plus VAT**, including production build, launch, documentation, account transfer and a 60-day defect warranty. Ongoing changes are quoted separately.

The higher handover price reflects the loss of recurring optimisation and the extra handover work. It also makes the managed option the natural recommendation without hiding a lock-in.

### Negotiation floor

Do not take the complete production scope below **£15,000 plus VAT**. If Cathal has a lower budget, remove the Work Problem Finder, deep transcript work or commerce migration. Do not discount the same scope.

## Expected platform cost

At current public pricing and current B@W scale:

- Vercel Pro: $20 per month, including $20 of usage credit.
- Sanity Growth: $15 per paid seat per month.
- Kit Creator: $33 per month for 1,000 subscribers, increasing with list size.
- Stripe: pay per successful transaction. Standard UK cards are currently 1.5% plus 20p, with higher rates for EU and international cards.
- Resend and any file storage: free or low usage initially, then usage-based.
- Acast remains an existing separate cost.

Budget **£100 to £200 per month** for the base software layer at launch, plus Stripe transaction fees and any existing Acast cost. Keep every account client-owned.

## Production inclusions

- Positioning and interface brand refresh.
- Responsive custom design system.
- Homepage and all agreed public templates.
- Sanity Studio and visual editing.
- Migration of the 79-episode Acast archive.
- Curated start-here and topic architecture.
- Persistent audio player.
- Work Problem Finder over the agreed content set.
- Better Bits and Sum Up journeys.
- Stripe Better Careers purchase and fulfilment flow.
- Kit migration, forms, tags and agreed welcome sequence.
- Listener question, leadership and speaking forms.
- Metadata, structured data, sitemap, crawler rules and dynamic share images.
- Redirect map and legacy shutdown support.
- Analytics, conversion events and launch dashboard.
- Accessibility, browser, mobile, performance and payment QA.
- Documentation and account ownership handover.

## Exclusions

- New episode recording, editing or video production.
- Manual transcript editing for all 79 episodes unless separately scoped.
- A full Better Careers learning portal or custom mobile app.
- New Better Leadership programme design beyond the agreed website proposition.
- Paid media and ongoing advertising spend.
- Legal or tax advice.
- Unapproved testimonials, logos, audience claims or image rights.
- A complete trademark or naming exercise.

## Make it a real HWL web-design pilot

This is valuable beyond one client only if the operating method is captured.

### Reusable method

1. Commercial and audience audit.
2. Public-site and performance audit.
3. Content and entity model.
4. Art direction based on the product's real behaviour.
5. Conviction prototype.
6. Greenfield platform build.
7. Conversion and distribution system.
8. Managed monthly optimisation.

### Case-study term

Ask for permission to publish the design process and agreed performance results after 90 days. Client data, private conversion values and customer information remain confidential.

### Measures of success

- Visitor understanding in usability tests.
- Episode play rate.
- Better Bits conversion by entry page.
- Work Problem Finder use and result clicks.
- Sum Up capture rate.
- Better Careers checkout and purchase rate.
- Qualified Better Leadership and speaking enquiries.
- Organic and answer-engine visibility.
- Core Web Vitals and accessibility.
- Publishing time per episode.

## The rule

Make the private prototype good enough that the commercial conversation is about whether Cathal wants to own it, not whether he can imagine it.

Then charge for the platform, the migration and the management. Do not charge for how quickly Codex helped HWL make it.
