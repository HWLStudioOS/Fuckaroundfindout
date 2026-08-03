#!/bin/bash
# refresh-health-data.sh
# Run this when you have a fresh Apple Health export at
# /Users/harrison/Downloads/apple_health_export/export.xml
# It re-runs the XML→CSV conversion that feeds the apple-health MCP.

set -e

SRC="/Users/harrison/Downloads/apple_health_export/export.xml"
OUT="/Users/harrison/HealthExport"

if [ ! -f "$SRC" ]; then
  echo "Source not found: $SRC"
  echo "Export from iPhone Settings → Health → Export All Data, AirDrop to Mac, unzip to Downloads/"
  exit 1
fi

mkdir -p "$OUT"

python3 <<'PY'
import xml.etree.ElementTree as ET
import csv
from pathlib import Path
from collections import defaultdict
import sys

SRC = "/Users/harrison/Downloads/apple_health_export/export.xml"
OUT = Path.home() / "HealthExport"
OUT.mkdir(exist_ok=True)

writers = {}
files = {}
counts = defaultdict(int)

def get_writer(rtype):
    if rtype not in writers:
        fname = rtype.replace("/", "_") + ".csv"
        fp = OUT / fname
        f = open(fp, "w", newline="", encoding="utf-8")
        w = csv.writer(f)
        w.writerow(["type", "sourceName", "startDate", "endDate", "value", "unit"])
        writers[rtype] = w
        files[rtype] = f
    return writers[rtype]

print(f"Streaming {SRC}...", file=sys.stderr)
try:
    for _, elem in ET.iterparse(SRC, events=("end",)):
        if elem.tag == "Record":
            rtype = elem.get("type", "")
            if not rtype:
                elem.clear(); continue
            get_writer(rtype).writerow([
                rtype, elem.get("sourceName", ""),
                elem.get("startDate", ""), elem.get("endDate", ""),
                elem.get("value", ""), elem.get("unit", "")
            ])
            counts[rtype] += 1
            elem.clear()
        elif elem.tag == "Workout":
            rtype = "HKWorkoutActivityType_" + elem.get("workoutActivityType", "Unknown").replace("HKWorkoutActivityType", "")
            get_writer(rtype).writerow([
                rtype, elem.get("sourceName", ""),
                elem.get("startDate", ""), elem.get("endDate", ""),
                elem.get("duration", ""), elem.get("durationUnit", "min")
            ])
            counts[rtype] += 1
            elem.clear()
finally:
    for f in files.values():
        f.close()

print(f"Wrote {len(counts)} CSV files. Top 10 by record count:", file=sys.stderr)
for k in sorted(counts.keys(), key=lambda x: -counts[x])[:10]:
    print(f"  {counts[k]:>10,}  {k}", file=sys.stderr)
PY

echo ""
echo "Done. CSVs at $OUT"
find "$OUT" -maxdepth 1 -mindepth 1 -print | sed -n '1,10p'
