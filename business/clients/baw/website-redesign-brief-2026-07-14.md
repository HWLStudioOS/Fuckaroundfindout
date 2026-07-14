# Better@Work website redesign and re-optimisation brief

**Date:** 14 July 2026  
**Status:** Working frontier-platform brief  
**Target:** Private conviction prototype first. Production timing begins only after Cathal buys the work.  
**Recommendation:** Build a greenfield Next.js platform on Vercel with Sanity, Stripe and Kit. Use WordPress once as a migration source, then retire WordPress and SiteGround.

## The honest verdict

The current Better@Work website is not a great website.

It has a recognisable logo, an energetic palette, useful source material and a real product in Better Careers. Those are assets. They do not add up to a coherent digital brand or a working Season 5 platform.

The larger problem is not visual age. It is that the site presents an older version of the business:

- It still leads with the 2022 award nomination and the old "work best friend" language.
- It presents Better@Work mainly as Cathal's show, while the actual Season 4 format and future plan rely on Cathal and Annette together.
- The Listen page still embeds the old Omny archive and appears to stop in 2025, even though Acast has the complete current feed.
- The Resources page stops at Season 3 and behaves like a PDF file dump.
- Speaking is a biography and a generic enquiry form, not a commercial proposition.
- Better Careers contains valuable material but wraps it in a weak buying journey and inconsistent pricing language.
- The site does not explain how the podcast, Better Bits, Sum Ups, Better Careers, Better Leadership and speaking fit together.
- The WordPress frontend mixes a legacy theme, Divi, WPBakery-style shortcodes, WooCommerce and several plugins. This makes simple changes slower and increases performance and maintenance risk.

The previous one-day FAFO scope was too eager to prove speed. It described a prettier site, but it had not earned the claim that the result would be great. Seven routes in a day would have created a persuasive prototype, not a production website. It did not go far enough on positioning, audience journeys, content modelling, feed automation, SEO, accessibility, analytics, migration or client approval.

This brief supersedes it.

## What the site needs to become

The redesign is not a podcast brochure. It is Better@Work's owned platform for turning conversations into useful ideas, loyal audience and qualified commercial demand.

The central proposition is:

> Better@Work finds useful ideas about work, tests them in honest conversation, and turns them into something people can use.

That is the shared logic behind the show, listener questions, Let's Take This Offline, the Better Bits, Sum Ups, Better Careers and Better Leadership.

The website should make five actions unusually easy, in this order:

1. Find and play an episode that is relevant now.
2. Join the owned audience through the Better Bits or a useful Sum Up.
3. Understand Better Leadership and make a serious organisational enquiry.
4. Understand and buy Better Careers.
5. Send Cathal and Annette a real question for the show.

Speaking remains important, but it should sit inside the commercial story rather than dominate the public brand.

## What the evidence says

### The audience is more specific than the current site

The strongest current audience signal is women aged 45 to 59 in Australia, the UK and the US. Spotify is 70% female and 68% aged 45 to 59. The LinkedIn audience is unusually senior, with roughly 40% at Senior, Director or CXO level and a strong concentration in finance, consulting and banking.

The public brand does not need to declare itself a women-only leadership brand. It does need to be designed, written and programmed with this woman in mind. She is experienced, time-poor and allergic to workplace content that is either condescending or vague.

### The podcast is a trust engine, not a media business on its own

May Acast volume was 929 downloads, up 31% on the old baseline. LinkedIn is currently the strongest discovery surface. YouTube is growing. Apple and Spotify remain the main listening surfaces. At this scale, the website's job is not to monetise page views. Its job is to deepen trust, capture permission and make the two product lanes legible.

- Individual lane: social or search to episode, then Sum Up or Better Bits, then Better Careers.
- Organisational lane: leadership episode or LinkedIn post, then Better Leadership or speaking proof, then a qualified conversation.

### The content is richer than the website suggests

The Acast feed contains 79 episodes and current Season 4 material through 9 July 2026. The production system already creates detailed descriptions, clips, quotations, takeaways and Sum Ups. The website currently throws most of that value away.

### The existing brand has two useful visual seeds

The redesigned Sum Up is clear, punchy and practical. The May performance report is more mature: warm paper tones, strong editorial hierarchy, restrained colour and credible data presentation. Neither should be copied wholesale. Together they point towards a brand that can combine useful tools with senior editorial credibility.

## Current-site baseline

This is the launch baseline, not a complete forensic audit.

| Area | Current evidence | Consequence |
| --- | --- | --- |
| Freshness | Listen page uses a stale Omny embed while the show has moved to Acast | The owned site appears abandoned |
| Positioning | Old tagline, 2022 award badge and solo-Cathal framing | Season 5 strategy is invisible |
| Architecture | Offers, podcast and resources are disconnected | Visitors cannot understand the business |
| Content | Newsletter and Sum Ups stop at Season 3 | High-value material is buried or stale |
| Search | No meta descriptions found across the main public pages | Weak search-result control |
| Structured data | Generic WebPage, Website and Organisation schema only | Episodes, people, products and resources are poorly described to search systems |
| Accessibility | Many images have no useful alt text, unnamed links exist, page zoom is restricted | Avoidable barriers and legal/reputation risk |
| Mobile performance | Lighthouse: Performance 56, Accessibility 86, Best Practices 77, SEO 85 | Below a credible production standard |
| Core experience | Mobile LCP 5.8s, CLS 0.319, interactive at 8.2s | Slow loading and visible layout movement |
| Frontend weight | 159 KiB unused CSS, 224 KiB unused JavaScript, 2.24s render-blocking opportunity | Legacy builder cost with little user value |
| Security hygiene | Insecure HTTP asset and document references remain | Browser warnings and trust loss |
| Index control | Backup, test shop, shop, subscribe and thin archive pages are indexable | Search clutter and weak quality signals |
| Commerce | Global currency notice and cart UI interrupt non-commerce pages | The whole site feels like a shop even when it should feel editorial |
| Forms | Speaking form appears to accept audio files, likely inherited from the listener-question workflow | Confusing intent and unnecessary data exposure |

### Page-level diagnosis

**Home:** High energy but visually blunt. It gives too much space to old proof and not enough to the current show, the duo or a useful next action.

**Listen:** The most damaging page. The embedded archive is stale, the page has two H1 elements, and the current Acast catalogue is absent.

**Newsletter and resources:** Valuable PDFs are presented as a long, insecure file list. There is no clear resource taxonomy, exchange or follow-up journey.

**Speaking:** The page title duplicates the About title. There is one loosely framed talk, limited proof and no clear buyer-oriented outcome. A biography is doing the work of a sales page.

**Better Careers:** The six-step content is useful and testimonials are credible. The current page is too long, visually inconsistent, partially duplicated and unclear about currency and promotion terms.

**About:** The current site explains Cathal. Season 5 needs to explain the partnership between Cathal and Annette, why the show exists, and why their different perspectives make it useful.

## Comparator lessons

The redesign should learn from strong adjacent brands without imitating their style.

### Amazing If and Squiggly Careers

- One clear idea supports learning products, a podcast, books, newsletter and corporate work.
- The podcast archive has individual episode pages, search and topic filters.
- Organisational proof and newsletter scale are visible without overpowering the useful content.
- The visual system is ownable because its line motif and illustrations come from the core brand idea.

### Dr Amantha Imber

- Three commercial paths are visible within seconds: speaking, podcast and books.
- Claims are backed by concrete proof such as downloads, reader scale and named organisations.
- The writing makes expert material feel practical and human.
- The current homepage is commercially effective, although its interruptive personalisation pop-up is not a pattern to copy.

### Hidden Brain

- The archive is treated as a library of durable ideas.
- "Featured episodes to start" removes the intimidation of a large back catalogue.
- Thematic series make old material discoverable again.
- Episode summaries and transcripts create more search and answer value than an audio player alone.

### HBR and Coaching Real Leaders

- Each series has a precise format promise and a defined audience.
- Listener applications and questions are designed as real editorial inputs.
- Host, series and episode information are separated cleanly.

The opportunity for Better@Work is to combine Amazing If's business clarity, Hidden Brain's content architecture and Amantha Imber's human commercial confidence, while retaining the B@W duo and practical tone.

## Brand architecture

Better@Work should be the master brand.

### Editorial engine

- **Better@Work podcast:** The flagship conversation and weekly trust engine.
- **Let's Take This Offline:** Cathal and Annette's applied reflection and listener-question format.
- **The Better Bits:** The owned weekly newsletter.
- **Sum Ups:** Useful, designed resources tied to episodes and topics.

### Offers

- **Better Careers:** The individual product.
- **Better Leadership:** The organisational lane, beginning with a Season 5 miniseries and an enquiry proposition.
- **Speaking:** Cathal's keynote and workshop offer, with Annette's role stated accurately where relevant.

The site should not pretend Better Leadership is a finished programme if its proposition and delivery are still being developed. The first release can frame the editorial miniseries, the problems it explores and the invitation for organisations to start a conversation.

## Positioning and message work

The old "new best friend at work" proposition has warmth but lowers the level of the brand. "Science-backed" has become generic and is risky unless each claim is demonstrably sourced. "Betterness" can remain part of the internal vocabulary, but it should not carry the public proposition alone.

The strongest working territory is:

> **Honest conversations. Useful ways to work better.**

It describes the format and the value without overclaiming. It also leaves room for careers, teams, leadership and life outside work.

Two other territories should be tested in copy and design, not decided in this document:

- **Better ideas for the work that matters.** More senior and purposeful, but less human.
- **The people, ideas and tools making work better.** Broad and clear, but less distinctive.

The final proposition needs one short review with Cathal and Annette. The choice should be made against real homepage and episode-page copy, not in a list of taglines.

## Creative strategy

The redesign needs an ownable idea. "Warm editorial site with a serif" is not enough. That look is fashionable, easy to generate and already becoming generic.

Three creative routes should be developed to high-quality art-direction boards, then one selected before full page design.

### Route A: Work, Annotated

**Idea:** Better@Work does not simply broadcast ideas. Cathal and Annette question, highlight, argue with and apply them.

Visual cues:

- Strong, readable editorial layouts with notes, highlights, brackets and useful marginalia.
- Episode cards show the idea, the source and what to do with it.
- Yellow behaves like a real highlighter, used sparingly.
- Sum Ups feel like designed field notes rather than lead-magnet PDFs.
- A paper and ink base, supported by deep violet, warm coral and dark green.
- Human marks are controlled, not scrapbook decoration.

This is the recommended starting route because it comes directly from the format and makes the resource system feel inevitable.

### Route B: Two Voices

**Idea:** The show's advantage is not only its guests. It is the shift from expert conversation to Cathal and Annette working through what it means.

Visual cues:

- Paired frames, split compositions and two related accent colours.
- The two-capsule logo becomes a genuine system for two perspectives, question and answer, idea and action.
- Photography prioritises Cathal and Annette together, reacting and listening rather than posing separately.
- Motion can move an idea from one voice to another.

This route is the most recognisably B@W, but it must avoid turning every layout into a visual gimmick.

### Route C: Signals from Work

**Idea:** Better@Work is where experienced people make sense of the changes, tensions and choices shaping working life.

Visual cues:

- Strong information hierarchy, restrained graphics and evidence-led proof.
- Confident photography and a more senior palette.
- Data points, source notes and topic signals are part of the interface.
- Better Leadership and speaking feel naturally credible.

This route strengthens the organisational lane, but it risks losing the show's warmth if used alone.

### Recommended combination

Lead with **Work, Annotated**, use **Two Voices** as the distinct B@W device, and borrow the proof discipline of **Signals from Work**.

### Visual principles

- Preserve the copyrighted two-capsule mark unless a separate identity decision is made.
- Use near-black and warm off-white as the stable foundation.
- Keep yellow as a signal, not the entire room.
- Retain violet as a recognisable audio/editorial colour, but deepen and control it.
- Use one warm accent for listener questions and action.
- Use a contemporary sans serif for navigation and body copy. Test a complementary text or display face only where it improves reading and voice.
- Avoid generic startup gradients, floating pill overload, cartoon hands, microphone clip art and stock office scenes.
- Use candid, directional photography of Cathal and Annette together, guests in conversation and real working moments.
- Let motion express listening, annotation or a change of perspective. Do not animate for decoration.

### Photography brief

The filming day should also create the core website image library:

- Cathal and Annette together, landscape and portrait.
- Listening, laughing, disagreeing, reading and preparing, not only looking at camera.
- Clean negative-space frames for homepage and campaign copy.
- Individual portraits with consistent light and grade.
- Hands, notes, headphones and studio details for resource and episode crops.
- Short silent motion loops that can be used without autoplay audio.
- A small set of neutral-background cut-outs only if the chosen route needs them.

The current image library can support wireframes, but the final brand should not be designed around old photography.

## Audience journeys

### Core listener

**Profile:** Senior woman, 45 to 59, often in finance, consulting or another high-responsibility environment.  
**Need:** A useful answer to a real work tension without being talked down to.  
**Likely entry:** LinkedIn, Apple, Spotify, Google or a shared episode.  
**Best next action:** Play an episode, save a Sum Up, join Better Bits or send a question.

### New discovery visitor

**Profile:** Has seen one clip or guest name and does not yet know the brand.  
**Need:** Immediate context and a low-friction way to sample the show.  
**Likely entry:** Episode detail page.  
**Best next action:** Play the relevant section, read the takeaways or browse a related topic.

### Organisational buyer

**Profile:** HR, L&D, leadership, transformation or senior business lead.  
**Need:** Proof that Better@Work can help with a defined organisational problem.  
**Likely entry:** LinkedIn, a leadership episode, a referral or Cathal's profile.  
**Best next action:** Review Better Leadership or speaking outcomes, then make an enquiry.

### Career buyer

**Profile:** Experienced professional facing a transition, plateau, return or re-entry.  
**Need:** A credible, bounded process with practical tools and realistic proof.  
**Likely entry:** Career episode, recommendation, Sum Up or product link.  
**Best next action:** Understand the six steps, review what is included, buy in the correct currency.

### Guest and referrer

**Profile:** Potential guest, publicist, past guest or professional referrer.  
**Need:** A credible picture of the show, audience and editorial standards.  
**Best next action:** Share a useful episode, propose a guest through a deliberate route, or introduce an organisation.

## Information architecture

### Primary navigation

- **Listen**
- **Ideas**
- **Better Leadership**
- **Better Careers**
- **About**
- Primary action: **Join The Better Bits**

Speaking can sit under About or a compact "Work with us" menu if the offers become broad enough. On mobile, the listener-question action should remain easy to find without competing with the primary sign-up.

### Release-one sitemap

- `/` Home
- `/episodes/` Episode archive
- `/episodes/{episode-slug}/` Individual episode template
- `/topics/{topic-slug}/` Topic template
- `/series/better-leadership/` Better Leadership miniseries and organisational enquiry
- `/ideas/` Ideas and resources landing page
- `/resources/{resource-slug}/` Individual Sum Up or resource page
- `/newsletter/` The Better Bits
- `/questions/` Listener question and voice-note page
- `/better-careers/` Better Careers sales page
- `/speaking/` Speaking proposition
- `/about/` Cathal, Annette and the show
- `/contact/` General contact
- Legal: privacy, terms, refunds and accessibility

Do not build a separate page merely because the old site had one. Every indexable URL must answer a clear question, serve a journey or protect a required transaction.

## Page blueprints

### Home

The home page should orient, prove and route. It should not try to contain the whole business.

1. Clear promise, Cathal and Annette, and two actions: listen to the latest episode and join Better Bits.
2. Latest or featured episode with a native, accessible audio player and one compelling idea.
3. "Start with what is happening at work" topic routes, built from audience problems rather than internal categories.
4. Let's Take This Offline, explaining the duo and listener-question format.
5. Three useful paths: ideas for me, better careers, better leadership.
6. One featured Sum Up with a concrete preview of what is inside.
7. Concise proof: audience, guests, organisations and testimonials that are approved and current.
8. Better Bits sign-up with a specific weekly promise.
9. Clean platform, social and legal footer.

### Episode archive

- Latest episode first.
- "New here? Start here" collection.
- Search by title, guest and transcript text if practical.
- Filters by topic, format, season and series.
- Distinguish guest interviews, Listener Questions, best-of episodes and Better Leadership.
- Make Apple, Spotify, YouTube and RSS follow actions easy without turning the page into a wall of platform badges.

### Episode detail

- Episode title, guest, date, season, duration and format.
- Accessible Acast audio player or native player using the feed enclosure.
- YouTube version where available.
- A short reason to listen and key moments.
- Three applied takeaways, not only a long show description.
- Cathal and Annette's offline reflection where relevant.
- Transcript in accessible HTML when available.
- Named sources, books and links.
- Related Sum Up, topic and episodes.
- Listener-question and Better Bits calls to action.
- Correct podcast episode, person and breadcrumb structured data.

### Better Leadership

- The leadership problem the series is exploring.
- Who the series and future offer are for.
- The five-part miniseries format and confirmed or target themes.
- Selected leadership episodes and proof.
- Cathal and Annette's relevant credibility.
- One enquiry form with qualifying questions and a clear response expectation.
- No invented programme features, pricing or outcomes.

### Ideas and resources

- Better Bits and Sum Ups under one useful content architecture.
- Filter by topic and format.
- Preview the value of each resource before asking for an email.
- Use a consistent decision about gating. Do not gate every PDF by default.
- Keep HTML summaries indexable even when a downloadable file is exchanged for email.

### Better Careers

- A precise statement of who the product is for and what problem it solves.
- The six-step method in a compact, credible sequence.
- What is included, format, access, time requirement and support.
- Approved testimonials without duplicates.
- Accurate Cathal and Annette roles.
- Price and currency logic that cannot contradict itself.
- Direct checkout path with refunds and support terms visible.

### Speaking

- The outcomes a buyer can commission, not a long biography.
- Two or three named talk or workshop propositions, once approved.
- Audience, format, takeaway and evidence for each.
- Short, edited video proof.
- Organisational logos or testimonials only with permission.
- A focused enquiry form. No audio-upload field.

### About

- Why Better@Work exists.
- Cathal and Annette together, then their distinct roles.
- How guest conversation becomes practical application.
- Concise credibility and links to speaking or questions.

### Listener questions

- Explain what makes a useful question and what may happen to a submission.
- Text and optional voice note.
- Clear consent covering edit, anonymity, publication and data retention.
- An example question and a simple alternative for general contact.

## Content model

The content model is the difference between a current site and another manual archive.

### Episode

- Acast episode ID
- Title and clean display title
- Slug
- Publication date
- Season and episode number
- Format: guest, Listener Questions, best-of, solo or miniseries
- Series
- Guest or guests
- Topics
- Duration
- Audio enclosure and Acast URL
- YouTube URL
- Short summary
- Full show notes
- Three takeaways
- Key moments or chapters
- Transcript
- Sources and book links
- Related Sum Up
- Related episodes
- Search title, description and social image

### Person

- Name, role and organisation
- Host or guest type
- Short and full biography
- Pronunciation and pronouns where useful
- Portrait and alt text
- Approved links
- Related episodes

### Resource

- Title, summary and format
- Topic and related episode
- Cover image and alt text
- Download file
- Gated or open state
- Version and publication date
- Follow-up journey

### Series

- Name, proposition and audience
- Episodes
- Hosts
- Commercial enquiry state

### Offer

- Name, audience, problem, method, contents, proof, price or enquiry state
- Related editorial content
- Purchase or enquiry action

## Acast integration

The public Acast RSS feed is suitable for an automatic episode importer. It includes a stable episode ID, date, duration, season, episode number, audio enclosure, description and episode URL.

Build a server-side import route that writes Episode documents into Sanity. Trigger it with Vercel Cron and allow a protected manual run. The public Next.js application should read the structured Sanity documents, not parse the RSS feed on every request.

The importer should:

1. Fetch the canonical numeric Acast feed on a schedule and on manual request.
2. Upsert episodes by `acast:episodeId`, never by title.
3. Sanitize and store the show description as source material.
4. Preserve curated website fields such as takeaways, topics, transcript and YouTube link when the feed updates.
5. Log failures without taking the public site down.
6. Support a preview and dry run before the initial 79-episode import.
7. Trigger on-demand revalidation only for affected pages.

The Acast show settings also need correction. The current feed links to `betteratwork.com.au`, identifies only Cathal in the show title and author, and still carries the old proposition. Those fields influence every podcast platform and should be reviewed as part of the refresh.

## Search, answer and content strategy

The aim is not to generate thin "SEO content". It is to make the real archive understandable, useful and citable.

### Required foundation

- One intentional title, H1 and meta description per indexable page.
- Canonical URLs and a clean XML sitemap.
- Remove or noindex backup, test, empty shop and thin archive URLs.
- Deliberate 301 redirect map for replaced pages and files.
- HTTPS-only internal links and assets.
- Open Graph and social images for core templates.
- PodcastSeries, PodcastEpisode, Person, Organisation, Product, Article and Breadcrumb structured data only where the visible page supports it.
- Visible transcripts in HTML, not only a PDF or iframe.
- Descriptive image alt text and meaningful link labels.
- Source and book citations on episode pages.

### Topic architecture

Start with a deliberately small taxonomy based on recurring audience problems. Candidate clusters:

- Leading people
- Career change and progression
- Conflict and difficult conversations
- Teams and culture
- Energy, stress and sustainable performance
- Strategy, decisions and change

Do not publish six empty topic hubs. A topic becomes indexable when it has enough episodes and an authored introduction that genuinely helps someone choose where to start.

### Answer value

Each strong episode page should make three questions answerable without requiring the full listen:

- What is the core idea?
- Why does it matter at work?
- What can I try next?

That is useful to human visitors, traditional search and answer engines. It is also native to the Sum Up format.

## Measurement

The redesign needs a baseline before it needs ambitious conversion targets.

### Core events

- `episode_play`
- `episode_complete_25`, `50`, `75`
- `platform_follow_click`
- `newsletter_submit`
- `resource_view`
- `resource_download`
- `listener_question_submit`
- `leadership_enquiry_submit`
- `speaking_enquiry_submit`
- `careers_checkout_start`
- `careers_purchase`
- `outbound_social_click`
- `problem_finder_search`
- `problem_finder_result_open`
- `playlist_email_request`

### Weekly dashboard

- Sessions and engaged sessions by source.
- Episode page to play rate.
- Better Bits conversion rate by entry page.
- Resource view to download or sign-up rate.
- Listener questions submitted.
- Qualified leadership and speaking enquiries.
- Better Careers checkout starts and purchases.
- Top topics and internal search terms.

UTM naming should match the summer content engine so LinkedIn, YouTube, newsletter, best-of episodes and guest sharing can be compared. Set realistic targets after two to four weeks of clean data.

## Performance, accessibility and privacy standard

The production standard is:

- Mobile Lighthouse scores of 90 or better for Performance, Accessibility, Best Practices and SEO on core templates under normal test conditions.
- Largest Contentful Paint at or below 2.5 seconds at the 75th percentile.
- Cumulative Layout Shift at or below 0.1.
- Interaction to Next Paint at or below 200 ms when field data becomes available.
- WCAG 2.2 AA for colour, keyboard use, focus, forms, headings, media controls and reduced motion.
- Browser zoom remains available.
- No autoplay audio.
- Responsive images, explicit dimensions, modern formats and restrained third-party scripts.
- Consent and analytics configuration appropriate to the UK, EU and Australian audience.
- Listener voice notes have explicit consent, retention and deletion rules.

These are acceptance criteria, not stretch goals.

## Technical recommendation

### Recommended stack

**Application:** Next.js App Router and TypeScript, deployed from a private Git repository to Vercel Pro. Prefer server-rendered and incrementally regenerated pages. Client-side JavaScript is reserved for the persistent player, search, forms and useful interaction.

**Design system:** Custom components, tokens and modern CSS. No purchased theme and no general-purpose component kit controlling the look. Accessible primitives can be used where they reduce risk.

**Content:** Sanity Content Lake and Studio. Episode, Person, Topic, Series, Resource, Product and Page are structured documents. Sanity's visual editing lets Cathal or HWL click from the preview into the correct field without handing layout control to a page builder.

**Podcast:** Acast remains the audio host and distribution source. A Vercel Cron job imports the canonical RSS feed into Sanity. Curated website fields remain separate from feed-owned fields.

**Commerce:** Stripe Checkout for Better Careers and future digital offers. Use adaptive pricing or deliberate regional prices, signed webhooks, a proper success flow and server-side fulfilment. Shopify is not justified unless Better@Work becomes a multi-product retail business with inventory, shipping or a large catalogue.

**Audience:** Migrate the consented Brevo audience and suppression data into Kit. Use custom on-site forms, Kit tags and sequences for Better Bits, Sum Ups, career interest and leadership interest. Do not lose unsubscribe history during migration.

**Transactional email:** Resend for listener questions, enquiries, receipts or resource-delivery messages that are not marketing campaigns.

**Files:** Sanity for editorial assets. Use a private object store such as Vercel Blob only where a listener voice note requires it, with an explicit retention and deletion policy.

**Analytics:** Vercel Web Analytics and Speed Insights for the first release, including named conversion events. Connect Google Search Console and Bing Webmaster Tools. Add a heavier product-analytics platform only when the traffic and experiment programme justify the extra tracking.

**Search and discovery:** Fast title, guest, topic and transcript search over the structured archive. Do not buy Algolia for 79 episodes.

### Signature frontier feature: the Work Problem Finder

The most interesting useful feature is not a generic chatbot. It is a grounded content finder.

A visitor describes a real problem, such as "my boss is micromanaging me" or "I am preparing for a career change". The site returns relevant B@W episodes, exact takeaways, transcript moments and Sum Ups. Every result links to the source. It can create an email playlist and tag the visitor's declared interest with consent.

Build semantic retrieval using Sanity dataset embeddings or a small vector index. Generated synthesis is optional and must remain grounded in the retrieved B@W material. The first pilot can use a curated set of 20 strong episodes before the whole archive is enriched.

This creates real utility, makes the archive feel alive and gives Better@Work an ownable interaction that competitors do not have.

### Persistent listening

Audio should continue when a visitor moves between episode, topic and resource pages. The global player remembers progress locally, exposes chapters and never autoplays. This is a more meaningful podcast-site feature than decorative animation.

### Ownership

The private concept can live inside HWL's Vercel environment. Production should move into client-owned Vercel, Sanity, Stripe and Kit accounts with HWL invited as the manager. Cathal owns the domain, customer data, content and platform accounts. HWL owns its reusable methods and non-client-specific code.

### What happens to WordPress and SiteGround

They become a migration source, not part of the new system.

- Export pages, media, Yoast metadata, redirects, products, orders, customers, forms and legal content.
- Export Brevo subscribers, consent fields and suppression records.
- Preserve WooCommerce financial and customer records in a secure archive.
- Map every useful public URL to a new destination before DNS changes.
- Keep the old system read-only for 30 to 60 days after launch.
- Cancel SiteGround and remove the WordPress attack surface once the archive and rollback window are complete.

No legacy theme, plugin or PHP code needs to come with us.

## Delivery plan

There is no client deadline yet. Use that freedom to make the pitch undeniable without doing the entire production build for free.

### Internal pilot, capped at five focused days

- Set the final creative route and design tokens.
- Build the responsive homepage with real Season 4 and Season 5 material.
- Build one exceptional episode page with player, chapters, takeaways, transcript and sources.
- Build a topic or start-here collection.
- Prototype the Work Problem Finder on a curated content set.
- Show the Better Careers path and Stripe checkout concept without taking live payment.
- Deploy a protected Vercel preview.

**Internal gate:** If this does not look and feel like an exceptional portfolio piece after five focused days, stop and diagnose it. Do not hide weak strategy with more pages.

### Pitch

Show Cathal the working experience, the migration plan and the commercial model. Do not give away the repository or connect production accounts before a contract and first payment.

### Client production after approval, four to six weeks

1. Positioning, content decisions and approved creative direction.
2. Full UX, responsive templates and production design system.
3. Sanity Studio, content migration and Acast importer.
4. Kit migration, Stripe integration, forms and transactional email.
5. Work Problem Finder, persistent player and archive search.
6. Redirects, SEO, answer optimisation, analytics and QA.
7. Client acceptance, domain cutover and 30 to 60 day legacy shutdown window.

## Release one and later work

### Release one, client production

- Complete brand and interface refresh.
- Current homepage and core product journeys.
- Automatic Acast episode archive and individual episode pages.
- Initial curated topics and start-here collection.
- Better Bits and Sum Up architecture.
- Better Leadership launch page and enquiry.
- Better Careers and speaking refresh.
- Analytics, SEO, accessibility, redirects and performance foundation.
- Persistent audio across page navigation.
- Work Problem Finder over the curated archive.
- Stripe and Kit conversion journeys.

### Release two, after launch data

- Extend semantic and transcript search to the full archive.
- Expanded topic hubs.
- Personalised resource recommendations if evidence supports them.
- Better Careers offer and checkout experiments.
- Better Leadership programme detail once the offer is real.
- More sophisticated subscriber segmentation and lifecycle automation.
- Additional episode tools such as saved playlists or chapter deep links if use justifies the build.

## Inputs and decisions needed

### Access

- WordPress administrator access for export only.
- SiteGround collaborator access for DNS, files, database export and shutdown only.
- Acast admin access or a named person who can change show settings.
- Export access to Brevo, Gravity Forms, WooCommerce and existing analytics.
- Client-owned Vercel, Sanity, Stripe, Kit and Resend accounts before production launch.
- No passwords sent in chat or stored in the project repo.

### Client decisions

- Final Season 5 launch date.
- Public role and prominence of Annette across show title, Acast metadata and website.
- Which audience language is explicit publicly, especially the senior-women lens.
- Better Leadership release-one promise and enquiry owner.
- Better Careers price, currencies, promotion dates and refund/support terms.
- Two or three speaking offers and approved proof.
- Third Sum Up test subject.
- Filming and photography date.
- Rights to the logo, photography, fonts, testimonials and organisational logos.

### Content inputs

- Cathal and Annette biographies and role definitions.
- Current show, platform and social links.
- Approved audience and performance proof.
- Guest list and permissions where required.
- Existing question-form consent language.
- Legal pages and business identity details.

## Roles

**Harrison:** Creative and strategic lead. Owns the standard, client decisions, visual judgement and final recommendation.

**Sol:** Content and editorial partner. Sharpens positioning and page copy, curates Season 4 proof and makes the site sound like the show.

**Codex:** Audit, information architecture, design system, coded Next.js application, Sanity schemas, integrations, migration support, testing and technical handover.

**Cathal and Annette:** Approve proposition, public roles, creative route, claims and launch content. Feedback should be batched at the defined gates.

## Definition of great

The redesign is great when:

- A new visitor can say what Better@Work is, who it helps and what to do next within five seconds.
- The latest Acast episode appears automatically and never depends on someone rebuilding a page.
- A visitor can find a relevant episode or useful starting point in no more than two decisions.
- Cathal and Annette feel like the source of the experience, not two people added to a generic template.
- The visual identity could only plausibly belong to Better@Work.
- The Better Bits and Sum Ups offer a clear exchange rather than a vague newsletter request.
- A serious organisational buyer can understand the leadership and speaking offer without reading a life story.
- A career buyer can understand the method, product, price and terms without uncertainty.
- Every important form reaches the right person and records consent correctly.
- Core templates meet the stated performance and accessibility standards.
- Search engines and answer systems can understand episodes, people, topics, products and sources.
- The owner can publish and correct content without a developer or a page builder.
- No backup page, old embed, insecure link, abandoned award badge or stale copyright date undermines trust.

## The next concrete move

Do not start by coding seven pages.

Start with the protected Vercel conviction prototype: one exceptional homepage, one exceptional episode page, one topic collection and the Work Problem Finder. Use the recommended art direction and real B@W material. Do not connect production services or build the remaining routes until Cathal buys the platform.

Speed still matters. It now serves a considered result.

## Evidence reviewed

### Better@Work

- Public site and main page templates: `https://betteratwork.net/`
- Current Acast show and episode archive: `https://shows.acast.com/betteratworkpodcast/episodes`
- Canonical Acast RSS feed: `https://feeds.acast.com/public/shows/69d60ca52a193257adc683b0`
- Summer tracker: `https://betteratwork-summer.vercel.app/`
- Season 5 summer plan, roadmap, Superstars preparation, May performance report, delivery model and client notes in this repository.
- Current Sum Up redesign PDF and May monthly performance report PDF.
- Public mobile Lighthouse run on 14 July 2026.
- Vercel documentation for Cron, ISR, Web Analytics and current Pro pricing.
- Sanity documentation for visual editing, webhooks, dataset embeddings and Growth pricing.
- Stripe Checkout, webhooks and UK pricing documentation.
- Kit audience automation and current Creator pricing.
- Google Search guidance for generative AI features and OpenAI publisher guidance for OAI-SearchBot.

### Comparators

- Amazing If and Squiggly Careers: `https://www.amazingif.com/`
- Dr Amantha Imber: `https://www.amantha.com/`
- Hidden Brain: `https://hiddenbrain.org/`
- HBR podcasts and Coaching Real Leaders: `https://hbr.org/podcasts`

These are product and content-architecture references, not visual templates.
