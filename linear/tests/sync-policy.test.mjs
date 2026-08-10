import assert from "node:assert/strict";
import test from "node:test";
import { linkedTaskOwnership, shouldCreateIssue } from "../lib/sync-policy.js";

test("only the state-recorded source may write a linked issue", () => {
  const cached = { sourcePath: "this-week.md" };
  assert.deepEqual(linkedTaskOwnership(cached, "this-week.md"), {
    process: true,
    reason: "owner",
    owner: "this-week.md",
  });
  assert.deepEqual(linkedTaskOwnership(cached, "today.md"), {
    process: false,
    reason: "non-owner",
    owner: "this-week.md",
  });
});

test("a stale marker without state ownership fails closed", () => {
  assert.deepEqual(linkedTaskOwnership(undefined, "today.md"), {
    process: false,
    reason: "missing-owner",
  });
});

test("today can mirror tasks without creating duplicate issues", () => {
  assert.equal(shouldCreateIssue({ path: "today.md", createIssues: false }), false);
  assert.equal(shouldCreateIssue({ path: "this-week.md" }), true);
  assert.equal(shouldCreateIssue(undefined), true);
});
