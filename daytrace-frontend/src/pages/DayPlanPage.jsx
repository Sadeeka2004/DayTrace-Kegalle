import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  CalendarX,
  CheckCircle2,
  ListOrdered,
  LoaderCircle,
  MapPin,
  Plus,
  Route as RouteIcon,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Link } from "react-router";
import SafeImage from "../components/common/SafeImage";
import useDayPlan from "../hooks/useDayPlan";
import { getAttractions } from "../services/api";
import { normalizeAttractions } from "../utils/normalizeAttraction";
import dayPlanHeroImage from "../assets/images/bathalegala-trail-placeholder.png";

function PlanHero({ attractionCount, onClearPlan }) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8 lg:py-24">
      <img
        src={dayPlanHeroImage}
        alt="Scenic trail representing a one-day journey around Kegalle"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />

      <div className="absolute inset-0 -z-20 bg-slate-950/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/25" />
      <div className="absolute -right-20 top-10 -z-10 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_340px]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-100 shadow-lg backdrop-blur-md">
            <CalendarDays size={17} aria-hidden="true" />
            {attractionCount}{" "}
            {attractionCount === 1
              ? "selected destination"
              : "selected destinations"}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Shape your day.
            <span className="block text-teal-300">
              Choose your own journey.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Review your selected attractions and arrange them into your
            preferred visit order for a simple one-day plan.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/places"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-teal-400 px-6 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
            >
              <Plus size={18} aria-hidden="true" />
              Add more places
            </Link>

            {attractionCount > 0 && (
              <button
                type="button"
                onClick={onClearPlan}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 font-semibold text-white backdrop-blur-md transition hover:border-rose-300 hover:bg-rose-500/20"
              >
                <Trash2 size={18} aria-hidden="true" />
                Clear plan
              </button>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-white/20 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-300">
            Plan overview
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                <ListOrdered size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xl font-bold">{attractionCount}</p>
                <p className="text-sm text-slate-300">Planned stops</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400 text-slate-950">
                <ShieldCheck size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">Session only</p>
                <p className="text-sm text-slate-300">No account required</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
                <ArrowUp size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">Custom order</p>
                <p className="text-sm text-slate-300">Move stops up or down</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function PlanAttractionCard({
  attraction,
  index,
  attractionCount,
  onMove,
  onRemove,
}) {
  return (
    <article className="relative sm:pl-16">
      <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#f4f8f7] bg-teal-700 font-bold text-white shadow-lg sm:absolute sm:left-0 sm:top-8 sm:mb-0">
        {index + 1}
      </span>

      <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10">
        <div className="grid md:grid-cols-[230px_1fr]">
          <div className="relative min-h-52 overflow-hidden bg-slate-200">
            <SafeImage
              src={attraction.primaryImage}
              alt={attraction.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-teal-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
              Stop {index + 1}
            </span>
          </div>

          <div className="p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                  {attraction.category}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  {attraction.name}
                </h3>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} className="text-teal-700" />
                    {attraction.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <RouteIcon size={16} className="text-teal-700" />
                    {attraction.distanceKm !== null
                      ? `Approx. ${attraction.distanceKm} km`
                      : "Distance unavailable"}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-slate-600">
                  {attraction.shortDescription}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onMove(attraction.id, -1)}
                  disabled={index === 0}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Move ${attraction.name} earlier`}
                >
                  <ArrowUp size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => onMove(attraction.id, 1)}
                  disabled={index === attractionCount - 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Move ${attraction.name} later`}
                >
                  <ArrowDown size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(attraction.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                  aria-label={`Remove ${attraction.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <Link
              to={`/places/${attraction.id}`}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-800 transition hover:text-teal-600"
            >
              View destination details
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function DayPlanPage() {
  const {
    planAttractionIds,
    removeAttraction,
    clearPlan,
    moveAttraction,
  } = useDayPlan();

  const [availableAttractions, setAvailableAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  useEffect(() => {
    let requestIsActive = true;

    const loadAttractions = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getAttractions();

        if (requestIsActive) {
          setAvailableAttractions(
            normalizeAttractions(response.attractions),
          );
        }
      } catch (error) {
        if (requestIsActive) {
          setErrorMessage(error.message);
        }
      } finally {
        if (requestIsActive) {
          setIsLoading(false);
        }
      }
    };

    loadAttractions();

    return () => {
      requestIsActive = false;
    };
  }, [retryCount]);

  useEffect(() => {
    if (!isClearDialogOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsClearDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClearDialogOpen]);

  const planAttractions = planAttractionIds
    .map((attractionId) =>
      availableAttractions.find(
        (attraction) => attraction.id === attractionId,
      ),
    )
    .filter(Boolean);

  const unavailableAttractionCount =
    planAttractionIds.length - planAttractions.length;

  const confirmClearPlan = () => {
    clearPlan();
    setIsClearDialogOpen(false);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f4f8f7]">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-teal-700"
          />
          <p className="mt-4 font-medium text-slate-600">
            Loading your day plan...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f4f8f7] px-5">
        <section className="w-full max-w-xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl">
          <AlertTriangle size={40} className="mx-auto text-rose-600" />
          <h1 className="mt-5 text-3xl font-bold text-slate-950">
            Day plan could not be loaded
          </h1>
          <p className="mt-3 text-slate-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-7 rounded-full bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-600"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f4f8f7]">
      <PlanHero
        attractionCount={planAttractions.length}
        onClearPlan={() => setIsClearDialogOpen(true)}
      />

      <section className="px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          {unavailableAttractionCount > 0 && (
            <div className="mb-7 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <TriangleAlert
                size={21}
                className="mt-0.5 shrink-0 text-amber-700"
              />
              <div>
                <p className="font-bold text-amber-950">
                  Some selected places are unavailable
                </p>
                <p className="mt-1 text-sm leading-6 text-amber-900/80">
                  {unavailableAttractionCount} previously selected attraction
                  record could not be found.
                </p>
              </div>
            </div>
          )}

          {planAttractions.length === 0 ? (
            <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-14">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-teal-100 blur-3xl" />
              <div className="relative">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-800 shadow-sm">
                  <CalendarX size={34} aria-hidden="true" />
                </span>
                <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
                  Your one-day journey
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                  Your day plan is empty
                </h2>
                <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">
                  Explore available attractions and add the places you would
                  like to visit during your one-day journey.
                </p>

                {unavailableAttractionCount > 0 && (
                  <button
                    type="button"
                    onClick={clearPlan}
                    className="mt-5 font-semibold text-amber-800 underline"
                  >
                    Clear old planner data
                  </button>
                )}

                <div className="mt-8">
                  <Link
                    to="/places"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-teal-700 px-7 font-semibold text-white transition hover:bg-teal-600"
                  >
                    Explore places
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <>
              <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                    Preferred visit sequence
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    Your selected journey
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Planning reference area: Wilpola, Aranayake
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  Plan ready to review
                </span>
              </div>

              <div className="relative space-y-6">
                <div className="absolute bottom-12 left-6 top-12 hidden w-0.5 bg-gradient-to-b from-teal-600 via-teal-300 to-teal-100 sm:block" />

                {planAttractions.map((attraction, index) => (
                  <PlanAttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    index={index}
                    attractionCount={planAttractions.length}
                    onMove={moveAttraction}
                    onRemove={removeAttraction}
                  />
                ))}
              </div>

              <div className="mt-10 flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6">
                <TriangleAlert
                  size={22}
                  className="mt-0.5 shrink-0 text-amber-700"
                />
                <div>
                  <h2 className="font-bold text-amber-950">
                    Planning information
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-amber-900/80">
                    The displayed order is your preferred visit order.
                    DayTrace does not provide live traffic, automatic route
                    optimization or turn-by-turn navigation. Verify current
                    conditions before travelling.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {isClearDialogOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 px-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-plan-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsClearDialogOpen(false);
            }
          }}
        >
          <section className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-7 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <Trash2 size={25} aria-hidden="true" />
              </span>
              <button
                type="button"
                onClick={() => setIsClearDialogOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close clear plan confirmation"
              >
                <X size={20} />
              </button>
            </div>

            <h2
              id="clear-plan-title"
              className="mt-6 text-2xl font-bold text-slate-950"
            >
              Clear your day plan?
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              This will remove all {planAttractions.length} selected places
              from the current planning session.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsClearDialogOpen(false)}
                className="min-h-11 rounded-full border border-slate-300 px-5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Keep plan
              </button>
              <button
                type="button"
                onClick={confirmClearPlan}
                className="min-h-11 rounded-full bg-rose-700 px-5 font-semibold text-white transition hover:bg-rose-600"
              >
                Clear all places
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default DayPlanPage;

