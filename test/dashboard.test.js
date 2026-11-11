import test from "node:test";
import assert from "node:assert/strict";

import {
  filterApplications,
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

test("filterApplications matches company, role, and location without case sensitivity", () => {
  const applications = [
    { company: "Northstar Labs", role: "Frontend Engineer", location: "Singapore" },
    { company: "Canopy Health", role: "Product Engineer", location: "Remote · APAC" }
  ];

  assert.deepEqual(filterApplications(applications, "NORTHSTAR"), [applications[0]]);
  assert.deepEqual(filterApplications(applications, "product"), [applications[1]]);
  assert.deepEqual(filterApplications(applications, "apac"), [applications[1]]);
});

test("filterApplications keeps every application for a blank query", () => {
  const applications = [{ company: "Northstar Labs" }];

  assert.deepEqual(filterApplications(applications, "   "), applications);
  assert.notEqual(filterApplications(applications, ""), applications);
});
