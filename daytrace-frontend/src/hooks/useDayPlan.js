import { useContext } from "react";
import DayPlanContext from "../context/DayPlanContext";

function useDayPlan() {
  const context = useContext(DayPlanContext);

  if (!context) {
    throw new Error("useDayPlan must be used inside DayPlanProvider.");
  }

  return context;
}

export default useDayPlan;