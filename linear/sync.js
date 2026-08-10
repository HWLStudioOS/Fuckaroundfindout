#!/usr/bin/env node
// Bidirectional poll. Single primary team. Push new/changed markdown checkboxes to
// Linear, pull state-flips back to markdown, append a delta line to _deltas.md.
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  listIssues,
  createIssue,
  updateIssue,
  listLabels,
  listWorkflowStates,
} from "./lib/linear.js";
import {
  readFile,
  writeFile,
  extractTasks,
  setTaskLinearId,
  setTaskChecked,
  listMarkdownFiles,
} from "./lib/markdown.js";
import { linkedTaskOwnership, shouldCreateIssue } from "./lib/sync-policy.js";
import { info, warn, err } from "./lib/log.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(readFileSync(resolve(__dirname, "config.json"), "utf8"));
const STATE_PATH = resolve(__dirname, CONFIG.stateFile);
const DELTA_PATH = resolve(__dirname, "_deltas.md");
const DRY = !!process.env.DRY_RUN;

function loadState() {
  if (!existsSync(STATE_PATH))
    throw new Error("State missing. Run bootstrap + import first.");
  return JSON.parse(readFileSync(STATE_PATH, "utf8"));
}
function saveState(s) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}
function appendDelta(line) {
  if (!existsSync(DELTA_PATH)) writeFileSync(DELTA_PATH, "# Linear deltas\n\n");
  appendFileSync(DELTA_PATH, line + "\n");
}

function trackedFiles(state) {
  const set = new Set(Object.keys(state.projects));
  for (const s of CONFIG.taskListSources) set.add(s.path);
  return [...set];
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

async function pushChanges(state) {
  const teamId = state.team.id;
  let created = 0;
  let flipped = 0;
  const warnedMarkers = new Set();

  for (const rel of trackedFiles(state)) {
    const fullPath = resolve(CONFIG.vaultRoot, rel);
    if (!existsSync(fullPath)) continue;
    const text = readFile(fullPath);
    const { tasks } = extractTasks(text);
    if (tasks.length === 0) continue;

    let mutated = text;
    const project = state.projects[rel];
    const labelIds = [];
    const labelMap = await getLabelMap(teamId);
    if (project?.label && labelMap[project.label]) labelIds.push(labelMap[project.label]);
    const taskSrc = CONFIG.taskListSources.find((s) => s.path === rel);
    if (taskSrc?.label && labelMap[taskSrc.label]) labelIds.push(labelMap[taskSrc.label]);
    const stateMap = await getStateMap(teamId);

    for (const t of tasks) {
      if (!t.linear) {
        if (!shouldCreateIssue(taskSrc)) continue;
        if (DRY) {
          info(`[DRY] would create "${t.text.slice(0, 60)}"`);
          continue;
        }
        const issue = await createIssue({
          teamId,
          projectId: project?.id,
          title: t.text.slice(0, 200),
          description: `Synced from \`${rel}\``,
          labelIds: labelIds.length ? labelIds : undefined,
          dueDate: t.due || undefined,
          stateId: t.checked
            ? stateMap.completed?.id
            : stateMap.unstarted?.id || stateMap.backlog?.id,
        });
        info(`push + ${issue.identifier} ${t.text.slice(0, 60)}`);
        mutated = setTaskLinearId(mutated, t.lineIdx, issue.identifier);
        state.issues[issue.identifier] = {
          id: issue.id,
          sourcePath: rel,
          line: t.lineIdx,
          title: t.text,
          checked: t.checked,
          projectId: project?.id || null,
        };
        created++;
      } else {
        const cached = state.issues[t.linear];
        const ownership = linkedTaskOwnership(cached, rel);
        if (!ownership.process) {
          const warningKey = `${t.linear}:${rel}`;
          if (!warnedMarkers.has(warningKey)) {
            const detail = ownership.reason === "non-owner"
              ? `owned by ${ownership.owner}`
              : "missing from linear/.state.json";
            warn(`skip ${t.linear} in ${rel}: ${detail}; duplicate or stale markers cannot write issue state`);
            warnedMarkers.add(warningKey);
          }
          continue;
        }
        if (cached && cached.checked !== t.checked) {
          if (DRY) {
            info(`[DRY] would flip ${t.linear} → ${t.checked ? "done" : "todo"}`);
          } else {
            const target = t.checked ? stateMap.completed?.id : stateMap.unstarted?.id;
            if (target) {
              await updateIssue(cached.id, { stateId: target });
              info(`push ~ ${t.linear} → ${t.checked ? "done" : "todo"}`);
              flipped++;
              cached.checked = t.checked;
            }
          }
        }
        if (cached) cached.checked = t.checked;
      }
    }
    if (!DRY && mutated !== text) writeFile(fullPath, mutated);
  }
  return { created, flipped };
}

async function pullChanges(state) {
  const since = state.lastSync || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let pulled = 0;
  const issues = await listIssues(state.team.id, since);
  for (const iss of issues) {
    const tracked = state.issues[iss.identifier];
    if (!tracked) continue;
    const isCompleted = iss.state.type === "completed";
    const isCanceled = iss.state.type === "canceled";
    const newChecked = isCompleted || isCanceled;
    const fullPath = resolve(CONFIG.vaultRoot, tracked.sourcePath);
    if (!existsSync(fullPath)) continue;
    const text = readFile(fullPath);
    const { tasks } = extractTasks(text);
    const t = tasks.find((x) => x.linear === iss.identifier);
    if (!t) continue;
    if (t.checked !== newChecked) {
      if (DRY) {
        info(`[DRY] would flip md ${iss.identifier} → ${newChecked ? "x" : " "}`);
      } else {
        const mutated = setTaskChecked(text, t.lineIdx, newChecked);
        writeFile(fullPath, mutated);
        const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
        appendDelta(
          `- ${stamp} ${iss.identifier} → ${iss.state.name} :: ${iss.title}  (\`${tracked.sourcePath}\`)`,
        );
        info(`pull ~ ${iss.identifier} → ${newChecked ? "done" : "todo"}`);
        tracked.checked = newChecked;
        pulled++;
      }
    }
  }
  return { pulled };
}

async function main() {
  const state = loadState();
  if (!state.team) throw new Error("state.team missing. Re-run bootstrap.");
  info(`Sync start. Last: ${state.lastSync || "(never)"}`);

  const push = await pushChanges(state);
  const pull = await pullChanges(state);

  if (!DRY) {
    state.lastSync = new Date().toISOString();
    saveState(state);
  }
  info(
    `Sync done. push: +${push.created} ~${push.flipped}. pull: ~${pull.pulled}.${DRY ? " (DRY)" : ""}`,
  );
}

main().catch((e) => {
  err("Sync failed: " + e.message);
  console.error(e);
  process.exit(1);
});
