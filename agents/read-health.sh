#!/bin/bash
# read-health.sh — unified daily health read for the morning brief.
#
# PRIMARY: Garmin Connect (health/current.json), refreshed daily by health-sync.py
#   -> resting HR, HRV, sleep + score, training readiness, body battery, stress, steps.
#   This replaced the manual iPhone export + the broken apple-health MCP on 9 Jun 2026.
# SECONDARY: Apple Health CSV (Renpho smart scale -> Apple Health) for weight + body
#   fat, which the Forerunner does not capture. Re-export via refresh-health-data.sh.

BASE="/Users/harrison/HWL META"
CUR="$BASE/health/current.json"
DIR="/Users/harrison/HealthExport"

echo "== Garmin (Forerunner 265, daily pull) =="
if [ -f "$CUR" ]; then
  python3 - "$CUR" <<'PY'
import json, sys, datetime
d = json.load(open(sys.argv[1]))
today = datetime.date.today()
date = d.get("date", "?")

def age_of(iso):
    try:
        return (today - datetime.date.fromisoformat(iso)).days
    except Exception:
        return None

def g(k, suf=""):
    v = d.get(k)
    return (str(v) + suf) if v not in (None, "") else "—"

def dated(label, value, datekey):
    dt = d.get(datekey)
    flag = ""
    if dt == "weekly":
        flag = "   [weekly avg, NOT last night]"
    else:
        a = age_of(dt)
        if a is not None and a >= 1:
            flag = f"   [from {dt}, {a}d old, watch not synced]"
    return f"{label}{value}{flag}"

print(f"Date:       {date}  (pulled {str(d.get('pulled_at',''))[:16]})")
print(f"Resting HR: {g('resting_hr')} bpm")
print(dated("HRV:        ", f"{g('hrv_avg_last_night')} ms ({g('hrv_status')})", "hrv_date"))
print(dated("Sleep:      ", f"{g('sleep_hours','h')} (score {g('sleep_score')})", "sleep_date"))
print(f"Readiness:  {g('training_readiness')} ({g('training_readiness_level')})")
print(f"Body batt:  {g('body_battery_low')}-{g('body_battery_high')}")
print(f"Stress avg: {g('stress_avg')}")
print(f"Steps:      {g('steps')}")

# All of today's core vitals empty => the watch never synced to Garmin Connect.
sleep_age = age_of(d.get("sleep_date") or "") or 0
if d.get("resting_hr") in (None, "") and d.get("steps") in (None, "") and sleep_age >= 1:
    print("!! Today's vitals are empty in Garmin Connect. The numbers above are carried")
    print("   forward from an earlier night. Force a watch sync (open Garmin Connect on")
    print("   your phone), then re-run: .venv-health/bin/python agents/health-sync.py")
PY
else
  echo "current.json MISSING — health-sync has not run."
  echo "Run: .venv-health/bin/python agents/health-sync.py"
fi

echo
echo "== Body composition (Renpho -> Apple Health CSV) =="

latest() {
  local f
  f=$(ls "$DIR"/$1 2>/dev/null | head -1)
  [ -z "$f" ] && { echo "MISSING"; return; }
  tail -n +2 "$f" | tr -d '\r' | awk -F',' 'NF>=6 && $5!="" {print $3"|"$5"|"$6}' | sort -r | head -1
}
field() { echo "$1" | cut -d'|' -f"$2"; }

w=$(latest "*BodyMass.csv")
if [ "$w" != "MISSING" ]; then
  val=$(field "$w" 2); unit=$(field "$w" 3); d=$(field "$w" 1 | cut -c1-10)
  if [ "$unit" = "lb" ]; then
    kg=$(awk "BEGIN{printf \"%.1f\", $val/2.20462}")
    echo "Weight:    ${kg} kg (${val} lb)   as of ${d}"
  else
    echo "Weight:    ${val} ${unit}   as of ${d}"
  fi
else echo "Weight:    MISSING (weigh on the Renpho + sync Apple Health)"; fi

bf=$(latest "*BodyFatPercentage.csv")
[ "$bf" != "MISSING" ] && echo "Body fat:  $(field "$bf" 2) (raw)   as of $(field "$bf" 1 | cut -c1-10)" || echo "Body fat:  MISSING"

newest=$(latest "*BodyMass.csv" | cut -c1-10)
[ -n "$newest" ] && echo "(Weight dated ${newest}. Vitals/sleep/readiness now come from Garmin above, live daily.)"
