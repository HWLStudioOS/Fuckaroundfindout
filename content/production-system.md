# Production System

The operational layer. What tools, what cost, what weekly rhythm, what gets delegated.

---

## The weekly time budget

From `content/waterfall.md`: ~8 hours per week of dedicated content time. Realistic breakdown:

| Block | Hours/week | When |
|-------|-----------|------|
| Sunday planning (idea capture, week plan) | 1 | Sun 9-10pm |
| Substack essay writing (alternates fortnights) | 3 | Sun 7-9pm + Mon 6-7am alternate weeks |
| Script writing (per piece) | 0.5 | Mon AM |
| Shoot blocks (field-note + cinematic) | 2-3 | Wed AM + Fri AM |
| Edit blocks | 2-3 | Wed PM + Fri PM |
| Posting + replies (60-min algorithm window per post) | 1 | Tue/Thu evenings |
| Engagement (LinkedIn comments, IG DMs) | 0.5 | Daily 10 min |

Total: 9-11 hours. Bumps to 12-14 in launch weeks (Pin shoots). Trim by 30% via editor delegation once at scale.

---

## Tool stack

### Buy now (pre-launch)

| Tool | Use | Cost |
|------|-----|------|
| Rode Wireless Go II + Lavalier | Audio for talking-head reels | £230 one-off |
| CapCut Pro (mobile subscription) | Tier A reels, fast cuts, auto-captions | £89/year |
| Artgrid annual | Cinematic stock for Tier B essays | £260/year |
| Gruppe A typeface license | Display / title cards / caption highlight | Foundry pricing, license once per studio |
| SF Pro Display | Body / long captions / Substack | Free, Apple system font |
| Substack Pro (free for now) | The newsletter | £0 |

**Required spend: £230 + £89 + £260 = £579.** With both paid fonts: £1,079. Recommend Week 1 launch with free fonts, buy in Week 4 if engagement justifies.

### Already have (presumed from existing client work)

| Tool | Already in use |
|------|---------------|
| Premiere Pro | Yes (per `business/delivery.md`) |
| iPhone (current model) for shooting | Presumed |
| MacBook for editing | Yes |
| Riverside for podcasts (BaW workflow) | Yes |
| Buffer or Metricool (for cross-posting) | Possibly, confirm |

### Don't buy until later

- DSLR / mirrorless camera. The iPhone is fine for everything Tier A. Tier B can be sourced footage or iPhone in cinematic mode. Buy a camera at Month 3+ if/when you outgrow the phone.
- Lighting kit. Natural light + a £60 panel is enough for v1.
- Premiere replacement (DaVinci Resolve). You already use Premiere; switching costs > switching benefits at v1.
- AI-tooling (Runway, Pika, etc.). Not part of the v1 voice. Adds in v1.1 if a specific use case emerges.

---

## Storage + file organisation

```
/Users/harrison/HWL META/content/
├── inspo/                      (existing, the source material)
├── platforms/                  (per-platform GTM docs)
├── ideas/                      (future: every concept gets a file)
├── shoots/                     (NEW: per-shoot raw + edits)
│   ├── 2026-05-25_pin1/
│   │   ├── raw/                (iPhone exports, camera files)
│   │   ├── selects/            (clips you actually used)
│   │   ├── exports/            (final cuts per platform)
│   │   └── notes.md            (what worked, what didn't, lessons)
├── essays/                     (Substack essays in markdown)
└── captions/                   (per-post caption variants)
```

The `notes.md` per shoot is the iteration log. After 30 days it's a self-built playbook.

### Cloud sync

iCloud for everything. Backup to an external SSD weekly. **One copy is no copies.** A lost Pin 1 raw shoot the day before launch is a real risk.

---

## The post-publishing loop

After every post:

1. **First 60 minutes:** reply to all comments. Track in `content/captions/[post-id]-engagement.md` what landed.
2. **After 24 hours:** screenshot the metrics. Saved to `content/shoots/[date]_[post]/metrics-24h.png`.
3. **After 7 days:** screenshot again. `metrics-7d.png`. Add a one-line lesson to `notes.md`.
4. **At fortnight close:** add the post to a tracking sheet (Notion or a simple markdown file) with views, follower delta, saves, DMs.

The tracking sheet is the only dashboard. No analytics tooling for v1.

---

## What to delegate (when scale demands)

Per `business/delivery.md`, editor delegation is already mapped for client work. Personal content can follow the same model:

| Stage | Could be delegated to | When |
|-------|----------------------|------|
| Caption first-draft writing | Claude (via agent, see below) | Now |
| Subtitle timing in CapCut | Editor / VA | Month 2+ |
| Cross-posting to non-IG platforms | Buffer or editor | Month 2+ |
| Engagement (replying to non-priority comments) | Never delegate. Personal voice is the moat. | – |
| Substack essay writing | Never. The voice is the asset. | – |
| Shooting yourself | Never (it's a personal account). Can have a 2nd shooter for B-roll. | – |

Editor capacity already scoped in `business/delivery.md` for HWL Studio work. Personal content slots in at +2-3 hours/week of editor time. Cost: roughly £100-200/week if hiring external; £0 if Tom/Mac take it on as agreed.

---

## The pre-shoot checklist (laminate this)

Before any shoot:
- [ ] Script printed or on second device
- [ ] Mic charged + paired
- [ ] iPhone storage > 20GB free
- [ ] Light source identified (window, panel, natural)
- [ ] Outfit not the same as last 3 reels
- [ ] Wide + mid + close angles planned
- [ ] B-roll list written for editor / yourself

The whole list takes 3 minutes. Skipping it costs an hour.

---

## The recurring blocks (put on the calendar now)

- **Sun 7-9pm:** Planning + writing
- **Mon 6-7am:** Script finalisation
- **Wed 7-9am:** Shoot block (field-notes)
- **Wed 6-8pm:** Edit block
- **Fri 7-9am:** Shoot block (cinematic, alternate weeks)
- **Fri 6-9pm:** Edit block
- **Tue 12-12:30pm + 6-6:30pm:** LinkedIn comments + IG DMs

If this collides with marathon training (per `health/training-plan.md`), training wins. Shift the shoot block, never the training.
