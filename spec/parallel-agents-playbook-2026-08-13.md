# Parallel Agents Playbook, 13 August 2026

Source-verified read of Boris Cherny's workflow (Claude Code's creator) and the adoption plan for HWL META. Research run 13 August 2026 by three parallel agents: source hunt, current feature map, local inventory.

## What Boris actually does, verified

The video Harrison watched is almost certainly the Sequoia Capital interview, 4 May 2026: "Anthropic's Boris Cherny: Why Coding Is Solved, and What Comes Next" (youtube.com/watch?v=SlGRN8jh2RI). The verified quote: "usually every night I have like a few thousand that are doing deeper work." Daytime he runs 5 to 10 sessions, each holding a tree of agents, a few hundred live at once. Some days, per Fortune (June 2026), tens of thousands.

On loops: he runs dozens of /loop jobs at all times. A PR babysitter that fixes CI and rebases. A CI-health loop that fixes flaky tests. A Twitter-feedback clusterer every 30 minutes. By June 2026 (Acquired Unplugged, WorkOS) he says he no longer prompts Claude at all: loops prompt Claude, and his job is writing the loops.

Other canonical sources, all consistent:

- 2 Jan 2026 X thread, 13 tips (8.1M views). Mirror: twitter-thread.com/t/2007179832300581177
- Team-tips thread, 31 Jan 2026. Mirror: threadreaderapp.com/thread/2017742743125299476.html
- Aggregator of all 22 threads: howborisusesclaudecode.com
- Living best-practices doc: code.claude.com/docs/en/best-practices
- Pragmatic Engineer interview, 4 Mar 2026 (the 5-terminal-tab walkthrough)
- Anniversary video with Cat Wu, 8 Jun 2026 (verification philosophy, agent trees)

## His system in six layers

1. **Parallel sessions.** 5 local sessions in named terminal tabs, each in its own checkout. Overflow to the desktop app, then 5 to 10 cloud sessions at claude.ai/code. Phone-first since early 2026: fires agents every morning and before bed from the Claude iOS app code tab.
2. **Sub-agents inside sessions.** Fan-out for parallel compute plus context protection. Custom definitions in .claude/agents (his: code-simplifier, verify-app, build-validator). Calibrates count to difficulty: 3, 5, or 10.
3. **Loops.** Dozens of /loop jobs babysitting states that change. The simplest thing that works.
4. **Routines.** Server-side loops that survive laptop close. His team's routines listen for tickets and bug reports and draft fixes.
5. **Verification.** His single most important tip: give the agent a way to run the thing it built. Browser, simulator, computer use. Worth 2 to 3x on final quality. Not just unit tests.
6. **Compounding memory plus auto mode.** Every mistake becomes a CLAUDE.md rule or a skill. Auto mode with a shared permission allowlist is what makes fleets possible at all.

The endgame is H21 stated back at us: manual prompting kills the OS, so the OS must prompt itself.

## Where HWL META already matches

| Boris layer | HWL equivalent | State |
|---|---|---|
| Routines | 17 launchd jobs, all healthy 13 Aug | Live since May |
| Verification | Morning brief maker/checker, board-room build gate | Live |
| Phone surface | Telegram agent (Opus 4.8, restricted mode) | Live |
| Compounding memory | CLAUDE.md, auto-memory, 18 commands/skills | Live |
| Safety substrate | Jarvis ledger, auth preflights, deny profiles | Ahead of Boris |

The scheduled half of his model already exists here. What is missing is the interactive half.

## The gap

1. No sub-agent definitions. .claude/agents did not exist before today.
2. /loop never used. The 28 Jun learning brief recommended exactly this and it never landed. H21 in action.
3. Parallel sessions happen by accident (three were live this afternoon) with no lane discipline.
4. Interactive permission allowlist is empty, so parallel sessions stall on prompts. Note: SYSTEM-STATUS records the empty allowlist as a deliberate safety property, so filling it is a Harrison decision, not an agent decision.
5. Worktree cost. Background-session isolation defaults to worktrees, and each worktree of this repo materialises 2 to 4 GB of LFS podcast masters. Fleets here must mostly run without worktrees or in the cloud.
6. OAuth single point of failure. One shared CLI session feeds every daemon. It expired twice in early August and took the whole fleet down both times. Undiagnosed. Scaling the fleet raises the blast radius.
7. Telegram agent still pinned to claude-opus-4-8. Opus 5 ships at the same price.

## Adoption plan

### Phase 0, shipped 13 August (files only, all dormant until used)

- `.claude/agents/qc-verifier.md`. Outbound content gate against publishing rules, voice DNA, client tone.
- `.claude/agents/client-researcher.md`. Pre-call and pre-proposal research, fans out per stakeholder.
- `.claude/agents/repo-scout.md`. Fast internal recall over the repo without loading files into the main conversation.
- `.claude/commands/night-shift.md`. Evening fan-out: reads open loops, spawns up to 5 background research/draft jobs, results land before the 06:30 brief. No sends, no schedule changes.
- `.claude/loop.md`. Default /loop prompt: quiet babysitter over publish checklists, renders, inbox, agent log. Only activates if Harrison types /loop.

### Phase 1, each needs one tap from Harrison

1. Populate the interactive allowlist with read-only commands via the /fewer-permission-prompts skill. This is the single biggest friction remover for parallel sessions. It amends a documented safety posture, so it waits for the tap.
2. Adopt three standing session lanes: Production, Clients, System. Name them, keep them open, queue work into them instead of one mega-chat.
3. First real /loop, from a terminal session on the next publish day: watch checklist state and render outputs, surface anything stuck. CLI only; the desktop app equivalent is Scheduled Tasks in the app UI.
4. Repin the Telegram agent to claude-opus-5 (one line in agents/telegram-agent.py, then restart the daemon). Same price, better model.
5. Run /night-shift once, watched, on a quiet evening. Judge output quality in the morning. Same acceptance logic as followup-drafter: no unattended promotion until a watched run passes.

### Phase 2, after Phase 1 sticks and the OAuth SPOF is diagnosed

- One cloud Routine (claude.ai/code) for overnight research sweeps: content inspiration clustering, prospect monitoring. Cloud routines never touch the Mac mini, so no launchd collision, but record any new standing job in SYSTEM-STATUS.
- Workflow orchestration (ultracode) for genuine fan-out jobs: quarterly content audits across all clients, repo-wide consistency sweeps.
- Remote Control or the Claude iOS app code tab as the phone surface for firing morning/evening agents, alongside Telegram capture.
- Not adopting now: agent teams (experimental, terminal-only, roughly 7x token cost), any always-on autonomous third-party framework (openclaw/Hermes rule stands).

## Token economics on the current plan

- Sub-agents inherit the session model. Pin volume work to Sonnet, keep Fable/Opus for judgment calls. Daemons already run Sonnet 5.
- Prompt cache: repeated prefixes within the TTL cost roughly a tenth of fresh input. Loops with a stable prompt are cheap. Loops that rewrite their prompt every tick are not.
- An overnight fleet spends the same budget as daytime work. Start at 3 to 5 background jobs a night, check /usage after a week, scale only on evidence.
- /usage shows session and plan state. /insights reports across recent sessions. Worth a fortnightly look.

## Guardrails, unchanged

- Launchd stays the only production scheduler for existing workflows. Nothing in this playbook duplicates a launchd job.
- No schedule, permission, or runtime change without a tap and a SYSTEM-STATUS note.
- Worktrees removed as soon as branches merge. Prefer no-worktree sub-agents or cloud sessions for parallel work in this repo. Met on 13 August: restructure Phase 1 landed, LFS is gone, and worktrees are now cheap, a normal tool for code jobs. State-file jobs stay out of worktrees regardless, one writer per live file. Fetch discipline while pre-rewrite history remains on GitHub dependabot branches: `git fetch origin main`, never a bare fetch, which drags old media packs back into `.git`.
- Sends, money, client-facing comms: one tap, always.
- Before scaling the fleet: revoke the old Kraken and Telegram credentials (SYSTEM-STATUS item 1) and diagnose the OAuth expiry pattern.

## Flagged during inventory, for Codex or Full Boot Up

- Repo plist copies of weekly-cfo and weekly-review have drifted from the installed versions and would break if reinstalled.
- linear-sync's last hourly run exited 1. SYSTEM-STATUS item 3 still watching.
- pm2.harrison.plist in ~/Library/LaunchAgents looks orphaned since the pm2 bridge retired 1 Jul.
- Two processes poll the same Telegram bot token with separate offsets. Fine today, but confirm before adding any third consumer.
