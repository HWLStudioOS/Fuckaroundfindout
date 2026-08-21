# Better Moments: Tasha Eurich (superseded)

**SUPERSEDED 19 AUGUST 2026.** Harrison selected Smart Conflict after reviewing the editorial options. The active Better Moments #6 package is `../better-moments-06-smart-conflict-2026-08-19/`. Retain this Tasha Eurich package as reference material only. Do not upload, schedule, send or publish any of its assets as Better Moments #6.

If this material is ever revived for a future slot, the series strings (BETTER MOMENTS 06, footers, folios, the "lands Thursday" callout day) live in `design/generate-artwork.mjs` and all 19 frames regenerate in one command; `copy.md` and `newsletter.md` renumber by hand. The transcript-verification gates in `carousel.md` and `publish-checklist.md` would still apply.

This proposal package was started remotely on 18 August while Harrison was on family duties. The notes below record what was built before the editorial choice changed.

## The call

**Title:** Resilience Has a Ceiling | Better Moments #6 | Tasha Eurich

**Editorial promise:** Resilience is not toughness on demand. Tasha shows why "what doesn't kill you makes you stronger" is backwards, why praising endurance hides its cost, and what actually rebuilds capacity: recovery designed in, stressors removed at source, and the self-awareness to see the bill before it arrives.

**Target runtime:** 10 to 12 minutes. Helen benchmark 11:23, Jennifer V2 ran 6:42.

## Why Tasha, why now

- She was the original Best-of #2 recommendation on 14 July: evergreen Spotify search traffic (72 impressions in the May window, 59 from Search), the 70-book Ellison Institute order, and the published Tupper outro already teases her. Roger displaced her on 20 July only because his Sum Up and backfill clips were live that same week. That reason expired with that week.
- The episode is all-time #6 in the catalogue (203) and the summer tracker itself carried "Best-of #2 · Tasha Eurich" before the swap.
- Cathal still owes Tasha the 70-book story (his own list, 6 July). A fresh Better Moment gives him the natural opening, and he can approve this pick from Spain with one WhatsApp thumbs-up.
- Resilience and self-awareness feed the corporate leadership lane warming up for Season 5 without spending any Better Leadership miniseries material.

**Backup if Harrison overrides:** Smart Conflict, all-time #2 (247). Nothing in this package blocks the swap, but every asset below is built for Tasha.

## Source

Original episode: **"What Doesn't Kill You Makes You Stronger" Is Backwards | Resilience Expert Tasha Eurich | S4 E3**, published 9 October 2025.

- Public episode: https://www.youtube.com/watch?v=MJ_rqzhEmts
- Companion follow-up: Listener Questions S4 E4, "Our Biggest Takeaways From the Tasha Eurich", https://www.youtube.com/watch?v=bKMdpI5h13o (secondary source for the hosts' own read on the episode; useful for the newsletter and for teaser candidates from Cathal and Annette's takeaways).
- Local masters: not identified from the remote session. Check `scripts/fetch-media.sh --list` and the Riverside originals on the studio machine. If no local master surfaces, the public YouTube 1080p is the fallback picture source, same posture as Jennifer's V1.

## Editorial spine

1. The myth: "what doesn't kill you makes you stronger" is backwards. Chronic adversity without recovery wears people down.
2. Resilience has a ceiling. It behaves like a budget, not a personality trait.
3. The praise trap: rewarding endurance teaches people to hide the cost, so the most praised performer quietly becomes the highest risk.
4. The self-awareness gap: most people believe they are self-aware, few are, and you cannot manage a cost you refuse to see.
5. Internal versus external self-awareness: what you see and what others see are different skills, and one without the other misleads.
6. The leader's move: fix the load, not the person. Remove chronic stressors at source and design recovery in.

The spine is built from the episode's stated ground (resilience myths and self-awareness, per the episode title and the S4 directory) and Tasha's published research. **Verify each beat against the actual transcript before picture lock, and correct any slide or copy claim the conversation does not support.** No quote in this package is presented as verbatim.

## Recommended week

| Date | Output | Purpose |
|---|---|---|
| Wed 19 Aug | Eight-slide resilience carousel, IG + Cathal LinkedIn | Useful standalone framework and lead-in. Jennifer's IG carousel goes out Tue, so #6's waits a day |
| Thu 20 Aug, 12:30 BST | Better Moments #6 to Acast and YouTube | The drop |
| Thu 20 Aug | Launch graphics and captions, IG + Cathal LinkedIn | Launch |
| Fri 21 Aug | The Better Bits | The resilience-ceiling tool and episode link |
| Sat 22 Aug, optional | Teaser clip from the myth moment | Second life after launch. Optional this week given Monday and Tuesday were lost |

The teaser moved to optional-after-launch rather than before-launch. Two lost days plus a Thursday deadline make the pre-launch reel the right thing to drop; the carousel does the warm-up job.

## Package map

- `carousel.md`: exact slide copy for both carousels, campaign idea, verification flags.
- `copy.md`: carousel caption, launch captions, Acast and YouTube copy, IG story frames.
- `newsletter.md`: Friday Better Bits draft.
- `edit-decision-list.md`: the moment map, transcript instructions and timecode slots for the studio pass.
- `publish-checklist.md`: approval gates and release sequence.
- `qc.md`: measured artwork checks and the honest not-done list.
- `artwork/carousel/`: eight 1080 x 1350 Instagram exports.
- `artwork/carousel-linkedin/`: eight separately composed 1080 x 1080 LinkedIn exports.
- `artwork/launch/`: 1080 x 1350 Instagram and LinkedIn exports, plus a 1920 x 1080 YouTube export.
- `artwork/source/`: SVG sources with live text for every frame.
- `design/`: brand tokens, fonts and the generator that renders every PNG from the SVG sources.

## Artwork system

The artwork continues the approved Jennifer Moss template: capsule logo, Montserrat, organic violet fields, yellow pill eyebrows, cream and ink alternation, compact folios. Frames were rebuilt as code-generated SVG so the package could be produced without the studio machine. Regenerate after any copy edit with:

```sh
node design/generate-artwork.mjs
```

Import the SVG sources into the Better at Work production Figma file if a design edit is needed; text remains live. The Jennifer reference frames live at https://www.figma.com/file/l5AZW9U1YF0Qe2P7cQdjzJ nodes `1120:14` (IG) and `1122:14` (LinkedIn).

## What the studio machine still owns

1. Pull the transcript: `yt-dlp --skip-download --write-auto-sub --sub-langs en --sub-format json3 https://www.youtube.com/watch?v=MJ_rqzhEmts` into `transcript/`, then build SRT/VTT/TXT with the established `build-captions.py` pattern.
2. Verify the spine and slide claims against the transcript. Regenerate artwork if any claim moves.
3. Fill the EDL timecodes, cut the 10 to 12 minute Better Moment, render picture and audio masters (24-bit WAV + 192 kbps MP3, per the #5 pattern).
4. Fill YouTube chapters and the Acast full-episode link in `copy.md`.
5. Optional Saturday teaser: one stable portrait crop, no burned captions, per the #5 lesson (two exports were rejected before the clean single-crop v3 landed).
