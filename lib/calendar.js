const HOUR_IN_MS = 60 * 60 * 1000;

export function escapeCalendarText(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function formatCalendarDate(value) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function createInterviewCalendar(applications, generatedAt = new Date()) {
  const interviews = applications
    .filter(({ interviewAt }) => interviewAt)
    .sort((left, right) => new Date(left.interviewAt) - new Date(right.interviewAt));

  const events = interviews.flatMap((application) => {
    const start = new Date(application.interviewAt);
    const end = new Date(start.getTime() + HOUR_IN_MS);
    return [
      "BEGIN:VEVENT",
      `UID:${escapeCalendarText(application.id)}@job-search-pipeline`,
      `DTSTAMP:${formatCalendarDate(generatedAt)}`,
      `DTSTART:${formatCalendarDate(start)}`,
      `DTEND:${formatCalendarDate(end)}`,
      `SUMMARY:${escapeCalendarText(`Interview: ${application.role} at ${application.company}`)}`,
      `LOCATION:${escapeCalendarText(application.location)}`,
      "END:VEVENT"
    ];
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Job Search Pipeline//Interview Calendar//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR"
  ].join("\r\n");
}

export function downloadCalendar(contents, filename) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
