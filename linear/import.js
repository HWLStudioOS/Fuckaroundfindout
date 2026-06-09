#!/usr/bin/env node
// One-shot import: every source markdown file's task list → Linear issues, all in
// the primary team. Issues get the project's group label + any task-source label.
// Idempotent via <!-- linear:HWL-12 --> markers in the markdown.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createIssue,
  listLabels,
  listWorkflowStates,
} from "./lib/linear.js";
import {
  readFile,
  writeFile,
  extractTasks,
  setTaskLinearId,
  parseFrontmatter,
  extractSection,
} from "./lib/markdown.js";
import { info, warn } from "./lib/log.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(readFileSync(resolve(__dirname, "config.json"), "utf8"));
const STATE_PATH = resolve(__dirname, CONFIG.stateFile);
const DRY = !!process.env.DRY_RUN;

function loadState() {
  if (!existsSync(STATE_PATH))
    throw new Error("State file missing. Run `node bootstrap.js` first.");
  return JSON.parse(readFileSync(STATE_PATH, "utf8"));
}
function saveState(s) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

let _labelMap = null;
let _stateMap = null;
async function getLabelMap(teamId) {
  if (_labelMap) return _labelMap;
  const labels = await listLabels(teamId);
  return (_labelMap = Object.fromEntries(labels.map((l) => [l.name.toLowerCase(), l.id])));
}
async function getStateMap(teamId) {
  if (_stateMap) return _stateMap;
  const states = await listWorkflowStates(teamId);
  return (_stateMap = Object.fromEntries(states.map((s) => [s.type, s])));
}

async function importFile(state, rel, opts) {
  const teamId = state.team.id;
  const fullPath = resolve(CONFIG.vaultRoot, rel);
  if (!existsSync(fullPath)) {
    warn(`Source not found: ${rel}`);
    return 0;
  }
  const source = readFile(fullPath);

  // Section-limited or full
  let searchText = source;
  if (opts.section) {
    const { body } = parseFrontmatter(source);
    const sec = extractSection(body, opts.section);
    if (!sec) {
      warn(`Section "${opts.section}" not found in ${rel}`);
      return 0;
    }
    searchText = sec.content;
  }

  const { tasks: tasksInSearch } = extractTasks(searchText);
  if (tasksInSearch.length === 0) return 0;

  const { tasks: allTasks } = extractTasks(source);

  // Map section-task-text to full-file line index (handles section-limited imports)
  const findLineIdx = (text, checked) => {
    const norm = (s) => s.replace(/<!--.*?-->/g, "").replace(/@due\([^)]+\)/, "").trim();
    return allTasks.find((t) => norm(t.text) === norm(text) && t.checked === checked)?.lineIdx;
  };

  const labelMap = await getLabelMap(teamId);
  const stateMap = await getStateMap(teamId);

  const labelIds = [];
  const project = state.projects[rel];
  if (project?.label && labelMap[project.label]) labelIds.push(labelMap[project.label]);
  if (opts.label && labelMap[opts.label.toLowerCase()]) labelIds.push(labelMap[opts.label.toLowerCase()]);

  let mutated = source;
  let created = 0;

  for (const t of tasksInSearch) {
    if (t.linear) continue;
    const lineIdx = findLineIdx(t.text, t.checked);
    if (lineIdx === undefined) {
      warn(`  could not locate line for "${t.text.slice(0, 60)}"`);
      continue;
    }

    if (DRY) {
      info(`  [DRY] + ${t.text.slice(0, 60)}${t.due ? " @" + t.due : ""}`);
      created++;
      continue;
    }

    const issue = await createIssue({
      teamId,
      projectId: project?.id,
      title: t.text.slice(0, 200),
      description: `Imported from \`${rel}\``,
      labelIds: labelIds.length ? labelIds : undefined,
      dueDate: t.due || undefined,
      stateId: t.checked
        ? stateMap.completed?.id
        : stateMap.unstarted?.id || stateMap.backlog?.id,
    });
    info(`  + ${issue.identifier} ${t.text.slice(0, 60)}`);
    mutated = setTaskLinearId(mutated, lineIdx, issue.identifier);
    state.issues[issue.identifier] = {
      id: issue.id,
      sourcePath: rel,
      line: lineIdx,
      title: t.text,
      checked: t.checked,
      projectId: project?.id || null,
    };
    created++;
  }

  if (!DRY && mutated !== source) {
    writeFile(fullPath, mutated);
    info(`  ↳ stamped ${rel}`);
  }
  return created;
}

async function main() {
  const state = loadState();
  if (!state.team) throw new Error("state.team missing. Re-run bootstrap.");

  let total = 0;

  // Project source files
  for (const [rel] of Object.entries(state.projects)) {
    info(`Importing ${rel}`);
    total += await importFile(state, rel, {});
  }

  // Task list sources (today.md, this-week.md)
  for (const src of CONFIG.taskListSources) {
    info(`Importing ${src.path}${src.section ? "#" + src.section : ""}`);
    total += await importFile(state, src.path, src);
  }

  if (!DRY) {
    state.lastSync = new Date().toISOString();
    saveState(state);
  }
  info(`Import complete. ${total} issue(s) created${DRY ? " (DRY)" : ""}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
