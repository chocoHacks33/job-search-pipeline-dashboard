import test from "node:test";
import assert from "node:assert/strict";

import {
  formatShortDate,
  getApplicationUpdateSignal,
  groupApplicationsByStage,
  summarizeApplications
} from "../lib/dashboard.js";

const sample = [
  { status: "applied" },
  { status: "screen" },
  { status: "interview" },
  { status: "offer" },
  { status: "rejected" }
];

test("summarizeApplications reports active work and response rate", () => {
  assert.deepEqual(summarizeApplications(sample), {
    total: 5,
    active: 4,
    interviews: 1,
    offers: 1,
    responseRate: 60
  });
});

test("summarizeApplications handles an empty pipeline", () => {
  assert.deepEqual(summarizeApplications([]), {
    total: 0,
    active: 0,
    interviews: 0,
    offers: 0,
    responseRate: 0
  });
});

test("groupApplicationsByStage creates every dashboard column", () => {
  const grouped = groupApplicationsByStage(sample);
  assert.equal(grouped.applied.length, 1);
  assert.equal(grouped.interview.length, 1);
  assert.equal(grouped.rejected.length, 1);
});

test("formatShortDate returns a concise local date", () => {
  assert.equal(formatShortDate("2026-11-09", "en-SG"), "9 Nov");
});

test("getApplicationUpdateSignal flags active applications after seven days", () => {
  assert.deepEqual(
    getApplicationUpdateSignal(
      { status: "applied", updatedAt: "2026-11-02" },
      "2026-11-11T18:00:00Z"
    ),
    {
      days: 9,
      needsAttention: true,
      label: "Updated 9 days ago · Follow up"
    }
  );
});

test("getApplicationUpdateSignal does not flag settled applications", () => {
  const signal = getApplicationUpdateSignal(
    { status: "rejected", updatedAt: "2026-10-27" },
    "2026-11-11T00:00:00Z"
  );

  assert.equal(signal.days, 15);
  assert.equal(signal.needsAttention, false);
  assert.equal(signal.label, "Updated 15 days ago");
});
