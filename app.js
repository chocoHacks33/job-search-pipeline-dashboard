import { applications } from "./data.js";
import {
  buildApplicationActivity,
  formatShortDate,
  groupApplicationsByStage,
  stageLabels,
  stageOrder,
  summarizeApplications
} from "./lib/dashboard.js";

const summaryGrid = document.querySelector("#summary-grid");
const activityChart = document.querySelector("#application-activity");
const activitySummary = document.querySelector("#activity-summary");
const pipeline = document.querySelector("#pipeline");
const cardTemplate = document.querySelector("#application-card-template");

function renderSummary() {
  const summary = summarizeApplications(applications);
  const metrics = [
    ["Active applications", summary.active],
    ["Interviews", summary.interviews],
    ["Offers", summary.offers],
    ["Response rate", `${summary.responseRate}%`]
  ];

  summaryGrid.replaceChildren(
    ...metrics.map(([label, value]) => {
      const card = document.createElement("article");
      card.className = "metric-card";
      const metric = document.createElement("strong");
      metric.textContent = value;
      const description = document.createElement("span");
      description.textContent = label;
      card.append(metric, description);
      return card;
    })
  );
}

function renderApplicationCard(application) {
  const fragment = cardTemplate.content.cloneNode(true);
  fragment.querySelector(".card-company").textContent = application.company;
  fragment.querySelector(".card-role").textContent = application.role;
  fragment.querySelector(".card-location").textContent = application.location;
  fragment.querySelector(".card-updated").textContent = formatShortDate(application.updatedAt);
  return fragment;
}

function renderApplicationActivity() {
  const activity = buildApplicationActivity(applications);
  const maximum = Math.max(...activity.map(({ count }) => count), 1);
  const total = activity.reduce((sum, { count }) => sum + count, 0);

  activitySummary.textContent = `${total} application${total === 1 ? "" : "s"} added during this window.`;
  activityChart.replaceChildren(
    ...activity.map(({ label, count }) => {
      const day = document.createElement("div");
      day.className = "activity-day";
      day.setAttribute("role", "listitem");
      day.setAttribute(
        "aria-label",
        `${label}: ${count} application${count === 1 ? "" : "s"}`
      );

      const barTrack = document.createElement("span");
      barTrack.className = "activity-bar-track";
      const bar = document.createElement("span");
      bar.className = "activity-bar";
      bar.style.height = `${count ? Math.max(12, (count / maximum) * 100) : 0}%`;
      barTrack.append(bar);

      const date = document.createElement("span");
      date.className = "activity-date";
      date.textContent = label;
      const value = document.createElement("strong");
      value.textContent = count;

      day.append(barTrack, value, date);
      return day;
    })
  );
}

function renderPipeline() {
  const groupedApplications = groupApplicationsByStage(applications);
  pipeline.replaceChildren(
    ...stageOrder.map((stage) => {
      const column = document.createElement("section");
      column.className = "stage-column";
      column.dataset.stage = stage;

      const heading = document.createElement("h3");
      heading.textContent = `${stageLabels[stage]} (${groupedApplications[stage].length})`;
      column.append(heading, ...groupedApplications[stage].map(renderApplicationCard));
      return column;
    })
  );
}

document.querySelector("#as-of").textContent = `Updated ${new Intl.DateTimeFormat("en-SG", {
  dateStyle: "medium"
}).format(new Date())}`;

renderSummary();
renderApplicationActivity();
renderPipeline();
