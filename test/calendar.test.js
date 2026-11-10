import test from "node:test";
import assert from "node:assert/strict";

import {
  createInterviewCalendar,
  escapeCalendarText,
  formatCalendarDate
} from "../lib/calendar.js";

test("escapes calendar punctuation and line breaks", () => {
  assert.equal(escapeCalendarText("One, two;\nthree\\four"), "One\\, two\\;\\nthree\\\\four");
});

test("formats UTC dates for iCalendar", () => {
  assert.equal(formatCalendarDate("2026-11-12T02:00:00Z"), "20261112T020000Z");
});

test("exports only scheduled interviews as one-hour events", () => {
  const calendar = createInterviewCalendar([
    {
      id: "one",
      company: "Acme, Inc.",
      role: "Engineer",
      location: "Singapore; Room 2",
      interviewAt: "2026-11-12T02:00:00Z"
    },
    { id: "two", company: "No Date", role: "Engineer", location: "Remote" }
  ], new Date("2026-11-10T00:00:00Z"));

  assert.equal((calendar.match(/BEGIN:VEVENT/g) ?? []).length, 1);
  assert.match(calendar, /DTSTART:20261112T020000Z/);
  assert.match(calendar, /DTEND:20261112T030000Z/);
  assert.match(calendar, /SUMMARY:Interview: Engineer at Acme\\, Inc\./);
});
