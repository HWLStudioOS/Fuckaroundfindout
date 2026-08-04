# Artwork specification

## Intent

This is the approved original-logo pass for Better Moments #4. The campaign keeps Laura's four-Cs idea clear, makes the guest large and recognisable, and recomposes the hierarchy for each platform ratio.

## Identity sources

The mark source of truth is `design/better-at-work-logo.svg`.

- Exact outlined geometry from the current Better at Work header, viewBox `0 0 827.3 417.5`.
- Includes the original Better, @, Work and TM paths.
- Approved exploration board: `Logo · Original Elevation`, root `130:251`, in Better Work Brand Playground `OMTB8YIiNcQ91Ljpzpmn2r`.
- Trimmed-source SHA-256: `d096bd164e714c784289dba52fe096b958a1b04016d0d8f9464879fcadabe65c`.

The previous masthead, retyped live device and seal are rejected. They must not be recreated or used as alternates.

Newsreader carries the human idea. Manrope carries explanatory copy. IBM Plex Mono carries orientation, sequence and release metadata.

## Source and render flow

Every source is SVG with live text, editable shapes and an embedded Laura still where required. The open-font files are bundled in `design/fonts/` and embedded into each SVG, so the sources remain portable. The PNG renderer runs one local headless Chrome session to honour those embedded fonts exactly. It does not install or change system fonts.

Run from the package root:

```sh
node design/generate-artwork.mjs
```

Requirements:

- Node.js 22 or newer.
- Google Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- The bundled font files and OFL licences in `design/fonts/`.

## Formats

- Instagram carousel: 1080 x 1350.
- LinkedIn native document: 1200 x 1500, separately composed.
- Instagram launch: 1080 x 1350.
- LinkedIn launch: 1200 x 1500.
- YouTube thumbnail: 1280 x 720.

These follow the Utilities export matrix. One idea can travel. One layout cannot. Nothing is stretched or centre-cropped between channels.

## Placement rules

- The exact original is the only mark used on covers, carousel interiors, the end card and launch artwork.
- Violet is the logo field throughout this package. Light and photographic artwork receives a violet holding field so the white forms and black TM remain legible.
- The viewBox and all paths remain untouched. Scale is always proportional.
- The mark includes the TM at every size and uses a 200 px working minimum in this package.
- Each carousel body slide has one dominant accent. Violet, yellow, coral, green and blue come from the locked Brand Primitives collection.
- Metadata stays quiet and useful. It never competes with the editorial headline.

## Safe areas

- Keep Instagram carousel text at least 72 px from an edge.
- Keep LinkedIn document text at least 82 px from an edge.
- Keep the YouTube headline inside the left 42% and Laura's face clear on the right.
- Keep launch headlines below the brand panel and away from Laura's eyes.
- Keep names, folios and page counts inside their own measured margins.

## Figma handoff

Import the SVG sources when a design edit is needed. The copy remains live and every placed logo remains outlined vector geometry. Compare it with `design/better-at-work-logo.svg`, not any rejected exploration. Map the named colours to the existing Better at Work variables, then export each channel at its native size.
