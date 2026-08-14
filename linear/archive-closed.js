#!/usr/bin/env node
// Archive closed (completed/canceled) Linear issues to recover free-plan
// headroom. On 13 August the workspace hit the free activeIssueCount limit and
// every hourly sync failed on issueCreate with "usage limit exceeded". Closed
// issues still count toward that limit; archived ones do not, and archiving is
// reversible per-issue from the Linear UI.
//
// Never archives an issue whose marker still lives in this-week.md, so the
// sync keeps its full working set. Recently closed issues are kept visible for
// KEEP_DAYS (default 7) so the board's short-term history stays browsable.
//
// Usage:
//   export $(grep -v '^#' .env | xargs)             # load LINEAR_API_KEY
//   DRY_RUN=1 node archive-closed.js                # preview only
//   node archive-closed.js                          # archive
//   KEEP_DAYS=14 node archive-closed.js             # keep a longer tail
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gql } from "./lib/linear.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DRY = !!process.env.DRY_RUN;
const KEEP_DAYS = Number(process.env.KEEP_DAYS || 7);

const weekFile = resolve(__dirname, "..", "this-week.md");
const live = new Set();
for (const m of readFileSync(weekFile, "utf8").matchAll(/<!--\s*linear:(HWL-\d+)\s*-->/g)) {
  live.add(m[1]);
}

// Page through every unarchived issue; the issues connection excludes
// archived nodes by default, which is exactly the set the limit counts.
const nodes = [];
let cursor = null;
for (;;) {
  const data = await gql(
    `query($after: String) {
      issues(first: 100, after: $after) {
        nodes { id identifier title completedAt canceledAt state { type } }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { after: cursor },
  );
  nodes.push(...data.issues.nodes);
  if (!data.issues.pageInfo.hasNextPage) break;
  cursor = data.issues.pageInfo.endCursor;
}

const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;
const closed = nodes.filter((n) => n.state.type === "completed" || n.state.type === "canceled");
const eligible = closed.filter((n) => {
  if (live.has(n.identifier)) return false;
  const closedAt = Date.parse(n.completedAt || n.canceledAt || "");
  return Number.isFinite(closedAt) && closedAt < cutoff;
});

console.log(`unarchived issues: ${nodes.length} (closed: ${closed.length}, open: ${nodes.length - closed.length})`);
console.log(`held back: ${closed.length - eligible.length} closed issue(s) with a live marker or closed within ${KEEP_DAYS}d`);
console.log(`eligible to archive: ${eligible.length}`);

let archived = 0;
for (const n of eligible) {
  if (DRY) {
    console.log(`[DRY] ${n.identifier}  ${(n.title || "").slice(0, 60)}`);
    continue;
  }
  await gql(`mutation($id: String!) { issueArchive(id: $id) { success } }`, { id: n.id });
  archived += 1;
  console.log(`archived ${n.identifier}`);
}

if (!DRY) {
  console.log(`archived ${archived}; unarchived now: ${nodes.length - archived}`);
}
