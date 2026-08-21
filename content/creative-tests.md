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

---

### 2026-08-13 (17:00 run), @creepersinstallation, slot Sun 23 Aug 2026

**Status:** proposed

**Slot source caveat, read this first:** `scripts/client-calendar.mjs` could not
be executed this run. The unattended session's permission mode blocked `node`,
`curl`, WebFetch and Playwright, so the live endpoint was unreachable from
inside the run. The runner (`agents/creative-lab.sh`, `--permission-mode
acceptEdits`) cannot currently run its own mandatory slot script; that needs an
allowlist entry for `node scripts/client-calendar.mjs` before the next run.
The slot below is NOT from the CSVs, which were not opened. It comes from the
deployed plan `2026-08-10-r2` as read live and recorded in this ledger earlier
today, 13 August: `@creepersinstallation` runs Sundays, 16 Aug single image and
23 Aug reel, with the NF3 New Forest shoot on Wed 19 Aug. Cross-checked against
`business/clients/creepers.md` (13 Aug correction: no installation-only post
since 30 July, installation bank empty) and `today.md`. The residual risk is
that the deployed calendar changed between this morning's read and 17:00.

**Client and slot rationale:** Creepers is the only client with a deployed
calendar (Better at Work and LOR are inactive in `calendars.json`). Installation
chosen again rather than rotated because the entry above was rejected on a
targeting error, never tested, and itself names the 23 Aug reel as the natural
re-target. The 16 Aug single image slot is not honestly actionable: it precedes
NF3, the installation bank is empty (Ferndale burned, Rootball rejected), and
the runway rule says an empty optional slot beats filler. The nursery account's
three weekly slots are committed material per the 10 Aug runway decision, not
open test slots. The 23 Aug reel is capturable on a shoot already scheduled,
which is the cheap kind of test.

**Hypothesis:** Because heritage-nursery and luxury-garden channels are
currently running single-specimen process and provenance films (Easy Big Trees'
"journey of a 30 year old Ulmus horizontalis" from its Heritage Collection,
LinkedIn, 30 Mar 2026; Luxury Gardens Magazine on Crescente's
stone-and-specimen selection craft, LinkedIn, 16 Jun 2026; The Modern House and
Inigo's Great Dixter behind-the-scenes process film, May 2026; Boomkwekerij Jef
Cools' specimen-preparation reels aimed at garden architects, Instagram), and
because Socialinsider's June 2026 reels benchmark of 140k reels shows reels are
the top reach format for 1 to 5k follower accounts at 9.78 percent reach rate,
with 30 to 60 seconds the strongest length band and a 65.5 percent average
3 second skip rate for small accounts, I expect a 30 to 45 second
single-specimen selection reel on `@creepersinstallation`, opening on hands and
material in motion inside the first second with ambient sound only, to beat the
median reach of the account's last five posts and keep at least 35 of every 100
viewers past the first 3 seconds (the small-account average is 34.5). I will
know within 7 days of posting, by Sunday 30 August, via reach and retention in
account insights.

**Evidence honesty:** The platform numbers are cross-category benchmarks
(Socialinsider Jun 2026; Metricool's Jun 2026 study of 24.3m posts shows reel
watch time doubled year on year and shares up 67 percent, so the format is
rising, not fading). The in-category sightings are real but imperfect: the two
most recent are LinkedIn executions, the Jef Cools Instagram reels are the
exact format on the exact audience but predate the 60 day window, and the
Dixter film is YouTube. I found no UK luxury-horticulture Instagram account
running this format inside 60 days. That gap is what makes this a test rather
than a copy. No performance figures exist for those accounts and none are
claimed. Counter-evidence stated plainly: domestic-trades data says face plus
voiceover beats pure b-roll 2 to 3x, and this variant deliberately ignores that
because it is the trades execution and the luxury lane runs restraint. That
choice is part of what the test decides.

**Variant: "How a tree gets chosen", cut structure, target 35 seconds:**

1. 0:00 to 0:03. Open mid-action, no logo, no title card. Close on a grower's
   hand running up the trunk from root flare to first branch, camera tilting
   with it. Ambient sound: wind, birdsong, footsteps on the row.
2. 0:03 to 0:08. Wide. Michael walks the row, eyes up in the canopies, one
   tree among hundreds.
3. 0:08 to 0:16. Three checks, close: root flare, graft union, canopy balance
   against the sky. These are the NF3 install macros, cut as beats.
4. 0:16 to 0:22. The decision. A tag or ribbon tied on. The only event in the
   film.
5. 0:22 to 0:29. The chosen specimen in full, locked off, wind moving the
   canopy.
6. 0:29 to 0:35. Closer. The rows in depth, late summer light. Text, small,
   lower third: "Chosen in the New Forest."

**Opening three seconds, written out:** A hand enters frame already moving,
palm brushing bark upward from the root flare, camera tilts up the stem with
it. No text until second 2, then one small line, lower third: "How a tree gets
chosen." The scroll-stop is contact between hand and tree in the first half
second, motion from frame one, per the skip-rate evidence.

**Caption, Creepers voice, installation account:**

The choosing takes longer than the planting.

Root flare first, then the graft, then the canopy against the sky. Michael
walks the row twice before anything gets a tag.

Grown in the New Forest. Ready for the right garden.

(If Michael is not on the NF3 shoot, the grower on site stands in, hands only,
and the caption drops the name.)

**Footage:** Entirely from NF3 on Wed 19 Aug, which already banks install
macros. Adds to the shot list: the continuous hand-up-trunk opening move, the
row-walk wide, the tag moment, one locked-off full-specimen shot with wind.
Roughly 15 minutes added on the day, ambient audio kept rolling on everything.
If NF3 slips, the test slips with it. Do not force the slot from the bank.

**Cost:** About 15 minutes added to the NF3 shoot day and 1.5 to 2 hours in
edit (cut to ambient, grade, minimal type). No new shoot, no gear, no music
licence.

**Risk:** Underperformance, not embarrassment: this is the same DP-grade
documentary work the account already runs, and ambient audio is safe sound-on.
Honest secondary risks: on 2,337 followers the signal may be too small to read,
in which case this closes inconclusive, not as a free retry; and the whole test
inherits NF3's schedule risk.

**Replaces:** The planned execution of the 23 Aug reel slot, against which
nothing is banked per the deployed plan as read this morning. Same slot, same
shoot day, same subject family. If the deployed calendar has since committed
material to this slot, this proposal dies on that fact and that is the correct
outcome.

**Note, delivery failure 13 Aug 17:00:** The Telegram send did not go out. The
session's permission mode blocked `curl`, and the fallback push reached the
desktop only (mobile inactive). The full message text is in the run's stdout
log. Next run: if this entry is still unacknowledged, retry the Telegram send
first; that retry is not a new proposal and does not breach the
one-at-a-time guard.

**Noted, 15 Aug 17:00 run:** Still undelivered. The 14 Aug run crashed before
doing anything (claude exited 1 per `agents/_log.md`), so the retry above
never happened. Today's retry hit the same wall as 13 Aug: `node`, `curl`,
`git` and web fetch are all denied, and `.claude/settings.json` still has no
allowlist entry for `node scripts/client-calendar.mjs`. The slot could not be
re-verified from inside this session for the same reason; the residual risk
stands, though nothing can be banked against 23 Aug before NF3 shoots on
19 Aug. Root cause of the send failures found: commit 840e634 routes lab
Telegram sends through the wrapper via `agents/outbox/<agent>-<date>.md`, but
only `form-lab.sh` and `pattern-lab.sh` carry the delivery block.
`creative-lab.sh` does not, so this agent currently has no working send path
at all. This run wrote the full message to
`agents/outbox/creative-lab-2026-08-15.md` per the ownership table (the file
is the record either way) and sent a desktop push pointing at it. Fixes
needed, engineering-side rather than by this scheduled agent: the allowlist
entry, and the delivery block copied into `creative-lab.sh`. No
acknowledgment found in `capture/inbox.md`. This entry crosses the three-day
staleness line at 17:00 on 16 Aug.

**Noted, 16 Aug 17:00 run:** Staleness line crossed: three days proposed, never
delivered. Third delivery attempt, still no working send path. `creative-lab.sh`
still has no outbox delivery block (the 15 Aug outbox file was never sent; per
`agents/_log.md` the wrapper delivered form-lab and pattern-lab messages on
15 Aug but creative-lab's run line carries no send), and this session denied
`node`, `curl`, WebFetch, exa fetch and Playwright, so both the mandatory slot
script and every direct send path were closed again. `.claude/settings.json`
still has no allowlist entry for `node scripts/client-calendar.mjs`. New
information this run, via the allowlisted Calendar tools: the NF3 shoot is not
on Harrison's Google Calendar anywhere in the 16 to 24 Aug window (no NF3,
New Forest, Creepers or shoot events), and it appears in neither `today.md` nor
`this-week.md`. That is not proof it slipped; the deployed calendar, which is
where the shoot was recorded on 13 Aug, could not be re-verified from this
session. But the test's only dependency now rests on a shoot no reachable
source can see, and the tap window closes when NF3 shoots on Wed 19 Aug. If
NF3 is off, this proposal should be re-targeted, not tapped. Full message
written to `agents/outbox/creative-lab-2026-08-16.md`, desktop push sent
pointing at it. No acknowledgment in `capture/inbox.md`; Harrison's 14 Aug
replies were to the form-lab question, not this. Nothing in the ledger is
`running`, so there were no results to close.

**Noted, 17 Aug 17:00 run:** Fourth day proposed, guard active, nothing new
proposed. No results to close, nothing is running. The slot script was denied
again, `.claude/settings.json` still has no allowlist entry for
`node scripts/client-calendar.mjs`, and `creative-lab.sh` still has no outbox
delivery block, so the Telegram path stayed shut for a fourth run. Real
movement on the dependency, all on Harrison's side: the 16 Aug weekly review
logged the NF3 confirmation question as HWL-282 in `this-week.md`, a 10:10
calendar hold this morning bundled it into the Anna send, and per
`capture/inbox.md` Harrison asked Anna by WhatsApp at midday, the advert
inputs plus whether NF3 still shoots Wed 19 Aug. Her answer is pending on
WhatsApp, which no reachable source can see. Gmail carries zero Creepers or
NF3 threads in the last 3 days and Google Calendar still has no shoot event,
only Harrison's own send hold. Practical tap deadline is Tuesday 18 Aug
evening: the two extra shot-list items need approving before NF3 shoots
Wednesday. If Anna kills or moves NF3, this proposal retargets with the shoot
rather than dying quietly. Message written to
`agents/outbox/creative-lab-2026-08-17.md`; send attempted from inside the
session, desktop push as fallback.

**Noted, 19 Aug 17:00 run:** Day 6 proposed, guard active, no results to close.
The dependency has slipped: NF3 was listed on the live calendar for today
("SHOOT NF3 · Wed 19" per the 07:10 calendar hold, recorded from the deployed
calendar by the 18 Aug overnight session) and did not shoot. Harrison's day
verifiably ran in London end to end: 07:45 VO2 run marked done, Better Moments
block to 13:30, the 15:00 Kerri Teams call with a 15:55 debrief in
capture/inbox.md, the 16:10 LOR pre-production session. And Anna cannot
reconfirm before Friday: her 09:18 auto-reply (Gmail, "Automatic reply: Pro
Landscaper Ad") says she is out of office until Fri 21 Aug; the advert
deadline was closed through Sam instead. Consequence per this test's own rule:
the test slips with the shoot. The 23 Aug reel slot has no footage source and
must not be forced from the bank; an empty Sunday beats filler. When NF3 gets
a new date, this proposal re-targets to the first installation slot after it,
same variant, no rebuild. Caveat stated honestly: the deployed calendar could
not be re-read from this session (node, curl, exa fetch and script execution
all denied again, the fifth consecutive run for the slot script), so
NF3-did-not-shoot is an inference from Harrison's verified London day, not a
grid read. Telegram send failed again, creative-lab.sh still has no outbox
delivery block (HWL-289): full message at
agents/outbox/creative-lab-2026-08-19.md, desktop notification sent, mobile
push inactive.

**Noted, 20 Aug 17:00 run:** Day 7 proposed, guard active, no results to close.
The 23 Aug slot is gone in practice: NF3 still has no date, Anna's out of
office runs to Fri 21 Aug (today.md, verified brief chain), and even an
immediate Friday reconfirmation cannot put footage in the bank before Sunday.
Do not tap for 23 Aug; an empty Sunday beats filler. The variant needs no
rebuild and re-targets unchanged to the first installation slot after a
rescheduled NF3, so Anna's Friday WhatsApp reply is the only tap that matters.
Harrison's 19 Aug 17:38 Telegram reply was a voice message, captured
untranscribed in capture/inbox.md; if it answered this proposal it is
unreadable from here, re-send as text. Slot script denied a sixth consecutive
run, and exa fetch, WebFetch, curl and osascript were all denied too, so the
deployed calendar could not be re-read; NF3 state comes from today.md.
HWL-289 (delivery block plus allowlist) and HWL-282 (NF3 confirmation) remain
open in this-week.md, and the Codex parallel-run prompts from 18 and 19 Aug
produced no report files, so the engineering fix has not landed. Full message
at agents/outbox/creative-lab-2026-08-20.md, desktop notification sent, mobile
push inactive.

**Result:** (window closes Sun 30 Aug)
