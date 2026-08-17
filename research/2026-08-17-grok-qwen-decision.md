# Grok and Qwen: bring them into the fold?

Decision brief. 17 August 2026. Read-only research, 20-minute box.

## Verdict up front

**Grok: (b) yes, for one narrow named job, built in the pre-restart week, not today.** The job is an X reply-target scout for the X layer that switches on w/c 7 September. Grok's X Search tool is the only cheap, legitimate programmatic read of X. Nothing else in the fleet touches Grok.

**Qwen: (a) no, not now.** There is no bulk-token job in the fleet, Claude Max makes marginal tokens free, Codex and Claude already cover code, and the Mac mini disk is at 97 percent. Revisit when a named job over about a million tokens a month appears or a client demands on-prem processing.

The honest tell: "Qwen or whatever that model is" is ambient AI news, not a job. H4 says AI is the distraction as much as the opportunity. A model with no job attached is the distraction.

## What the fleet does today

- Every scheduled agent runs through `agents/agent-runtime.sh` on `claude-sonnet-5` (line 374, `HWL_CLAUDE_MODEL` override) via the Claude CLI on a Claude Max account. Telegram agent is pinned to `claude-opus-5` (`agents/telegram-agent.py` line 62). No Grok, Qwen, OpenRouter, Ollama or gateway reference exists anywhere in `agents/` or `CLAUDE.md`.
- Marginal token cost is zero. The fleet is flat-rate on Max, not per-token API. Any "cheaper model" argument has to beat free.
- Auth is one surface and it already failed three times, the 2 to 6 August outage ran four days unnoticed (SYSTEM-STATUS.md line 65 to 67). Every extra provider is a second key, a second billing account, a second thing that can 429 at 06:30.
- "Grok Bot" in SYSTEM-STATUS.md is Cursor's product, audited and narrowed 12 August. Unrelated to xAI's Grok model. Do not conflate.
- Hardware: Mac mini M4 Pro, 14 cores, 64 GB unified memory. Data volume 926 GB with 32 GB free (97 percent full as of this morning). Ollama, LM Studio and mlx_lm are not installed.
- Routing layers: `vercel:ai-gateway` skill is installed. No OpenRouter skill. Neither is needed for a single extra provider, and a gateway is a third auth surface, so call xAI direct if Grok ships.

## Grok (xAI)

**Current state, August 2026.** Grok 4.6 shipped 12 August: $2.00 in, $0.50 cached, $6.00 out per million, 500K context. Grok 4.3 and the 4.20 family are $1.25 in, $2.50 out, 1M context. Web Search, X Search and code execution are billed at $5 per 1,000 calls on top of tokens. Sources: https://docs.x.ai/docs/models and https://www.aipricing.guru/news/xai-grok-4-6-launch-pricing-impact-august-2026/ and https://x.ai/news/grok-4-1-fast (Agent Tools API, X search).

**What it does better than Claude for this fleet.** One thing. Real-time X data through the Agent Tools API. Claude has web search but X blocks crawlers, and the X API's own paid tiers are far dearer than $5 per 1,000 X-search calls. `content/strategy.md` line 54 makes X the discovery, relationship and idea-testing layer: three original posts and 25 good replies a week from w/c 7 September (`this-week.md` line 57, HWL-270). Finding 25 reply-worthy posts a week by hand is exactly the doom-scroll H12 warns about for Instagram. A scout that hands Harrison a shortlist three times a week removes the scroll and keeps the reply itself human.

**The named job.** `agents/x-scout.py`, launchd Mon/Wed/Fri 08:30 from 7 September. Queries a fixed list of lane topics and accounts through Grok 4.3 plus X Search, returns 8 to 10 candidate posts with a one-line why, appends to `capture/inbox.md`, pushes a Telegram digest. Same shape as `agents/discovery-scan.md`. Grok never drafts the reply. Voice stays Harrison's, per `content/voice-dna.md`.

**Cost.** About 30 X-search calls per run at $0.005 each is $0.15, plus a few cents of Grok 4.3 tokens. Under £2 a month.

**Integration cost.** 2 to 3 hours: script, plist, Telegram digest, `_log.md` line, doctor check. Plus 10 minutes of Harrison's own hands to create the xAI console account and key (credentials rule, not Claude's job).

**Security posture.** Outbound is search queries about public topics. Inbound is public posts. No client, financial or identity data is involved. Enforce it in code: a query denylist of client names, same pattern as `agents/health_security.py`. xAI stores API requests 30 days for audit, does not train on them by default, and Zero Data Retention is enterprise-only. Source: https://docs.x.ai/developers/faq/security. That is acceptable for a public-data-only lane and nowhere near the openclaw or Hermes objection, which was about an autonomous agent with reach into the machine. This is a read-only fetch script.

**Maintenance tax.** One more key, one more billing account, one more failure mode. Mitigation: it is off the critical path. If it dies, the morning brief does not care and the X layer still runs by hand.

**What Grok must not do.** No content drafting, no client work, no replacement for Sonnet or Opus in any existing agent, no "let's also try Grok for the morning brief". The moment it drifts past X search it is a second OS.

## Qwen (Alibaba)

**Current state, August 2026.** Qwen 3.5 (February) is Apache 2.0, dense 0.8B to 27B plus MoE 35B-A3B, 122B-A10B and 397B-A17B. Qwen 3.6 (April) refreshed the 35B-A3B MoE and added a dense 27B that beats the 3.5 flagship on coding. Qwen 3.7 Max (May) is the closed API flagship at $2.50 in, $7.50 out list, currently on a 50 percent promo. Qwen3.6-35B-A3B on OpenRouter is $0.098 in, $0.95 out. Sources: https://codersera.com/blog/qwen-3-5-complete-guide-2026/ and https://github.com/QwenLM/Qwen3.6 and https://openrouter.ai/qwen/qwen3.6-35b-a3b and https://openrouter.ai/qwen/qwen3.7-max.

**Local viability on the mini.** Yes, technically. Qwen3.6-35B-A3B at Q4 is roughly 20 GB and runs 60 to 80 tokens a second on Apple silicon with MLX. Source: https://modelfit.io/blog/qwen-35-medium-series/ and https://unsloth.ai/docs/models/qwen3.6. Two problems. The disk has 32 GB free, so a 20 GB model puts the machine back at 99 percent, three days after five stale worktrees took it to 98. And 20 GB of unified memory resident on the box that runs the fleet, Resolve proxies and ffmpeg pipelines is not free either.

**Candidate jobs, tested one by one.**

- Bulk classification or summarisation of the discovery scan. No. Discovery-scan is 3 to 7 items, three times a week. There is no bulk. Claude Max makes it free anyway.
- Transcription. No. That is Whisper.
- Coding. No. Codex owns engineering, Claude covers the rest, both are already paid for. Qwen3.6-27B is a fine coder and it is still a third one.
- Offline failover for the morning brief when Claude auth dies. Tempting after a four-day outage, and wrong. The brief's value is Gmail, Calendar, Garmin, Granola and Linear tool access wired through Claude Code. A local model with none of that produces a worse brief, and wiring MCPs to a second runtime is building a second OS. That is H4 and H21 in one move. The fix for auth outages shipped 13 August (Telegram alert on logged-out session).
- Embeddings and recall for Patronus. Plausible, but that is a product decision in a different repo, and hosted embeddings are cheaper than running a local model for it.

**Comparison for the record.** If a real bulk job appears, Qwen3.6-35B-A3B via OpenRouter at $0.098 in beats Claude Haiku 4.5 at $1.00 in and $5.00 out (Batch API halves that) by roughly ten times on input. Source: https://platform.claude.com/docs/en/about-claude/pricing. That is the only case where Qwen earns a slot, and only through the API, not local, until the disk is sorted.

**Security posture.** Local Qwen is the one option here that is security-positive: nothing leaves the machine. Alibaba Cloud or OpenRouter routing is a new jurisdiction and a new logging policy for anything sent. Neither matters until there is a job.

**Revisit triggers.** A named workload over about a million tokens a month. Anthropic Max limits throttling the fleet. A client contract that forbids cloud processing. Disk under 70 percent. Any one of those, reopen this.

## Weighing it

Harrison wants harsh truth and a bias for building. The build bias is satisfied by one small Grok script with a real customer (the X layer) and a real date. The harsh truth is that everything else on the table is model tourism. The operating theory has a name for it. Adding providers with no job increases auth surface, splits attention, and moves the fleet away from the two-lane Claude and Codex model that SYSTEM-STATUS.md spent August hardening.

## First concrete step

Not today. The X layer is provisional on w/c 7 September and the restart-week decisions land by 4 September (`content/distribution-product-plan-2026-08-10.md` line 18). So:

1. By 28 August, Harrison confirms the X layer is switching on 7 September. If it slips, this whole brief slips with it.
2. If confirmed, Harrison creates the xAI console account and API key himself, 10 minutes, and drops the key in the Keychain the way the other agent secrets are held.
3. Claude builds `agents/x-scout.py` plus plist in the 31 August to 4 September window, 2 to 3 hours, off the critical path, public-query denylist included. First run Monday 7 September 08:30.
4. Qwen: nothing. No download, no account, no gateway. Note the revisit triggers above and move on.
