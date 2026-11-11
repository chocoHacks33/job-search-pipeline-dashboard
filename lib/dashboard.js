export const stageOrder = ["applied", "screen", "interview", "offer", "rejected"];

export const stageLabels = {
  applied: "Applied",
  screen: "Recruiter screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Closed"
};

export function summarizeApplications(applications) {
  const active = applications.filter(({ status }) => status !== "rejected");
  const interviews = applications.filter(({ status }) => status === "interview").length;
  const offers = applications.filter(({ status }) => status === "offer").length;
  const responses = applications.filter(({ status }) => !["applied", "rejected"].includes(status)).length;

  return {
    total: applications.length,
    active: active.length,
    interviews,
    offers,
    responseRate: applications.length ? Math.round((responses / applications.length) * 100) : 0
  };
}

export function groupApplicationsByStage(applications) {
  return Object.fromEntries(
    stageOrder.map((stage) => [stage, applications.filter(({ status }) => status === stage)])
  );
}

export function sortApplications(applications, sortBy = "updated-desc") {
  const sorted = [...applications];
  const byCompany = (first, second) =>
    first.company.localeCompare(second.company, undefined, { sensitivity: "base" });
  const comparisons = {
    "updated-desc": (first, second) =>
      second.updatedAt.localeCompare(first.updatedAt) || byCompany(first, second),
    "updated-asc": (first, second) =>
      first.updatedAt.localeCompare(second.updatedAt) || byCompany(first, second),
    "applied-desc": (first, second) =>
      second.appliedAt.localeCompare(first.appliedAt) || byCompany(first, second),
    "company-asc": byCompany
  };

  if (!comparisons[sortBy]) {
    throw new RangeError(`Unknown application sort: ${sortBy}`);
  }

  return sorted.sort(comparisons[sortBy]);
}

export function formatShortDate(value, locale = "en-SG") {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
    new Date(`${value}T00:00:00`)
  );
}
