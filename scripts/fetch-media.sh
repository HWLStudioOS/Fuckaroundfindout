#!/bin/bash
# Restore media that lives outside Git.
#
# Restructure Phase 1 moved client production media out of the repository and
# onto an external store. The bytes are gone from Git; the manifest is not.
# This script puts requested files back into the working tree on demand.
#
#   scripts/fetch-media.sh                 restore everything in the manifest
#   scripts/fetch-media.sh jennifer        restore paths matching "jennifer"
#   scripts/fetch-media.sh --check         verify the store without writing
#   scripts/fetch-media.sh --list          show what the manifest knows about
#
# Restored files are gitignored, so fetching media can never re-commit it.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$REPO_ROOT/business/clients/baw/production/MEDIA-MANIFEST.json"
cd "$REPO_ROOT" || exit 1

[[ -f "$MANIFEST" ]] || { echo "No manifest at $MANIFEST" >&2; exit 1; }

MODE="fetch"; FILTER=""
case "${1:-}" in
  --check) MODE="check" ;;
  --list)  MODE="list" ;;
  -h|--help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  "") ;;
  *) FILTER="$1" ;;
esac

python3 - "$MANIFEST" "$MODE" "$FILTER" <<'PY'
import hashlib, json, os, shutil, sys

manifest_path, mode, filt = sys.argv[1], sys.argv[2], sys.argv[3]
m = json.load(open(manifest_path))
store = m["store"]
files = [f for f in m["files"] if not filt or filt.lower() in f["repo_path"].lower()]

if not files:
    print(f"  nothing in the manifest matches {filt!r}")
    sys.exit(1)

if mode == "list":
    for f in files:
        print(f"  {f['bytes']/1e6:9.1f} MB  {f['repo_path']}")
    print(f"\n  {len(files)} files, {sum(f['bytes'] for f in files)/1e9:.2f} GB")
    sys.exit(0)

if not os.path.isdir(store["root"]):
    print(f"  Store not mounted. Expected {store['root']}")
    print(f"  Connect the {store['label']} drive and retry.")
    sys.exit(2)

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

ok = missing = corrupt = restored = 0
for f in files:
    src, dst = f["store_path"], f["repo_path"]
    name = os.path.basename(dst)
    if not os.path.exists(src):
        print(f"  MISSING FROM STORE  {name}")
        missing += 1
        continue
    if sha256(src) != f["sha256"]:
        print(f"  CHECKSUM MISMATCH   {name}  (store copy differs from manifest)")
        corrupt += 1
        continue
    ok += 1
    if mode == "check":
        continue
    if os.path.exists(dst) and os.path.getsize(dst) == f["bytes"] and sha256(dst) == f["sha256"]:
        continue
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    restored += 1
    print(f"  restored  {f['bytes']/1e6:8.1f} MB  {name}")

verb = "verified" if mode == "check" else "usable"
print(f"\n  {ok}/{len(files)} {verb}" + (f", {restored} restored" if mode == "fetch" else ""))
if missing or corrupt:
    print(f"  PROBLEMS: {missing} missing from store, {corrupt} checksum mismatch")
    sys.exit(3)
PY
