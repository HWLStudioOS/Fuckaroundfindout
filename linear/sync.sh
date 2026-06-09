#!/usr/bin/env bash
# Wrapper used by launchd. Loads .env if present, then runs sync.js.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [ -z "${LINEAR_API_KEY:-}" ]; then
  echo "[$(date -u +%FT%TZ)] ERROR LINEAR_API_KEY not set in linear/.env" >&2
  exit 1
fi

NODE_BIN="${NODE_BIN:-$(command -v node)}"
"$NODE_BIN" "$HERE/sync.js"
