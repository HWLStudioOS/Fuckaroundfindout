#!/usr/bin/env python3
"""health-sync: pull daily health from Garmin Connect into a local datastore.

Garmin (Forerunner 265) is the spine: sleep, HRV, resting HR, stress, body
battery, training readiness/status, recent activities. Replaces the manual
iPhone export and the broken apple-health MCP.

Writes:
  health/data/garmin-YYYY-MM-DD.json   full raw dump (one per day, for backfill/repair)
  health/current.json                  concise rolling snapshot morning-brief reads

Creds: .config/garmin.config.json  (gitignored; never printed)
Token: .config/.garmin_tokens/      (cached OAuth, so we don't re-login every run)

Run:   .venv-health/bin/python agents/health-sync.py
"""
import json, sys, datetime
from pathlib import Path

BASE = Path("/Users/harrison/HWL META")
CFG = BASE / ".config/garmin.config.json"
TOKENS = BASE / ".config/.garmin_tokens"
DATA = BASE / "health/data"
CURRENT = BASE / "health/current.json"
DATA.mkdir(parents=True, exist_ok=True)


def log(msg):
    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M %Z")
    try:
        with open(BASE / "agents/_log.md", "a") as f:
            f.write(f"- {stamp} | health-sync | {msg}\n")
    except Exception:
        pass
    print(msg)


if not CFG.exists():
    log("ABORT: .config/garmin.config.json missing"); sys.exit(1)

cfg = json.load(open(CFG))
email, password = cfg.get("email"), cfg.get("password")
if not email or not password:
    log("ABORT: email/password missing in config"); sys.exit(1)

from garminconnect import Garmin

# Token-cached login: resume from tokenstore if present, else authenticate and save.
try:
    g = Garmin(email=email, password=password)
    g.login(str(TOKENS))
except Exception as e:
    log(f"tokenstore login failed ({e}); fresh login")
    g = Garmin(email=email, password=password)
    g.login()
    try:
        g.garth.dump(str(TOKENS))
    except Exception:
        pass

today = datetime.date.today()
d = today.isoformat()


def safe(fn):
    try:
        return fn()
    except Exception as e:
        return {"_error": str(e)}


raw = {
    "stats_and_body": safe(lambda: g.get_stats_and_body(d)),
    "sleep": safe(lambda: g.get_sleep_data(d)),
    "hrv": safe(lambda: g.get_hrv_data(d)),
    "rhr": safe(lambda: g.get_rhr_day(d)),
    "stress": safe(lambda: g.get_all_day_stress(d)),
    "body_battery": safe(lambda: g.get_body_battery(d, d)),
    "training_readiness": safe(lambda: g.get_training_readiness(d)),
    "training_status": safe(lambda: g.get_training_status(d)),
    "activities": safe(lambda: g.get_activities(0, 5)),
}

out = {"pulled_at": datetime.datetime.now().isoformat(), "date": d, "raw": raw}
json.dump(out, open(DATA / f"garmin-{d}.json", "w"), indent=2, default=str)


def dig(obj, *keys):
    for k in keys:
        if isinstance(obj, dict) and k in obj:
            obj = obj[k]
        else:
            return None
    return obj


sb = raw.get("stats_and_body") or {}
sl = dig(raw.get("sleep"), "dailySleepDTO") or {}
hv = raw.get("hrv") or {}
tr = raw.get("training_readiness")
if isinstance(tr, list) and tr:
    tr = tr[0]
tr = tr or {}

# Early-morning runs (06:00) often beat the watch sync, so today's sleep and HRV
# come back empty even though readiness and activities are present. Fall back to
# the most recent completed night, then to the weekly HRV average that always
# sits inside the readiness block, and tag which date each metric is actually
# from so a stale read is honest rather than silently wrong.
yday = (today - datetime.timedelta(days=1)).isoformat()

secs = sl.get("sleepTimeSeconds")
sleep_date = d
if not secs:
    sl_y = dig(safe(lambda: g.get_sleep_data(yday)), "dailySleepDTO") or {}
    if sl_y.get("sleepTimeSeconds"):
        sl, secs, sleep_date = sl_y, sl_y.get("sleepTimeSeconds"), yday

hrv_avg = dig(hv, "hrvSummary", "lastNightAvg")
hrv_status = dig(hv, "hrvSummary", "status")
hrv_date = d
if hrv_avg is None:
    hv_y = safe(lambda: g.get_hrv_data(yday)) or {}
    y_avg = dig(hv_y, "hrvSummary", "lastNightAvg")
    if y_avg is not None:
        hrv_avg, hrv_status, hrv_date = y_avg, dig(hv_y, "hrvSummary", "status"), yday
if hrv_avg is None:
    hrv_avg, hrv_status, hrv_date = tr.get("hrvWeeklyAverage"), hrv_status or "WEEKLY_AVG", "weekly"

snap = {
    "date": d,
    "pulled_at": out["pulled_at"],
    "source": "garmin-forerunner-265",
    "resting_hr": sb.get("restingHeartRate") or dig(raw.get("rhr"), "restingHeartRate"),
    "steps": sb.get("totalSteps"),
    "stress_avg": sb.get("averageStressLevel"),
    "body_battery_high": sb.get("bodyBatteryHighestValue"),
    "body_battery_low": sb.get("bodyBatteryLowestValue"),
    "sleep_hours": round(secs / 3600, 1) if secs else None,
    "sleep_score": dig(sl, "sleepScores", "overall", "value"),
    "sleep_date": sleep_date,
    "hrv_avg_last_night": hrv_avg,
    "hrv_status": hrv_status,
    "hrv_date": hrv_date,
    "training_readiness": tr.get("score"),
    "training_readiness_level": tr.get("level"),
}
json.dump(snap, open(CURRENT, "w"), indent=2, default=str)

errs = [k for k, v in raw.items() if isinstance(v, dict) and v.get("_error")]
log(
    f"OK {d}: RHR {snap['resting_hr']}, sleep {snap['sleep_hours']}h "
    f"(score {snap['sleep_score']}), HRV {snap['hrv_avg_last_night']} {snap['hrv_status']}, "
    f"readiness {snap['training_readiness']}"
    + (f" | endpoints errored: {errs}" if errs else "")
)
print(json.dumps(snap, indent=2, default=str))
