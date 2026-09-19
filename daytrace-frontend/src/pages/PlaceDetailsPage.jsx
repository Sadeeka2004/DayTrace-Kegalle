import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  LoaderCircle,
  Map,
  MapPin,
  RefreshCw,
  Route as RouteIcon,
  Signpost,
  Trees,
  TriangleAlert,
} from "lucide-react";
import { Link, useParams } from "react-router";
import PlaceGallery from "../components/places/PlaceGallery";
import AddToPlanButton from "../components/places/AddToPlanButton";
import { getAttractionById } from "../services/api";
import { normalizeAttraction } from "../utils/normalizeAttraction";

function InformationUnavailable({ children }) {
  return (
    <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-500">
      <TriangleAlert
        size={17}
        className="mt-0.5 shrink-0 text-amber-600"
      />
      {children}
    </p>
  );
}

function PlaceDetailsPage() {
  const { placeSlug } = useParams();
  const [attraction, setAttraction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let requestIsActive = true;

    const loadAttraction = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setErrorStatus(null);

        const response = await getAttractionById(placeSlug);

        if (requestIsActive) {
          setAttraction(normalizeAttraction(response.attraction));
        }
      } catch (error) {
        if (requestIsActive) {
          setAttraction(null);
          setErrorMessage(error.message);
          setErrorStatus(error.status || null);
        }
      } finally {
        if (requestIsActive) {
          setIsLoading(false);
        }
      }
    };

    loadAttraction();

    return () => {
      requestIsActive = false;
    };
  }, [placeSlug, retryCount]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f4f8f7]">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-teal-700"
          />
          <p className="mt-4 font-medium text-slate-600">
            Loading destination...
          </p>
        </div>
      </main>
    );
  }

  if (!attraction) {
  const attractionWasNotFound =
    errorStatus === 400 || errorStatus === 404;

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f4f8f7] px-5 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <MapPin
          size={35}
          className="mx-auto text-rose-700"
        />

        <h1 className="mt-5 text-3xl font-bold text-slate-950">
          {attractionWasNotFound
            ? "We could not find this place"
            : "Destination could not be loaded"}
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          {attractionWasNotFound
            ? "The attraction may have been removed or the address is incorrect."
            : errorMessage ||
              "A temporary server or network problem prevented this destination from loading."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {!attractionWasNotFound && (
            <button
              type="button"
              onClick={() =>
                setRetryCount((count) => count + 1)
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 font-semibold text-white transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/20"
            >
              <RefreshCw size={18} />
              Try again
            </button>
          )}

          <Link
            to="/places"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
          >
            <ArrowLeft size={18} />
            Return to Explore
          </Link>
        </div>
      </section>
    </main>
  );
}

  const hasOpeningHours =
    attraction.openingTime && attraction.closingTime;
  const hasFacilities = attraction.facilities.length > 0;
  const hasTravelTips = attraction.travelTips.length > 0;
  const hasDistance = attraction.distanceKm !== null;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f4f8f7]">
      <section className="px-5 py-7 sm:px-8">
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-teal-700">
            Home
          </Link>
          <span>/</span>
          <Link to="/places" className="hover:text-teal-700">
            Explore
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-800">
            {attraction.name}
          </span>
        </nav>
      </section>

      <PlaceGallery attraction={attraction} />

      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
                About this place
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Destination overview
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                {attraction.description}
              </p>

              {attraction.travelInformation && (
                <>
                  <h3 className="mt-7 text-lg font-bold text-slate-950">
                    Travel information
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {attraction.travelInformation}
                  </p>
                </>
              )}
            </section>

            <div className="grid gap-5 sm:grid-cols-2">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Clock3 size={25} className="text-teal-800" />
                <h2 className="mt-5 text-xl font-bold">
                  Opening hours
                </h2>

                {hasOpeningHours ? (
                  <>
                    <p className="mt-3 text-slate-600">
                      {attraction.openingTime} – {attraction.closingTime}
                    </p>
                    {attraction.openingNote && (
                      <p className="mt-2 text-sm text-slate-500">
                        {attraction.openingNote}
                      </p>
                    )}
                  </>
                ) : (
                  <InformationUnavailable>
                    Opening times are currently unavailable.
                  </InformationUnavailable>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Trees size={25} className="text-teal-800" />
                <h2 className="mt-5 text-xl font-bold">
                  Available facilities
                </h2>

                {hasFacilities ? (
                  <ul className="mt-3 space-y-2 text-slate-600">
                    {attraction.facilities.map((facility) => (
                      <li key={facility}>• {facility}</li>
                    ))}
                  </ul>
                ) : (
                  <InformationUnavailable>
                    Facility information is currently unavailable.
                  </InformationUnavailable>
                )}
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2">
                <Signpost size={25} className="text-teal-800" />
                <h2 className="mt-5 text-xl font-bold">
                  Travel tips
                </h2>

                {hasTravelTips ? (
                  <ul className="mt-4 space-y-3 text-slate-600">
                    {attraction.travelTips.map((tip) => (
                      <li key={tip} className="flex gap-3">
                        <span className="font-bold text-teal-700">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <InformationUnavailable>
                    Travel tips are currently unavailable.
                  </InformationUnavailable>
                )}
              </section>
            </div>
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Location information
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <MapPin size={20} className="text-teal-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Location
                    </p>
                    <p className="mt-1 font-medium">
                      {attraction.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <RouteIcon size={20} className="text-teal-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Distance from Wilpola
                    </p>

                    {hasDistance ? (
                      <p className="mt-1 font-medium">
                        Approximately {attraction.distanceKm} km
                      </p>
                    ) : (
                      <InformationUnavailable>
                        Distance is unavailable.
                      </InformationUnavailable>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <AddToPlanButton
                  attractionId={attraction.id}
                  fullWidth
                />
              </div>

              <Link
                to={`/map?place=${attraction.id}`}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-5 font-semibold text-white transition hover:bg-teal-600"
              >
                <Map size={19} />
                View on Map
              </Link>
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-bold text-amber-950">
                Important travel notice
              </h2>
              <p className="mt-3 text-sm leading-6 text-amber-900/80">
                Opening times, access conditions and facilities may change.
                Verify important details before travelling.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default PlaceDetailsPage;