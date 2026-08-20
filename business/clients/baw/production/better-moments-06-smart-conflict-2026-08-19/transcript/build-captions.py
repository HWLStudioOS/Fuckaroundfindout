#!/usr/bin/env python3
"""Build Better Moments #6 captions from the public Smart Conflict JSON3 track."""

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


# Harrison's final 25 fps Premiere lock. Runtime: 00:04:25:18.
# One uninterrupted programme extract, with no synthetic joins or overlays.
MAIN_SEGMENTS = [(2383.320, 2649.040)]

# Alice Driscoll, stable close-up. End before Cathal's response.
TEASER_SEGMENTS = [(2583.760, 2634.960)]

REPLACEMENTS = {
    "Kah,": "Cathal,",
    "Cahal": "Cathal",
    "Louis,": "Louise,",
    "Alcott": "Allcott",
    "behavior": "behaviour",
}

PHRASE_REPLACEMENTS = {
    "Graeme Allcott": "Graham Allcott",
    '"Kah,': '"Cathal,',
    '"Louis,': '"Louise,',
    "ner nervous systems": "nervous systems",
    "nervous system freeall": "nervous system freefall",
    "fight, flight or freeze": "fight, flight or freeze",
    "amigdala": "amygdala",
    "n to 100": "nought to 100",
    "Rick cord": "ripcord",
    "rip cord": "ripcord",
    "prioritizing": "prioritising",
    "Prioritize": "Prioritise",
    "organizations": "organisations",
    "organization": "organisation",
    "judgment": "judgement",
    "to that, if that means": "to, if that means",
    "need to that, if": "need to, if",
    "worked there and I found": "I worked there and I found",
    "desire to win?\", it's hard": "desire to win?\" It's hard",
    "you would we would say": "we would say",
    "come back maybe I mean": "come back maybe. I mean",
    "Yeah. It in a way": "Yeah, in a way",
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
            if not token or re.fullmatch(r"\[[^\]]+\]", token):
                continue
            token = REPLACEMENTS.get(token, token)
            start = (base + segment.get("tOffsetMs", 0)) / 1000.0
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
    text = re.sub(r"^[,.;:]+\s*", "", text)
    text = re.sub(r"\bi\b", "I", text)
    text = re.sub(r"\b(um|uh)\b", "", text, flags=re.IGNORECASE)
    for phrase, replacement in PHRASE_REPLACEMENTS.items():
        text = text.replace(phrase, replacement)
    text = re.sub(r'\?",\s+it\'s hard', '?" It\'s hard', text, flags=re.IGNORECASE)
    for repeated in (
        "In in",
        "I I",
        "default default",
        "you you",
        "we we",
        "and and and",
        "and and",
        "for for",
        "or or",
        "to to",
        "we'll we'll we'll",
    ):
        text = re.sub(rf"\b{re.escape(repeated)}\b", repeated.split()[0], text, flags=re.IGNORECASE)
    text = text.replace("c get curious", "get curious")
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"([.!?])[,;:]", r"\1", text)
    text = re.sub(r"^[,.;:]+\s*", "", text)
    return re.sub(r"\s{2,}", " ", text).strip()


def captions(
    words: list[Word], *, max_words: int, max_chars: int, max_duration: float
) -> list[tuple[float, float, str]]:
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


def clamp_to_edit(
    rows: list[tuple[float, float, str]], segments: list[tuple[float, float]]
) -> list[tuple[float, float, str]]:
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
Style: Default,Montserrat,76,&H00FFFFFF,&H000000FF,&H80000000,&H50000000,-1,0,0,0,100,100,-1.0,0,1,2.8,1.2,2,80,80,710,1

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
    chunks = ["# Better Moments #6 transcript: Smart Conflict\n"]
    cursor = 0.0
    for index, (source_in, source_out) in enumerate(segments, start=1):
        segment_words = by_segment.get(index - 1, [])
        text = clean_text(" ".join(word.text for word in segment_words))
        chunks.append(
            f"## {stamp(cursor, '.')} | Source {stamp(source_in, '.')} to {stamp(source_out, '.')}\n\n{text}\n"
        )
        cursor += source_out - source_in
    path.write_text("\n".join(chunks), encoding="utf-8")


def validate(rows: list[tuple[float, float, str]], runtime: float) -> None:
    previous_end = 0.0
    for start, end, text in rows:
        if not text or end <= start or start < previous_end - 0.001 or end > runtime + 0.001:
            raise ValueError(f"Invalid cue: {start=}, {end=}, {text=}")
        previous_end = end


def main() -> None:
    output = Path(__file__).resolve().parent
    source = (
        output / "source-smart-conflict.en.json3"
        if len(sys.argv) == 1
        else Path(sys.argv[1]).resolve()
    )
    raw_words = source_words(source)

    main_words = remap(raw_words, MAIN_SEGMENTS)
    main_runtime = sum(end - start for start, end in MAIN_SEGMENTS)
    # The public JSON3 tail runs slightly late against Harrison's Premiere
    # transcript. Preserve the confirmed final words inside the locked out.
    main_words.extend(
        [
            Word(main_runtime - 0.060, "operating", 0),
            Word(main_runtime - 0.020, "on.", 0),
        ]
    )
    main_rows = clamp_to_edit(
        captions(main_words, max_words=8, max_chars=44, max_duration=3.8), MAIN_SEGMENTS
    )
    main_rows = [(start, end, clean_text(text)) for start, end, text in main_rows]
    validate(main_rows, main_runtime)
    write_srt(output / "BetterAtWork-BetterMoments-06-SmartConflict.srt", main_rows)
    write_vtt(output / "BetterAtWork-BetterMoments-06-SmartConflict.vtt", main_rows)
    write_transcript(
        output / "BetterAtWork-BetterMoments-06-SmartConflict.txt", main_words, MAIN_SEGMENTS
    )

    teaser_words = remap(raw_words, TEASER_SEGMENTS)
    teaser_rows = clamp_to_edit(
        captions(teaser_words, max_words=5, max_chars=27, max_duration=2.6), TEASER_SEGMENTS
    )
    teaser_runtime = sum(end - start for start, end in TEASER_SEGMENTS)
    validate(teaser_rows, teaser_runtime)
    write_srt(output / "BetterAtWork-SmartConflict-Curiosity-Teaser.srt", teaser_rows)
    write_vtt(output / "BetterAtWork-SmartConflict-Curiosity-Teaser.vtt", teaser_rows)
    write_ass(output / "BetterAtWork-SmartConflict-Curiosity-Teaser.ass", teaser_rows)

    print(f"main captions: {len(main_rows)}; runtime: {main_runtime:.3f}s")
    print(f"teaser captions: {len(teaser_rows)}; runtime: {teaser_runtime:.3f}s")


if __name__ == "__main__":
    main()
