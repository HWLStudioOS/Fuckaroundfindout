# Wednesday carousel

## Campaign idea

**Resilience is not a personality trait.**

The carousel dismantles the bounce-back myth before the audience knows an episode is coming. It moves from the myth through the ceiling and the praise trap into the self-awareness gap, then hands leaders the structural move: fix the load, not the person.

Verification flags: slide 5 carries research figures and slide 3 carries the ceiling metaphor. Both must be checked against the episode transcript before final sign-off. If either moves, edit `design/generate-artwork.mjs` and regenerate; the exports are one command.

## Slide copy, as rendered

### 1. Cover, violet

Pill eyebrow: A BETTER WAY TO THINK ABOUT RESILIENCE

Headline: TOUGHING IT OUT IS **NOT RESILIENCE.**

Subhead: What doesn't kill you does not make you stronger.

### 2. The myth, cream, pill 01

Headline: "Bounce back" is bad advice.

Body: Chronic pressure without recovery does not build strength. It drains it. The people praised for coping are often closest to the edge.

Callout (TASHA'S POINT): Endurance is not evidence of health.

### 3. The ceiling, ink, pill 02

Headline: Resilience runs out.

Body: It behaves like a budget, not a trait. Every unresolved stressor spends from it, and nothing refills it by itself.

Callout (TASHA'S POINT): Spend without recovery and the account empties.

### 4. The praise trap, cream, pill 03

Headline: "She's so resilient" is a warning sign.

Body: When coping gets rewarded, people learn to hide the cost. The strongest performer quietly becomes the highest risk.

Callout (THE RISK): Praise the recovery, not the endurance.

### 5. Self-awareness, ink, pill 04

Headline: Most of us can't see it coming.

Body: Tasha's research: 95 percent of people believe they are self-aware. Roughly 10 to 15 percent actually are. You cannot manage a cost you refuse to see.

Callout (TASHA'S RESEARCH): The gap is the risk.

### 6. Two lenses, cream, pill 05

Headline: Know yourself. Then ask around.

Body: Internal self-awareness is what you see. External is what others see. They are different skills, and one without the other misleads.

Callout (TRY THIS): One honest outside view beats a week of reflection.

### 7. The leader's move, ink, pill 06

Headline: Fix the load, not the person.

Body: Resilience training cannot outrun a broken workload. Remove the chronic stressor at source, then design recovery into the plan, not around it.

Callout (TASHA'S POINT): The fix sits upstream of the person.

### 8. Action, violet, pill DO

Eyebrow: TRY THIS THIS WEEK

Headline: Protect the capacity.

List:

1. Remove one cause of chronic stress.
2. Ask one person for the outside view.
3. Put recovery in the calendar.

Callout (BETTER MOMENTS 06): Tasha Eurich. The full conversation lands Thursday.

## Formats

Visual system: approved Jennifer Moss Better Moments template, rebuilt as code so it renders without the studio machine. Instagram is 1080 x 1350 in `artwork/carousel/`. LinkedIn is 1080 x 1080, separately composed, in `artwork/carousel-linkedin/`. Files are `01-cover` through `08-action`, named by section.

Slide 8's callout says "lands Thursday" deliberately and only works if the carousel posts Wednesday. If the drop slips, regenerate slide 8 with the true day first, per the slip rule in `publish-checklist.md`. The Jennifer package taught this the hard way; its slide 8 still said Thursday a week after launch.

## Sources

SVG sources with live text sit in `artwork/source/` (`li-` prefix for the LinkedIn set). Regenerate all 19 PNGs with `node design/generate-artwork.mjs`. The SVGs import into Figma with text editable if a design pass is wanted.
