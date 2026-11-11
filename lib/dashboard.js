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

export function buildApplicationActivity(
  applications,
  referenceDate = new Date(),
  numberOfDays = 14
) {
  if (!Number.isInteger(numberOfDays) || numberOfDays < 1) {
    throw new RangeError("numberOfDays must be a positive integer");
  }

  const reference = new Date(referenceDate);
  if (Number.isNaN(reference.valueOf())) {
    throw new TypeError("referenceDate must be valid");
  }

  const referenceDay = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate()
  );
  const countsByDate = new Map();

  applications.forEach(({ appliedAt }) => {
    countsByDate.set(appliedAt, (countsByDate.get(appliedAt) ?? 0) + 1);
  });

  return Array.from({ length: numberOfDays }, (_, index) => {
    const offset = numberOfDays - index - 1;
    const day = new Date(referenceDay - offset * 86_400_000);
    const date = day.toISOString().slice(0, 10);

    return {
      date,
      label: new Intl.DateTimeFormat("en-SG", {
        day: "numeric",
        month: "short",
        timeZone: "UTC"
      }).format(day),
      count: countsByDate.get(date) ?? 0
    };
  });
}

export function formatShortDate(value, locale = "en-SG") {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
    new Date(`${value}T00:00:00`)
  );
}
