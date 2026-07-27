import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(await readFile(new URL("../app/generated-board.json", import.meta.url), "utf8"));

test("generates the complete board state", () => {
  assert.equal(data.title, "The Board Room");
  assert.ok(data.summary.active > 0);
  assert.ok(data.summary.open >= data.summary.active);
  assert.ok(data.summary.closedThisWeek >= 2);
  assert.ok(data.tasks.some((task) => task.id === "HWL-184"));
  assert.ok(data.tasks.some((task) => task.state === "waiting"));
  assert.ok(data.tasks.some((task) => task.state === "scheduled"));
  assert.ok(data.tasks.some((task) => task.state === "parked"));
});

test("keeps active priority order deterministic", () => {
  const active = data.tasks.filter((task) => task.state === "todo" || task.state === "in-progress");
  assert.deepEqual(active.map((task) => task.rank), active.map((_, index) => index + 1));
  for (let index = 1; index < active.length; index += 1) {
    assert.ok(active[index - 1].score >= active[index].score);
  }
  assert.equal(active[0].id, "HWL-184");
});

test("does not turn waiting or parked work into active work", () => {
  const nonActive = data.tasks.filter((task) => ["waiting", "scheduled", "parked"].includes(task.state));
  assert.ok(nonActive.length > 0);
  assert.ok(nonActive.every((task) => task.rank === null));
});
