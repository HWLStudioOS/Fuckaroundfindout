---
name: council
description: Multi-agent deliberation framework for high-stakes strategic decisions. 5 advisors argue from forced perspectives, blind-review each other, then a chairman synthesises one clear verdict. Use for pricing, client decisions, business direction, major commitments.
trigger: /council, "should I...", pricing calls, strategic forks, anything where the wrong answer costs real money or time
---

# The Council

Five advisors argue. A blind reviewer finds what they all missed. The chairman delivers one verdict. Harrison decides.

---

## Step 0: Gate Check

Before spinning up agents, classify the decision:

**Type 1 (Irreversible / high-stakes):** Pricing a client, dropping a client, taking on a major project, business direction pivot, large financial commitment, hiring, signing a contract.
Run the full council.

**Type 2 (Reversible / low-stakes):** Content approach, tool selection, scheduling, format choices, anything undoable within a week at minimal cost.
Tell Harrison: "This doesn't need a council. Here's what I'd do." Answer directly.

**The test:** "If this goes wrong, can Harrison undo it within a week with no real damage?" Yes = Type 2. No = Type 1.

### Question Sharpening

If the question is vague, sharpen it before proceeding. A council on "should I grow my business?" produces nothing. A council on "should I pitch Colin Fisher at 1,500 or 2,000/month given he's evaluating over 3 months?" produces a verdict.

Ask Harrison to reframe if needed. One question, one decision, one council.

### Time Horizon Tag

Before dispatching, tag the decision:
- **Sprint** (1-4 weeks): Weight the Executor and Contrarian heaviest.
- **Quarter** (1-3 months): Balanced weight across all five.
- **Long game** (6+ months): Weight First Principles and Expansionist heaviest.

This tag feeds into the Chairman's synthesis weighting.

---

## Step 0b: The Build Gate (delete before you build)

*Elon seed, the Algorithm: "The most common mistake of smart engineers is to optimize a thing that should not exist." (The Book of Elon, p135.) Delete, then simplify, then accelerate, then automate, strictly in that order. If you are not adding back about 10%, you did not delete enough.*

**This gate is bound to the assistant, not to Harrison's memory.** Harrison reliably forgets to summon a tool (the council itself proves it: campaign-chaser nagged "council decision overdue" for a month and it was never run). So this is not something he invokes. **Before you scaffold any net-new HWL-OS component, an agent, a skill, a product, a new file structure, a new automation, you run the Build Gate first and show the verdict.** His documented weakness is over-building and under-using (H21); this is the structural counter, applied by the system, every time.

It is also invocable on demand as `/delete-pass <thing>` (proposal) or `/delete-pass audit <existing agent/file>` (prune one existing part).

### The gate (Step 1 is blocking)

1. **Can this requirement be killed?** What breaks if it never exists? Which existing file or agent already does 80% of this? Do not discuss simplify / accelerate / automate until this is answered.
2. If it survives: what is the smallest version? What gets deleted from the first idea?
3. **Add-back check:** name the ~10% you will add back after deleting. If you cannot, you did not delete enough, go back to 1.

### The verdict (always one line, plus the parts)

```
BUILD GATE: <thing>
Verdict: KILL / KEEP-SIMPLIFIED / BUILD-AS-SCOPED
Cut: {what you deleted from the first idea}
Add back: {the ~10%}
Next action: {single concrete step}
```

- **KILL** ends it. The absence of a build is a valid, often correct, output.
- **KEEP-SIMPLIFIED / BUILD-AS-SCOPED** writes its single next action as a `- [ ]` line into `this-week.md` so it lands on the chased rail, not a feeling.
- **Audit mode** must end in an actual deletion diff (an archived prompt, a removed file), never just a nomination.

Log one line to `agents/_log.md`: `{ISO timestamp} | build-gate | <thing> -> {verdict}`. Never edit `CLAUDE.md` to enforce this (block-end rule until 18 July); the agent-bound convention carries it.

**First dogfood target:** this file. `council/SKILL.md` still says "JARVIS" four times (lines under Step 3, Post-Decision Grading, Implementation Notes), which violates the CLAUDE.md "No JARVIS" hard rule. An audit run should strip them.

---

## Step 1: The Five Advisors (run in parallel)

All five receive:
- Harrison's question, exactly as asked
- The time horizon tag
- Instruction to tag every claim as **[FACT]**, **[INFERENCE]**, or **[OPINION]**
- 300-word max, no fluff, no preamble
- Relevant context from memory/ and .claude/rules/ (except the Outsider)

Each advisor MUST end with:
**Confidence:** [1-10] and one sentence on what would change their mind.

---

### 1. The Contrarian
> "Your job is to find why this will fail. Write a pre-mortem: it's 6 months from now and this decision was a disaster. What happened? What did Harrison miss? What's the hidden risk everyone's too polite to mention?
>
> Be specific. 'It might not work' is worthless. 'The client will expect 20hrs/week of output for a 10hr/week retainer, and by month 2 Harrison is doing unpaid overtime' is useful.
>
> End with the single biggest reason this could go wrong."

### 2. First Principles
> "Strip this decision to its fundamentals. What does Harrison actually need from this? What assumptions is he making that might be wrong? If you rebuilt this decision from scratch with no 'how things are usually done,' what would you do?
>
> Challenge the frame. If Harrison is asking 'A or B?', consider whether C exists. If he's optimising the wrong variable, say so."

### 3. The Expansionist
> "Find the upside Harrison hasn't seen. What adjacent opportunities does this unlock? What's the 10x version of this that he's underplaying? Where's the leverage?
>
> Stay grounded. 'This could lead to a billion-dollar empire' is noise. 'Landing this client gives you a case study that opens three similar doors in the same sector' is signal."

### 4. The Outsider
> "You know the strategic communications and consultancy industry, but nothing about Harrison's specific situation, clients, revenue, or history. You're an experienced operator in this space seeing this question cold.
>
> What patterns have you seen work or fail in situations like this? What would you tell a sharp 25-year-old consultant asking this question? What's the industry-standard play, and when does deviating from it actually pay off?"

**Context rule:** The Outsider receives ONLY the question and the industry context. No client files, no memory, no financial details. Fresh eyes means fresh eyes.

### 5. The Executor
> "It's Monday morning. Harrison has made this decision. Map the execution:
> 1. First three concrete actions (with deadlines)
> 2. What could go wrong in execution, not strategy?
> 3. What does 'done' look like in 2 weeks?
> 4. What's the minimum viable version if time runs short?
>
> If this is a binary choice (A vs B), map Monday for BOTH paths. Make the comparison tangible."

---

## Step 2: Blind Peer Review

A sixth agent receives all five responses, labelled Advisor A through E (shuffled, not in the order above). No advisor names or lenses revealed.

> "You're reviewing five anonymous strategic advisors. For each:
>
> 1. **Steelman:** What's the strongest version of their argument? (You must do this before critiquing.)
> 2. **Blind spot:** What did they miss or get wrong?
> 3. **Strength:** Rate 1-10.
>
> Then answer these three questions:
> - **Strongest position:** Which advisor and why?
> - **Biggest blind spot:** Which advisor and what did they miss?
> - **The gap:** What did ALL FIVE miss? This is the most important question. What's the angle none of them considered?
>
> If 4 or more advisors agree on the same direction, flag it explicitly. Consensus on strategic questions is suspicious and needs pressure-testing."

---

## Step 2b: Consensus Alarm (conditional)

If the peer reviewer flags near-unanimous agreement (4+ advisors on the same direction), spawn one additional agent:

> "The council reached near-unanimous agreement on [X]. Five smart people all agreeing should make you nervous, not confident. Your job:
>
> 1. Steel-man the opposite position. Make the strongest possible case AGAINST the consensus.
> 2. Find the shared assumption that all five are standing on. Is it solid?
> 3. Name one scenario where the consensus is dead wrong.
>
> You're not being contrarian for sport. You're the last check before Harrison commits."

---

## Step 3: Chairman Synthesis

JARVIS reads everything (all advisors, the peer review, any consensus alarm response) and delivers:

### Format:

**VERDICT:** [1-2 sentences. Clear. Actionable. No hedge words unless genuinely uncertain.]

**KEY TENSION:** [The most important disagreement between advisors and how to think about it.]

**THE GAP:** [What the whole council missed. JARVIS's own read, informed by deep Harrison context that the advisors may not have fully weighted.]

**REGRET CHECK:** [Which choice would Harrison regret more if it went wrong? Not what's optimal on paper, but what he'd lose sleep over.]

**MONDAY MOVE:** [One concrete next action. Specific enough to calendar.]

**CONFIDENCE:** [High / Medium / Split. If split, say what new information would resolve it.]

---

## Post-Decision Grading (optional)

After Harrison lives with the decision (weeks or months later), he can grade the council:

```
/council grade [topic]: [what actually happened]
```

JARVIS saves a calibration record to memory:
- Which advisor lens was most accurate?
- Which missed the mark?
- What did the council miss entirely?

Over time, this builds a track record. "The Contrarian has been right on 3/4 pricing decisions." That data feeds future Chairman weighting.

---

## Implementation Notes

- Advisors are spawned as parallel agents via the Agent tool
- Each agent gets a system prompt matching its lens above, plus Harrison's question and relevant context
- Peer review agent sees anonymised, shuffled responses only
- Chairman synthesis is done by JARVIS directly (not delegated), because JARVIS has the deepest Harrison context
- Total cost: 6-7 agent calls. This is expensive by design. Don't use it for small questions.
- Target turnaround: 2-3 minutes for the full pipeline

---

## Examples of Good Council Questions

- "Should I pitch Colin Fisher at 1,500 or 2,000/month?"
- "Should I take the LOR Assembly Specialist campaign at the quoted price, or push back?"
- "Is it time to hire a part-time editor, or keep doing everything myself?"
- "Should I drop Better at Work if a bigger client comes along?"
- "Do I invest in building a productised offering, or stay purely bespoke?"

## Examples of Bad Council Questions (answer directly)

- "What should I post on LinkedIn this week?"
- "Should I use Premiere or DaVinci for this edit?"
- "What time should I schedule this meeting?"
