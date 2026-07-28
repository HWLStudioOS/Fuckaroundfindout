import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { mergeBoardEvents } from "../app/board-state.ts";
import { reconcileBoardText } from "../scripts/reconcile-board-events-core.mjs";

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

test("closes a task immediately and recalculates the room", () => {
  const expectedNext = data.tasks
    .filter((task) => task.id !== "HWL-184" && (task.state === "todo" || task.state === "in-progress"))
    .sort((a, b) => b.score - a.score)[0].id;
  const updated = mergeBoardEvents(data, [{
    version: 1,
    id: "HWL-184",
    state: "done",
    updatedAt: "2026-07-27T18:00:00.000Z",
  }]);

  assert.equal(updated.tasks.find((task) => task.id === "HWL-184").state, "done");
  assert.equal(updated.summary.active, data.summary.active - 1);
  assert.equal(updated.summary.closedThisWeek, data.summary.closedThisWeek + 1);
  assert.equal(updated.tasks.find((task) => task.rank === 1).id, expectedNext);
});

test("uses the newest edit for a task", () => {
  const updated = mergeBoardEvents(data, [
    {
      version: 1,
      id: "HWL-184",
      state: "done",
      updatedAt: "2026-07-27T18:00:00.000Z",
    },
    {
      version: 1,
      id: "HWL-184",
      title: "Check and send the finished Carey Garden edit.",
      state: "todo",
      updatedAt: "2026-07-27T18:01:00.000Z",
    },
  ]);

  const task = updated.tasks.find((candidate) => candidate.id === "HWL-184");
  assert.equal(task.state, "todo");
  assert.equal(task.title, "Check and send the finished Carey Garden edit.");
});

test("closes an active task before it has a Linear ID", () => {
  const fallbackTask = {
    ...data.tasks.find((task) => task.id === "HWL-184"),
    id: "active-confirm-david-s-550-monthly-payment-date-against",
  };
  const source = { ...data, tasks: [fallbackTask] };
  const updated = mergeBoardEvents(source, [{
    version: 1,
    id: fallbackTask.id,
    state: "done",
    updatedAt: "2026-07-28T09:30:00.000Z",
  }]);

  assert.equal(updated.tasks[0].state, "done");
  assert.equal(updated.summary.active, 0);
  assert.equal(updated.summary.closedThisWeek, 1);
});

test("reconciles a live edit into the canonical checkbox line", () => {
  const source = "- [ ] Old task title. <!-- linear:HWL-999 -->\n";
  const firstPass = reconcileBoardText(source, [{
    version: 1,
    id: "HWL-999",
    title: "Edited task title.",
    state: "done",
    updatedAt: "2026-07-27T18:02:00.000Z",
  }]);

  assert.equal(firstPass.text, "- [x] Edited task title. <!-- linear:HWL-999 -->\n");
  assert.equal(firstPass.applied, 1);
  assert.deepEqual(firstPass.settledTaskIds, []);

  const secondPass = reconcileBoardText(firstPass.text, [{
    version: 1,
    id: "HWL-999",
    title: "Edited task title.",
    state: "done",
    updatedAt: "2026-07-27T18:02:00.000Z",
  }]);
  assert.equal(secondPass.applied, 0);
  assert.deepEqual(secondPass.settledTaskIds, ["HWL-999"]);
});

test("reconciles and settles a markerless active task", () => {
  const id = "active-confirm-david-s-550-monthly-payment-date-against";
  const source = "- [ ] Confirm David’s £550 monthly payment date against Wise or the agreement.\n";
  const event = {
    version: 1,
    id,
    title: "Confirm David's £550 payment date and reply.",
    state: "done",
    updatedAt: "2026-07-28T09:31:00.000Z",
  };
  const firstPass = reconcileBoardText(source, [event]);

  assert.equal(firstPass.text, "- [x] Confirm David's £550 payment date and reply.\n");
  assert.equal(firstPass.applied, 1);

  const secondPass = reconcileBoardText(firstPass.text, [event]);
  assert.equal(secondPass.applied, 0);
  assert.deepEqual(secondPass.settledTaskIds, [id]);
});
