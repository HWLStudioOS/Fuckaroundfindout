#!/usr/bin/env python3
"""telegram-inbound.py: capture Harrison's Telegram replies into capture/inbox.md.

Replaces the dead ccpa-telegram bridge (pm2 crash loop, retired 1 Jul 2026) with a
deliberately narrow surface: capture only. No Claude execution, no shell, no commands.
Messages from Harrison's chat land in the inbox tagged as authoritative evidence, so
"done X" / "sent Y" replies count in the morning brief instead of vanishing.
Runs every 2 minutes via com.hwl.telegram-inbound.plist.
"""
import json
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

META = Path("/Users/harrison/HWL META")
CONFIG = META / ".config/telegram.config.json"
OFFSET_FILE = META / ".config/telegram-inbound.offset"
INBOX = META / "capture/inbox.md"
LOG = META / "agents/_log.md"

cfg = json.loads(CONFIG.read_text())
TOKEN = cfg["telegram"]["botToken"]
ALLOWED = set(cfg.get("allowedUsers", [])) | {cfg["telegram"]["chatId"]}
API = f"https://api.telegram.org/bot{TOKEN}"


def api(method, **params):
    data = urllib.parse.urlencode(params).encode()
    with urllib.request.urlopen(f"{API}/{method}", data=data, timeout=15) as r:
        return json.loads(r.read())


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
for u in updates:
    msg = u.get("message") or u.get("edited_message")
    if not msg:
        continue
    if msg.get("chat", {}).get("id") not in ALLOWED:
        continue
    text = msg.get("text") or msg.get("caption")
    if not text:
        kinds = [k for k in ("voice", "photo", "video", "document", "audio") if k in msg]
        if kinds:
            captured.append((msg, f"[{kinds[0]} message received, not transcribed. Re-send as text if it matters.]"))
        continue
    captured.append((msg, text.strip()))

if captured:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    block_lines = [f"## {now} (Telegram reply)"]
    block_lines += [f"- {text}" for _, text in captured]
    block_lines += [
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

    with LOG.open("a") as f:
        f.write(f"{datetime.now().strftime('%Y-%m-%dT%H:%M:%S')} | telegram-inbound | captured {len(captured)} reply(ies) to capture/inbox.md\n")

# Advance the offset only after a successful inbox write, so a failed run retries.
OFFSET_FILE.write_text(str(updates[-1]["update_id"]))

if captured:
    last_msg = captured[-1][0]
    api(
        "sendMessage",
        chat_id=last_msg["chat"]["id"],
        reply_to_message_id=last_msg["message_id"],
        text="Logged to inbox. Counts as evidence in the next brief.",
    )
