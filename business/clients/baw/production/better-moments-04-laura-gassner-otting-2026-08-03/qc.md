# Quality control

Checked on Monday 3 August 2026. The package is technically ready for creative and producer review. Nothing has been uploaded, sent, scheduled or published.

## Media masters

| File | Runtime | Format | Size |
|---|---:|---|---:|
| `video/BetterAtWork-BetterMoments-04-LauraGassnerOtting-RoughCut.mp4` | 09:56.752 | H.264, 1920 x 1080, 25 fps, AAC 48 kHz stereo | 687,916,340 bytes |
| `video/BetterAtWork-Laura-HowAreYou-Teaser.mp4` | 00:45.120 | H.264, 1080 x 1920, 25 fps, AAC 48 kHz stereo | 64,905,125 bytes |
| `audio/BetterAtWork-BetterMoments-04-LauraGassnerOtting-Master.wav` | 09:56.752 | 24-bit PCM, 48 kHz stereo | 171,864,678 bytes |
| `audio/BetterAtWork-BetterMoments-04-LauraGassnerOtting.mp3` | 09:56.752 | MP3, 192 kbps, 44.1 kHz stereo | 14,323,853 bytes |

The MP3 contains title, artist, album and track metadata.

## Loudness

Measured with FFmpeg EBU R128 loudness analysis after final encoding.

| Master | Integrated | True peak | Loudness range |
|---|---:|---:|---:|
| 16:9 MP4 | -15.99 LUFS | -1.49 dBTP | 5.10 LU |
| 24-bit WAV | -15.98 LUFS | -1.49 dBTP | 5.10 LU |
| 192 kbps MP3 | -16.25 LUFS | -1.62 dBTP | 5.00 LU |
| 9:16 teaser | -16.13 LUFS | -1.49 dBTP | 4.90 LU |

All four are inside the working target of -16 LUFS with a -1.5 dBTP ceiling, allowing for codec variance.

## Picture and decode

- Full-frame decode completed for both MP4 files with no reported decode errors.
- Full decode completed for WAV and MP3 with no reported errors.
- Black-frame detection found no spans of 0.08 seconds or longer in either video.
- Twenty frames around all nine long-edit boundaries were inspected. No blank, corrupt or unintended transition frames were found.
- Ten frames across the teaser, including all dynamic crop changes, were inspected. Laura and Cathal remain inside the portrait crop and captions remain clear of the face and platform control areas.

## Captions and transcript

- Main SRT: 337 cues, final cue ends at 09:56.600.
- Main VTT: 337 cues.
- Teaser SRT and burned ASS: 37 cues, final cue ends at 00:45.120.
- Text transcript: ten edit sections with source and finished timecodes.
- Automated validation found no overlaps, backwards times or non-positive cues.
- Names, consonance, the Four Horsemen and the four Cs were spot-corrected.

The source is the public episode's timed auto-caption track, included as `transcript/source-e8Z0nuapNLI.en.json3`. It has not had a complete human word-for-word transcription pass. Give the rapid title-list exchange around 04:09 one final listen before uploading the long captions.

## Artwork

- Eight Instagram carousel PNGs at 1080 x 1350.
- Eight separately composed LinkedIn native-document PNGs at 1200 x 1500.
- Launch PNGs at 1080 x 1350, 1200 x 1500 and 1280 x 720.
- Nineteen PNG exports and nineteen matching editable SVG sources.
- Every SVG retains live Newsreader, Manrope and IBM Plex Mono text and passed a text-element check.
- Every source contains exactly one instance of the outlined original logo from `design/better-at-work-logo.svg`, including the TM.
- The canonical source uses viewBox `0 0 827.3 417.5` and matches the current live-site header vector at trimmed-source SHA-256 `d096bd164e714c784289dba52fe096b958a1b04016d0d8f9464879fcadabe65c`.
- The generator rejects substituted outlines, missing TM geometry, non-proportional scaling, clipped marks and any placement below the 200 px working minimum.
- Violet is the logo field on covers, light carousel pages and photographic launch artwork. The original white forms, black lettering and black TM remain unchanged.
- The rejected masthead, retyped live mark and seal are absent from the generator and all nineteen SVG sources.
- Brand Primitives were matched to the Figma variables under Utilities root `115:250`.
- The complete Instagram and LinkedIn sets, launch images and YouTube thumbnail were inspected at contact-sheet scale and at full size. A browser-level bounding-box check also passed for every live text element. No clipped copy, missing metadata, illegible logo placements or broken image references were found.
- Laura remains large and recognisable in all launch ratios. Her face is clear of the brand panel and headline in each composition.
- The artwork generator passed JavaScript syntax validation and two consecutive rebuilds produced identical SHA-256 hashes for all thirty-eight SVG and PNG files. The caption builder passed Python compilation.

This is the completed original-logo pass. The SVG files remain editable and the PNG files are the checked delivery exports.

## Storage and release state

All scratch renders and final media were written to internal storage. No render output was written to `/Volumes/Livs4TB2`.

The artwork rebuild did not alter either video or either audio master. Their SHA-256 checksums match the pre-design values.

No external platform state was changed. Producer approval, the final caption listen and live-link replacements remain explicit handoff gates.
