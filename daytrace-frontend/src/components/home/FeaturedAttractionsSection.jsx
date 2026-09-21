import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, MapPinned } from "lucide-react";
import { Link } from "react-router";
import { getAttractions } from "../../services/api";
import { normalizeAttractions } from "../../utils/normalizeAttraction";
import PlaceCard from "../places/PlaceCard";
import PlaceCardSkeleton from "../places/PlaceCardSkeleton";

const FEATURED_PLACE_NAMES = [
  "Bathalegala (Bible Rock)",
  "Meeyan Ella Waterfall",
  "Millennium Elephant Foundation",
];

const FEATURED_PLACE_LIMIT = FEATURED_PLACE_NAMES.length;

function FeaturedAttractionsSection() {
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let requestIsActive = true;

    const loadAttractions = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getAttractions();

        if (requestIsActive) {
          const normalizedAttractions = normalizeAttractions(
            response.attractions,
          );

         const featuredAttractions = FEATURED_PLACE_NAMES
  .map((placeName) =>
    normalizedAttractions.find(
      (attraction) => attraction.name === placeName,
    ),
  )
  .filter(Boolean);

setAttractions(featuredAttractions);

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

  return (
    <section
      aria-labelledby="featured-attractions-heading"
      className="bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
              <MapPinned size={17} aria-hidden="true" />
              Start exploring
            </div>

            <h2
              id="featured-attractions-heading"
              className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl"
            >
              Discover local destinations
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Preview verified attractions stored in DayTrace Kegalle and add
              interesting places directly to your one-day plan.
            </p>
          </div>

          <Link
            to="/places"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/15"
          >
            View all places
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {Array.from(
              { length: FEATURED_PLACE_LIMIT },
              (_, index) => (
                <PlaceCardSkeleton key={index} />
              ),
            )}
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
            <AlertTriangle
              size={38}
              className="mx-auto text-rose-600"
              aria-hidden="true"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-950">
              Destinations could not be loaded
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-slate-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-6 rounded-full bg-teal-700 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/20"
            >
              Try again
            </button>
          </div>
        ) : attractions.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {attractions.map((attraction) => (
              <PlaceCard
                key={attraction.id}
                attraction={attraction}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <MapPinned
              size={40}
              className="mx-auto text-slate-400"
              aria-hidden="true"
            />

            <h3 className="mt-5 text-xl font-bold text-slate-950">
              No destinations available yet
            </h3>

            <p className="mt-2 text-slate-600">
              Attraction records will appear here after the administrator adds
              them.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedAttractionsSection;