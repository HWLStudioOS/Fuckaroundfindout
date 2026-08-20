# Quality control

**Status: PENDING FINAL PREMIERE EXPORT.**

Harrison approved the 00:04:25:18 editorial selection on Wednesday 19 August 2026. The final Premiere export has not yet been placed in this package, so the main video is not technically approved for upload from this directory.

## Authoritative picture lock

- Sequence in: 00:39:43:08
- Sequence out: 00:44:09:01
- Runtime: 00:04:25:18 at 25 fps, or 265.720 seconds
- Treatment: one continuous extract
- Added text: none
- Added logo: none
- Original programme branding: retain as exported from Premiere

The marked range was verified in the 14:44 and 14:50 Premiere autosaves. The attached rough transcript ends its final cue at 00:04:25:13, five frames before the full marked sequence ends.

## Final-master checks still required

- Full decode with zero video or audio errors.
- Exact runtime of 265.720 seconds and 6,643 frames at constant 25 fps.
- Complete opening question and complete final sentence by ear.
- No black frames, frozen frames, flash cuts, added text or added logo.
- Audio and video start together and remain in sync through the final frame.
- Integrated loudness near -16 LUFS and true peak no higher than -1.5 dBTP.
- Fast-start MP4 with the `moov` atom before `mdat`.
- Final SRT and VTT checked against the exported audio.
- Fresh SHA-256 checksums recorded only after the final export passes.

## Superseded main media

The rejected 00:07:40:13 feedback cut passed its own technical QC, but it is not the approved editorial selection. Its video, audio, frames, loudness reports and checksums are retained under:

`superseded/2026-08-19-0740-feedback-cut/`

Do not upload those files.

## Teaser

The separate curiosity teaser remains technically valid and unchanged:

| File | Runtime | Measured delivery |
|---|---:|---|
| `video/BetterAtWork-SmartConflict-Curiosity-Teaser.mp4` | 00:00:51.200 | H.264 High, 1080 x 1920, 25 fps, AAC LC 48 kHz stereo |

- Loudness: -15.81 LUFS integrated, -1.46 dBTP, 3.7 LU LRA.
- Full decode previously passed with zero errors.
- No black span exceeds 100 ms, no frozen frame exceeds two seconds, and no audio silence exceeds one second.
- The teaser remains a clean handoff with no burned captions or subtitle stream.
- Teaser SRT, VTT and ASS sidecars remain unchanged.

## Artwork

The YouTube thumbnail with **GET CURIOUS, NOT FURIOUS** matches the final cut.

The Instagram and LinkedIn launch graphics and both carousel formats were realigned to the approved 04:25 excerpt on 20 August.

- Instagram carousel: eight PNGs at 1080 x 1350.
- LinkedIn carousel: eight PNGs at 1080 x 1080.
- Instagram and LinkedIn launch graphics: 1080 x 1350.
- YouTube thumbnail: 1920 x 1080.
- Figma reports no missing fonts.
- Contact-sheet review passed for clipping, overlap, order, naming and message alignment.

All frames remain named DRAFT pending Harrison's visual approval. Nothing has been posted, scheduled or sent.

## Remaining gates

1. Harrison exports the final Premiere sequence to the active delivery path.
2. Run every final-master check above and record fresh checksums.
3. Give the main captions one final human listen.
4. Confirm the YouTube and Acast destinations, then replace the newsletter CTA.
5. Publish only through the checked release sequence in `publish-checklist.md`.
