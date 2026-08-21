#!/usr/bin/env python3
"""Build captions for Better Moments #6 (Leidy Klotz) from YouTube's JSON3 caption track.

Adapted from the Better Moments #5 builder. Source timings are the public
episode https://www.youtube.com/watch?v=drCMMd-Z5Yk and match the 1080p
public-source proxy in ../video/source/. Re-run from this folder:

    python3 build-captions.py

If the finished cut is relinked to the Riverside isolated camera and mic, keep
these segment times as the programme reference and apply the measured offset in
the edit, not here. Give the long captions one final human listen against the
finished master before upload; auto-caption word timing drifts by up to 0.3 s.
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Word:
    start: float
    text: str
    edit_segment: int


# Locked picture edit, seconds on the public source timeline (in, out).
MAIN_SEGMENTS = [
    (2508.380, 2520.870),  # 1 cold open A: you don't need to move a wall
    (2536.520, 2551.580),  # 2 cold open B: space is one of the only things we can change
    (328.170, 363.530),    # 3 psychological needs come before design; we choose our spaces
    (590.260, 603.260),    # 4 Cathal names agency, growth and connection
    (523.990, 560.570),    # 5 nursing-home study, life or death
    (751.800, 785.660),    # 6 agency feeds on itself, rearrange a room
    (836.000, 873.930),    # 7 mission statement versus cubicles and corner offices
    (889.860, 929.820),    # 8 the boss's conference room, how is your space showing agency
    (2424.200, 2485.870),  # 9 Annette's question, the most damaging mistake
    (2348.500, 2372.520),  # 10 give the project team the room
    (2704.440, 2808.570),  # 11 friendship factories, be intentional
    (2866.900, 2934.660),  # 12 it doesn't cost money, move the couch, go someplace new
]

TEASER_SEGMENTS = [(2029.200, 2087.960)]  # 20 minutes early, home field advantage

REPLACEMENTS = {
    "Kahal": "Cathal",
    "Cahal": "Cathal",
    "Lydi": "Leidy",
    "Lyddie": "Leidy",
    "Lidy": "Leidy",
    "Lydon": "Leidy",
    "Lydi,": "Leidy,",
    "Lyddie,": "Leidy,",
    "Lidy,": "Leidy,",
    "Lydi.": "Leidy.",
    "Klotz,": "Klotz,",
}

TIMED_TOKEN_REPLACEMENTS: dict[int, str] = {
    363400: "put ourselves in.",   # segment 3 out: audio carries the phrase, caption lags
    2372480: "",                   # segment 10 out: drop clipped "Which"
    2934600: "",                   # segment 12 out: drop clipped "Now,"
    752000: "This feeds",          # segment 6 in: audio starts on "this"
    836080: "",                    # segment 7 in: "you know," sits before the cut in audio
    2866920: "I just",             # segment 12 in: audio starts on "I just think"
    2029280: "You say",            # teaser in: audio starts on "You say go"
    2087919: "",                   # teaser out: drop clipped "And"
}


def source_words(path: Path) -> list[tuple[float, str]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    words: list[tuple[float, str]] = []
    for event in payload.get("events", []):
        base = event.get("tStartMs")
        if base is None:
            continue
        for segment in event.get("segs", []):
            raw = segment.get("utf8", "").replace("\n", " ")
            token = raw.replace(">>", "").strip()
            if not token:
                continue
            if re.fullmatch(r"\[[^\]]+\]", token):
                continue
            token = REPLACEMENTS.get(token, token)
            start_ms = base + segment.get("tOffsetMs", 0)
            token = TIMED_TOKEN_REPLACEMENTS.get(start_ms, token)
            if not token:
                continue
            start = start_ms / 1000.0
            words.append((start, token))
    return words


def remap(words: list[tuple[float, str]], segments: list[tuple[float, float]]) -> list[Word]:
    mapped: list[Word] = []
    cursor = 0.0
    for index, (source_in, source_out) in enumerate(segments):
        first_word = True
        for start, token in words:
            if source_in <= start < source_out:
                if first_word and token:
                    token = token[0].upper() + token[1:]
                    first_word = False
                mapped.append(Word(cursor + start - source_in, token, index))
        cursor += source_out - source_in
    return mapped


def clean_text(text: str) -> str:
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\bi\b", "I", text)
    text = text.replace("cuz", "because")
    text = re.sub(r"\b(\w+(?:'\w+)?)( \1\b)+", r"\1", text)
    text = text.replace("Gen Zs", "Gen Z")
    text = text.replace("agency growth and connection", "agency, growth and connection")
    text = text.replace("agency, competence, and connection", "agency, competence and connection")
    text = text.replace("agency, growth, and connection", "agency, growth and connection")
    text = text.replace("50%", "50 per cent")
    text = re.sub(r"\bum\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\buh\b", "", text, flags=re.IGNORECASE)
    text = text.replace(" ,", ",")
    return re.sub(r"\s{2,}", " ", text).strip()


def captions(words: list[Word], *, max_words: int, max_chars: int, max_duration: float) -> list[tuple[float, float, str]]:
    result: list[tuple[float, float, str]] = []
    group: list[Word] = []

    def flush(next_start: float | None = None) -> None:
        nonlocal group
        if not group:
            return
        start = group[0].start
        natural_end = group[-1].start + 0.72
        if next_start is not None:
            natural_end = min(natural_end, max(start + 0.08, next_start - 0.04))
        end = min(natural_end, start + max_duration)
        text = clean_text(" ".join(word.text for word in group))
        if text:
            result.append((start, end, text))
        group = []

    for index, word in enumerate(words):
        if group:
            proposed = clean_text(" ".join(item.text for item in group + [word]))
            gap = word.start - group[-1].start
            segment_changed = word.edit_segment != group[-1].edit_segment
            if segment_changed or len(group) >= max_words or len(proposed) > max_chars or gap > 1.0:
                flush(word.start)
        group.append(word)
        duration = word.start - group[0].start
        if (re.search(r"[.!?]$", word.text) and len(group) >= 3) or duration >= max_duration - 0.45:
            next_start = words[index + 1].start if index + 1 < len(words) else None
            flush(next_start)
    flush()
    return result


def clamp_to_edit(rows: list[tuple[float, float, str]], segments: list[tuple[float, float]]) -> list[tuple[float, float, str]]:
    boundaries: list[float] = []
    cursor = 0.0
    for source_in, source_out in segments:
        cursor += source_out - source_in
        boundaries.append(cursor)
    clamped: list[tuple[float, float, str]] = []
    for start, end, text in rows:
        boundary = next((item for item in boundaries if item > start + 0.001), boundaries[-1])
        end = min(end, boundary)
        if end > start:
            clamped.append((start, end, text))
    return clamped


def stamp(seconds: float, separator: str = ",") -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, remainder = divmod(milliseconds, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, millis = divmod(remainder, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}{separator}{millis:03d}"


def write_srt(path: Path, rows: list[tuple[float, float, str]]) -> None:
    chunks = []
    for index, (start, end, text) in enumerate(rows, start=1):
        chunks.append(f"{index}\n{stamp(start)} --> {stamp(end)}\n{text}\n")
    path.write_text("\n".join(chunks), encoding="utf-8")


def write_vtt(path: Path, rows: list[tuple[float, float, str]]) -> None:
    chunks = ["WEBVTT\n"]
    for start, end, text in rows:
        chunks.append(f"{stamp(start, '.')} --> {stamp(end, '.')}\n{text}\n")
    path.write_text("\n".join(chunks), encoding="utf-8")


def write_transcript(path: Path, words: list[Word], segments: list[tuple[float, float]], title: str) -> None:
    by_segment: dict[int, list[Word]] = {}
    for word in words:
        by_segment.setdefault(word.edit_segment, []).append(word)
    chunks = [f"# {title}\n"]
    cursor = 0.0
    for index, (source_in, source_out) in enumerate(segments, start=1):
        segment_words = by_segment.get(index - 1, [])
        text = clean_text(" ".join(word.text for word in segment_words))
        if text:
            text = text[0].upper() + text[1:]
        chunks.append(
            f"## Segment {index} | finished {stamp(cursor, '.')} | source {stamp(source_in, '.')} to {stamp(source_out, '.')}\n\n{text}\n"
        )
        cursor += source_out - source_in
    path.write_text("\n".join(chunks), encoding="utf-8")


def main() -> None:
    output = Path(__file__).resolve().parent
    if len(sys.argv) == 1:
        source = output / "source-drCMMd-Z5Yk.en.json3"
    elif len(sys.argv) == 2:
        source = Path(sys.argv[1]).resolve()
    else:
        raise SystemExit("Usage: build-captions.py [/path/to/youtube-captions.en.json3]")
    raw_words = source_words(source)

    main_words = remap(raw_words, MAIN_SEGMENTS)
    main_rows = clamp_to_edit(captions(main_words, max_words=8, max_chars=44, max_duration=3.8), MAIN_SEGMENTS)
    write_srt(output / "BetterAtWork-BetterMoments-06-LeidyKlotz.srt", main_rows)
    write_vtt(output / "BetterAtWork-BetterMoments-06-LeidyKlotz.vtt", main_rows)
    write_transcript(output / "BetterAtWork-BetterMoments-06-LeidyKlotz.txt", main_words, MAIN_SEGMENTS,
                     "Better Moments #6 transcript (auto-caption remap, needs a human listen)")

    teaser_words = remap(raw_words, TEASER_SEGMENTS)
    teaser_rows = clamp_to_edit(captions(teaser_words, max_words=5, max_chars=27, max_duration=2.6), TEASER_SEGMENTS)
    write_srt(output / "BetterAtWork-Klotz-20-Minutes-Early-Teaser.srt", teaser_rows)
    write_transcript(output / "BetterAtWork-Klotz-20-Minutes-Early-Teaser.txt", teaser_words, TEASER_SEGMENTS,
                     "Teaser transcript (auto-caption remap)")

    print(f"main captions: {len(main_rows)}")
    print(f"teaser captions: {len(teaser_rows)}")


if __name__ == "__main__":
    main()
