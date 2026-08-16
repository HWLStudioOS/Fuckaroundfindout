#!/usr/bin/env python3
"""fleet-health.py: does every scheduled agent still actually run?

Written 16 August 2026 after discovery-scan sat dead on AUTH_REQUIRED from Friday
afternoon to Sunday evening and Harrison found out from a chat session rather than
from the system. The fleet had no heartbeat. Adding more agents to a fleet where
one can die silently just buys more silent deaths.

DESIGN RULE, do not break it: this script uses no Claude and no MCP. The failure it
exists to catch is the shared Claude session logging out, which takes every agent
down at once. A watchdog that needs the thing it watches is not a watchdog. Pure
stdlib, reads agents/_log.md, posts to Telegram directly.

Exit codes: 0 healthy, 1 something is overdue or failing, 2 could not run.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path

os.umask(0o077)

META = Path(os.environ.get("HWL_META_DIR", "/Users/harrison/HWL META"))
LOG = META / "agents/_log.md"
STATUS = META / "agents/_fleet-status.md"
CONFIG = META / ".config/telegram.config.json"

MON, TUE, WED, THU, FRI, SAT, SUN = range(7)
WEEKDAYS = [MON, TUE, WED, THU, FRI]
DAILY = list(range(7))

# Expected cadence, read off agents/launchd/*.plist on 16 August 2026.
# grace_hours is how late a run may be before it counts as missed.
EXPECTED = [
    # name,              days,      hour, minute, grace_hours, plist
    ("morning-brief",    WEEKDAYS,   6, 30,  6, True),
    ("content-engine",   [MON],      7,  0,  8, True),
    ("arsenal-watch",    DAILY,      8, 15,  8, True),
    ("health-sync",      DAILY,      6, 15,  8, True),
    ("creative-lab",     DAILY,     17,  0,  6, True),
    ("form-lab",         DAILY,     17, 30,  6, True),
    ("pattern-lab",      [WED, SAT],19, 30,  8, True),
    ("weekly-cfo",       [FRI],     16,  0, 12, True),
    ("weekly-review",    [SUN],     18,  0, 12, True),
    # 26h grace: nightly-backup writes its own completion line after it commits,
    # so in a freshly cloned copy its latest line always trails by one cycle. On
    # the mini it is current. The wider grace stops that artifact firing a false
    # alarm when this is run anywhere other than the mini.
    ("nightly-backup",   DAILY,     22, 30, 26, True),
    # Observed running in the log but with NO plist committed in agents/launchd/.
    # Either they are scheduled by something not in the repo, or they are invoked
    # by another agent. Tracked so the gap stays visible instead of being folded away.
    ("discovery-scan",   DAILY,     14,  0, 10, False),
    ("evening-reflection", DAILY,   19,  0,  8, False),
    ("campaign-chaser",  DAILY,     10,  0, 10, False),
    ("board-room",       DAILY,     22, 30,  8, False),
]

# Log lines come in two shapes:
#   2026-08-14T06:43:51+0100 | morning-brief | SUCCEEDED | exit=0; ...
# - 2026-08-15 06:15  | health-sync | OK 2026-08-15: RHR 48 ...
LINE = re.compile(
    r"^-?\s*(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2})?"
    r"(?:[+-]\d{4}|\s*[A-Z]{2,4})?\s*\|\s*([a-z0-9-]+)\s*\|\s*(.*)$"
)
BAD = ("AUTH_REQUIRED", "FAILED", "CONFIGURATION_ERROR", "VALIDATION FAILED",
       "RUN_FAILED", "auth_required")


def last_runs(text):
    """Map agent name to (datetime, detail) of its most recent log line."""
    seen = {}
    for raw in text.splitlines():
        m = LINE.match(raw.strip())
        if not m:
            continue
        day, hh, mm, name, detail = m.groups()
        try:
            when = datetime.strptime(f"{day} {hh}:{mm}", "%Y-%m-%d %H:%M")
        except ValueError:
            continue
        if name not in seen or when >= seen[name][0]:
            seen[name] = (when, detail.strip())
    return seen


def due_before(now, days, hour, minute):
    """Most recent scheduled firing at or before now, or None if never due."""
    for back in range(0, 14):
        day = now - timedelta(days=back)
        if day.weekday() not in days:
            continue
        fire = day.replace(hour=hour, minute=minute, second=0, microsecond=0)
        if fire <= now:
            return fire
    return None


def assess(now, runs):
    rows = []
    for name, days, hour, minute, grace, has_plist in EXPECTED:
        due = due_before(now, days, hour, minute)
        seen = runs.get(name)
        if due is None:
            rows.append((name, "PENDING", "not yet due in this window", has_plist))
            continue
        if seen is None:
            rows.append((name, "NEVER", "no run in agents/_log.md at all", has_plist))
            continue
        when, detail = seen
        late = now - due
        if any(flag in detail for flag in BAD):
            rows.append((name, "ERROR", f"last run {when:%d %b %H:%M}: {detail[:110]}", has_plist))
        elif when < due and late > timedelta(hours=grace):
            hours = int(late.total_seconds() // 3600)
            rows.append((name, "MISSED",
                         f"due {due:%a %d %b %H:%M}, last ran {when:%a %d %b %H:%M}, {hours}h late",
                         has_plist))
        else:
            rows.append((name, "OK", f"last ran {when:%a %d %b %H:%M}", has_plist))
    return rows


def config_checks():
    """Non-cadence checks. Things that are silently off rather than overdue."""
    rows = []
    if not CONFIG.is_file():
        return [("telegram-config", "ERROR", f"no config at {CONFIG}", True)]
    try:
        cfg = json.loads(CONFIG.read_text())
    except Exception as exc:
        return [("telegram-config", "ERROR", f"config unreadable: {exc}", True)]

    capture = ((cfg.get("telegram") or {}).get("botToken") or "").strip()
    agent = ((cfg.get("agentBot") or {}).get("botToken") or "").strip()
    if not agent:
        rows.append(("telegram-agent", "NEVER",
                     "agentBot.botToken is not set, so telegram-agent.py idles and has "
                     "never run. Only the capture bot is live, which by design just "
                     "acknowledges. Create a second bot with @BotFather.", True))
    elif agent == capture:
        rows.append(("telegram-agent", "ERROR",
                     "agentBot.botToken equals the capture bot token. telegram-agent.py "
                     "refuses to start, correctly: two pollers on one token fight over "
                     "getUpdates. Use a distinct bot.", True))

    voice = cfg.get("voice") or {}
    if voice.get("enabled", True):
        model = Path(voice.get("model") or (META / ".config/whisper/ggml-base.en.bin"))
        if not model.expanduser().is_file():
            rows.append(("voice-transcription", "MISSED",
                         f"whisper model missing at {model}, so voice notes fall back "
                         "to the placeholder. brew install whisper-cpp ffmpeg, then "
                         "download a ggml model.", True))
    return rows


def render(now, rows):
    order = {"ERROR": 0, "NEVER": 1, "MISSED": 2, "PENDING": 3, "OK": 4}
    rows = sorted(rows, key=lambda r: (order.get(r[1], 9), r[0]))
    bad = [r for r in rows if r[1] in ("ERROR", "NEVER", "MISSED")]
    out = [
        "---",
        f"generated: {now:%Y-%m-%d %H:%M} by scripts/fleet-health.py",
        "owner: generated, never hand-edited",
        "---",
        "",
        "# Fleet status",
        "",
        f"**{len(rows) - len(bad)} of {len(rows)} healthy.**"
        + (f" {len(bad)} needing attention." if bad else " Nothing overdue."),
        "",
        "| Agent | State | Detail | Scheduled in repo |",
        "| --- | --- | --- | --- |",
    ]
    for name, state, detail, has_plist in rows:
        plist = "yes" if has_plist else "**no plist**"
        out.append(f"| `{name}` | {state} | {detail} | {plist} |")
    out += [
        "",
        "`no plist` means the agent appears in `agents/_log.md` but has no committed",
        "launchd job in `agents/launchd/`. It is running from something outside the",
        "repo, or being invoked by another agent. Either way the repo is not the",
        "source of truth for its schedule, which is worth closing.",
        "",
        "Deliberately NOT auto-created, because `CLAUDE.md` forbids adding a second",
        "schedule for an existing workflow and a duplicate launchd job would double-run",
        "the agent. To see what is really loaded on the mini:",
        "",
        "```",
        "launchctl list | grep hwl",
        "```",
        "",
        "Run this script anywhere other than the mini and the picture is stale: a clone",
        "only holds the log as far as the last nightly push, so same-day runs look",
        "missing when they are not. The mini is the only place the answer is true.",
        "",
    ]
    return "\n".join(out), bad


def notify(bad, now):
    if not bad or not CONFIG.is_file():
        return
    try:
        cfg = json.loads(CONFIG.read_text())
        token = cfg["telegram"]["botToken"]
        chat = cfg["telegram"]["chatId"]
    except Exception:
        return
    lines = [f"Fleet health, {now:%a %d %b %H:%M}", ""]
    for name, state, detail, _ in bad:
        lines.append(f"{state}: {name}")
        lines.append(f"  {detail}")
    if any(s == "ERROR" and "AUTH" in d.upper() for _, s, d, _ in bad):
        lines += ["", "Auth failures take the whole fleet down.",
                  "Run: claude auth login"]
    body = urllib.parse.urlencode({
        "chat_id": chat, "text": "\n".join(lines),
    }).encode()
    try:
        urllib.request.urlopen(
            f"https://api.telegram.org/bot{token}/sendMessage", data=body, timeout=15
        ).read()
    except Exception:
        pass


def main():
    if not LOG.is_file():
        print(f"fleet-health: no log at {LOG}", file=sys.stderr)
        return 2
    now = datetime.now()
    rows = assess(now, last_runs(LOG.read_text(errors="replace"))) + config_checks()
    report, bad = render(now, rows)
    STATUS.write_text(report)
    os.chmod(STATUS, 0o600)
    print(report)
    notify(bad, now)
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
