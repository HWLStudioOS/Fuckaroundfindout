import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative, basename, extname, dirname } from "node:path";

export function readFile(p) {
  return readFileSync(p, "utf8");
}

export function writeFile(p, c) {
  writeFileSync(p, c);
}

export function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { data: {}, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: text };
  const raw = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\n/, "");
  const data = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].trim();
  }
  return { data, body };
}

export function stringifyFrontmatter(data, body) {
  const keys = Object.keys(data);
  if (keys.length === 0) return body;
  const lines = keys.map((k) => `${k}: ${data[k]}`);
  return `---\n${lines.join("\n")}\n---\n\n${body.replace(/^\n+/, "")}`;
}

export function listMarkdownFiles(root, globSpec) {
  const { glob, exclude = [] } = typeof globSpec === "string" ? { glob: globSpec } : globSpec;
  const [dirPart, filePart] = splitGlob(glob);
  const dir = resolve(root, dirPart);
  if (!existsSync(dir)) return [];
  const out = [];
  walk(dir, (full) => {
    if (!full.endsWith(".md")) return;
    const rel = relative(root, full);
    if (exclude.includes(rel)) return;
    if (matchesPattern(rel, glob)) out.push(full);
  });
  return out;
}

function splitGlob(g) {
  const idx = g.indexOf("*");
  if (idx === -1) return [dirname(g), basename(g)];
  return [g.slice(0, idx).replace(/\/$/, "") || ".", g.slice(idx)];
}

function matchesPattern(rel, glob) {
  const re = new RegExp(
    "^" +
      glob
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*\*/g, "::DOUBLESTAR::")
        .replace(/\*/g, "[^/]*")
        .replace(/::DOUBLESTAR::/g, ".*") +
      "$",
  );
  return re.test(rel);
}

function walk(dir, visit) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, visit);
    else visit(full);
  }
}

// Extract markdown task list items. Returns { line, idx, checked, text, due, linear }
// Format we round-trip:
//   - [ ] Task text @due(2026-05-12) <!-- linear:CLI-12 -->
//   - [x] Done text <!-- linear:CLI-12 -->
const TASK_RE = /^(\s*)-\s*\[([ xX])\]\s*(.+?)\s*$/;
const DUE_RE = /@due\((\d{4}-\d{2}-\d{2})\)/;
const LINK_RE = /<!--\s*linear:([A-Z]+-\d+)\s*-->/;

export function extractTasks(text) {
  const lines = text.split("\n");
  const tasks = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(TASK_RE);
    if (!m) continue;
    const [, indent, mark, rawText] = m;
    const due = (rawText.match(DUE_RE) || [])[1] || null;
    const link = (rawText.match(LINK_RE) || [])[1] || null;
    let cleanText = rawText.replace(DUE_RE, "").replace(LINK_RE, "").trim();
    tasks.push({
      lineIdx: i,
      indent,
      checked: mark.toLowerCase() === "x",
      text: cleanText,
      due,
      linear: link,
      raw: lines[i],
    });
  }
  return { lines, tasks };
}

export function setTaskLinearId(textBody, lineIdx, identifier) {
  const lines = textBody.split("\n");
  if (lines[lineIdx].includes("<!-- linear:")) {
    lines[lineIdx] = lines[lineIdx].replace(LINK_RE, `<!-- linear:${identifier} -->`);
  } else {
    lines[lineIdx] = lines[lineIdx].trimEnd() + ` <!-- linear:${identifier} -->`;
  }
  return lines.join("\n");
}

export function setTaskChecked(textBody, lineIdx, checked) {
  const lines = textBody.split("\n");
  lines[lineIdx] = lines[lineIdx].replace(/-\s*\[[ xX]\]/, `- [${checked ? "x" : " "}]`);
  return lines.join("\n");
}

export function projectNameFromPath(filePath) {
  const base = basename(filePath, extname(filePath));
  // Convert kebab/snake to Title Case for project name
  return base
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function firstHeading(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

export function extractSection(body, headingText) {
  const re = new RegExp(`^##\\s+${headingText}\\s*$`, "im");
  const m = body.match(re);
  if (!m) return null;
  const start = m.index + m[0].length;
  const rest = body.slice(start);
  const nextHeading = rest.match(/^##\s+/m);
  const end = nextHeading ? nextHeading.index : rest.length;
  return { start: m.index, contentStart: start, contentEnd: start + end, content: rest.slice(0, end) };
}
