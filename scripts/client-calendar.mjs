#!/usr/bin/env node
// Read a client's LIVE content calendar and report which slots are genuinely open.
//
// The repo's CSVs are stale. business/clients/creepers-calendar-2026-jun-sep.csv
// has 65 rows and 50 carry no status, including July slots long past. An empty
// status there means nobody went back and marked it, not that the slot is free.
// Proposing a test against one of those wastes a run.
//
// The deployed calendar is authoritative: it is what the client is shown and
// what Harrison keeps current. It is versioned and records a live url on
// anything already published.
//
// Adding a client is config, not code. Put them in
// business/clients/calendars.json and this picks them up.
//
//   node scripts/client-calendar.mjs                 every active client
//   node scripts/client-calendar.mjs creepers        one client
//   node scripts/client-calendar.mjs creepers --json machine-readable

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = join(ROOT, "business", "clients", "calendars.json");
const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const wanted = args.find((a) => !a.startsWith("--"));

/** "w/c 17 August" + day-of-month + month name -> a real Date, or null. */
export function resolveDate(monthName, dayOfMonth, year) {
  const m = MONTHS.indexOf(String(monthName || "").trim().toLowerCase());
  const d = parseInt(dayOfMonth, 10);
  if (m < 0 || Number.isNaN(d)) return null;
  return new Date(Date.UTC(year, m, d));
}

/** A slot is open when nothing has shipped and nothing is banked against it. */
export function isOpen(post) {
  if (post.url) return false;                       // already published
  const note = String(post.note || "").toLowerCase();
  if (note.includes("live")) return false;
  if (note.includes("posted")) return false;
  if (note.includes("banked")) return false;
  return true;
}

async function loadClient(key, client, today) {
  if (!client.url) return { key, label: client.label, error: "no deployed calendar" };
  let payload;
  try {
    const res = await fetch(client.url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return { key, label: client.label, error: `HTTP ${res.status}` };
    payload = await res.json();
  } catch (err) {
    return { key, label: client.label, error: err.message };
  }

  const year = today.getUTCFullYear();
  const slots = [];
  for (const week of payload.WEEKS || []) {
    for (const post of week.posts || []) {
      const when = resolveDate(week.month, post.dt, year);
      slots.push({
        date: when ? when.toISOString().slice(0, 10) : null,
        week: week.wc,
        day: post.d,
        channel: client.channels?.[post.ch] || post.ch,
        series: post.series,
        title: post.title,
        format: post.fmt,
        note: post.note,
        published: Boolean(post.url),
        open: isOpen(post),
        future: when ? when >= today : false,
      });
    }
  }

  return {
    key,
    label: client.label,
    planVersion: payload.planVersion,
    total: slots.length,
    published: slots.filter((s) => s.published).length,
    // The only slots worth proposing against: open AND not in the past.
    actionable: slots.filter((s) => s.open && s.future),
    shoots: (payload.WEEKS || []).flatMap((w) => (w.shoots || []).map((s) => ({ week: w.wc, ...s }))),
  };
}

const config = JSON.parse(readFileSync(CONFIG, "utf8"));
const today = new Date();
today.setUTCHours(0, 0, 0, 0);

const entries = Object.entries(config.clients).filter(
  ([k, c]) => (wanted ? k === wanted : c.active)
);

if (entries.length === 0) {
  console.error(wanted ? `  unknown client: ${wanted}` : "  no active clients");
  process.exit(1);
}

const results = [];
for (const [key, client] of entries) results.push(await loadClient(key, client, today));

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    if (r.error) {
      console.log(`  ${r.label}: ${r.error}`);
      continue;
    }
    console.log(`  ${r.label}  plan ${r.planVersion}  ${r.published}/${r.total} published`);
    if (r.actionable.length === 0) {
      console.log("    no open future slots. A quiet week is a real answer.");
    }
    for (const s of r.actionable.slice(0, 6)) {
      console.log(`    ${s.date}  ${s.day.padEnd(3)}  ${String(s.channel).padEnd(22)} ${String(s.format || "").padEnd(9)} ${s.title}`);
    }
    if (r.shoots.length) {
      console.log(`    shoots: ${r.shoots.map((s) => `${s.id} ${s.d || ""}`.trim()).join(", ")}`);
    }
  }
}
