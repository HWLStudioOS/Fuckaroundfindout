import { del, get, list } from "@vercel/blob";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { reconcileBoardText } from "./reconcile-board-events-core.mjs";

const EVENT_PREFIX = "board-room-events/";
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(projectRoot, "..");
const boardPath = resolve(repoRoot, "this-week.md");
const envPath = resolve(projectRoot, ".env.local");

function localEnvValue(key) {
  if (!existsSync(envPath)) return null;
  const line = readFileSync(envPath, "utf8")
    .split("\n")
    .find((candidate) => candidate.startsWith(`${key}=`));
  if (!line) return null;
  const raw = line.slice(key.length + 1).trim();
  if (raw.startsWith('"')) {
    try { return JSON.parse(raw); } catch { return null; }
  }
  return raw;
}

const token = process.env.BLOB_READ_WRITE_TOKEN ?? localEnvValue("BLOB_READ_WRITE_TOKEN");
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is missing from the Board Room environment.");

const blobs = [];
let cursor;
do {
  const page = await list({ prefix: EVENT_PREFIX, limit: 1000, cursor, token });
  blobs.push(...page.blobs);
  cursor = page.hasMore ? page.cursor : undefined;
} while (cursor);

const storedEvents = (await Promise.all(blobs.map(async (blob) => {
  const stored = await get(blob.pathname, { access: "private", token });
  if (stored?.statusCode !== 200 || !stored.stream) return null;
  const event = JSON.parse(await new Response(stored.stream).text());
  if (event?.version !== 1 || typeof event.id !== "string" || typeof event.updatedAt !== "string") return null;
  return { event, pathname: blob.pathname };
}))).filter(Boolean);

const reconciliation = reconcileBoardText(
  readFileSync(boardPath, "utf8"),
  storedEvents.map((stored) => stored.event),
);
const settledIds = new Set(reconciliation.settledTaskIds);
const deletable = storedEvents
  .filter((stored) => settledIds.has(stored.event.id))
  .map((stored) => stored.pathname);

if (reconciliation.applied) writeFileSync(boardPath, reconciliation.text);
for (const pathname of deletable) await del(pathname, { token });

console.log(`Board Room reconciliation: ${reconciliation.applied} task(s) applied, ${deletable.length} settled event(s) cleared.`);
