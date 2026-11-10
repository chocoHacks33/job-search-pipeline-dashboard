import test from "node:test";
import assert from "node:assert/strict";

import {
  createApplicationsCsv,
  escapeCsvCell,
  protectSpreadsheetValue
} from "../lib/csv.js";

test("protects formula-like spreadsheet values", () => {
  assert.equal(protectSpreadsheetValue("=1+1"), "'=1+1");
  assert.equal(protectSpreadsheetValue("@SUM(A1)"), "'@SUM(A1)");
  assert.equal(protectSpreadsheetValue("Safe company"), "Safe company");
});

test("quotes commas, quotes, and line breaks", () => {
  assert.equal(escapeCsvCell('Acme, "Global"'), '"Acme, ""Global"""');
});

test("exports a stable header and one row per application", () => {
  const csv = createApplicationsCsv([{
    company: "Acme, Inc.",
    role: "Engineer",
    status: "interview",
    location: "Singapore",
    appliedAt: "2026-11-01",
    updatedAt: "2026-11-09",
    nextStepAt: "2026-11-12"
  }]);

  const lines = csv.split("\r\n");
  assert.equal(lines.length, 2);
  assert.equal(lines[0], "Company,Role,Stage,Location,Applied,Last updated,Next step");
  assert.match(lines[1], /^"Acme, Inc\.",Engineer,interview/);
});
