# B@W website FAFO scope

> **Superseded on 14 July 2026.** This was a useful speed exercise, but it is not the production brief. It underestimated the strategy, content architecture, migration, measurement and quality work required for a client website. The replacement is `website-redesign-brief-2026-07-14.md`.

**Date:** 14 July 2026  
**North star:** A Season 5 launchpad, not a podcast brochure.

## The bet

Build a new Better@Work website in code in one working day and put it on a private preview URL. Do not wait for the WordPress theme, Divi, WPBakery or the old agency stack. Use the live site only as a source for approved copy, assets, URLs and working commercial plumbing.

The day ends with a real decision:

- **Kill it:** the direction is wrong and the live site remains untouched.
- **Iterate it:** the idea is right but needs another pass.
- **Ship it:** port the build into a clean WordPress theme, connect the live services and launch before Season 5.

## What changes

Keep:

- Better@Work name and copyrighted capsule logo.
- “When work is better, life is better” as an ownable brand line.
- Cathal and Annette as the human centre of the show.
- The existing domain, important URLs, podcast links, Sum Ups, Brevo list, forms and Better Careers checkout.
- The useful content already sitting in WordPress and the media library.

Open to change:

- Every layout.
- Palette and typography.
- Navigation and page hierarchy.
- Photography treatment.
- Podcast cover art and episode-card system.
- Sum Up presentation.
- Copy hierarchy and calls to action.
- The relationship between the show, Better Leadership, Better Careers and Cathal’s speaking.

Cut from the new direction:

- The 2022 award badge in the hero.
- The cart icon as primary navigation.
- Cartoon microphone and phone compositions.
- Wall-to-wall yellow.
- “Podcast best friend” language as the lead proposition.
- Solo-Cathal framing across the whole brand.
- Decorative motion that does not help someone understand or act.
- Divi and WPBakery shortcodes in new page content.

## Design direction

**Working name:** Intelligent optimism.

The site should feel like a sharp editorial publication with the warmth of a very good conversation. Credible enough for a senior Goldman, Westpac or Ellison Institute leader. Human enough to still sound like Cathal and Annette.

### Visual system

- Off-white and near-black carry most of the interface.
- Existing yellow becomes a signal colour, not the entire room.
- Violet remains recognisable but gets deeper and more controlled.
- One warmer accent can distinguish questions, listener dilemmas and calls to action.
- A confident editorial serif for large ideas, paired with a clean sans serif for navigation, labels and body copy.
- The capsule logo becomes a layout device: labels, buttons, topic tags, image crops and section markers.
- Large, candid photography. Fewer cut-outs. No clip-art collage.
- Motion is limited to useful transitions, episode progress and small capsule interactions.

### Voice

- Smart, direct and useful.
- Practical without sounding like workplace content marketing.
- One strong idea per section.
- Senior audience, normal language.
- The show is a source of ideas and relationships, not the final product.

## Day-one site map

The build uses one shared design system and seven lightweight routes. The homepage gets the full craft pass. Supporting pages use the same shell and real content, not bespoke art direction on day one.

### 1. Home

1. Tight navigation: Episodes, Better Leadership, Resources, About. Primary action: Join The Better Bits.
2. Hero: the core belief, Season 5 framing, Cathal and Annette, Listen and Subscribe actions.
3. Featured episode or trailer with a proper player and one clear reason to listen.
4. “Better Me, Better We, Better Ways” as the editorial framework.
5. Better Leadership, Better Careers and Speaking as three distinct paths.
6. Latest Sum Ups and practical resources.
7. Cathal and Annette as a duo, with a short explanation of “Let’s Take This Offline”.
8. Proof strip using approved audience, guest and organisational evidence.
9. The Better Bits sign-up.
10. Clean footer with listening platforms, social links and legal pages.

### 2. Episodes

- Featured Season 5 episode or trailer.
- Latest episodes from Acast or the existing feed.
- Topic filters prepared for Leadership, Careers, Teams, Change and Better Me.
- Links to listen on the user’s chosen platform.

### 3. Better Leadership

- A credible “coming in Season 5” page for the five-part miniseries.
- Who it is for, the questions it will answer and the leaders being sought.
- Enquiry or introduction form for guests, corporate superfans and programme buyers.

### 4. Resources

- The Better Bits newsletter.
- Sum Up library with useful covers, not a file dump.
- One featured lead magnet.
- Existing PDFs remain available while the new gated flow is built.

### 5. About

- Cathal and Annette together.
- Why the show exists.
- Their different roles and the value of the post-interview discussion.
- Compact credibility, no full CV wall.

### 6. Speaking and work with us

- Cathal’s speaking proposition.
- Two named talks or workshops.
- Evidence, video and a direct booking action.
- Better Leadership positioned as the emerging corporate lane.

### 7. Better Careers

- New wrapper around the existing product.
- Clear value, testimonials and $20 September promotion framing.
- Existing WooCommerce checkout remains the transaction layer until there is a reason to replace it.

## One-day build plan

### Hour 0 to 1: extract and frame

- Pull the useful copy, links, PDFs, show art and photography from the public site.
- Build the content model and route map.
- Set tokens for colour, type, spacing, radii and motion.

### Hour 1 to 3: make the homepage undeniable

- Build navigation, hero, episode feature and the three commercial paths.
- Establish the visual language at desktop and mobile widths.
- Use real content above the fold.

### Hour 3 to 5: build the site shell

- Add Episodes, Better Leadership, Resources, About, Speaking and Better Careers routes.
- Reuse components and keep each page tight.
- Connect existing public destinations where a live integration is not ready.

### Hour 5 to 6: interactions and plumbing

- Add responsive navigation, episode/player behaviour and useful micro-interactions.
- Wire the newsletter form if the public endpoint is usable. Otherwise keep a clearly marked preview state.
- Link the existing checkout without recreating payments.

### Hour 6 to 7: hard QA

- Mobile, tablet and desktop.
- Keyboard navigation, contrast, focus states and reduced motion.
- Broken links, image weight, metadata and social preview.
- Check every route at a clean browser session.

### Hour 7 to 8: taste pass and preview

- Remove anything generic or over-designed.
- Tighten copy and spacing.
- Deploy a private preview.
- Record the remaining production gaps in plain English.

## Technical shape

### Preview

- Code-first static frontend.
- Plain HTML, CSS and minimal JavaScript, or a very small Vite setup if component reuse earns it.
- No CMS dependency during the design day.
- Stored in Git with a single deployable build.

### Production

- Port the approved frontend into a clean custom WordPress theme.
- Native templates and a small set of editable content fields or blocks.
- Keep WooCommerce, Gravity Forms and Brevo only where they are doing real work.
- Work on a SiteGround staging copy.
- Deploy theme files separately from live orders, subscribers and form entries.
- Preserve URLs and add deliberate redirects for anything removed.

This gives the owner a familiar WordPress admin without handing the frontend back to a page builder.

## Inputs and ownership

**Codex:** design system, coded site, responsive behaviour, technical integration, testing and deployment plan.

**Sol:** sharpen the page copy, pull the best Season 4 proof and keep the language consistent with the summer and Season 5 plan.

**Harrison:** taste, final image selection, what feels genuinely Better@Work, and the ship or kill decision.

**Cathal and Annette:** one short direction reaction before the full production switch. Approval to publish remains separate from approval to explore.

## Constraints

- No DNS change on the design day.
- No edits to the live WordPress site.
- No payment rebuild in the first pass.
- No promise of a searchable 79-episode archive unless the feed gives us clean structured data.
- No publishing unapproved audience numbers, client logos or testimonials.
- Confirm ownership and permitted use of the logo, typefaces, photography and legacy agency assets before launch.
- The public preview must not expose forms that appear live but discard submissions.

## Definition of done

At the end of the day there is:

- A private URL anyone on the B@W team can open.
- A genuinely finished responsive homepage.
- Six supporting routes using the same real design system.
- Real B@W copy and assets above the fold.
- A clear path to listen, subscribe, explore Better Leadership, buy Better Careers or book Cathal.
- No Divi, WPBakery or WordPress admin dependency in the preview.
- A written list of the remaining live integrations and the exact steps to launch.

The output is allowed to be wrong. It is not allowed to be vague.
