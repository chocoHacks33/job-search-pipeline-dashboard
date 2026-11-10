import test from "node:test";
import assert from "node:assert/strict";

import { filterApplicationsByStage } from "../lib/filters.js";

const sample = [
  { id: 1, status: "applied" },
  { id: 2, status: "interview" },
  { id: 3, status: "interview" }
];

test("returns a copy when every stage is selected", () => {
  const result = filterApplicationsByStage(sample, "all");
  assert.deepEqual(result, sample);
  assert.notEqual(result, sample);
});

test("filters applications to one selected stage", () => {
  assert.deepEqual(filterApplicationsByStage(sample, "interview").map(({ id }) => id), [2, 3]);
});

test("returns no applications for an unknown stage", () => {
  assert.deepEqual(filterApplicationsByStage(sample, "unknown"), []);
});
