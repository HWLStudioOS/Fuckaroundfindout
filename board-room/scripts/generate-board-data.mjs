import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(projectRoot, "..");
const boardPath = resolve(repoRoot, "this-week.md");
const todayPath = resolve(repoRoot, "today.md");

if (!existsSync(boardPath) || !existsSync(todayPath)) {
  console.log("Canonical source files are outside this upload. Using the committed board snapshot.");
  process.exit(0);
}

const boardText = readFileSync(boardPath, "utf8");
const todayText = readFileSync(todayPath, "utf8");
const overrides = JSON.parse(readFileSync(resolve(projectRoot, "priority-overrides.json"), "utf8"));

const sourceDate = todayText.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)?.[1] ?? new Date().toISOString().slice(0, 10);
const sourceYear = Number(sourceDate.slice(0, 4));
const week = boardText.match(/^week:\s*(.+)$/m)?.[1] ?? "Current week";

const areaWeights = {
  "New business": 60,
  Creepers: 64,
  "Better at Work": 52,
  "Laing O'Rourke": 68,
  "Money and admin": 66,
  Health: 38,
};

function cleanTitle(value) {
  return value
    .replace(/<!--\s*linear:[^>]+-->/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}

function inferDue(title) {
  const explicit = title.match(/(?:Tomorrow,\s*)?(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
  if (!explicit) return null;
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const month = months.indexOf(explicit[2].toLowerCase()) + 1;
  return `${sourceYear}-${String(month).padStart(2, "0")}-${String(Number(explicit[1])).padStart(2, "0")}`;
}

function inferActiveState(title, checked) {
  if (checked) return "done";
  if (/exporting|in edit|started|draft(?:ed| is written)|built and gated/i.test(title)) return "in-progress";
  return "todo";
}

function automaticScore(task) {
  if (task.state === "done") return 0;
  if (task.state === "parked") return 8;
  if (task.state === "scheduled") return 24;
  if (task.state === "waiting") return 18;

  let score = areaWeights[task.area] ?? 44;
  if (task.state === "in-progress") score += 20;
  if (/tomorrow|before \d{1,2} /i.test(task.title)) score += 18;
  if (/£|payment|cash|invoice|purchase order|VAT|HMRC|PAYE|tax/i.test(task.title)) score += 12;
  if (/WhatsApp|send|book|lock the date/i.test(task.title)) score += 8;
  if (/deploy.*only after|park|when .* approved/i.test(task.title)) score -= 12;
  return Math.max(1, Math.min(99, score));
}

function automaticReason(task) {
  if (task.state === "waiting") return "Visible, but owned by somebody else or blocked by an external response.";
  if (task.state === "scheduled") return "Deliberately dated. It should not steal attention from the active room.";
  if (task.state === "parked") return "Explicitly parked. No guilt, no daily resurfacing.";
  if (task.state === "done") return "Closed in the canonical weekly board.";
  if (task.state === "in-progress") return "Work is already moving. Finish before opening another loop.";
  if (task.due) return `Dated for ${task.due}.`;
  return "Ranked from client consequence, cash impact, dependency and effort already invested.";
}

const tasks = [];
let mode = null;
let area = null;

for (const line of boardText.split("\n")) {
  const heading2 = line.match(/^##\s+(.+)/);
  if (heading2) {
    const name = heading2[1].trim();
    mode = name === "Active board" ? "active"
      : name.startsWith("Awaiting") ? "waiting"
      : name === "Scheduled later" ? "scheduled"
      : name === "Parked" ? "parked"
      : null;
    area = null;
    continue;
  }

  const heading3 = line.match(/^###\s+(.+)/);
  if (heading3 && mode === "active") {
    area = heading3[1].trim();
    continue;
  }

  if (mode === "active") {
    const match = line.match(/^- \[([ xX])\]\s+(.+)$/);
    if (!match) continue;
    const title = cleanTitle(match[2]);
    const id = match[2].match(/<!--\s*linear:([^>\s]+)\s*-->/)?.[1] ?? `active-${slug(title)}`;
    tasks.push({
      id,
      title,
      area: area ?? "Active",
      state: inferActiveState(title, match[1].toLowerCase() === "x"),
      due: inferDue(title),
    });
    continue;
  }

  if (["waiting", "scheduled", "parked"].includes(mode)) {
    const match = line.match(/^-\s+(.+)/);
    if (!match) continue;
    const title = cleanTitle(match[1]);
    tasks.push({
      id: `${mode}-${slug(title)}`,
      title,
      area: mode === "waiting" ? "Awaiting" : mode === "scheduled" ? "Later" : "Parked",
      state: mode,
      due: inferDue(title),
    });
  }
}

for (const task of tasks) {
  const override = overrides[task.id];
  task.baseScore = override?.score ?? automaticScore({
    ...task,
    state: task.state === "done" ? "todo" : task.state,
  });
  task.score = task.state === "done" ? 0 : task.baseScore;
  task.reason = override?.reason ?? automaticReason(task);
  task.tier = task.state === "done" ? "Closed"
    : task.score >= 90 ? "Critical"
    : task.score >= 75 ? "High"
    : task.score >= 55 ? "Next"
    : "Later";
}

const active = tasks
  .filter((task) => task.state === "todo" || task.state === "in-progress")
  .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
active.forEach((task, index) => { task.rank = index + 1; });
tasks.filter((task) => !active.includes(task)).forEach((task) => { task.rank = null; });

const stateOrder = { "in-progress": 0, todo: 1, waiting: 2, scheduled: 3, parked: 4, done: 5 };
tasks.sort((a, b) => {
  if (active.includes(a) && active.includes(b)) {
    return b.score - a.score || a.title.localeCompare(b.title);
  }
  if (active.includes(a)) return -1;
  if (active.includes(b)) return 1;
  return stateOrder[a.state] - stateOrder[b.state] || b.score - a.score;
});

const closedThisWeek = tasks.filter((task) => task.state === "done").length;
const weeklyTotal = active.length + closedThisWeek;
const open = tasks.filter((task) => task.state !== "done").length;
const xp = closedThisWeek * 120 + tasks.filter((task) => task.state === "in-progress").length * 25;

let sourceCommit = "local";
try {
  sourceCommit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: repoRoot, encoding: "utf8" }).trim();
} catch {}

const output = {
  title: "The Board Room",
  week,
  sourceDate,
  generatedAt: new Date().toISOString(),
  sourceCommit,
  summary: {
    open,
    active: active.length,
    inProgress: tasks.filter((task) => task.state === "in-progress").length,
    waiting: tasks.filter((task) => task.state === "waiting").length,
    scheduled: tasks.filter((task) => task.state === "scheduled").length,
    parked: tasks.filter((task) => task.state === "parked").length,
    closedThisWeek,
    completion: weeklyTotal ? Math.round((closedThisWeek / weeklyTotal) * 100) : 100,
    xp,
    level: Math.floor(xp / 500) + 1,
  },
  tasks,
};

const snapshotPath = resolve(projectRoot, "app/generated-board.json");

if (process.env.HWL_BOARD_FROZEN_SNAPSHOT === "1") {
  // Deploy validation runs in a clean detached checkout that must stay
  // byte-identical to the pushed commit. generatedAt and sourceCommit are
  // stamped pre-commit, so they can never match a post-commit regeneration;
  // everything else is a pure function of the committed sources and must match.
  const stripVolatile = (snapshot) => {
    const stable = { ...snapshot };
    delete stable.generatedAt;
    delete stable.sourceCommit;
    return stable;
  };
  let committed;
  try {
    committed = JSON.parse(readFileSync(snapshotPath, "utf8"));
  } catch (error) {
    console.error(`Frozen snapshot check failed: cannot read committed snapshot: ${error.message}`);
    process.exit(1);
  }
  if (JSON.stringify(stripVolatile(output), null, 2) !== JSON.stringify(stripVolatile(committed), null, 2)) {
    console.error("Frozen snapshot check failed: app/generated-board.json does not match its canonical sources. Rerun the nightly snapshot and commit before deploying.");
    process.exit(1);
  }
  console.log(`Frozen snapshot verified against canonical sources: ${output.summary.active} active, ${output.summary.open} open, ${closedThisWeek} closed. Nothing written.`);
  process.exit(0);
}

writeFileSync(snapshotPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Board generated: ${output.summary.active} active, ${output.summary.open} open, ${closedThisWeek} closed.`);
