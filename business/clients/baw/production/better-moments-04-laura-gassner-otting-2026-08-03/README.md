# Better Moments #4: Laura Gassner Otting

Production package for the week beginning Monday 3 August 2026.

## The call

**Title:** The Four Things That Make Work Worth Doing | Better Moments #4 | Laura Gassner Otting

**Editorial promise:** A good job is not the same for everyone. Laura gives listeners a practical career scorecard built around calling, connection, contribution and control.

**Target runtime:** 9 minutes 57 seconds.

This is a fresh cut of Laura's conversation. It does not simply repeat the original "follow your passion" launch. The long edit moves from other people's definitions of success into consonance and the four Cs. The social teaser comes from an unused moment at the end of the interview.

## Source

Primary master on the connected drive:

`/Volumes/Livs4TB2/Laura Pod Cut 1.mp4`

- 3840 x 2160
- HEVC
- 25 fps
- AAC stereo, 48 kHz
- 60:57.080
- 16,153,926,734 bytes

Existing social cuts, retained only as provenance:

- `/Volumes/Livs4TB2/LAURA CLIP 1.mp4`: published Four Horsemen of Success cut.
- `/Volumes/Livs4TB2/Laura Clip 2 Fixed.mp4`: published Are You Choosing for Yourself cut.
- `/Volumes/Livs4TB2/Laura Clip 2.mp4`: superseded pre-fix version.

None of those three files should be presented as this week's new teaser.

## Editorial spine

1. Calling, connection, contribution and control do not matter equally to every person.
2. External scorecards keep successful people chasing the next marker.
3. A good job on paper can still be the wrong job for the person doing it.
4. The first diagnostic is simple: whose goal is this?
5. Consonance is when what you do matches who you are.
6. The four Cs turn that idea into a usable career scorecard.
7. The right mix changes with life stage.

## Recommended week

| Date | Output | Purpose |
|---|---|---|
| Mon 3 Aug | Cathal text-only post | Standalone point of view, no podcast mention |
| Tue 4 Aug | Eight-slide four Cs carousel | Practical value and episode lead-in |
| Wed 5 Aug | Fresh "How are you?" teaser | Human, useful and not previously published |
| Thu 6 Aug, 12:30 BST | Better Moments #4 | Acast, YouTube and social launch |
| Fri 7 Aug | The Better Bits | Four-dials exercise and episode link |
| Sat 8 Aug, optional | Control over power short | Second life after launch |

Nothing in this package has been uploaded, sent, scheduled or published.

## Package map

- `video/`: 16:9 episode rough cut and fresh 9:16 teaser.
- `audio/`: 24-bit WAV and 192 kbps MP3 masters.
- `transcript/`: timed SRT, VTT, text transcript, public timed-caption source and caption builder.
- `artwork/carousel/`: eight 1080 x 1350 PNG exports.
- `artwork/carousel-linkedin/`: eight separately composed 1200 x 1500 PNG exports.
- `artwork/launch/`: Instagram, LinkedIn and YouTube launch exports.
- `artwork/source/`: portable editable SVG files, suitable for Figma import.
- `design/`: tokens, artwork specification and the deterministic SVG generator.
- `copy.md`: Acast, YouTube, Instagram, LinkedIn, story and teaser copy.
- `carousel.md`: exact slide copy and visual notes.
- `thought-leadership.md`: Monday Cathal post.
- `newsletter.md`: Friday Better Bits draft.
- `edit-decision-list.md`: source timecodes and editorial rationale.
- `publish-checklist.md`: approval and release sequence.
- `handoff-checklist.md`: producer, design and archive sign-off.
- `qc.md`: measured media and artwork checks.

## Design lock

The completed artwork uses one Better at Work logo everywhere: the exact outlined original, including the TM. The canonical local source is `design/better-at-work-logo.svg`. Its geometry matches the live-site header vector and the approved `Logo · Original Elevation` board in the Better Work Brand Playground. The rejected masthead, retyped live mark and seal are not part of this package.

The colour primitives are paper, ink, violet, yellow, coral, green and blue. Newsreader carries editorial headlines, Manrope carries explanatory copy, and IBM Plex Mono carries metadata. Every source is an editable SVG with live text and replaceable imagery. The approved open fonts and their OFL licences are bundled under `design/fonts/`, so no system font install is required.

The original mark sits on violet throughout this package, with a violet holding field added when the surrounding artwork is light or photographic. It is never retyped, recoloured, stretched or separated into a new lock-up. The LinkedIn carousel is a native 1200 x 1500 composition and the YouTube thumbnail is 1280 x 720. The deterministic generator rebuilds all nineteen SVG and PNG pairs and rejects any logo substitution, distortion, missing TM, clipped placement or mark smaller than the 200 px working minimum.

## Caption note

The timed files are remapped from the public episode caption track, then spot-corrected for names, the four Cs and obvious recognition errors. Run `python3 transcript/build-captions.py` from this folder to rebuild them. Give the long captions one final human scan before upload, particularly the rapid title-list exchange at 04:09.

## Storage rule

The source drive has only 11 GB free. All render scratch and final media were created on the internal disk. Do not point Premiere, Resolve or an ffmpeg cache at `/Volumes/Livs4TB2`.
