# Mind-map notes prototype (the "Obsidian competitor" idea)

> **SUPERSEDED 2 July 2026 (evening).** Harrison overrode the gate the same day: product from day 1, build starts immediately as a nights-and-weekends project. Codename **patronus**, repo at `~/patronus` (VISION / PRODUCT / MARKET / TECH / ROADMAP). The gamification wedge (living graph, progression, shareable summons, quests) is the core of the new writeup. This file stays as the record of the original gate run. The 2-day prototype scope below survives inside `~/patronus/ROADMAP.md` as v0.

Captured 2 July 2026. Idea from Harrison: build an Obsidian competitor. Easier to use, UI 1000% cleaner, much more fun and interactive mind map. Build Gate run same day per council/SKILL.md Step 0b.

## Build Gate

```
BUILD GATE: Obsidian competitor
Verdict: KEEP-SIMPLIFIED
Cut: the company. Accounts, sync, mobile, plugins, pricing, product name, "competitor" framing.
Add back: Obsidian vault drag-in. Drop a folder of .md files and watch it come alive. That is the demo and the distribution hack in one.
Next action: 2-day prototype, w/c 13 July (post-RTTS). Nothing before race day.
```

## The claim, decomposed

Three claims in the idea. They are not equally strong.

1. **"Easier to use."** Real gap, weak wedge. Reflect and Capacities already sell exactly this and it has not dented Obsidian.
2. **"UI 1000% cleaner."** Achievable, Harrison's taste is the asset (H1). But every competitor claims clean. Not a moat, a hygiene factor.
3. **"Much more fun / interactive mind map."** This is the actual idea. Obsidian's graph view is a screensaver, you cannot think in it, edit in it, or work in it. Nobody has shipped "the map IS the app" with genuinely tactile, alive physics. Closest is Heptabase and it is deliberate and manual, not alive. This claim is demonstrable in a 30-second clip. The other two are not.

## Market reality, named

- **Obsidian:** free, local markdown trust moat, plugin ecosystem, cult. You do not out-feature it, you can only out-feel it.
- **Heptabase:** $11.99/mo, whiteboard-first knowledge base. Nearest occupant of this exact territory, years deep.
- **Tana** (outliner + supertags, AI-forward), **Capacities** (object-based, clean), **Reflect** ($10/mo, fast + clean).
- **Scrintal, Kosmik, Napkin:** visual canvas thinking tools.
- **AFFiNE, Anytype, Logseq:** open-source alternatives.

Consumer note apps are a graveyard business: high churn, low willingness to pay, distribution decides everything. A real run at this is a multi-year product company. That is a different business from HWL Studio, and July 2026 is not the month HWL Studio funds a second business.

## Two versions of the idea

**Version A, product company.** Months of build before the hard part even starts (distribution against funded incumbents). Does not pay inside 12 months. KILLED at the gate for now. Only reopens via Council, and only with Version B evidence in hand.

**Version B, build-in-public prototype.** 2 days. One demo clip: "I dropped my Obsidian vault into a thing I built this weekend and it came alive." Feeds the audience engine, is Harrison's own substance (his build, his footage, passes the substance rule), and tests real demand for £0. If the clip pulls and people ask for access, that is the evidence that reopens Version A. Demo first, product later. This is the GTM-engineering posture applied to his own idea.

## Prototype scope (the 2 days, hard cap)

- Web app, local only, no backend, no accounts. Static deploy to Vercel.
- Drag in a folder of .md files (File System Access API). Parse `[[wikilinks]]`.
- Force-directed canvas, WebGL (pixi.js or react-force-graph). Springy physics, satisfying drag, pinch, zoom. Must hold 60fps at 1-2k notes or the "fun" claim dies.
- Click node: note opens in side panel, editable, links update live on the canvas.
- Double-click canvas: new note. Drag node onto node: new link.
- Nothing else in v0. Cmd-K search is the only permitted add-back if time remains inside the cap.

## Success test (both, after one week)

1. Harrison uses it himself daily over that week, by choice.
2. The demo clip gets real pull (benchmarks: Arsenal reel 184k IG / 260k TT is the ceiling, but anything with unprompted "can I use this" replies counts).

Neither lands: archive, total cost 2 days. Both land: Council run on Version A with the numbers.

## Timing

Nothing before 11 July. Race is 9 days out and the new-client campaign's 5 warm asks are the open leverage this week. Build window: w/c 13 July.
