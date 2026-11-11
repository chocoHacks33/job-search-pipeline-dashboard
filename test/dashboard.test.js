import test from "node:test";
import assert from "node:assert/strict";

import {
  formatShortDate,
  groupApplicationsByStage,
  sortApplications,
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

test("sortApplications orders records without mutating the source", () => {
  const applications = [
    { company: "Zeta", appliedAt: "2026-11-01", updatedAt: "2026-11-04" },
    { company: "Alpha", appliedAt: "2026-11-03", updatedAt: "2026-11-02" },
    { company: "Beta", appliedAt: "2026-11-02", updatedAt: "2026-11-03" }
  ];

  assert.deepEqual(
    sortApplications(applications, "updated-asc").map(({ company }) => company),
    ["Alpha", "Beta", "Zeta"]
  );
  assert.deepEqual(
    sortApplications(applications, "applied-desc").map(({ company }) => company),
    ["Alpha", "Beta", "Zeta"]
  );
  assert.equal(applications[0].company, "Zeta");
});

test("sortApplications rejects unknown sort modes", () => {
  assert.throws(() => sortApplications([], "random"), RangeError);
});
