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

export function formatShortDate(value, locale = "en-SG") {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
    new Date(`${value}T00:00:00`)
  );
}

export function filterApplications(applications, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return [...applications];
  }

  return applications.filter(({ company = "", role = "", location = "" }) =>
    [company, role, location].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery)
    )
  );
}
