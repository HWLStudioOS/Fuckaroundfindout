#!/usr/bin/env node
// Detect contradictions between the state-bearing Markdown files.
//
// Restructure Phase 2. `linear/lib/sync-policy.js` already refuses to write
// Linear issue state from a file that does not own a marker, which protects
// Linear. It does not protect Harrison: the Markdown files can still disagree
// with each other, and he reads those every morning.
//
// The HWL-191 flap on 9-10 August was exactly this. today.md and this-week.md
// carried the same marker with opposite checkbox states, and the hourly sync
// flapped between them.
//
// Two rules, both exact. No fuzzy text matching, because a false positive here
// would train everyone to ignore the check.
//
//   1. A linear:HWL-N marker may appear in at most one state-bearing file.
//      Two files carrying the same marker is a contradiction waiting to happen,
//      whether or not the checkboxes currently agree.
//   2. Within one file, a marker may appear only once. A repeated marker means
//      one task is recorded twice and the two copies will drift.
//
// Coverage is reported but never fails: most today.md items legitimately have
// no weekly counterpart. The number is here so the gap stays visible.
//
//   node scripts/check-state-consistency.mjs           check, exit 1 on failure
//   node scripts/check-state-consistency.mjs --quiet   only print failures

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATE_FILES = ["today.md", "this-week.md"];
const MARKER = /<!--\s*linear:(HWL-\d+)\s*-->/g;
const TASK_LINE = /^\s*-\s*\[( |x|X)\]\s*(.+)$/;

const quiet = process.argv.includes("--quiet");
const say = (...a) => { if (!quiet) console.log(...a); };

/** Every checkbox line in a file, with its marker if it carries one. */
export function parseTasks(text) {
  const tasks = [];
  text.split("\n").forEach((line, i) => {
    const m = line.match(TASK_LINE);
    if (!m) return;
    MARKER.lastIndex = 0;
    const markers = [...line.matchAll(MARKER)].map((x) => x[1]);
    tasks.push({
      line: i + 1,
      done: m[1].toLowerCase() === "x",
      marker: markers[0] ?? null,
      text: m[2].replace(MARKER, "").trim(),
    });
  });
  return tasks;
}

/** Rules 1 and 2. Returns a list of violations, empty when clean. */
export function findViolations(byFile) {
  const violations = [];
  const seen = new Map(); // marker -> [{file, line, done}]

  for (const [file, tasks] of Object.entries(byFile)) {
    const within = new Map();
    for (const t of tasks) {
      if (!t.marker) continue;
      if (within.has(t.marker)) {
        violations.push({
          rule: "duplicate-within-file",
          marker: t.marker,
          detail: `${file} carries ${t.marker} at lines ${within.get(t.marker)} and ${t.line}`,
        });
      } else {
        within.set(t.marker, t.line);
      }
      if (!seen.has(t.marker)) seen.set(t.marker, []);
      seen.get(t.marker).push({ file, line: t.line, done: t.done });
    }
  }

  for (const [marker, places] of seen) {
    const files = new Set(places.map((p) => p.file));
    if (files.size < 2) continue;
    const states = new Set(places.map((p) => p.done));
    violations.push({
      rule: states.size > 1 ? "contradictory-state" : "shared-marker",
      marker,
      detail: places
        .map((p) => `${p.file}:${p.line} [${p.done ? "x" : " "}]`)
        .join("  vs  "),
    });
  }
  return violations;
}

function main() {
  const byFile = {};
  for (const f of STATE_FILES) {
    const p = join(ROOT, f);
    if (!existsSync(p)) {
      console.error(`  MISSING state file: ${f}`);
      process.exit(2);
    }
    byFile[f] = parseTasks(readFileSync(p, "utf8"));
  }

  const violations = findViolations(byFile);

  for (const [f, tasks] of Object.entries(byFile)) {
    const marked = tasks.filter((t) => t.marker).length;
    say(`  ${f}: ${tasks.length} tasks, ${marked} carry a linear marker`);
  }

  if (violations.length === 0) {
    say("\n  No contradictions. Every marker is owned by exactly one file.");
    return 0;
  }

  console.error(`\n  ${violations.length} state contradiction(s):\n`);
  for (const v of violations) {
    const why = {
      "contradictory-state": "SAME MARKER, OPPOSITE STATE. This is the HWL-191 flap.",
      "shared-marker": "same marker in two files. They agree now and will drift.",
      "duplicate-within-file": "one task recorded twice in one file.",
    }[v.rule];
    console.error(`    ${v.marker}  ${why}`);
    console.error(`      ${v.detail}\n`);
  }
  console.error("  Fix: give each task exactly one owning file, per PR #20.");
  return 1;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  process.exit(main());
}
