# Quality control

Checked on Tuesday 18 August 2026, 22:15 to 22:25 BST, on the internal disk. The package is technically ready for Harrison's creative review on Wednesday 19 August. Nothing has been reviewed, approved, uploaded, sent, scheduled or published.

**Source status: public-source proxy. Replace with the master before release if one can be obtained.** No local programme master exists for the Leidy Klotz episode. Only Klotz's isolated Riverside camera and enhanced mic are local (see `edit-decision-list.md` for their measured offsets). The rough cut, WAV and MP3 below were rendered from the public YouTube 1080p video. Picture and Cathal's audio therefore carry YouTube's encode, and Klotz's audio is the programme mix rather than his enhanced mic.

## Media

| File | Runtime | Format | Size |
|---|---:|---|---:|
| `video/BetterAtWork-BetterMoments-06-LeidyKlotz-RoughCut-v1.mp4` | 08:01.873 | H.264 High, 1920 x 1080, yuv420p, 24 fps, about 2.99 Mb/s; AAC LC 48 kHz stereo 190 kb/s | 191,759,888 bytes |
| `audio/BetterAtWork-BetterMoments-06-LeidyKlotz-Master.wav` | 08:01.873 | 24-bit PCM, 48 kHz stereo | 138,779,622 bytes |
| `audio/BetterAtWork-BetterMoments-06-LeidyKlotz.mp3` | 08:01.873 | MP3, 192 kb/s, 44.1 kHz stereo | 11,566,580 bytes |
| `video/BetterAtWork-Klotz-20-Minutes-Early-Teaser-16x9-Reference.mp4` | 00:58.800 | H.264 High, 1920 x 1080, 24 fps; AAC 48 kHz stereo 192 kb/s | 21,200,051 bytes |
| `video/source/BetterAtWork-S4E30-LeidyKlotz-YouTube-drCMMd-Z5Yk.mp4` (proxy) | 52:22.589 | H.264, 1920 x 1080, 24 fps; AAC 44.1 kHz stereo | 765,140,646 bytes |

The MP3 carries title, artist, album and track metadata (Your Office Is Sending a Message | Better Moments #6 | Leidy Klotz, Better at Work, Better Moments, track 6).

## Loudness

Premaster (concatenated programme audio before normalisation): -16.29 LUFS integrated, -0.11 dBTP, LRA 7.3 LU. Normalised with a two-pass linear loudnorm to the house target.

| Master | Integrated | True peak | Loudness range |
|---|---:|---:|---:|
| 16:9 MP4 | -16.0 LUFS | -1.4 dBFS | 6.9 LU |
| 24-bit WAV | -16.0 LUFS | -1.5 dBFS | 6.9 LU |
| 192 kb/s MP3 | -16.2 LUFS | -1.7 dBFS | 6.9 LU |
| 16:9 teaser reference | -16.4 LUFS | -1.8 dBFS | 6.1 LU |

All inside the working target of -16 LUFS with a -1.5 dBTP ceiling, allowing for codec variance (the MP4's AAC re-encode sits 0.1 dB over the WAV ceiling, inside tolerance).

## Picture and decode

- Full-frame decode of the rough cut completed with no reported errors.
- Black-frame detection found no spans of 0.08 seconds or longer.
- Frames one frame before and half a frame after all eleven internal edit boundaries (finished positions 00:12.490, 00:27.550, 01:02.910, 01:15.910, 01:52.490, 02:26.350, 03:04.280, 03:44.240, 04:45.910, 05:09.930, 06:54.060) were extracted and inspected on a contact sheet. No blank, corrupt or unintended transition frames. Every boundary lands on a normal active-speaker shot. The contact sheet was not kept in the package (PNG files are tracked in Git).
- The public programme is an active-speaker edit, so most cuts change shot naturally. Two joins are same-speaker jump cuts by construction: segment 1 to segment 2 (Klotz, cold open) and the mid-segment-12 pass through Cathal's closing furniture, which was deliberately left uncut. Both are flagged in the EDL as first trims.

## Cut-point audio check

Every in and out point was snapped to the quietest 60 ms gap within 0.35 s of the caption-derived proposal, using a 10 ms RMS envelope of the proxy audio, then eight uncertain points were re-checked on a 20 ms envelope. Twenty of twenty-four points land in measured silence at -38 dBFS or quieter. Two land in continuous speech and are the two to listen to first:

- Segment 8 out (source 00:15:29.820, finished 03:44.240): cut immediately before "And it's like, so often we jump right to", after "how is your space showing agency, right?"
- Segment 10 in (source 00:39:08.500, finished 04:45.910): opens on "Whereas if you've got a team". No gap between "right?" and "Whereas".

Segment 2 in (00:42:16.520) and segment 12 in (00:47:46.900) were moved off the caption stamps into measured silence, because the auto-captions run up to 0.3 s ahead of the audio in those passages.

## Captions and transcript

- Main SRT: 241 cues, final cue ends at 08:01.820, no overlaps, no non-positive cues, longest line 44 characters. VTT matches.
- Teaser SRT: 45 cues, final cue ends at 00:58.760, no overlaps, longest line 27 characters.
- Source: the public episode's timed auto-caption track, `transcript/source-drCMMd-Z5Yk.en.json3`, remapped by `transcript/build-captions.py`. Leidy and Cathal were spot-corrected (the auto-captions render the guest as Lydi, Lyddie, Lidy and Lydon). Fillers stripped, five clipped edge tokens dropped or restored to match the audio.
- Give the long captions one final human listen before upload. Auto-caption word timing lags the waveform by up to 0.3 s in places, and Klotz's phrase "agency, competence and connection" in the biggest-mistake answer is left as spoken.

## Speaker attribution

Checked against Klotz's isolated enhanced mic at the measured +00:04:50.276 offset: known Cathal-only windows read -30 to -63 dB mean on the isolated track, known Klotz-only windows -16 dB. In segment 12, "so many people say we don't have the budget ... put a chair by the side of the kitchen ... move a couch" reads -31.6 dB (Cathal), "removing obstacles ... that's definitely free" reads -19.5 dB (Klotz). The copy attributes accordingly.

## Artwork

None built. `artwork/` is empty. Figma frames to clone are listed in `README.md` and `carousel.md`.

## Storage and release state

The proxy, rough cut and audio masters live on the internal disk inside the package (38 GB free after the render). Render scratch was deleted. Nothing was written to `/Volumes/UGREEN`. `MEDIA-MANIFEST.json` was not changed. No external platform state was changed. Harrison's tooling was not modified: the working yt-dlp build ran in an isolated `uvx` environment and the offset maths ran under `uv run --with numpy`; nothing was installed into the system Python or Homebrew.
