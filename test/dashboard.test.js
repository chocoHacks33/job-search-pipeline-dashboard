import test from "node:test";
import assert from "node:assert/strict";

import {
  buildApplicationActivity,
  formatShortDate,
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

test("buildApplicationActivity creates a continuous daily series", () => {
  const applications = [
    { appliedAt: "2026-11-08" },
    { appliedAt: "2026-11-10" },
    { appliedAt: "2026-11-10" }
  ];

  assert.deepEqual(
    buildApplicationActivity(applications, "2026-11-11T18:00:00Z", 4),
    [
      { date: "2026-11-08", label: "8 Nov", count: 1 },
      { date: "2026-11-09", label: "9 Nov", count: 0 },
      { date: "2026-11-10", label: "10 Nov", count: 2 },
      { date: "2026-11-11", label: "11 Nov", count: 0 }
    ]
  );
});

test("buildApplicationActivity rejects invalid window sizes", () => {
  assert.throws(() => buildApplicationActivity([], new Date(), 0), RangeError);
});
