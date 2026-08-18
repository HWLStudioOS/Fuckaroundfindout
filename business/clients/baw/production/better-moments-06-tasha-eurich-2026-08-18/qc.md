# QC: Better Moments #6

Run 18 August 2026, remote session. Measured, not assumed.

## Artwork, measured

- 19 frames rendered. 8 Instagram at 1080 x 1350 (62 to 79 KB), 8 LinkedIn at 1080 x 1080 (56 to 75 KB), launch Instagram and LinkedIn at 1080 x 1350 (92 KB each), YouTube at 1920 x 1080 (74 KB).
- No frame has a white edge strip. Bottom-corner pixel check passed on all 19 after switching the renderer to the headless-shell build. Full Chrome's new headless subtracts about 87 px of window furniture from the requested size; the generator now prefers headless-shell and documents why.
- Palette sampled from the approved #5 exports and reused exactly: cover violet `#6D2AEF`, interior violet `#6847D8`, cream `#FFF8EE`, ink `#171817`, yellow `#F4DE46`.
- Type is Montserrat throughout (OFL, bundled and subset in `design/fonts/`), matching the #5 system: ExtraBold headlines, Medium body, Bold letterspaced eyebrows, pills and footers.
- 72 px safe margins held on every frame. Callout text auto-shrinks to clear the card padding; longest line renders at 30 px.
- Copy in the renders matches `carousel.md` exactly; the generator is the single source for slide strings.
- No em dashes in any package file or SVG source, checked mechanically.

## Visual checks done by eye

Cover, myth, ceiling, praise trap, action, LinkedIn cover, launch Instagram and launch YouTube were reviewed against the #5 originals side by side in session. Composition, pill grammar, callout cards, folios and footers match the approved template. Interiors alternate cream and ink with the violet action closer, as in #5.

## Honest not-done list

- **No transcript existed in this environment** (YouTube and Acast are unreachable from the remote container), so no claim in this package has been verified against what Tasha actually said in the episode. The two highest-risk items are flagged in `carousel.md` and `edit-decision-list.md`: the self-awareness figures (slide 5, captions, newsletter) and the ceiling metaphor (slide 3, title, launch artwork). Verify both before anything ships.
- **Launch artwork carries no guest portrait.** The #5 composition used a circular guest still; no Tasha image exists in this container. The SVG marks the slot (cx 790, cy 400, r 215, 14 px white ring). Adding the still from the episode master on the studio machine is a 10-minute upgrade, and the typographic version is shippable if the week stays compressed.
- **No episode media QC** because there is no episode media yet: no masters, no loudness, no sync checks. That is all studio-machine work after the cut.
- The LinkedIn carousel set reuses the Instagram line breaks at 88 percent scale. It renders correctly, but nobody has posted this template at 1080 square since Jennifer's set, so eyeball slide 5 (densest body) before publishing.
