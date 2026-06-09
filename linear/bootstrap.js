#!/usr/bin/env node
// One-shot bootstrap: ensure labels exist + create one Linear project per markdown
// source file inside the primary team. Idempotent. Free-plan friendly (uses one team).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  viewer,
  listTeams,
  listProjects,
  createProject,
  listLabels,
  createLabel,
} from "./lib/linear.js";
import { listMarkdownFiles, readFile, firstHeading, projectNameFromPath } from "./lib/markdown.js";
import { info, warn } from "./lib/log.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(readFileSync(resolve(__dirname, "config.json"), "utf8"));
const STATE_PATH = resolve(__dirname, CONFIG.stateFile);

function loadState() {
  if (!existsSync(STATE_PATH))
    return { team: null, projects: {}, issues: {}, lastSync: null };
  return JSON.parse(readFileSync(STATE_PATH, "utf8"));
}
function saveState(s) {
  writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}

function projectDescriptionFromFile(fullPath, group) {
  // Linear caps description at 255 chars. Keep source + group + a brief tail.
  const body = readFile(fullPath);
  const rel = relative(CONFIG.vaultRoot, fullPath);
  const lines = body
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("---"));
  const sourceLine = `${group} · source: ${rel}`;
  const budget = 254 - sourceLine.length - 4;
  const firstPara = lines.slice(0, 3).join(" ").replace(/\s+/g, " ").slice(0, Math.max(0, budget));
  return budget > 0 ? `${sourceLine}\n\n${firstPara}` : sourceLine.slice(0, 254);
}

async function main() {
  const state = loadState();

  const { viewer: v, org } = await viewer();
  info(`Connected as ${v.name} <${v.email}> in workspace "${org.name}" (${org.urlKey})`);

  const teams = await listTeams();
  const primary = teams.find((t) => t.key === CONFIG.primaryTeamKey) || teams[0];
  if (!primary) throw new Error("No teams in workspace.");
  info(`Primary team: ${primary.key} "${primary.name}"`);
  state.team = { id: primary.id, key: primary.key, name: primary.name };

  // Labels
  const existingLabels = await listLabels(primary.id);
  const byLabelName = new Set(existingLabels.map((l) => l.name.toLowerCase()));
  const allLabels = [
    ...CONFIG.projectGroups.map((g) => g.label),
    ...(CONFIG.extraLabels || []),
  ];
  for (const lbl of allLabels) {
    if (byLabelName.has(lbl.toLowerCase())) continue;
    info(`  + label: ${lbl}`);
    await createLabel({ teamId: primary.id, name: lbl });
  }

  // Projects: one per source file, name = "{Group}: {Heading or filename}"
  const existingProjects = await listProjects(primary.id);
  const byProjectName = new Map(existingProjects.map((p) => [p.name.toLowerCase(), p]));

  for (const group of CONFIG.projectGroups) {
    for (const src of group.sources || []) {
      const files = listMarkdownFiles(CONFIG.vaultRoot, src);
      for (const f of files) {
        const heading = firstHeading(readFile(f)) || projectNameFromPath(f);
        const projName = `${group.name}: ${heading}`;
        const lookup = projName.toLowerCase();
        let p = byProjectName.get(lookup);
        if (!p) {
          info(`  + project: ${projName}  (${relative(CONFIG.vaultRoot, f)})`);
          p = await createProject({
            name: projName,
            description: projectDescriptionFromFile(f, group.name),
            teamIds: [primary.id],
          });
          byProjectName.set(lookup, p);
        } else {
          info(`  · project exists: ${projName}`);
        }
        state.projects[relative(CONFIG.vaultRoot, f)] = {
          id: p.id,
          name: projName,
          group: group.name,
          label: group.label,
        };
      }
    }
  }

  saveState(state);
  info(`Bootstrap complete. State: ${STATE_PATH}`);
  info(`Workspace URL: https://linear.app/${org.urlKey}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
