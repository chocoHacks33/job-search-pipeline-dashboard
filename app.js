import { applications } from "./data.js";
import {
  formatShortDate,
  groupApplicationsByStage,
  stageLabels,
  stageOrder,
  summarizeStageDistribution,
  summarizeApplications
} from "./lib/dashboard.js";

const summaryGrid = document.querySelector("#summary-grid");
const stageDistribution = document.querySelector("#stage-distribution");
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

function renderStageDistribution() {
  const distribution = summarizeStageDistribution(applications);

  stageDistribution.replaceChildren(
    ...distribution.map(({ label, count, percentage }) => {
      const row = document.createElement("div");
      row.className = "distribution-row";

      const name = document.createElement("span");
      name.textContent = label;
      const progress = document.createElement("progress");
      progress.max = applications.length || 1;
      progress.value = count;
      progress.setAttribute(
        "aria-label",
        `${label}: ${count} application${count === 1 ? "" : "s"}, ${percentage}% of pipeline`
      );
      const value = document.createElement("strong");
      value.textContent = `${count} · ${percentage}%`;

      row.append(name, progress, value);
      return row;
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
renderStageDistribution();
renderPipeline();
