---
date: 2026-06-09
target: https://www.hwlstudio.com
method: rendered the live React SPA in a headless browser, extracted full DOM, all links, all CTAs, all meta tags
status: audit complete. Source code not in this repo, so fixes are specced, not applied.
---

# hwlstudio.com audit, 9 June 2026

## The one finding that matters

**Every primary call-to-action on the site is a dead button.** "Get in Touch", "View Pricing", "See Our Work", "Build an Engine", "read our manifesto" all render as elements with no `href` and no click handler. There is no contact form, no `mailto:`, no booking link, no email capture field anywhere on the page. The only working links on the entire site are the four case-study videos (YouTube/Vimeo) and the three footer social icons.

So the site is a beautifully written brochure with no door. A brand/comms lead who lands here, reads the copy, decides they want to hire you, and clicks "Get in Touch" hits nothing. That is the whole funnel breaking at the last inch. With your content about to drive real top-of-funnel traffic (and the IG bio link presumably pointing here), this is the single highest-priority fix on the entire to-do list, above the system, above the funnel theory. Fix the door before you drive traffic to it.

## What the site says (it's genuinely good copy)

The writing and positioning are strong and on-voice. Verbatim spine:

- H1: "Systems for scale, craft for impact."
- Sub: "We turn expertise into a repeatable content system that compounds every week."
- Core offer: **"The Integrated Content Engine™"** (note: trademarked) with three steps: Strategic Blueprint → Cinematic Production + Editorial Craft → Systemised Distribution.
- Philosophy section: "Content is infrastructure. Not decoration." This is excellent and is the real positioning asset.
- Selected works: Better@Work (podcast), MARCHON Training (social series), MARCHON (product launch), Laing O'Rourke (documentary interview).

The copy is doing its job. The site's problem is not the words, it's that the machine underneath the words is unplugged.

## Defects, ranked

**Critical**
1. All CTAs dead (above). No way to contact, book, or convert.
2. No lead capture of any kind. The funnel research (`spec/funnel-niels-klement-2026-05-26.md`) recommends a mobile-first audit/quiz funnel as the IG-bio destination. Right now the bio link goes to a page you can't even email from. Even before a full funnel, a single working contact path is non-negotiable.

**High**
3. **Stale dating undercuts the premium positioning.** The offer block says "Updated for 2025" and "Available for Q2 2025". It's June 2026. To a sharp buyer this reads as abandoned. Either remove the year stamps entirely (cleaner for a scarcity brand) or update them.
4. **SEO/social presence is effectively zero.** No meta description, no Open Graph tags, no favicon, no page title beyond "HWL Studios". Share the link in a DM or Slack and it renders as a bare ugly URL with no preview card. For a studio whose whole pitch is "we make you look premium online", the link preview failing is an own-goal. This is a fast, high-value fix.

**Medium**
5. **Brand name inconsistency.** Site title and footer say "HWL Studio**s**" (plural). Your business, invoices, and every internal file say "HWL Studio" (singular). Pick one. Singular is the registered entity (HWL Studio Limited). The plural is probably a leftover.
6. **Case studies are just video links, not case studies.** "WATCH CASE STUDY" opens a raw YouTube/Vimeo video with zero framing: no client problem, no what-you-did, no result, no metric. The Arsenal/viral numbers, the LOR "documentary interview", the MARCHON launch all have real outcomes you could state. A one-screen case study per project (problem → approach → result + the embedded film) would do far more conversion work than a bare video.
7. **Social links are personal, not studio.** Footer points to x.com/HazzaLiving, instagram.com/harrison.living, linkedin.com/in/harrisonliving. That's fine if the strategy is founder-led (it currently is, and the Arsenal reel went viral on the personal IG). But decide deliberately: is the studio brand or the personal brand the front door? Right now it's mixed by accident, not design.

**Low**
8. "MARCHON" is featured twice as a client but doesn't appear in your current client files (LOR, Creepers, BaW, Colin Fisher). Likely an older engagement. Confirm it's still a story you want leading the works section, or swap in Creepers/Chelsea (2 golds + a silver, 5-star trade stand) which is fresher and more premium-coded.

## What I'd do, in order

1. **Tonight-or-tomorrow, 30 min:** make "Get in Touch" work. Even the crudest version, a `mailto:harrison@hwlstudio.com` or a Calendly link, beats a dead button. Stop the bleed.
2. **This week, ~2 hrs:** add meta description + Open Graph tags + favicon so the link previews properly when shared. Remove the "2025" stamps. Fix Studio/Studios.
3. **Next:** stand up the real conversion path. This is where the funnel work (separate doc) plugs in: the mobile-first audit funnel as the bio destination, Calendly-in-funnel so you're not paying the inbox tax. The site becomes the credibility layer; the funnel becomes the conversion layer.
4. **When you have a spare half-day:** turn the four video links into actual one-screen case studies with a result line each. This is the highest-ROI content upgrade on the site.

## Note on access

The site is a deployed single-page app; its source is not in this repo, so I could not push these fixes directly. If you tell me where it's hosted and where the code lives (Vercel? a separate repo? a no-code builder like Framer/Webflow?), I can either make the changes or hand you exact copy-paste diffs. The meta-tags and dead-CTA fixes are a 20-minute job for whoever has repo access.
