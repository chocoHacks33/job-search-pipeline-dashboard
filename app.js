import { applications } from "./data.js";
import {
  filterApplications,
  formatShortDate,
  groupApplicationsByStage,
  stageLabels,
  stageOrder,
  summarizeApplications
} from "./lib/dashboard.js";

const summaryGrid = document.querySelector("#summary-grid");
const pipeline = document.querySelector("#pipeline");
const cardTemplate = document.querySelector("#application-card-template");
const searchInput = document.querySelector("#application-search");
const searchStatus = document.querySelector("#search-status");

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

function renderPipeline(visibleApplications = applications) {
  const groupedApplications = groupApplicationsByStage(visibleApplications);
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

function applySearch() {
  const visibleApplications = filterApplications(applications, searchInput.value);
  renderPipeline(visibleApplications);
  searchStatus.textContent = `Showing ${visibleApplications.length} of ${applications.length} applications.`;
}

document.querySelector("#as-of").textContent = `Updated ${new Intl.DateTimeFormat("en-SG", {
  dateStyle: "medium"
}).format(new Date())}`;

renderSummary();
applySearch();

searchInput.addEventListener("input", applySearch);
