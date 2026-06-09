#!/usr/bin/env python3
"""One-time Garmin credential setup. Run once:
    .venv-health/bin/python agents/_setup-garmin.py
Type your Garmin email, then your password (hidden). Writes the gitignored
.config/garmin.config.json with 600 perms. Safe to delete this file after.
"""
import json, getpass, os

BASE = "/Users/harrison/HWL META"
os.makedirs(BASE + "/.config", exist_ok=True)

print("Garmin Connect login (stored locally, gitignored, never shown to anyone):")
email = input("  Garmin email: ").strip()
password = getpass.getpass("  Garmin password (typing is hidden): ")

if not email or "@" not in email or not password:
    print("\nSomething was empty. Nothing saved. Run it again.")
    raise SystemExit(1)

path = BASE + "/.config/garmin.config.json"
with open(path, "w") as f:
    f.write(json.dumps({"email": email, "password": password}))
os.chmod(path, 0o600)
print(f"\nSaved for {email}. You can tell Claude it's done.")
