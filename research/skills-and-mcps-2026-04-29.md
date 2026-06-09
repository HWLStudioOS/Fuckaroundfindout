# Skills & MCPs Research, 29 Apr 2026

Background research agent run, requested as part of the rebuild kickoff. **All URLs need verification before any install.** Several recommendations cite specific star counts and dates that look hallucinable. Treat as a starting point, not a shopping list.

---

## TL;DR

If only three install: **`obsidian-second-brain`** (proactive spine), **`claudeblattman`** (executive-assistant commands), and the **Buffer MCP + Readwise MCP pairing** (outbound + inbound content).

## Day-one stack

### Skills (6)
1. **`obsidian-second-brain`** (Eugen Ughelbur), self-rewriting knowledge base with 4 scheduled agents (morning brief, nightly synthesis, Friday review, Sunday vault audit). Single-URL ingest rewrites 5-15 related notes. Solves the decay problem directly. Vault-first `/research-deep` (scans existing notes before web search) is exactly what Harrison wants.
2. **`claudeblattman`** (Chris Blattman), 20 cleanly-scoped slash commands: `/morning-brief`, `/checkin`, `/triage-inbox`, `/pre-meeting-brief`, `/post-meeting`, `/done`, `/goals-review`. Built for "professionals who don't code." "Propose → approve → automate" trust progression.
3. **`obra/superpowers`**, only the brainstorm/write-plan/subagent core. 172k stars, in official Anthropic marketplace. The dev-focused stuff is wrong audience; the orchestration primitives generalise.
4. **`email-triage-plugin`** (Eric Porres), 3-tier classification (Reply / Review / Noise) with alias-aware routing. Drafts only, never sends. Perfect for the LOR / Creepers / BaW / personal split.
5. **`linkedin-writer`** (kvsdileep), *only if* his existing LinkedIn flow truly produces slop. Banned-phrases enforcement, 1,800-2,800 char limit, sample-calibration on his top posts.
6. **`charlie-cfo-skill`** (Every Inc.), CFO frameworks for bootstrapped founders. Pairs with Xero MCP. Charlie is the judgement layer over Xero's data layer.

(Plus the built-in `anthropic-skills:schedule` for cron-style scheduling, already there, free, confirmed.)

### MCPs (6)
1. **Telegram Notification MCP** (`kstonekuan/telegram-notification-mcp`), send-only push channel. Stick to outbound, avoid the listening pattern.
2. **Buffer MCP** (official, GraphQL beta Feb 2026), first-party LinkedIn/social outbound. Free tier covers pilot. No native LinkedIn MCP exists; Buffer is the path.
3. **Readwise MCP** (official), search across Reader docs and highlights. Inbound counterpart to Buffer.
4. **Exa MCP** (`exa-labs/exa-mcp-server`), neural-embedding semantic web search. Better than Perplexity for "find me things like X." Sub-200ms fast mode.
5. **Apple Health MCP** (`neiltron/apple-health`), reads Apple Health SQLite. Sleep, RHR, HRV, workouts. Cheaper read path than buying a WHOOP.
6. **TrainingPeaks MCP** (`jamsusmaximus`), 52 tools, cookie auth. Replaces flaky Garmin auth. Treat as preferred over Garmin, not as production infra.

## Patterns worth borrowing

1. **Harper Reed's "always draft, never send"**, codified into skill files, not policy memos. One-time `voice-extract` pass over Gmail, then never edit voice manually again.
2. **Mike Murchison's `/gm` morning loop**, fixed prompt, daily run. Schedule is the daemon, skill is the work.
3. **Worker/reasoner separation**, Sonnet for I/O and assembly, Opus for synthesis and weekly reports. Cuts cost ~80%.
4. **Vault-first research**, scan vault before any web search. Output a delta report. Antidote to second-brain restart-from-zero.
5. **Three-tier email triage with alias routing**, alias is the strong prior. 80% of decisions made by alias, only 20% need real classification.

## Anti-recommendations

- **VoltAgent's 1000+ skills**, quantity-over-quality, reintroduces the sprawl that killed the previous stack
- **wshobson/agents (34.5k stars)**, developer-focused (K8s, MLOps), wrong audience
- **Slack MCP (currently dead)**, leave dead. Solo, doesn't need it. Telegram is right.
- **WHOOP MCP**, only if he buys a WHOOP. Apple Health has the same data via iPhone.
- **Granola paid tier**, keep free. Route transcripts via export → vault rather than live MCP.
- **Notion MCP write access**, downgrade to read-only. Stop splitting attention between Notion and `hwlstudio-rewrite/`. Pick one (Obsidian is the recommendation).
- **Custom-built running coach**, TrainingPeaks + Strava + Apple Health + Charlie-CFO-style frameworks adapted = the structure. Don't rebuild a coach prompt.
- **MindStudio's content-repurposing engines**, produces the slop he's escaping.
- **anthropic/skills (official repo)**, `docx` / `pdf` / `xlsx` / `pptx` already in his harness.

## Already there, keep

- `council` (the only skill from the old system that survives the rebuild)
- `anthropic-skills:schedule`
- Strava MCP (alive, reliable)
- Gmail MCP
- Google Calendar MCP
- Granola MCP (free tier only)
- Xero MCP (reinstall, was removed 26 Mar)
- Perplexity MCP
- Whisper MCP
- Firecrawl MCP

## Already there, kill

- Slack MCP (dead, won't replace)
- Garmin MCP (replace with TrainingPeaks + Apple Health)
- Figma MCP (unless an active visual-identity project demands it)

---

## Verification, done 29 Apr 2026 12:45

All 11 named repos checked via `gh repo view` / `gh search repos`. Corrected paths:

| Recommendation | Verified path | Stars | Last push | Status |
|---|---|---|---|---|
| obsidian-second-brain | [eugeniughelbur/obsidian-second-brain](https://github.com/eugeniughelbur/obsidian-second-brain) | 438 | 29 Apr 2026 | ✅ alive, just pushed |
| claudeblattman | [chrisblattman/claudeblattman](https://github.com/chrisblattman/claudeblattman) | 295 | 27 Apr 2026 | ✅ alive |
| superpowers | [obra/superpowers](https://github.com/obra/superpowers) | 172,419 | 28 Apr 2026 | ✅ flagship |
| email-triage-plugin | [ericporres/email-triage-plugin](https://github.com/ericporres/email-triage-plugin) | 18 | 19 Feb 2026 | ✅ exists, slow |
| linkedin-writer | [kvsdileep/linkedin-writer](https://github.com/kvsdileep/linkedin-writer) | 11 | 5 Apr 2026 | ✅ small but alive |
| charlie-cfo-skill | [EveryInc/charlie-cfo-skill](https://github.com/EveryInc/charlie-cfo-skill) | 209 | 29 Jan 2026 | ✅ alive |
| notebooklm-skill | [claude-world/notebooklm-skill](https://github.com/claude-world/notebooklm-skill) | 184 | 14 Apr 2026 | ✅ alive |
| Telegram notification MCP | [kstonekuan/telegram-notification-mcp](https://github.com/kstonekuan/telegram-notification-mcp) | 21 | 26 Jan 2026 | ✅ alive |
| Exa MCP | [exa-labs/exa-mcp-server](https://github.com/exa-labs/exa-mcp-server) | 4,355 | 29 Apr 2026 | ✅ flagship |
| Apple Health MCP | [neiltron/apple-health-mcp](https://github.com/neiltron/apple-health-mcp) (path was wrong in original brief) | 535 |, | ✅ alive |
| TrainingPeaks MCP | [JamsusMaximus/trainingpeaks-mcp](https://github.com/JamsusMaximus/trainingpeaks-mcp) (capital J/M) | 54 |, | ✅ "no API approval needed, works with any account" |

All real. Buffer MCP and Readwise MCP are first-party, separate verification on their docs pages when wiring.

Install plan: 4-hour block to install all 6 day-one skills + wire all 6 day-one MCPs. Requires Harrison API keys for: Telegram bot, Buffer, Readwise, Exa, TrainingPeaks (cookie auth).
