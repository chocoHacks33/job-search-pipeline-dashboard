const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toUtcDay(value) {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getFollowUpReminders(applications, today = new Date()) {
  const todayUtc = toUtcDay(today);

  return applications
    .filter(({ status, nextStepAt }) => status !== "rejected" && nextStepAt)
    .map((application) => ({
      ...application,
      daysUntil: Math.round((toUtcDay(`${application.nextStepAt}T00:00:00Z`) - todayUtc) / DAY_IN_MS)
    }))
    .filter(({ daysUntil }) => daysUntil <= 7)
    .sort((left, right) => left.daysUntil - right.daysUntil || left.company.localeCompare(right.company));
}

export function describeDueDate(daysUntil) {
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d overdue`;
  if (daysUntil === 0) return "Due today";
  if (daysUntil === 1) return "Due tomorrow";
  return `Due in ${daysUntil}d`;
}

export function renderFollowUpReminders(container, applications, today = new Date()) {
  const reminders = getFollowUpReminders(applications, today);
  if (!reminders.length) {
    const empty = document.createElement("p");
    empty.className = "empty-reminders";
    empty.textContent = "No follow-ups are due in the next seven days.";
    container.replaceChildren(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "reminder-list";
  reminders.forEach((reminder) => {
    const item = document.createElement("li");
    item.className = "reminder-item";
    const detail = document.createElement("div");
    const company = document.createElement("strong");
    company.textContent = reminder.company;
    const role = document.createElement("span");
    role.textContent = `${reminder.role} · ${reminder.status}`;
    detail.append(company, role);

    const due = document.createElement("span");
    due.className = "reminder-due";
    due.dataset.urgency = reminder.daysUntil < 0 ? "overdue" : "upcoming";
    due.textContent = describeDueDate(reminder.daysUntil);
    item.append(detail, due);
    list.append(item);
  });
  container.replaceChildren(list);
}
