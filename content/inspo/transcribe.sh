#!/bin/bash
set -e
MODEL=~/whisper-models/ggml-base.en.bin
IDS=(DWvblhciNQp DXOghyskcds DYWhIpghytZ DW1zYyEERei DW6NW9-kjWC DW-pV3WE8ya DXRZEXGk7G2 DW63qyOkXMz DSu2ZIiEzhG DW15stpDZVa DXOghyskcds)
for id in "${IDS[@]}"; do
  if [ -f "transcripts/${id}.txt" ]; then echo "skip $id"; continue; fi
  mp4="raw/${id}.mp4"
  wav="audio/${id}.wav"
  if [ ! -f "$wav" ]; then
    ffmpeg -loglevel error -y -i "$mp4" -ar 16000 -ac 1 -c:a pcm_s16le "$wav"
  fi
  whisper-cli -m "$MODEL" -f "$wav" -otxt -of "transcripts/${id}" --no-prints 2>&1 | tail -3
  echo "done $id"
done
echo "ALL DONE"
