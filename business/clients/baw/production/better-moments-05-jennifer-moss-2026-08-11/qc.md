# Quality control

Checked on Tuesday 11 August 2026. The package is technically ready for creative and producer review. Nothing has been uploaded, sent, scheduled or published.

## Current clean teaser revision, 13 August

| File | Runtime | Format | Size |
|---|---:|---|---:|
| `video/BetterAtWork-Jennifer-AI-Adoption-Clean-NoCaptions-v3.mp4` | 00:48.000 | H.264, 1080 x 1920, 24 fps, AAC 48 kHz stereo | 62,998,096 bytes |

- Rebuilt from Jennifer's continuous isolated camera and enhanced mic using the verified 00:04:12.309 source offset.
- One stable portrait crop for the full excerpt. No programme-camera switches, picture edits or burned captions.
- Full-frame decode completed with no reported errors.
- No black span of 0.08 seconds or longer and no subtitle stream detected.
- Five evenly spaced frames were inspected. Jennifer remains consistently framed throughout.
- Large-v3 transcription confirms the file opens on the complete clause “People will be much more resistant to engaging with AI” and finishes the complete answer on “all of that happens when you have empathy.”
- There is 0.163 seconds of clean lead-in before the first word and 0.357 seconds of tail after the final word.
- Integrated loudness is -16.5 LUFS, true peak -3.9 dBFS and loudness range 3.6 LU.
- Video and audio both start at 00:00.000 and end at 00:48.000.

The first captioned teaser and first clean export are creatively rejected and remain in the package for comparison only.

## V2 review cut

| File | Runtime | Format | Size |
|---|---:|---|---:|
| `video/BetterAtWork-BetterMoments-05-JenniferMoss-RoughCut-v2.mp4` | 06:42.500 | H.264, 1920 x 1080, 24 fps, AAC 48 kHz stereo | 357,185,001 bytes |

- Integrated loudness: -16.1 LUFS.
- True peak: -4.1 dBFS.
- Loudness range: 4.1 LU.
- Full-frame decode completed with no reported errors.
- The only detected black span is the intentional 00:00.125 end fade.
- Frames immediately before and after all six edit boundaries were inspected. No blank, corrupt or unintended transition frames were found.
- Jennifer's isolated camera and enhanced mic are aligned to the programme master by a verified constant offset of 00:04:12.309.
- V2 SRT, VTT and text transcript were generated from the finished file. Names and key terms were spot-corrected.
- The original 09:50 rough cut and its downstream audio masters remain unchanged pending producer approval of V2.

## Media masters

| File | Runtime | Format | Size |
|---|---:|---|---:|
| `video/BetterAtWork-BetterMoments-05-JenniferMoss-RoughCut.mp4` | 09:50.292 | H.264, 1280 x 720, 24 fps, AAC 48 kHz stereo | 252,244,065 bytes |
| `video/BetterAtWork-Jennifer-AI-Adoption-Teaser.mp4` (rejected) | 00:52.125 | H.264, 1080 x 1920, 24 fps, AAC 48 kHz stereo | 51,259,404 bytes |
| `audio/BetterAtWork-BetterMoments-05-JenniferMoss-Master.wav` | 09:50.292 | 24-bit PCM, 48 kHz stereo | 170,004,198 bytes |
| `audio/BetterAtWork-BetterMoments-05-JenniferMoss.mp3` | 09:50.292 | MP3, 192 kbps, 44.1 kHz stereo | 14,168,974 bytes |

The MP3 contains title, artist, album and track metadata.

## Loudness

| Master | Integrated | True peak | Loudness range |
|---|---:|---:|---:|
| 16:9 MP4 | -16.2 LUFS | -1.6 dBFS | 4.8 LU |
| 24-bit WAV | -16.0 LUFS | -1.5 dBFS | 4.8 LU |
| 192 kbps MP3 | -16.2 LUFS | -1.7 dBFS | 4.8 LU |
| 9:16 teaser | -15.9 LUFS | -3.0 dBFS | 3.3 LU |

All four are inside the working target of -16 LUFS with a -1.5 dBTP ceiling, allowing for codec variance.

## Picture and decode

- Full-frame decode completed for both MP4 files with no reported errors.
- Black-frame detection found no spans of 0.08 seconds or longer in either video.
- Frames before and after all eight long-edit boundaries were inspected. No blank, corrupt or unintended transition frames were found.
- Seven frames across the teaser were inspected. Jennifer remains inside the portrait crop and captions remain clear of her face and platform control areas.

## Captions and transcript

- Main SRT: 287 cues, final cue ends at 09:50.292.
- Main VTT: 287 cues.
- Teaser SRT and burned ASS: 36 cues, final cue ends at 00:52.125.
- Automated validation found no overlaps, backwards times or non-positive cues.
- Jennifer Moss, Cathal, Gen Z, pathways, compliance-based and World Economic Forum were spot-corrected.

The source is the public episode's timed auto-caption track, included as `transcript/source-ePWxmi2TI5g.en.json3`. Give the long captions one final human listen before upload.

## Artwork

- Eight Instagram carousel PNGs at 1080 x 1350.
- Eight separately composed LinkedIn carousel PNGs at 1080 x 1080.
- Launch PNGs at 1080 x 1350 for Instagram and LinkedIn, plus 1920 x 1080 for YouTube.
- All 19 frames are live and editable in Figma.
- Figma validation found no missing frames, empty text layers or missing fonts.
- The artwork uses the approved Laura Gassner Otting Better Moments template: the original outlined Better at Work mark, Montserrat Bold and Medium, organic violet fields, alternating cream and ink slides, compact numbered pills and yellow callouts.
- Both carousel contact sheets and all three launch compositions were inspected. No clipped copy, missing metadata or broken imagery was found.

## Storage and release state

The source master was read in place. Render scratch stayed on the internal disk.

No external platform state was changed. Producer approval, the final caption listen and live-link replacements remain explicit handoff gates.
