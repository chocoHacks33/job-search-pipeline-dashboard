const columns = [
  ["Company", "company"],
  ["Role", "role"],
  ["Stage", "status"],
  ["Location", "location"],
  ["Applied", "appliedAt"],
  ["Last updated", "updatedAt"],
  ["Next step", "nextStepAt"]
];

export function protectSpreadsheetValue(value) {
  const text = value == null ? "" : String(value);
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

export function escapeCsvCell(value) {
  const safeValue = protectSpreadsheetValue(value).replace(/"/g, '""');
  return /[",\r\n]/.test(safeValue) ? `"${safeValue}"` : safeValue;
}

export function createApplicationsCsv(applications) {
  const header = columns.map(([label]) => escapeCsvCell(label)).join(",");
  const rows = applications.map((application) =>
    columns.map(([, key]) => escapeCsvCell(application[key])).join(",")
  );
  return [header, ...rows].join("\r\n");
}

export function downloadCsv(contents, filename) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
