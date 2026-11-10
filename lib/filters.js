import { stageOrder } from "./dashboard.js";

export function filterApplicationsByStage(applications, selectedStage = "all") {
  if (selectedStage === "all") {
    return [...applications];
  }

  if (!stageOrder.includes(selectedStage)) {
    return [];
  }

  return applications.filter(({ status }) => status === selectedStage);
}
