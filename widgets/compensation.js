export function summarizeCompensation(applications) {
  const ranges = applications.filter(
    ({ status, salaryMin, salaryMax }) =>
      status !== "rejected" && Number.isFinite(salaryMin) && Number.isFinite(salaryMax)
  );

  if (!ranges.length) {
    return { count: 0, averageMinimum: 0, averageMaximum: 0 };
  }

  const sum = (field) => ranges.reduce((total, application) => total + application[field], 0);
  return {
    count: ranges.length,
    averageMinimum: Math.round(sum("salaryMin") / ranges.length),
    averageMaximum: Math.round(sum("salaryMax") / ranges.length)
  };
}

export function formatSalary(value, currency = "SGD", locale = "en-SG") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function renderCompensationInsight(container, applications) {
  const summary = summarizeCompensation(applications);
  const panel = document.createElement("article");
  panel.className = "insight-panel";

  const description = document.createElement("p");
  description.textContent = summary.count
    ? `Based on ${summary.count} active roles with disclosed annual ranges.`
    : "Add salary ranges to active applications to compare compensation.";

  const createStat = (label, value) => {
    const stat = document.createElement("div");
    stat.className = "insight-stat";
    const metric = document.createElement("strong");
    metric.textContent = summary.count ? formatSalary(value) : "—";
    const caption = document.createElement("span");
    caption.textContent = label;
    stat.append(metric, caption);
    return stat;
  };

  panel.append(
    description,
    createStat("Average range floor", summary.averageMinimum),
    createStat("Average range ceiling", summary.averageMaximum)
  );
  container.replaceChildren(panel);
}
