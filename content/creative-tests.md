# Creative tests

Owned by the `creative-lab` agent. One test per week, per `agents/STATE-OWNERSHIP.md`.

This file is the loop. A test that is proposed and never resolved is a guess
with extra steps, so every entry carries a signal, a deadline and eventually a
verdict. The agent reads this before proposing anything, closes what is due,
and leads its Telegram message with results rather than ideas.

## Why this file exists rather than another inspiration folder

Two earlier attempts produced reference material and died:

- `discovery-scan`: nine archived batches, every one marked "nobody promoted any item"
- `content/inspo/`: a full download, frame and transcript pipeline, untouched since 18 May 2026

Both filled a folder. What survives in this system pushes a decision to
Harrison's phone. So entries here are not ideas, they are built variants
attached to a real dated slot, and each one ends in a verdict.

## Status values

| Status | Meaning |
|---|---|
| `proposed` | Built and sent. Waiting on Harrison's tap. |
| `running` | Approved and published. Signal window is open. |
| `won` | Beat the stated signal. Say what to do with that. |
| `lost` | Missed the stated signal. Say what it rules out. |
| `inconclusive` | Signal unreadable or the slot changed. Not a free retry. |
| `rejected` | Harrison declined. Record why; it is data about taste. |
| `parked` | Good, but not now. Needs a trigger to revive. |

## Entry format

```
### YYYY-MM-DD, @account, slot date
**Status:** proposed
**Hypothesis:** Because [evidence + source], I expect [format change] to
[outcome] on [account]. I will know by [date] via [signal].
**Variant:** what was actually built
**Cost:** production time, and whether it needs a shoot
**Risk:** underperforms / could embarrass the client on their own grid
**Replaces:** what was in the slot
**Result:** (filled when the window closes) verdict + one line on what it taught
```

## Standing rule

Three consecutive losses in one lane stops that lane. Record the stop here so a
future run does not rediscover the same dead end.

---

## Tests

### 2026-08-13, @creepersinstallation, slot Thu 20 Aug 2026

**Status:** rejected
**Client rotation:** First entry in the ledger, no prior test to rotate away
from. Creepers chosen for this run. Installation account chosen over nursery
because it is the account with the live gap: no installation-only post since
the 30 July hedge carousel, and the 13 August optional install slot was closed
rather than forced.
**Slot:** Thu 20 Aug, Detail & Texture, "NF3 macro set" carousel. Depends on
the NF3 New Forest shoot on Wed 19 Aug, so nothing for this slot is banked yet.
That makes it the next genuinely unfilled slot in the coming week.

**Hypothesis:** Because Socialinsider's July 2026 Instagram benchmark shows
mixed-media carousels outperform image-only carousels on engagement, because
Metricool's June 2026 study of 24.3M posts shows carousels drive nine times
the saves of single images, and because the current heritage-craft playbook
(Influencers Time, 31 July 2026) opens on hands and material in motion before
any face or logo with ambient sound only, I expect converting the planned NF3
macro set from an image-only carousel into a mixed-media carousel with two
silent, locked-off motion slides to beat the median saves and non-follower
reach of the last five carousels on @creepersinstallation. I will know within
7 days of posting by the saves and reach figures in account insights.

**Evidence honesty:** The benchmark evidence is cross-category format data,
not an in-category sighting. I found no organic luxury-horticulture account
running mixed-media macro carousels in the last 60 days. The in-category finds
(crane lifts, tree relocations getting traction) are LinkedIn executions, a
different lane. Because the category layer is thin, this test is deliberately
the cheap version: same slot, same series, same shoot, two extra clips.

**Variant, slide by slide:**

1. Static. Near-abstract macro of bark grain in raking light, shot so it reads
   as texture before it reads as a plant. Specimen name small, lower third.
2. Static. Bud or leaf detail, second specimen.
3. VIDEO, 8 to 10 seconds, locked off on tripod. A grower's hand enters frame
   and turns a leaf or presses a bud. Ambient sound only, wind and birdsong.
   No music, no voice, no text.
4. Static. The full specimen the details came from. The close-up-to-wide
   resolution beat.
5. VIDEO, 6 to 8 seconds, locked off. Wind moving through foliage, nothing
   else in frame moves.
6. Static closer. Row context, depth, late-summer light.

**Opening three seconds:** Slide one is the scroll-stop and carries the test.
One near-abstract macro, bark grain lit side-on so it reads as topography, no
overlay except the specimen name small in the lower third. First caption line
visible in feed: "The wind does the showing this week."

**Caption, Creepers voice, Detail & Texture series:**

The wind does the showing this week.

Close range in the New Forest rows. Bark, bud, and the turn of a leaf, caught
moving rather than posed.

[specimen name]
[specimen name]
[specimen name]

**Footage:** NF3 on Wed 19 Aug already banks "install macros" per the shoot
schedule. Add two locked-off macro video clips to the NF3 shot list, tripod,
roughly 30 seconds recorded per clip, ambient audio kept. If NF3 slips, the
test slips with it. Do not force the slot from the bank.

**Cost:** About 10 minutes added to the NF3 shoot day and 30 to 45 minutes
added in edit against the image-only version. No new shoot, no new gear.

**Risk:** Underperformance only. It cannot embarrass the client: the motion
slides are the same DP-grade macro work the series already runs, and ambient
audio means a sound-on viewer gets wind, not a jolt. The honest secondary risk
is noise: on a 2,300-follower account the signal may be too small to read, in
which case this closes as inconclusive, not as a free retry.

**Replaces:** Nothing on the calendar. Same slot, same series, same subject.
It replaces the image-only execution of the planned NF3 macro set.

**Note:** Proposed via a supervised dry run on 13 Aug. Telegram send
intentionally skipped on instruction. No running tests existed to close before
this proposal.

**Status correction, 13 Aug:** `rejected` on a targeting error, not on merit.
The slot is wrong. This was built against the stale
`creepers-calendar-2026-jun-sep.csv`, which lists a Thu 20 Aug Detail & Texture
carousel. The deployed calendar, plan `2026-08-10-r2`, runs
`@creepersinstallation` on **Sundays**: 16 Aug single image, 23 Aug reel. There
is no Thu 20 Aug slot.

The reasoning holds and is worth re-running against a real slot. Its account
choice was right (installation has had no post since 30 July), its evidence was
verified accurate (Metricool's June 2026 study of 24.3m posts across 375k
accounts does report roughly nine times the saves on carousels versus single
images), its cost and risk honesty was right, and it correctly flagged that the
in-category evidence was thin.

`scripts/client-calendar.mjs` now reads the deployed calendar and returns only
open future slots, and the agent is forbidden from reading the CSVs. The 23 Aug
reel slot, which follows the NF3 shoot on 19 Aug, is the natural re-target.

**Result:** rejected, targeting error. Kept in the ledger rather than deleted,
because the failure is the useful part.
