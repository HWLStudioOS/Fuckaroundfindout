#!/usr/bin/env bash
# One-shot end-to-end wiring. Run this after pasting LINEAR_API_KEY into linear/.env.
# bootstrap → import → install launchd → first sync → tail.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

if [ ! -f .env ]; then
  echo "ERROR: linear/.env missing." >&2
  echo "Create it first:  echo 'LINEAR_API_KEY=lin_api_...' > linear/.env" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "${LINEAR_API_KEY:-}" ]; then
  echo "ERROR: LINEAR_API_KEY not set in linear/.env" >&2
  exit 1
fi

NODE_BIN="${NODE_BIN:-$(command -v node)}"
echo "==> bootstrap (teams + projects + labels)"
"$NODE_BIN" bootstrap.js

echo
echo "==> import (today.md + this-week.md + campaigns + clients → Linear)"
"$NODE_BIN" import.js

echo
echo "==> install launchd hourly cron"
bash install.sh

echo
echo "==> kick first sync"
launchctl kickstart -k "gui/$(id -u)/com.hwl.linear-sync"

sleep 2
echo
echo "==> recent stdout:"
tail -n 30 "$HERE/_stdout.log" 2>/dev/null || true
echo
echo "==> recent stderr:"
tail -n 30 "$HERE/_stderr.log" 2>/dev/null || true

echo
echo "Live. Phone app → Linear → workspace 'Harrison OS'."
