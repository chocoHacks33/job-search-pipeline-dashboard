import test from "node:test";
import assert from "node:assert/strict";

import {
  formatShortDate,
  groupApplicationsByStage,
  summarizeStageDistribution,
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

test("summarizeStageDistribution reports counts and shares for every stage", () => {
  assert.deepEqual(summarizeStageDistribution(sample), [
    { stage: "applied", label: "Applied", count: 1, percentage: 20 },
    { stage: "screen", label: "Recruiter screen", count: 1, percentage: 20 },
    { stage: "interview", label: "Interview", count: 1, percentage: 20 },
    { stage: "offer", label: "Offer", count: 1, percentage: 20 },
    { stage: "rejected", label: "Closed", count: 1, percentage: 20 }
  ]);
});

test("summarizeStageDistribution handles an empty pipeline", () => {
  assert.equal(
    summarizeStageDistribution([]).every(({ count, percentage }) => count === 0 && percentage === 0),
    true
  );
});
