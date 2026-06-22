# Running HWL META on the MacBook

The Mac mini is the host. It is always on and runs every scheduled agent (morning-brief, weekly-review, weekly-cfo, content-engine, health-sync, nightly-backup). The MacBook is a working copy for editing the OS on the move. It does not run agents.

This file is the laptop setup. Mac mini install lives in `agents/launchd/INSTALL.md`.

## 1. Authenticate git (one time)

Easiest path:

```bash
gh auth login
```

Pick **GitHub.com** -> **HTTPS** -> **Login with a web browser**. The terminal prints a one-time code (the code is shown to you, it is not emailed). Copy it, the browser opens `github.com/login/device`, paste it, click Authorize.

Then clone (or you already have it):

```bash
gh repo clone HWLStudioOS/Fuckaroundfindout "HWL META"
```

If you prefer SSH, the remote is `git@github.com:HWLStudioOS/Fuckaroundfindout.git` and you will need an SSH key registered on this machine.

## 2. Daily workflow

The Mac mini commits and pushes every night at 22:30. To avoid clashes, on the laptop:

```bash
git pull origin main      # before you start
# ...edit...
git add -A && git commit -m "..." && git push origin main   # when you finish
```

Pull first, push when done. If you leave changes uncommitted on the laptop and the mini also changes the same files, you get a merge to sort out. Pushing before you close the lid keeps both machines clean.

## 3. Do NOT load the agent plists here

`agents/launchd/*.plist` are tracked in the repo for reference and for installing on the mini. Do not `launchctl load` them on the MacBook. They assume the mini's paths, the Telegram config, and the health venv, none of which are on the laptop. Running them here would double-fire the agents or fail noisily. Read `agents/*.md` freely, just do not schedule them.

## 4. What `codex/` is

`codex/` is a read-only snapshot of the canonical codex source, copied from the mini's live folder `~/hwlstudio-codex/harrison-os/`. It holds the 11-round interview log (`04-interview-log.md`), the numbered canonical files, and the daily captures. Secrets and the finance inbox are deliberately excluded.

The live capture surface stays on the mini. Treat `codex/` here as reference, not as the place new codex sessions write. To refresh the snapshot from the mini later:

```bash
rsync -a --delete \
  --exclude='.DS_Store' --exclude='finance-inbox' --exclude='.secrets' \
  --exclude='*.env' --exclude='token*.json' --exclude='credential*.json' \
  ~/hwlstudio-codex/harrison-os "HWL META/codex/"
```

Snapshot taken 2026-06-22.

## 5. What is not in the repo (by design)

`.config/` (Telegram token), `.secrets/`, `.venv-health/`, and OS junk are gitignored. The laptop does not need them because it does not run agents. If you ever do want to run an agent from the laptop, copy those across by hand, do not commit them.
