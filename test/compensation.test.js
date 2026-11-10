import test from "node:test";
import assert from "node:assert/strict";

import { formatSalary, summarizeCompensation } from "../widgets/compensation.js";

test("summarizes active roles that disclose complete salary ranges", () => {
  const summary = summarizeCompensation([
    { status: "applied", salaryMin: 60000, salaryMax: 80000 },
    { status: "interview", salaryMin: 80000, salaryMax: 100000 },
    { status: "rejected", salaryMin: 200000, salaryMax: 300000 },
    { status: "screen", salaryMin: 70000 }
  ]);

  assert.deepEqual(summary, { count: 2, averageMinimum: 70000, averageMaximum: 90000 });
});

test("returns an empty insight when no complete ranges are available", () => {
  assert.deepEqual(summarizeCompensation([]), { count: 0, averageMinimum: 0, averageMaximum: 0 });
});

test("formats Singapore dollar values without fractional noise", () => {
  assert.match(formatSalary(72000), /72,000/);
});
