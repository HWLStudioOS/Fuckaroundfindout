---
date: 2026-06-10
trigger: Harrison: "research top agencies, steal a bit of the style, I want mine to feel like someone is looking at the frontier of humanity"
method: screenshotted live references (Anduril, SpaceX, OpenAI, DixonBaxi, A24) and distilled the load-bearing patterns
applies_to: ~/hwlstudio-site (rebuilt repo), prototype on branch redesign-frontier
---

# hwlstudio.com design direction: Quiet Frontier

## What the references actually do

**Anduril** (the purest "frontier" site): near-black, full-bleed slow film of the sea, condensed all-caps headline, and a layer of tiny engineering metadata ("EST. 2017 → FUTURE", section indices). It reads like a classified engineering document crossed with cinema. No accent colour at all.

**SpaceX**: full-bleed launch photography, dated like a mission log ("Nov 12, 2025"), minimal chrome. The work IS the site.

**A24**: work-first (giant list of film titles with years), editorial restraint, and the best newsletter capture line in the business ("Letters from our filmmakers... Not too often, just enough"). Maps directly to the funnel doc's owned-newsletter centre.

**DixonBaxi**: near-black, a single centred wordmark, a horizontal filmstrip of work. Zero sales copy above the fold.

**OpenAI**: extreme whitespace restraint. Less stealable (product UI), but confirms the rule: one idea per screen.

## The diagnosis of the current site

The copy is right and stays. The visual language is the problem: white background, indigo-600 SaaS buttons, rounded-xl cards, pill badges ("High Velocity" with a lightning bolt), drop shadows, "Most Popular" ribbon. It's a polished SaaS template. Serious organisations buy from the Anduril/A24 shelf, not the SaaS shelf. None of the five references use a single pill badge or coloured button.

## The direction: Quiet Frontier

Cinema does the talking, typography does the structure, metadata does the texture.

- **Palette**: near-black base (#0B0B0C), bone text (#EDEAE4), muted grey-warm secondary, hairline dividers at 10-15% opacity. No accent colour. CTAs are white. A single small status dot (live green) for the capacity line is the only colour on the site.
- **Typography**: Instrument Serif stays as display (it's already the brand across the proposal decks) but goes much bigger, tight leading, used sparingly. Space Grotesk uppercase letterspaced for the utility/metadata layer (labels, indices, nav). Inter for body. This matches the existing HWL deck system (Instrument Serif / Space Grotesk / Inter), so site and proposals become one brand.
- **Hero**: full-viewport muted film loop (Vimeo background mode, existing showcase reel), headline set low like SpaceX, metadata strip ("EST. 2024 / LONDON / THE INTEGRATED CONTENT ENGINE") up top.
- **Engineering metadata texture**: section indices (01 PROCESS, 02 PHILOSOPHY, 03 SELECTED WORKS), small caps, hairlines. The Anduril move.
- **Works**: large cinematic rows, real film frames, in-page lightbox (already built). Work-first ordering: works move up the page, above philosophy.
- **Kill list**: all pill badges, all indigo, all rounded-xl/rounded-full, all drop shadows, the "Most Popular" ribbon, the green checkmarks.
- **Door unchanged**: Calendly + mailto stay exactly as wired; pricing modal restyles dark.

## Later (funnel phase, not this pass)

- A24-style newsletter capture line in the footer once the newsletter exists (0-30 day funnel build).
- Application gate replacing "book a call" once qualified-application flow is designed.
- Case-study film pages (David's first edits) as their own routes.

References saved: /tmp/hwl-site/ref-{anduril,spacex,openai,dixonbaxi,a24}.png
