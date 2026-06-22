# Harrison OS MVP Roadmap

Date started: 2026-05-11.

## Architecture Thesis

Harrison OS should be a hybrid:

- Markdown files as durable memory.
- A small app as the daily interface.
- A proactive message layer for daily/weekly prompts.
- Optional integrations for calendar, email, Slack, health, finance, and tasks.

The memory can live locally, but the experience must not feel local/manual.

## What Codex Can Do Natively

Codex can:

- Maintain the Markdown memory files.
- Analyze files and statements.
- Draft daily/weekly prompts and reviews.
- Run local scripts.
- Build a local app.
- Create Codex-native recurring thread wakeups.
- Use available connectors when explicitly connected and invoked.

Codex cannot natively, by itself:

- Send arbitrary Telegram messages without a bot/backend.
- Send emails without an email integration or SMTP/API layer.
- Call Harrison's mobile number without a telephony service.
- Pull Bevel/Whoop/Apple Health data without an export/API/shortcut bridge.
- Ship an iPhone app without an Apple developer/TestFlight workflow.

## Phase 0: Tomorrow Useful

Goal: a daily operating brief even before full automation exists.

Minimum:

- Codex-native daily heartbeat or manual morning run.
- Daily check-in template.
- Daily plan template.
- Read from current OS memory.
- Ask for the missing live inputs:
  - Sleep.
  - Training readiness.
  - Calendar.
  - Client obligations.
  - Food availability.
- Produce:
  - Today's top 3.
  - Deep work block.
  - Training prompt.
  - Meal plan.
  - Learning block.
  - Money/client reminder.
  - One grounding line.

## Phase 1: Proactive Message Layer

Goal: Harrison receives useful prompts without opening a blank chat.

Options:

- Codex heartbeat into this thread.
- Telegram bot.
- Email digest.
- Slack DM to self, if available/preferred.

Recommendation:

Start with Codex heartbeat for speed, then build Telegram/email if the heartbeat feels too contained inside Codex.

## Phase 2: Daily Check-In Store

Goal: every day creates structured memory.

Data to capture:

- Date.
- Sleep.
- Energy.
- Mood.
- Training.
- Work focus.
- Money stress.
- Relationship/life.
- Learning.
- Wins.
- Avoidance.
- Tomorrow's next action.

Storage:

- Markdown daily logs initially.
- JSON/SQLite later if building an app.

## Phase 3: Command Center Web App

Goal: browser-accessible dashboard before native phone app.

Views:

- Today.
- Money.
- Clients.
- Content.
- Learning.
- Health.
- Relationships/life.
- Attention.
- Weekly review.

Stack options:

- Static HTML/JS for fastest prototype.
- Next.js or similar for richer local app.
- SQLite for local structured data.

Recommendation:

Start static/local, then only add framework/backend once the daily workflow is proven.

## Phase 4: Integrations

Priority order:

1. Calendar.
2. Email/Superhuman source via Gmail or mailbox export.
3. Slack.
4. Linear/tasks.
5. Finance exports / Xero.
6. Health data export.
7. Telegram/push notifications.

Integration rule:

- Connect only what improves a weekly decision or daily action.
- Avoid integration theatre.

See `20-integrations-access-plan.md` for the staged access plan.

## Phase 5: Private Phone App

Goal by end of June:

- Private iPhone app via TestFlight, if feasible.

Core features:

- Daily brief.
- Check-in.
- Notifications.
- Weekly review.
- Command Center.
- Learning brief.
- Capture inbox.

Nice-to-have:

- Voice memo capture.
- Health data integration.
- Calendar view.
- Telegram/email fallback.

## Daily Brief Template

Daily output should include:

- Opening grounding line.
- Sleep/recovery summary.
- Training for today.
- Calendar / schedule.
- Deep work block.
- Client obligations.
- Money/admin warning.
- Meals.
- Learning block.
- One piece of wisdom.
- End-of-day check-in prompt.

## Weekly Review Template

Weekly output should include:

- Wins.
- Money reality.
- Health/training reality.
- Client delivery reality.
- Content progress.
- Relationship/life note.
- Learning synthesis.
- Attention pattern.
- Risks.
- Next week's actions.

## Immediate Build Decision

The next practical decision:

- Create a Codex-native daily heartbeat first.
- Build a Telegram/email bridge first.
- Build a local Command Center app first.

Recommendation:

1. Codex heartbeat for immediate proactive behavior.
2. Local Command Center app for daily use.
3. Telegram/email bridge once the message content is proven.
4. TestFlight app after the workflow is genuinely useful.
