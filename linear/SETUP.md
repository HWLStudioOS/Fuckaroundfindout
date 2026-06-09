# Linear setup, 30 seconds

This is the mobile-access layer over HWL META. Markdown stays source of truth. Linear is the phone/iPad UI when you're not at the mini.

## The one human step (only thing you have to do)

### 1. Make sure the workspace exists

Sign in to **https://linear.app** with `harrison@hwlstudio.com`. Workspace already provisioned is fine. The bootstrap creates the 6 teams (Campaigns, Clients, Agents, Learning, Money, Life) inside whichever workspace your key belongs to. Workspace name itself doesn't matter to the script.

### 2. Generate a personal API key

In Linear:

- Click your avatar (top left) → Settings → under **Preferences** group → **Security & access**
- Scroll to **Personal API keys** → New key
- Label: `hwl-sync`
- Copy the key (`lin_api_...`). It's shown once.

(The workspace-level API page also lists API keys but personal keys are created from Security & access.)

### 3. Paste it and run one command

```bash
cd "/Users/harrison/HWL META/linear"
echo 'LINEAR_API_KEY=lin_api_...PASTE_HERE...' > .env
bash wire.sh
```

`wire.sh` runs bootstrap (teams + projects + labels), import (today.md + this-week.md + every campaign + every client → Linear issues with due dates), installs the hourly launchd cron, and kicks the first sync. Logs print at the end so you see what landed.

Open Linear, you'll see Campaigns / Clients / Agents / Learning / Money / Life teams populated. That's it.

## Mobile / Macbook access

- **iPhone**: install **Linear** from the App Store. Sign in with the same `harrison@hwlstudio.com`. Workspace **Harrison OS** appears.
- **Macbook**: same app from the Mac App Store, or https://linear.app/harrison-os in a browser.
- **Login**: whatever you used in step 1 (Google SSO if you went that route, email magic link otherwise). One identity, no separate password unless you set one.

## Daily flow (the design)

1. **You tick a task on your phone** (e.g. mark "Golf Day 5 follow-up" done).
2. Within an hour, `com.hwl.linear-sync` runs on the mini.
3. It detects the state change and flips the markdown checkbox in `today.md` (or wherever the task lives).
4. It appends a line to `linear/_deltas.md`.
5. Next morning, the morning-brief agent reads `linear/_deltas.md` and shows what changed overnight.

Other direction: you add a `- [ ] New task` to `today.md` on the mini, the next sync pushes it to Linear as a new issue.

## What's synced

- **Push (markdown → Linear)**: every `- [ ]` checkbox in `today.md`, `this-week.md`, `campaigns/*.md`, `business/clients/*.md`. New items get created. Items you tick locally flip the issue state in Linear.
- **Pull (Linear → markdown)**: state changes on issues we created (started → completed, completed → unstarted, canceled). Title edits in Linear are not pulled back (markdown stays the title source of truth).
- **Not synced**: free-form prose, frontmatter, headings, tables. Linear holds issues only.

## When it breaks

- The script is dumb and recoverable. State is in `linear/.state.json`.
- If `.state.json` is deleted, re-run `node bootstrap.js && node import.js`. Already-linked tasks have `<!-- linear:CLI-7 -->` markers in the markdown and won't be re-created.
- If Linear is down, `sync.js` exits non-zero, launchd retries on the next hour. Markdown is untouched.
- Manual run anytime: `bash sync.sh` or `node sync.js`.
- Dry run: `DRY_RUN=1 node sync.js` — prints what it would do, writes nothing.

## Acceptance test

1. Open Linear on your phone.
2. Pick any task from today's list, tick it.
3. From the mini: `launchctl kickstart -k gui/$(id -u)/com.hwl.linear-sync`.
4. `cat "today.md"` — that task is now `- [x]` and the next morning-brief will surface it in the "Linear deltas" section.

If step 4 holds, MVP ships.
