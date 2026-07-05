# The Content System

**Created 5 July 2026 as part of the ground-up rebuild.** This is the operating loop. Strategy and identity live in `content/strategy.md`. This file is who does what, on which day, with which tool.

The design principle, learned the hard way: **Harrison creates when the tool has no edit layer.** Typewriter for writing. One-take talk for video. Every version of this system that added ceremony produced zero posts. So the system's job is to catch what he makes and carry it to the platforms, never to hand him a production.

---

## Capture (Harrison's side, the only part that is his)

Three capture modes, all no-edit-layer:

1. **Talk.** Camera on, one take, say the thing. 90 seconds or 15 minutes, both fine. No script, no teleprompter (teleprompter eyes are his own named cringe signal). Re-takes allowed, edits during capture are not.
2. **Type.** The typewriter. One page, one idea. Photograph the page, that photo is both capture and potential asset.
3. **Voice.** Telegram voice note or reply, any time. The inbound daemon lands it in `capture/inbox.md` tagged as his own words.

That is the entire ask. Everything below happens downstream of these three.

## The weekly loop

| Day | What happens | Who |
|---|---|---|
| Any day | Capture: talk / type / voice, as life happens | Harrison |
| Monday 06:30 | content-engine reads the bank. If it holds Harrison-authored material: drafts the week's written distribution (LinkedIn posts, X versions) from HIS words, flags the strongest video thread. If empty: one-line nudge, stops. | content-engine |
| Tue-Thu | Writing engine ships: 2-3 LinkedIn posts (per platform doc), the weekly X long-form, replies. Each item one tap before live. Buffer handles scheduling. | Harrison taps, Claude/Buffer execute |
| Shoot day (flexible, taper-aware) | The week's video: one take or a filmed slice of real work. Hand off footage. | Harrison |
| Edit window | Cut the long-form. Talk-led, inserts where footage exists. Package: 2-3 title/thumbnail variants for Test & Compare. Cut 1-2 native shorts/reels from offcuts. | Harrison or David or Claude-assisted, whatever the week allows |
| Fixed slot (recommend Sunday evening UK) | Long-form publishes. Native re-cuts to IG (Trial Reel first when unsure) and TikTok within 48h, staggered. | One tap, then system |
| Daily, ~10 min | LinkedIn ICP commenting + X replies. Phone-sized habit, not a session. | Harrison |

**The floor when a week collapses:** the written idea still ships. The video slot skips clean. No make-up debt, no double-week, no spiral. A skipped slot is logged in the pipeline, not mourned.

## Division of labour (hard lines)

**Harrison, and only Harrison:**
- Substance. Every idea originates in his capture. The system never assigns a topic.
- The take itself (talking, typing, shooting).
- The one tap that sends anything live.

**Claude (sessions + agents):**
- Transcription of every take and voice note into the bank.
- Cutting captions and per-platform adaptations from his transcript, in his words, voice-DNA checked.
- Packaging: title/thumbnail copy variants, hook options pulled from his own phrasing, thumbnail brief per brand sheet.
- Cross-post mechanics: watermark-free masters, native re-cuts specced per platform doc, links in first comments, staggered timing, Buffer scheduling.
- The scoreboard: every draft and every ship logged in `content/pipeline.md`. The repo is the record, Telegram is the notification.
- The weekly review names misses out loud: "Posted" empty for 14 days is a flagged failure, not a silence.

**Nobody:**
- Nothing posts autonomously. Ever.

## Tooling

- **Publishing:** Buffer MCP for all scheduled posts (LinkedIn auto mode only, per known quirk; local images via catbox upload).
- **Capture transport:** Telegram (inbound daemon live since 1 Jul).
- **Transcription:** whisper via the existing inspo transcribe pipeline, repointed at his own takes.
- **YouTube:** Test & Compare on every upload (3 packaging variants). YPP + Hype the moment 500 subs clears.
- **X:** Premium subscription required before the first post. Budget it as platform rent (money rule: over £40 needs the tap, so this waits for one).

## Cadence summary

| Surface | Cadence | Format |
|---|---|---|
| YouTube | 1 long-form/week, fixed slot | Named POV wrapper, talk-led, 8-15 min |
| LinkedIn | 2-3/week + daily comments | Documents/carousels, multi-image, text; video sparingly |
| X | 1 long-form/week + daily replies | The weekly idea, durable and declarative |
| IG | 1-2 Reels/week + 1 carousel | Native cuts + "how I shot this" trust layer |
| TikTok | 1-3/week | Native cuts + photo-mode carousels, search-keyworded |
| Quarterly | 1 cinematic piece | When a real moment earns it, never scheduled |

## What killed the last three systems (do not rebuild these)

1. The waterfall demanded 7-10 outputs a fortnight from one person with a client business. It produced zero. Cadence must fit inside 5-8 hours or it is fiction.
2. Scripts and shot lists turned every post into a production. Production ceremony is where his output goes to die.
3. Silent plumbing. Telegram ate three weeks of drafts and nothing noticed. The repo is the record now, and the weekly review checks content by name.
4. The system picking his substance. Vetoed 2 July, stays vetoed. Containers yes, topics never.
