import { appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_FILE = resolve(__dirname, "..", "_log.md");

function ts() {
  return new Date().toISOString();
}

export function log(level, msg, meta) {
  const line = `[${ts()}] ${level.toUpperCase()} ${msg}${meta ? " " + JSON.stringify(meta) : ""}`;
  console.log(line);
  try {
    appendFileSync(LOG_FILE, line + "\n");
  } catch (e) {
    // best-effort
  }
}

export const info = (m, meta) => log("info", m, meta);
export const warn = (m, meta) => log("warn", m, meta);
export const err = (m, meta) => log("error", m, meta);
