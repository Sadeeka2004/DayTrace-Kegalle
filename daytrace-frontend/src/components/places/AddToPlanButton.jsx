import { Check, Plus } from "lucide-react";
import useDayPlan from "../../hooks/useDayPlan";

function AddToPlanButton({ attractionId, fullWidth = false }) {
  const { addAttraction, isInPlan } = useDayPlan();
  const alreadyAdded = isInPlan(attractionId);

  return (
    <button
      type="button"
      onClick={() => addAttraction(attractionId)}
      disabled={alreadyAdded}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus:outline-none focus:ring-4 ${
        fullWidth ? "w-full" : ""
      } ${
        alreadyAdded
          ? "cursor-default bg-emerald-100 text-emerald-800 focus:ring-emerald-500/20"
          : "bg-teal-700 text-white hover:bg-teal-600 focus:ring-teal-600/20"
      }`}
    >
      {alreadyAdded ? (
        <>
          <Check size={18} aria-hidden="true" />
          Added to Day Plan
        </>
      ) : (
        <>
          <Plus size={18} aria-hidden="true" />
          Add to Day Plan
        </>
      )}
    </button>
  );
}

export default AddToPlanButton;