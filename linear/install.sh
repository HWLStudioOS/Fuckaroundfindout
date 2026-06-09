#!/usr/bin/env bash
# Wires the hourly launchd job.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PLIST_SRC="$HERE/launchd/com.hwl.linear-sync.plist"
PLIST_DST="$HOME/Library/LaunchAgents/com.hwl.linear-sync.plist"

mkdir -p "$HOME/Library/LaunchAgents"
cp "$PLIST_SRC" "$PLIST_DST"

# Unload first in case it's already loaded
launchctl bootout "gui/$(id -u)/com.hwl.linear-sync" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST_DST"
launchctl enable "gui/$(id -u)/com.hwl.linear-sync"
echo "Loaded com.hwl.linear-sync. Runs every 3600s."
echo "Next run via: launchctl kickstart -k gui/$(id -u)/com.hwl.linear-sync"
echo "stdout: $HERE/_stdout.log  stderr: $HERE/_stderr.log"
