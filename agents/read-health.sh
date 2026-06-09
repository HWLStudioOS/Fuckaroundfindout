#!/bin/bash
# read-health.sh — direct CSV read of latest health metrics.
# The apple-health MCP (neiltron/apple-health) DuckDB loader is broken:
# 0 of 91 tables load with a "value column binding" error, so the morning
# brief never gets health data through it. The CSVs themselves are clean,
# so we read them directly here. Data currency = the dates printed below.
# Regenerate CSVs from a fresh iPhone export with refresh-health-data.sh.

DIR="/Users/harrison/HealthExport"

# latest <glob> -> prints "startDate|value|unit" for the most recent record
latest() {
  local f
  f=$(ls "$DIR"/$1 2>/dev/null | head -1)
  [ -z "$f" ] && { echo "MISSING"; return; }
  tail -n +2 "$f" | tr -d '\r' | awk -F',' 'NF>=6 && $5!="" {print $3"|"$5"|"$6}' | sort -r | head -1
}

field() { echo "$1" | cut -d'|' -f"$2"; }

echo "== Apple Health (direct CSV read; MCP loader is broken) =="

w=$(latest "*BodyMass.csv")
if [ "$w" != "MISSING" ]; then
  val=$(field "$w" 2); unit=$(field "$w" 3); d=$(field "$w" 1 | cut -c1-10)
  if [ "$unit" = "lb" ]; then
    kg=$(awk "BEGIN{printf \"%.1f\", $val/2.20462}")
    echo "Weight:    ${kg} kg (${val} lb)   as of ${d}"
  else
    echo "Weight:    ${val} ${unit}   as of ${d}"
  fi
else echo "Weight:    MISSING"; fi

bf=$(latest "*BodyFatPercentage.csv")
[ "$bf" != "MISSING" ] && echo "Body fat:  $(field "$bf" 2) (raw)   as of $(field "$bf" 1 | cut -c1-10)" || echo "Body fat:  MISSING"

rhr=$(latest "*RestingHeartRate.csv")
[ "$rhr" != "MISSING" ] && echo "RHR:       $(field "$rhr" 2) bpm   as of $(field "$rhr" 1 | cut -c1-10)" || echo "RHR:       MISSING"

hrv=$(latest "*HeartRateVariabilitySDNN.csv")
[ "$hrv" != "MISSING" ] && echo "HRV SDNN:  $(field "$hrv" 2) ms   as of $(field "$hrv" 1 | cut -c1-10)" || echo "HRV SDNN:  MISSING"

newest=$(latest "*BodyMass.csv" | cut -c1-10)
echo "(Latest reading dated ${newest}. If more than ~2 weeks old, re-export: iPhone Settings > Health > profile > Export All Data, AirDrop to Mac, unzip to Downloads, then run agents/refresh-health-data.sh.)"
