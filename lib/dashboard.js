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

export function getApplicationUpdateSignal(application, referenceDate = new Date()) {
  const updatedAt = new Date(`${application.updatedAt}T00:00:00Z`);
  const reference = new Date(referenceDate);

  if (Number.isNaN(updatedAt.valueOf()) || Number.isNaN(reference.valueOf())) {
    throw new TypeError("Application update dates must be valid");
  }

  const referenceDay = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate()
  );
  const days = Math.max(0, Math.floor((referenceDay - updatedAt.valueOf()) / 86_400_000));
  const isSettled = ["offer", "rejected"].includes(application.status);
  const needsAttention = !isSettled && days >= 7;
  const ageLabel = days === 0 ? "Updated today" : `Updated ${days} day${days === 1 ? "" : "s"} ago`;

  return {
    days,
    needsAttention,
    label: needsAttention ? `${ageLabel} · Follow up` : ageLabel
  };
}
