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
date = d.get("date", "?")
def g(k, suf=""):
    v = d.get(k)
    return (str(v) + suf) if v not in (None, "") else "—"
try:
    age = (datetime.date.today() - datetime.date.fromisoformat(date)).days
    stale = f"   [STALE {age}d — health-sync may have failed]" if age > 2 else ""
except Exception:
    stale = ""
print(f"Date:       {date}{stale}")
print(f"Resting HR: {g('resting_hr')} bpm")
print(f"HRV:        {g('hrv_avg_last_night')} ms ({g('hrv_status')})")
print(f"Sleep:      {g('sleep_hours','h')} (score {g('sleep_score')})")
print(f"Readiness:  {g('training_readiness')} ({g('training_readiness_level')})")
print(f"Body batt:  {g('body_battery_low')}-{g('body_battery_high')}")
print(f"Stress avg: {g('stress_avg')}")
print(f"Steps:      {g('steps')}")
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
