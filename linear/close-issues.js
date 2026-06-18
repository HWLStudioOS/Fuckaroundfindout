#!/usr/bin/env node
// Close Linear issues directly via the API, decoupled from the markdown push.
// Use for reconciling reality (real-world / conversational completions that never
// got a checkbox) and for clearing zombie issues orphaned by daily today.md rewrites.
//
// The next `sync.js` run pulls these state flips back into the source markdown and
// appends a _deltas.md line, so the loop stays consistent.
//
// Usage:
//   export $(grep -v '^#' .env | xargs)            # load LINEAR_API_KEY
//   node close-issues.js completed HWL-91 HWL-93    # mark done
//   node close-issues.js canceled HWL-5 HWL-6 ...   # mark obsolete
//   DRY_RUN=1 node close-issues.js canceled HWL-5   # preview only
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { updateIssue, listWorkflowStates } from "./lib/linear.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE = resolve(__dirname, ".state.json");
const DRY = !!process.env.DRY_RUN;

const [type, ...ids] = process.argv.slice(2);
if (!type || !ids.length) {
  console.error("usage: close-issues.js <completed|canceled> HWL-1 HWL-2 ...");
  process.exit(1);
}

const state = JSON.parse(readFileSync(STATE, "utf8"));
if (!state.team?.id) {
  console.error(".state.json has no team.id");
  process.exit(1);
}
const states = await listWorkflowStates(state.team.id);
const target = states.find((s) => s.type === type);
if (!target) {
  console.error(`No workflow state of type "${type}". Available: ${states.map((s) => s.type).join(", ")}`);
  process.exit(1);
}

let done = 0;
const missing = [];
for (const id of ids) {
  const iss = state.issues[id];
  if (!iss) { missing.push(id); continue; }
  if (DRY) { console.log(`[DRY] ${id} -> ${type}  (${iss.title.slice(0, 60)})`); continue; }
  await updateIssue(iss.id, { stateId: target.id });
  iss.checked = true;
  done++;
  console.log(`${id} -> ${type}`);
}
if (!DRY) writeFileSync(STATE, JSON.stringify(state, null, 2));
if (missing.length) console.error(`not in state (skipped): ${missing.join(", ")}`);
console.log(`closed ${done}/${ids.length} as ${type}${DRY ? " (DRY)" : ""}`);
