#!/usr/bin/env python3
"""telegram-inbound.py: capture Harrison's Telegram replies into capture/inbox.md.

Replaces the dead ccpa-telegram bridge (pm2 crash loop, retired 1 Jul 2026) with a
deliberately narrow surface: capture only. No Claude execution, no shell, no commands.
Messages from Harrison's chat land in the inbox tagged as authoritative evidence, so
"done X" / "sent Y" replies count in the morning brief instead of vanishing.
Runs every 2 minutes via com.hwl.telegram-inbound.plist.
"""
import json
import os
import shutil
import subprocess
import tempfile
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

from telegram_queue import (
    is_authorized_private_message,
    is_forwarded_message,
    normalize_telegram_ids,
)

os.umask(0o077)

META = Path("/Users/harrison/HWL META")
CONFIG = META / ".config/telegram.config.json"
OFFSET_FILE = META / ".config/telegram-inbound.offset"
INBOX = META / "capture/inbox.md"
LOG = META / "agents/_log.md"

cfg = json.loads(CONFIG.read_text())
TOKEN = cfg["telegram"]["botToken"]
ALLOWED = normalize_telegram_ids(
    list(cfg.get("allowedUsers", [])) + [cfg["telegram"]["chatId"]]
)
API = f"https://api.telegram.org/bot{TOKEN}"

# Voice transcription. Local whisper.cpp on the mini, so audio never leaves the
# machine and no API key joins the secret surface. Every setting is optional and
# every failure degrades to the old placeholder rather than dropping the capture.
VOICE = cfg.get("voice") or {}
VOICE_ENABLED = VOICE.get("enabled", True)
VOICE_MODEL = Path(
    VOICE.get("model")
    or (META / ".config/whisper/ggml-base.en.bin")
).expanduser()
VOICE_MAX_SECONDS = int(VOICE.get("maxSeconds", 600))
VOICE_TIMEOUT = int(VOICE.get("timeoutSeconds", 300))


def api(method, **params):
    data = urllib.parse.urlencode(params).encode()
    with urllib.request.urlopen(f"{API}/{method}", data=data, timeout=15) as r:
        return json.loads(r.read())


def transcribe_voice(media):
    """Return transcript text for a Telegram voice/audio payload, or None.

    Never raises. Any missing tool, oversized file or non-zero exit returns None
    so the caller falls back to the placeholder. Harrison's 14 August voice note
    was lost because nothing here existed; losing the audio is bad, losing the
    capture entirely would be worse.
    """
    if not VOICE_ENABLED:
        return None
    if media.get("duration", 0) > VOICE_MAX_SECONDS:
        return None

    whisper = shutil.which("whisper-cli") or shutil.which("whisper-cpp")
    ffmpeg = shutil.which("ffmpeg")
    if not whisper or not ffmpeg or not VOICE_MODEL.is_file():
        return None

    file_id = media.get("file_id")
    if not file_id:
        return None

    try:
        info = api("getFile", file_id=file_id)
        if not info.get("ok"):
            return None
        remote_path = info["result"]["file_path"]

        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            source = tmp / "voice.oga"
            wav = tmp / "voice.wav"

            # The token is in the URL, so never log this and never surface it.
            url = f"https://api.telegram.org/file/bot{TOKEN}/{remote_path}"
            with urllib.request.urlopen(url, timeout=60) as r:
                source.write_bytes(r.read())

            # whisper.cpp wants 16 kHz mono PCM.
            subprocess.run(
                [ffmpeg, "-nostdin", "-loglevel", "error", "-y",
                 "-i", str(source), "-ar", "16000", "-ac", "1", str(wav)],
                check=True, timeout=VOICE_TIMEOUT, capture_output=True,
            )

            done = subprocess.run(
                [whisper, "-m", str(VOICE_MODEL), "-f", str(wav),
                 "--no-timestamps", "--no-prints", "--language", "en"],
                check=True, timeout=VOICE_TIMEOUT, capture_output=True, text=True,
            )
            transcript = " ".join(done.stdout.split()).strip()
            return transcript or None
    except Exception:
        # Deliberately broad. A transcription failure must never cost the capture
        # or stall the offset, because the offset only advances on a good write.
        return None


def atomic_private_write(path, text):
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(text)
    os.chmod(temporary, 0o600)
    os.replace(temporary, path)


offset = 0
if OFFSET_FILE.exists():
    try:
        offset = int(OFFSET_FILE.read_text().strip())
    except ValueError:
        pass

resp = api("getUpdates", offset=offset + 1, timeout=0)
if not resp.get("ok"):
    raise SystemExit(f"telegram-inbound: getUpdates failed: {resp}")
updates = resp["result"]
if not updates:
    raise SystemExit(0)

captured = []
transcribed = 0
for u in updates:
    msg = u.get("message") or u.get("edited_message")
    if not msg:
        continue
    if not is_authorized_private_message(msg, ALLOWED):
        continue
    text = msg.get("text") or msg.get("caption")
    if not text:
        kinds = [k for k in ("voice", "photo", "video", "document", "audio") if k in msg]
        if kinds:
            kind = kinds[0]
            transcript = None
            if kind in ("voice", "audio"):
                transcript = transcribe_voice(msg[kind])
            if transcript:
                captured.append((
                    msg,
                    f"{transcript}\n\n  [transcribed from a {kind} note, Harrison's own words]",
                    is_forwarded_message(msg),
                ))
                transcribed += 1
            else:
                captured.append((
                    msg,
                    f"[{kind} message received, not transcribed. Re-send as text if it matters.]",
                    is_forwarded_message(msg),
                ))
        continue
    captured.append((msg, text.strip(), is_forwarded_message(msg)))

if captured:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    block_lines = []
    for _message, text, forwarded in captured:
        safe_text = text.replace("\n", "\n  ")
        if forwarded:
            block_lines += [
                f"## {now} (Telegram forwarded material)",
                f"- {safe_text}",
                "- Source: telegram forward (reference material, not Harrison's own words)",
                "- Tag: reference",
                "- Status: new",
                "",
            ]
        else:
            block_lines += [
                f"## {now} (Telegram reply)",
                f"- {safe_text}",
                "- Source: telegram reply (authoritative, Harrison's own words)",
                "- Tag: capture",
                "- Status: new",
                "",
            ]
    content = INBOX.read_text()
    lines = content.splitlines(keepends=True)
    insert_at = next((i for i, l in enumerate(lines) if l.startswith("## 20")), len(lines))
    lines.insert(insert_at, "\n".join(block_lines) + "\n")
    INBOX.write_text("".join(lines))

    detail = f"captured {len(captured)} reply(ies) to capture/inbox.md"
    if transcribed:
        detail += f", {transcribed} transcribed locally via whisper.cpp"
    with LOG.open("a") as f:
        f.write(f"{datetime.now().strftime('%Y-%m-%dT%H:%M:%S')} | telegram-inbound | {detail}\n")

# Advance the offset only after a successful inbox write, so a failed run retries.
atomic_private_write(OFFSET_FILE, str(updates[-1]["update_id"]))

if captured:
    last_msg = captured[-1][0]
    ack = "Logged to inbox. Counts as evidence in the next brief."
    if transcribed:
        # Echo the opening words back so a silent mistranscription is visible
        # immediately rather than surfacing days later in a brief.
        opening = " ".join(captured[-1][1].split()[:12])
        ack = f'Transcribed and logged: "{opening}..."'
    api(
        "sendMessage",
        chat_id=last_msg["chat"]["id"],
        reply_to_message_id=last_msg["message_id"],
        text=ack,
    )
