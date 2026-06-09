# Command Center Spec

**Canonical source:** `/Users/harrison/hwlstudio-codex/harrison-os/12-command-center-spec.md`

The codex spec describes a single-screen interface (eventually a web dashboard, eventually a TestFlight phone app) that answers:

- What matters today?
- What is late or at risk?
- How much cash is real?
- What is the next high-leverage move?
- Am I moving toward the man I say I want to become?

## Eight modules (per codex 12)

1. **Today**, calendar, top three outcomes, training plan, client deadlines, one personal priority.
2. **Money**, bank balance, personal cash, credit card balances, receivables, tax buffer, next 14 days cash in/out, late invoice follow-up status.
3. **Clients**, BaW next deliverable, Creepers next deliverable, LOR next action, open proposals, blocked/waiting status, editor-ready task list, VA-ready follow-up list, content inventory by client.
4. **Content**, this week's post, idea inbox, draft queue, published log, proof/case-study assets to collect, delegation queue.
5. **Learning**, weekly research brief, books/podcasts/articles queue, one idea to apply this week, notes to convert.
6. **Health**, sleep, training, recovery, weight/body composition trend, 50K race countdown, morning movement check.
7. **Relationship / Life**, Maya check-in, family/friends touchpoints, admin/life tasks, proposal/future-family thread (private), out-of-house work plan, NZ/future home thread.
8. **Attention**, Instagram time, screen-time trend, deep work blocks, doom-scroll trigger notes, serendipity blocks (coffee shop, Soho House, meetings, shoots, walks).

## v1 implementation

Markdown is the interface. Each module corresponds to existing HWL META files:
- Today → `today.md`
- Money → `money/index.md`
- Clients → `business/clients/*.md`
- Content → `content/pipeline.md`
- Learning → `learning/weekly-brief/{latest}.md`
- Health → `health/index.md` + `health/training-plan.md` current week
- Relationship / Life → `life/*.md`
- Attention → `life/attention-tools.md`

## v1.1 implementation (deferred)

Local static HTML/JS dashboard reading the same markdown. Lives at `spec/dashboard/` or similar. Phase 3 of codex MVP roadmap. Built only after the markdown version is reliably populated by agents.

## v1.2 implementation (deferred, end of June target)

TestFlight phone app. Phase 5 of codex MVP roadmap. Built only after v1 acceptance hits.

## Codex reminder candidates (per spec)

- Reconcile cash and card charges.
- Follow up late invoices.
- Check VAT / tax buffer.
- Review client delivery status.
- Choose and publish one post.
- Review training and sleep.
- Plan learning inputs.
- Do a relationship / life check-in.

The morning-brief and weekly-review agents (v1 priority) carry most of these.

## Automation boundaries

Per codex 12: automate collection, reminders, research, summaries, drafts, checklists aggressively. Keep final approval with Harrison for payments, client messages, public posts, legal/tax decisions, major relationship communications.

## First build principle

Start small:
1. One capture inbox. (Done: `capture/inbox.md`.)
2. One weekly review. (Drafted: `agents/weekly-review.md`. Acceptance Phase 4.)
3. One money dashboard. (Drafted: `money/index.md` + `agents/weekly-cfo.md`. Acceptance Phase 4.)
4. One client delivery dashboard. (Done: `business/delivery.md` + `business/clients/*.md`.)
5. One content pipeline. (Done: `content/pipeline.md`.)

Do not build a cathedral before the capture habit exists.
