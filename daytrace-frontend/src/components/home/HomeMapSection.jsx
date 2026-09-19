import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, MapPinned } from "lucide-react";
import { Link } from "react-router";
import AttractionMap from "../map/AttractionMap";
import { getAttractions } from "../../services/api";
import { normalizeAttractions } from "../../utils/normalizeAttraction";

function HomeMapSection() {
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
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
          const mappedAttractions = normalizeAttractions(
            response.attractions,
          ).filter(
            (attraction) =>
              Number.isFinite(attraction.latitude) &&
              Number.isFinite(attraction.longitude),
          );

          setAttractions(mappedAttractions);
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

  const selectAttraction = (attractionSlug) => {
    const attraction = attractions.find(
      (item) => item.slug === attractionSlug,
    );

    setSelectedAttraction(attraction || null);
  };

  const fullMapPath = selectedAttraction
    ? `/map?place=${selectedAttraction.slug}`
    : "/map";

  return (
    <section
      aria-labelledby="home-map-heading"
      className="bg-[#f4f8f7] px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-800">
              <MapPinned size={17} aria-hidden="true" />
              Location preview
            </div>

            <h2
              id="home-map-heading"
              className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl"
            >
              See what is nearby
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Explore attraction locations around the project reference point
              and select a marker to view destination information.
            </p>
          </div>

          <Link
            to={fullMapPath}
            className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-teal-700 px-6 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/20"
          >
            Open full map
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {isLoading ? (
          <div className="h-[380px] animate-pulse rounded-3xl border border-slate-200 bg-slate-200 motion-reduce:animate-none" />
        ) : errorMessage ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 px-6 text-center">
            <div>
              <AlertTriangle
                size={38}
                className="mx-auto text-rose-600"
                aria-hidden="true"
              />

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                Map locations could not be loaded
              </h3>

              <p className="mt-2 text-slate-600">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() =>
                  setRetryCount((count) => count + 1)
                }
                className="mt-6 rounded-full bg-teal-700 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-600"
              >
                Try again
              </button>
            </div>
          </div>
        ) : attractions.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div>
              <MapPinned
                size={40}
                className="mx-auto text-slate-400"
                aria-hidden="true"
              />

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                No mapped attractions available
              </h3>

              <p className="mt-2 text-slate-600">
                Locations will appear after coordinates are added by the
                administrator.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white bg-white p-2 shadow-2xl shadow-slate-900/10">
            <AttractionMap
              attractions={attractions}
              selectedAttraction={selectedAttraction}
              onAttractionSelect={selectAttraction}
              onMapError={setErrorMessage}
              compact
            />
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Map data © OpenStreetMap contributors. Locations and distances are
          approximate planning information.
        </p>
      </div>
    </section>
  );
}

export default HomeMapSection;