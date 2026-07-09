# Cash

A fast money snapshot for the phone. Read-only. Never edits the money files.

Do this:
1. Read `money/weekly.md` if it exists (the weekly-cfo agent's output) and
   `money/index.md`.
2. Report, in short plain lines:
   - Monthly run rate and the live per-client revenue lines from `money/index.md`,
     each with its status.
   - Anything the weekly-cfo flagged this week: tax reserve, VAT registration,
     slow payers, outstanding invoices.
   - Any money named as outstanding in the most recent `capture/inbox.md` entries
     (for example an unconfirmed client payment).
3. State the as-of date of every figure. These files are hand-maintained, Xero is
   not wired, so there are no live bank balances. Say that plainly. Never present a
   stale number as today's balance.
4. No advice unless asked. Just the picture.

Optional argument: a focus like `lor` or `vat` narrows the snapshot to that.
