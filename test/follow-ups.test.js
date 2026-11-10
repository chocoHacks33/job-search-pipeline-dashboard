import test from "node:test";
import assert from "node:assert/strict";

import { describeDueDate, getFollowUpReminders } from "../widgets/follow-ups.js";

const today = new Date("2026-11-10T12:00:00Z");

test("returns due and overdue active applications in chronological order", () => {
  const reminders = getFollowUpReminders([
    { company: "Later", status: "screen", nextStepAt: "2026-11-16" },
    { company: "Past", status: "applied", nextStepAt: "2026-11-08" },
    { company: "Closed", status: "rejected", nextStepAt: "2026-11-09" },
    { company: "Distant", status: "interview", nextStepAt: "2026-12-01" }
  ], today);

  assert.deepEqual(reminders.map(({ company, daysUntil }) => [company, daysUntil]), [
    ["Past", -2],
    ["Later", 6]
  ]);
});

test("describes reminder urgency in plain language", () => {
  assert.equal(describeDueDate(-2), "2d overdue");
  assert.equal(describeDueDate(0), "Due today");
  assert.equal(describeDueDate(1), "Due tomorrow");
  assert.equal(describeDueDate(4), "Due in 4d");
});
