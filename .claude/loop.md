# Default loop: quiet babysitter

Each tick, check in this order and act on the safe parts only:

1. Publish checklists: any `business/clients/*/production/*/publish-checklist.md` touched in the last 3 days with an unchecked step that reads as due today? Surface it.
2. Renders and exports: any video output directory in active production folders with a file that stopped growing (finished render) or a job that looks stalled? Surface it.
3. Capture: unprocessed new lines in `capture/inbox.md`? Triage per its rules, file what is clearly filable, leave judgment calls.
4. Agent health: tail `agents/_log.md`. Any FAILED or BLOCKED line newer than the last tick? Surface it with the exact error line.

If nothing needs attention, reply "quiet" and treat the tick as a noop. Do the safe actions yourself (file updates, drafts, triage). Flag anything send-shaped, money-shaped or schedule-shaped for Harrison instead of acting.

Never duplicate a launchd daemon's job. This loop observes and surfaces, the daemons own their work. No em dashes.
