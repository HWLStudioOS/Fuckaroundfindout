# Agent: followup-drafter

**Status:** SPEC, not yet wired. Written 9 June 2026 (Claude). Do not add to launchd until Harrison has watched one manual run and signed off on the send-gate behaviour.

**Purpose:** Close the gap the automation audit named: the system surfaces stalled outreach but never acts, so drafts rot (golf clubs went 35 days cold one tap from sent). This agent removes the "draft lives in an old session log" failure by turning every staged, due follow-up into a real, ready-to-send Gmail draft, then pushing Harrison a one-tap nudge.

**Honest constraint:** the Gmail MCP can `create_draft` but cannot send. So this is a DRAFTER, not a true auto-sender. True unattended send would need a send-capable path (Gmail API via OAuth script, or Superhuman automation) and is a separate, bigger build with a real one-tap gate. Until then, the human send is the gate, by design and by tooling limit. That is acceptable: it still kills the "I never got around to writing it" failure, which is the actual problem.

## Scope (start narrow)

**First live scope: golf-clubs campaign ONLY.** Do not touch LOR, Creepers, BaW, or any client campaign. Those are live relationships where a mis-timed auto-draft does real damage. Prove the loop on cold prospect outreach first, where the downside is a slightly-off breakup email to a club that already ignored five touches.

Expand to other campaigns only after Harrison explicitly widens scope.

## Trigger (when wired)

Mon/Wed/Fri 09:30 BST, just before campaign-chaser at 10:00, so chaser reports reflect drafts already staged. Or run inside campaign-chaser as a sub-step.

## What it reads

- `campaigns/golf-clubs.md` (in-scope campaign files only)
- The staged follow-up bodies + trigger dates + recipient table in each campaign file
- `content/voice-dna.md` (tone check on any body it composes fresh)
- Gmail (via `list_drafts`) to avoid creating a duplicate draft for a target that already has one

## What it does

1. For each in-scope campaign, find follow-ups whose trigger date has passed and that are NOT yet sent or drafted.
2. Check the blocker field. Only act when the blocker is "Harrison send" (i.e. content is ready, only the send is pending). If the blocker is a real decision ("send breakup or declare dead", "awaiting reply"), DO NOT draft, surface it instead.
3. For each ready follow-up: create a Gmail draft per recipient, salutation personalised from the recipient table, subject from the staged plan. Strip any "Sent via Superhuman" line (send client is TBD).
4. Write the new Gmail draft IDs back into the campaign file's live-state block (see golf-clubs.md for the format).
5. Push ONE Telegram message: "N golf follow-ups drafted and sitting in Gmail, subject 'X'. One tap each to send. Best window tomorrow AM." Include the count and the club names, not the full bodies.

## What it must NOT do

- Never send. Drafts only, until a gated send path exists.
- Never touch client (non-prospect) campaigns without explicit scope widening.
- Never create a fresh body from scratch for a relationship that needs nuance; if the staged body is missing, surface "needs a written follow-up" rather than inventing one.
- Never re-draft a target that already has a matching draft in Gmail (dedupe via list_drafts).

## Success criterion

A staged follow-up never sits past its trigger date as vapour again. It becomes a concrete Gmail draft within one agent cycle, and Harrison gets a phone nudge with a one-tap path to send. The 35-day golf rot does not recur.

## First run, already done manually 9 June 2026

Claude created the 6 golf breakup drafts by hand (IDs logged in `campaigns/golf-clubs.md`) as the proof-of-concept this agent automates. That is the exact behaviour to wire: due + staged + blocker-is-send → draft + log + nudge.
