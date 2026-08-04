#!/usr/bin/env python3
"""Build captions for Better Moments #4 from YouTube's JSON3 caption track."""

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


MAIN_SEGMENTS = [
    (3053.28, 3078.56),
    (332.24, 398.40),
    (436.56, 492.80),
    (653.76, 679.00),
    (1157.92, 1215.50),
    (1478.72, 1551.70),
    (2008.24, 2088.40),
    (2092.72, 2239.00),
    (2378.64, 2409.52),
    (3096.00, 3131.80),
]

TEASER_SEGMENTS = [(3409.28, 3454.40)]

REPLACEMENTS = {
    "consonants": "consonance",
    "Consonants": "Consonance",
    "Gastnering": "Gassner Otting",
    "Kahal": "Cathal",
    "Cahal": "Cathal",
}

TIMED_TOKEN_REPLACEMENTS = {
    3415520: "you?",
    3419920: "answer.",
    3420880: "Nice.",
    3421920: "Break",
    3422240: "stride.",
    3424319: "Don't",
    3425520: "coffee.",
    3425920: "It's",
    3426160: "very,",
    3427040: "small.",
    3427440: "And",
    3427839: "listen.",
    3428079: "And",
    3429440: "connection,",
    3430000: "contribution,",
    3430720: "calling,",
    3431119: "control.",
    3431520: "As",
    3433040: "factors,",
    3434640: "is,",
    3435359: "note",
    3436319: "about?",
    3436640: "Did",
    3437760: "kids?",
    3438079: "Did",
    3441440: "Like,",
    3443280: "Like,",
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
    text = text.replace("four C's", "four Cs")
    text = text.replace("Four C's", "Four Cs")
    text = text.replace("radioraph", "radar graph")
    text = text.replace("theater associate VP", "senior associate VP")
    text = text.replace("in continents", "in consonance")
    text = text.replace("four workmen", "Four Horsemen")
    text = text.replace("these this four horsemen", "these Four Horsemen")
    text = text.replace("this four horsemen", "the Four Horsemen")
    text = text.replace("a four horsemen", "the Four Horsemen")
    text = re.sub(r"\b[Cc]onsonants\b", "Consonance", text)
    text = re.sub(r"\b[Cc]onstants\b", "Consonance", text)
    text = re.sub(r"\bbaddy\b", "batty", text, flags=re.IGNORECASE)
    text = text.replace("cuz", "because")
    text = text.replace("it's very it's very small", "it's very, it's very small")
    text = text.replace("connection contribution calling control", "connection, contribution, calling, control")
    text = text.replace("break stride", "Break stride.")
    text = text.replace("uh ", "")
    text = text.replace("Um ", "")
    return text.strip()


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
    """Keep captions inside their source segment and the finished runtime."""
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


def ass_stamp(seconds: float) -> str:
    centis = max(0, round(seconds * 100))
    hours, remainder = divmod(centis, 360_000)
    minutes, remainder = divmod(remainder, 6_000)
    secs, cs = divmod(remainder, 100)
    return f"{hours}:{minutes:02d}:{secs:02d}.{cs:02d}"


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


def write_ass(path: Path, rows: list[tuple[float, float, str]]) -> None:
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Helvetica Now Display,84,&H00FFFFFF,&H000000FF,&H80000000,&H50000000,-1,0,0,0,100,100,-1.5,0,1,2.5,1.2,2,80,80,735,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = [
        f"Dialogue: 0,{ass_stamp(start)},{ass_stamp(end)},Default,,0,0,0,,{text}"
        for start, end, text in rows
    ]
    path.write_text(header + "\n".join(events) + "\n", encoding="utf-8")


def write_transcript(path: Path, words: list[Word], segments: list[tuple[float, float]]) -> None:
    by_segment: dict[int, list[Word]] = {}
    for word in words:
        by_segment.setdefault(word.edit_segment, []).append(word)
    chunks = ["# Better Moments #4 transcript\n"]
    cursor = 0.0
    for index, (source_in, source_out) in enumerate(segments, start=1):
        segment_words = by_segment.get(index - 1, [])
        text = clean_text(" ".join(word.text for word in segment_words))
        chunks.append(
            f"## {stamp(cursor, '.')} | Source {stamp(source_in, '.')} to {stamp(source_out, '.')}\n\n{text}\n"
        )
        cursor += source_out - source_in
    path.write_text("\n".join(chunks), encoding="utf-8")


def main() -> None:
    output = Path(__file__).resolve().parent
    if len(sys.argv) == 1:
        source = output / "source-e8Z0nuapNLI.en.json3"
    elif len(sys.argv) == 2:
        source = Path(sys.argv[1]).resolve()
    else:
        raise SystemExit("Usage: build-captions.py [/path/to/youtube-captions.en.json3]")
    raw_words = source_words(source)

    main_words = remap(raw_words, MAIN_SEGMENTS)
    main_rows = clamp_to_edit(
        captions(main_words, max_words=8, max_chars=44, max_duration=3.8),
        MAIN_SEGMENTS,
    )
    write_srt(output / "BetterAtWork-BetterMoments-04-LauraGassnerOtting.srt", main_rows)
    write_vtt(output / "BetterAtWork-BetterMoments-04-LauraGassnerOtting.vtt", main_rows)
    write_transcript(output / "BetterAtWork-BetterMoments-04-LauraGassnerOtting.txt", main_words, MAIN_SEGMENTS)

    teaser_words = remap(raw_words, TEASER_SEGMENTS)
    teaser_rows = clamp_to_edit(
        captions(teaser_words, max_words=5, max_chars=27, max_duration=2.6),
        TEASER_SEGMENTS,
    )
    write_srt(output / "BetterAtWork-Laura-HowAreYou-Teaser.srt", teaser_rows)
    write_ass(output / "BetterAtWork-Laura-HowAreYou-Teaser.ass", teaser_rows)

    print(f"main captions: {len(main_rows)}")
    print(f"teaser captions: {len(teaser_rows)}")


if __name__ == "__main__":
    main()
