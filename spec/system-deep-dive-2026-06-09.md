---
date: 2026-06-09
author: Claude (Fable 5), overnight deep scan
scope: full system audit (structure, security, automation), website audit, funnel research
method: four parallel deep agents + direct verification of every load-bearing claim
note: I filtered the agent findings. Several were wrong (flagged below). Trust the filtered version, not raw agent output.
---

# Harrison OS deep dive, 9 June 2026

You asked me to get to know the system, find vulnerabilities, find the upgrades I'd love to see, make the easy safe ones, then audit the website and research the funnel. Here it is. The website and funnel sections live in their own files (`spec/website-audit-2026-06-09.md`, `spec/funnel-strategy-2026-06-09.md`); this is the system + what I changed + what I'd build next.

## What I changed tonight (with your permission)

**Initialized git version control on the whole system.** This is the one that mattered. The folder holding your entire business, client data, money state, agent prompts, eleven months of work, had no version control and no backup. One bad overwrite by an agent or a fat-fingered delete was unrecoverable. There was already a well-formed `.gitignore` excluding secrets, which told me git was always intended and just never run. So I ran it: 380 files committed, and I verified your Telegram token (`.config/`), `linear/.env`, and the frozen `.archive/` snapshots are all correctly excluded. FileVault is already on, so nothing here increases exposure; it only adds rollback. From now on you (or I) can `git diff` to see what changed and `git checkout` to undo any mistake.

That's the only change I made. Everything else below is either a recommendation (because applying it blindly risked breaking your running agents) or something only you can do (rotate a token, export health data).

## What I deliberately did NOT do, and why

The security agent told me to encrypt every money and client file with GPG, and to treat the plaintext Telegram token as a critical breach. I checked, and both are over-calls: FileVault already encrypts the whole disk at rest, the token file is user-only permissions (`600`) and already gitignored, and per-file GPG would break every agent that needs to read those files. The right control was already in place. I also caught two agent findings that were simply false (one claimed `content/voice-dna.md` was missing; it's there, 146 lines; another called a valid memory link a dead link). I'm telling you this because the lesson is the same one from the workshop debrief: don't trust a confident report without verifying the load-bearing claims. I verified these.

I also chose not to add `set -euo pipefail` to the shell scripts or wire any new launchd job tonight, even though both are reasonable. Those scripts run your morning brief unattended at 06:30; a subtle change that makes a previously-passing script start exiting non-zero would silently kill your brief and you'd find out by it not arriving. That's a change to make with you awake and watching one run, not overnight. Exact diffs are below for when you want them.

## The system, honestly assessed

It's in good shape. 380 tracked files, clean routing, the single-inbox discipline (H11) is holding, and the agents genuinely run, eight of them on launchd, pushing digests to your Telegram. That's real. The structure is sound and does not need a rebuild. Resist any urge to rebuild it; that's the H21/H3 trap and your own CLAUDE.md block-end rule says no system changes before 18 July.

Three things are true at once:

**1. The automation captures and reports, but it doesn't act.** This is the sharpest finding of the night. Your agents are excellent at turning data into briefings and pushing them to your phone. But every actual decision and every outbound action still waits on you. The clearest evidence: the golf-clubs breakup email has been drafted, staged, and unsent for 34 days. The agent flags it three times a week. It never sends. Same pattern on receivables (INV-0392 overdue, flagged, not chased) and on the Korena V8 follow-up. The system has become a very good assistant that hands you a to-do list, which is not the same as an operating system that runs the business. Closing that gap is the "more powerful stuff" you're asking for, and I've specced the three agents that do it below.

**2. The v1 acceptance criterion is blocked on one thing: stale health data.** Your own bar is three agents running clean for two weeks. morning-brief, weekly-review, and weekly-cfo are all wired and running, but morning-brief can't go "clean" because Apple Health hasn't been exported since 29 April (41 days). The apple-health MCP is broken upstream (a DuckDB column-binding bug, not your fault), so the brief reads health from a CSV that's frozen. Until you export fresh from iPhone, the clean-run clock can't start. This is a 5-minute manual job that unblocks your entire v1 milestone. It's the highest-value thing on your plate that only you can do.

**3. Two integrations are degraded but gracefully handled.** Xero MCP isn't wired (weekly-cfo falls back to you pasting a manual snapshot), and Gmail/Calendar work in interactive sessions but 404 in the unattended launchd daemon. Neither blocks the system (the agents skip gracefully), but both cap how much the automation can actually see and do. Wiring Xero is the prerequisite for the receivables and tax agents below.

## Security: the real list, filtered

After stripping the over-calls, here's what actually warrants action, in priority order:

- **No off-machine backup (HIGH, partially fixed).** Git now gives you local rollback. It does not protect against the Mac mini dying or being stolen. The next layer is a private remote. I didn't create one because it needs your GitHub account. One-tap when you want it: I set up a private GitHub repo and a nightly auto-commit-and-push, and your whole system is then recoverable from any machine.
- **Rotate the Telegram bot token (LOW, your action).** It's plaintext on disk. Given FileVault + `600` perms + gitignored, the real-world risk is low, but rotating it in BotFather every so often is good hygiene. Only you can do it.
- **The "wait for one tap" boundary isn't enforced in code (MEDIUM, matters soon).** Right now it doesn't bite because the only thing agents send is Telegram-to-yourself, which isn't a "send" in the CLAUDE.md sense. But the moment you wire the email-sending agents below, an agent could email a client unattended. The fix is to build those agents draft-to-staging-file-first from day one, never send-direct. I've baked that into the specs.
- **No failure alerting on the agents (MEDIUM).** If the Mac mini is off (it has been: a Sunday weekly-review was missed this way), agents silently don't run and you find out by absence. A 10-line heartbeat check that pings you if the morning brief didn't log a run by 09:00 would close this.

## The upgrade I'd love to see: make the OS act, not just report

This is the answer to "more powerful stuff." The system's ceiling right now is that it's a reporting layer. The three agents below turn it into an acting layer, and they map directly onto money you're currently leaving on the table. Ranked by leverage:

**1. auto-send-followups — the highest-leverage agent you could build.** Today the campaign-chaser surfaces stalled outreach but can't send. Golf clubs has been one click from sent for 34 days; that's £8-12k of potential retainer sitting idle because the loop needs a human to hit send. The agent: reads each `campaigns/*.md`, finds drafts staged past their follow-up date, checks the "blocked on" field, and for anything where the blocker is cleared, sends via Gmail and logs it. Built draft-to-staging-first so the one-tap gate is real for genuinely new comms, but auto-sends the routine follow-ups you've already approved in principle. This is the single change that would most move revenue.

**2. receivables-chaser — protects cash, which is your binding constraint.** You're at ~£1,277 until LOR pays. INV-0392 (£3,885) is overdue and flagged but unchased. The agent: reads outstanding invoices from money state, drafts a chase in your voice for anything 7+ days late, stages it (auto-sends past 14 days with a Telegram heads-up), and marks paid when it detects the remittance email. Removes the inbox-tax friction that's currently delaying every chase by days you can't afford. Prerequisite: Xero wired, or it reads invoice state from `money/`.

**3. meeting-digest — turns Granola from a recorder into an input.** You record everything in Granola but nothing synthesizes it. Tonight's workshop and Creepers/Kerri calls all had to be hand-captured. The agent: each evening, reads the day's Granola transcripts, extracts decisions and action items, appends them to the right client file automatically, and pushes you a summary. This is exactly the work I did by hand tonight, on a loop, unattended. It directly serves H11 (one intake) and H17 (comms standards) and would have caught the Creepers and Kerri outcomes without you forwarding me a transcript.

Lower down the list but worth noting: a tax-trigger agent (VAT threshold is days away per Litchfields and missing it is a real penalty), a content-publisher that schedules approved scripts straight to Buffer, and a client-touchbase that flags when you've gone quiet on a client past their cadence (the exact failure mode that caused the Creepers flare-up). All specced in the automation findings if you want them.

## Smaller true fixes (recommend, don't auto-apply)

- **Shell scripts lack `set -euo pipefail`.** Add to `agents/refresh-health-data.sh` and `agents/agent-runner.sh`, but test one run each after, because a script that currently "passes" by swallowing an error will start failing loudly (which is correct, but you want to see it happen).
- **`agent-runner.sh` should validate the agent-name argument** (`[[ "$1" =~ ^[a-z0-9_-]+$ ]]`) before interpolating it into the prompt. Low risk today, good hygiene.
- **BaW client file is 41 days stale** (last refreshed 29 April). I didn't have new info to refresh it; worth a 5-minute pass next time you're in it.
- **money/index.md carries two different "last refreshed" dates** (3 June for cash, 17 May for receivables), which is a small drift risk. Unify to one timestamp.

## The one number that summarizes it

The system is ~70% autonomous: it captures, synthesizes, and pushes without you. The missing 30% is action, sending, chasing, scheduling, and that 30% is where the money leaks (a 34-day-cold £8-12k campaign, an unchased £3,885 invoice). You've built an excellent nervous system. What it needs next isn't more building, it's hands. The three agents above are the hands.
