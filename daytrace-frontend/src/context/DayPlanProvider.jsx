import { useEffect, useState } from "react";
import DayPlanContext from "./DayPlanContext";

const STORAGE_KEY = "daytrace-day-plan-v1";

function readStoredPlan() {
  try {
    const storedPlan = sessionStorage.getItem(STORAGE_KEY);

    if (!storedPlan) {
      return [];
    }

    const parsedPlan = JSON.parse(storedPlan);

    if (!Array.isArray(parsedPlan)) {
      return [];
    }

    return parsedPlan.filter((attractionId) => typeof attractionId === "string");
  } catch {
    return [];
  }
}

function DayPlanProvider({ children }) {
  const [planAttractionIds, setPlanAttractionIds] = useState(readStoredPlan);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(planAttractionIds),
    );
  }, [planAttractionIds]);

  const addAttraction = (attractionId) => {
    setPlanAttractionIds((currentPlan) => {
      if (currentPlan.includes(attractionId)) {
        return currentPlan;
      }

      return [...currentPlan, attractionId];
    });
  };

  const removeAttraction = (attractionId) => {
    setPlanAttractionIds((currentPlan) =>
      currentPlan.filter((id) => id !== attractionId),
    );
  };

  const clearPlan = () => {
    setPlanAttractionIds([]);
  };

  const moveAttraction = (attractionId, direction) => {
    setPlanAttractionIds((currentPlan) => {
      const currentIndex = currentPlan.indexOf(attractionId);
      const targetIndex = currentIndex + direction;

      if (
        currentIndex === -1 ||
        targetIndex < 0 ||
        targetIndex >= currentPlan.length
      ) {
        return currentPlan;
      }

      const updatedPlan = [...currentPlan];

      [updatedPlan[currentIndex], updatedPlan[targetIndex]] = [
        updatedPlan[targetIndex],
        updatedPlan[currentIndex],
      ];

      return updatedPlan;
    });
  };

  const isInPlan = (attractionId) => {
    return planAttractionIds.includes(attractionId);
  };

  const contextValue = {
    planAttractionIds,
    addAttraction,
    removeAttraction,
    clearPlan,
    moveAttraction,
    isInPlan,
  };

  return (
    <DayPlanContext.Provider value={contextValue}>
      {children}
    </DayPlanContext.Provider>
  );
}

export default DayPlanProvider;