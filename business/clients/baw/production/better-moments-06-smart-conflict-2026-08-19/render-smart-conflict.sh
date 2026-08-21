#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SOURCE="/Volumes/Livs4TB2/Alice_Lou_FUllPod_V2.mp4"
ALICE_RAW="/Volumes/Livs4TB2/K0_28112025_CATHALQINLANX2/B184L005_251128QB.MP4"
PICTURE="$ROOT/video/BetterAtWork-BetterMoments-06-SmartConflict-Picture.mp4"
PREMASTER="$ROOT/audio/BetterAtWork-BetterMoments-06-SmartConflict-Premaster.wav"
MASTER_WAV="$ROOT/audio/BetterAtWork-BetterMoments-06-SmartConflict-Master.wav"
MASTER_MP3="$ROOT/audio/BetterAtWork-BetterMoments-06-SmartConflict.mp3"
MASTER_MP4="$ROOT/video/BetterAtWork-BetterMoments-06-SmartConflict-Master.mp4"
TEASER="$ROOT/video/BetterAtWork-SmartConflict-Curiosity-Teaser.mp4"
LOUDNESS_JSON="$ROOT/qc/loudnorm-pass1.json"
LOUDNESS_SUMMARY="$ROOT/qc/loudnorm-pass2.txt"

for file in "$SOURCE" "$ALICE_RAW"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required source: $file" >&2
    exit 1
  fi
done

ffmpeg -hide_banner -y \
  -ss 2383.320 -t 265.720 -i "$SOURCE" \
  -filter_complex "
    [0:v]setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,
      fps=25,format=yuv420p[v];
    [0:a]asetpts=PTS-STARTPTS,aresample=48000[a]
  " \
  -map "[v]" -an -c:v h264_videotoolbox -b:v 18M -maxrate 24M -bufsize 36M \
    -profile:v high -level 4.2 \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart "$PICTURE" \
  -map "[a]" -vn -c:a pcm_s24le -ar 48000 "$PREMASTER"

LOUDNESS_DATA="$(ffmpeg -hide_banner -i "$PREMASTER" \
  -af loudnorm=I=-16:LRA=11:TP=-1.5:print_format=json -f null - 2>&1 \
  | sed -n '/^{/,/^}/p')"
printf '%s\n' "$LOUDNESS_DATA" > "$LOUDNESS_JSON"

INPUT_I="$(printf '%s' "$LOUDNESS_DATA" | jq -r '.input_i')"
INPUT_TP="$(printf '%s' "$LOUDNESS_DATA" | jq -r '.input_tp')"
INPUT_LRA="$(printf '%s' "$LOUDNESS_DATA" | jq -r '.input_lra')"
INPUT_THRESH="$(printf '%s' "$LOUDNESS_DATA" | jq -r '.input_thresh')"
TARGET_OFFSET="$(printf '%s' "$LOUDNESS_DATA" | jq -r '.target_offset')"

ffmpeg -hide_banner -y -i "$PREMASTER" \
  -af "loudnorm=I=-16:LRA=11:TP=-1.5:measured_I=$INPUT_I:measured_TP=$INPUT_TP:measured_LRA=$INPUT_LRA:measured_thresh=$INPUT_THRESH:offset=$TARGET_OFFSET:linear=true:print_format=summary" \
  -c:a pcm_s24le -ar 48000 "$MASTER_WAV" 2> "$LOUDNESS_SUMMARY"

ffmpeg -hide_banner -y -i "$MASTER_WAV" \
  -c:a libmp3lame -b:a 192k -ar 44100 \
  -metadata title="Get Curious, Not Furious | Better Moments #6" \
  -metadata artist="Better at Work with Cathal Quinlan" \
  -metadata album="Better Moments" \
  -metadata track="6" \
  "$MASTER_MP3"

ffmpeg -hide_banner -y -i "$PICTURE" -i "$MASTER_WAV" \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -ar 48000 \
  -movflags +faststart -shortest "$MASTER_MP4"

ffmpeg -hide_banner -y \
  -ss 2656.640 -t 51.200 -i "$ALICE_RAW" \
  -ss 2583.760 -t 51.200 -i "$SOURCE" \
  -map 0:v:0 -map 1:a:0 \
  -vf "crop=1215:2160:1312:0,scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p" \
  -af "loudnorm=I=-16:LRA=11:TP=-1.5" \
  -r 25 -c:v h264_videotoolbox -b:v 14M -maxrate 18M -bufsize 28M \
  -profile:v high -level 4.2 \
  -c:a aac -b:a 192k -ar 48000 -t 51.200 -movflags +faststart "$TEASER"

python3 "$ROOT/transcript/build-captions.py"

echo "Rendered:"
echo "  $MASTER_MP4"
echo "  $MASTER_WAV"
echo "  $MASTER_MP3"
echo "  $TEASER"
