# Publish checklist

Prepared Tuesday 18 August 2026, late. Every box below is unchecked. Nothing has been reviewed, approved, uploaded, sent, scheduled or published.

## Prepared overnight (unreviewed)

- [ ] Guest recommendation made (Leidy Klotz), with Zach Mercurio and Colin Fisher as alternates. Harrison decides.
- [ ] Public JSON3 caption track pulled and long SRT, VTT and text transcript built (auto-caption remap, needs a human listen).
- [ ] Editorial spine and 12-segment picture lock defined, cut points snapped to the measured waveform.
- [ ] 16:9 rough cut rendered from the public-source proxy at 1920 x 1080, 08:01.873.
- [ ] 24-bit WAV and 192 kbps MP3 masters rendered at -16 LUFS.
- [ ] 58.8-second 20-minutes-early teaser rendered in 16:9 as a reference. No 9:16 yet.
- [ ] Carousel, teaser, launch, Acast, YouTube, story and newsletter copy drafted.
- [ ] Isolated Riverside Klotz camera and mic located locally and their two offsets against the proxy measured.

## Wednesday 19 August build

- [ ] Harrison confirms the guest, or switches to Mercurio (evaluated spine in the summary) and reruns the package.
- [ ] Harrison reviews the v1 cut and trims. First candidates: segment 12's closing furniture, then segment 1 if the cold-open jump cut jars.
- [ ] Decide whether to relink Klotz's isolated camera and enhanced mic under his speech (offsets in `edit-decision-list.md`) or ship the proxy picture.
- [ ] Decide the 9:16 teaser build: single stable crop of the programme, or isolated camera for Klotz plus programme for Cathal's line.
- [x] Clone the BM#5 Figma frames and reskin the eight-slide carousel (Instagram 1080 x 1350, LinkedIn 1080 x 1080) plus the three launch graphics. Export into `artwork/`. Done 18 Aug 22:35 by Claude, DRAFT frames, unreviewed; four headlines were fitted to the frame widths (see `carousel.md`).
- [x] Pull a Klotz still for the launch graphics. Used a crop of the episode's YouTube thumbnail (`assets/`), swap if a press photo exists.
- [ ] Rebuild captions if any segment moves (`python3 transcript/build-captions.py` after editing `MAIN_SEGMENTS`).

## Approval gates

- [ ] Harrison approves the guest, the cut and the copy.
- [ ] Cathal and Annette approve the office angle and picture lock.
- [ ] Give the long captions one final human listen against the finished master.
- [ ] Confirm the book subtitle against the listing before it goes into any description.
- [ ] Replace the master if a real programme master arrives from Cathal or Riverside; otherwise ship the proxy knowingly and note it in the handoff.
- [ ] Confirm Thursday Acast and YouTube destination URLs.
- [ ] Replace `[LISTEN TO LEIDY KLOTZ IN EIGHT MINUTES]` in the newsletter with the tested link.
- [ ] Check the Buffer history that neither teaser window was previously published as a clip.

## Release sequence

- [ ] Wed 19 Aug, morning: publish the carousel on Better at Work Instagram.
- [ ] Wed 19 Aug, morning: publish the LinkedIn carousel from Cathal's account.
- [ ] Wed 19 Aug, afternoon (or Thu morning): publish the 20-minutes-early reel on Better at Work Instagram.
- [ ] Thu 20 Aug, 12:30 BST: publish Better Moments #6 to Acast.
- [ ] Thu 20 Aug, 12:30 BST: publish Better Moments #6 to YouTube.
- [ ] Thu 20 Aug: publish the Instagram launch graphic and caption.
- [ ] Thu 20 Aug: publish Cathal's LinkedIn launch graphic and caption.
- [ ] Fri 21 Aug: The Better Bits draft to Cathal for his one-tap approval. Cathal owns the send.
- [ ] Fri 21 Aug: publish the 20-minutes-early reel from Cathal's LinkedIn.
- [ ] Sat 22 Aug, optional: "Nobody cares, but not in a bad way" cut.

## After release

- [ ] Copy the finished masters to `/Volumes/UGREEN/HWL-Media/baw-production/better-moments-06-leidy-klotz-2026-08-18/` and add them to `MEDIA-MANIFEST.json`.
- [ ] Update `business/clients/baw.md` with the #6 outcome (state file, not touched by this package).
