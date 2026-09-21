import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock3,
  Compass,
  ExternalLink,
  Layers3,
  LoaderCircle,
  MapPin,
  Navigation,
  RefreshCw,
  Route as RouteIcon,
  RotateCcw,
  Search,
  TriangleAlert,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import AttractionMap from "../components/map/AttractionMap";
import SafeImage from "../components/common/SafeImage";
import { getAttractions } from "../services/api";
import { getDrivingRoute } from "../services/routeService";
import { normalizeAttractions } from "../utils/normalizeAttraction";
import mapHeroImage from "../assets/images/place-waterfall-placeholder.png";

const WILPOLA_REFERENCE_LOCATION = {
  id: "wilpola-reference",
  name: "Wilpola, Aranayake",
  latitude: 7.1721806,
  longitude: 80.4526413,
};

function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedAttractionId = searchParams.get("place");

  const [attractions, setAttractions] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [mapResourceError, setMapResourceError] = useState("");
  const [mapRetryCount, setMapRetryCount] = useState(0);
  const [routeStartId, setRouteStartId] = useState(
    WILPOLA_REFERENCE_LOCATION.id,
  );
  const [routeDestinationId, setRouteDestinationId] = useState(
    () => requestedAttractionId || "",
  );
  const [routeData, setRouteData] = useState(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  useEffect(() => {
    let requestIsActive = true;

    const loadAttractions = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getAttractions();

        if (requestIsActive) {
          setAttractions(
            normalizeAttractions(response.attractions),
          );
        }
      } catch (error) {
        if (requestIsActive) {
          setAttractions([]);
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

  const attractionsWithCoordinates = useMemo(
    () =>
      attractions.filter(
        (attraction) =>
          Number.isFinite(attraction.latitude) &&
          Number.isFinite(attraction.longitude),
      ),
    [attractions],
  );

  const filteredAttractions = useMemo(() => {
    const normalizedSearch = locationSearch
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return attractions;
    }

    return attractions.filter((attraction) =>
      [
        attraction.name,
        attraction.category,
        attraction.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [attractions, locationSearch]);

  const requestedAttraction = attractions.find(
    (attraction) =>
      attraction.id === requestedAttractionId,
  );

  const selectedAttraction =
    attractionsWithCoordinates.find(
      (attraction) =>
        attraction.id === requestedAttractionId,
    );

  const selectedPlaceHasNoCoordinates =
    requestedAttraction && !selectedAttraction;

  const routeLocations = useMemo(
    () => [
      WILPOLA_REFERENCE_LOCATION,
      ...attractionsWithCoordinates,
    ],
    [attractionsWithCoordinates],
  );

  const selectAttraction = (attractionId) => {
    setRouteDestinationId(attractionId);
    setRouteData(null);
    setRouteError("");
    setSearchParams({ place: attractionId });
  };

  const clearRoute = () => {
    setRouteData(null);
    setRouteError("");
  };

  const updateRouteStart = (locationId) => {
    setRouteStartId(locationId);
    clearRoute();
  };

  const updateRouteDestination = (locationId) => {
    setRouteDestinationId(locationId);
    clearRoute();

    const destinationAttraction = attractionsWithCoordinates.find(
      (attraction) => attraction.id === locationId,
    );

    if (destinationAttraction) {
      setSearchParams({ place: destinationAttraction.id });
    }
  };

  const showRoute = async () => {
    const startLocation = routeLocations.find(
      (location) => location.id === routeStartId,
    );
    const destinationLocation = routeLocations.find(
      (location) => location.id === routeDestinationId,
    );

    if (!startLocation || !destinationLocation) {
      setRouteError("Select both a start point and destination.");
      return;
    }

    if (startLocation.id === destinationLocation.id) {
      setRouteError("Start point and destination must be different.");
      return;
    }

    try {
      setIsRouteLoading(true);
      setRouteError("");
      setRouteData(null);

      const calculatedRoute = await getDrivingRoute([
        startLocation,
        destinationLocation,
      ]);

      setRouteData({
        ...calculatedRoute,
        startName: startLocation.name,
        destinationName: destinationLocation.name,
      });
    } catch (error) {
      setRouteError(error.message);
    } finally {
      setIsRouteLoading(false);
    }
  };

  const resetMapView = () => {
    setSearchParams({});
    setLocationSearch("");
    setMapResourceError("");
    setRouteStartId(WILPOLA_REFERENCE_LOCATION.id);
    setRouteDestinationId("");
    setRouteData(null);
    setRouteError("");
    setMapRetryCount((count) => count + 1);
  };

  const retryMapResources = () => {
    setMapResourceError("");
    setMapRetryCount((count) => count + 1);
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f4f8f7]">
      <section className="relative isolate overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8 lg:py-24">
        <img
          src={mapHeroImage}
          alt="Waterfall landscape representing locations around Kegalle"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />

        <div className="absolute inset-0 -z-20 bg-slate-950/50" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />

        <div className="absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_340px]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-100 shadow-lg backdrop-blur-md">
              <Navigation size={17} aria-hidden="true" />
              Interactive location discovery
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Explore the map.

              <span className="block text-teal-300">
                Discover what is nearby.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              View attraction locations, explore the
              surrounding area and open destination
              information directly from map markers.
            </p>
          </div>

          <aside className="rounded-3xl border border-white/20 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-300">
              Map overview
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <Layers3
                  size={20}
                  className="text-teal-300"
                  aria-hidden="true"
                />

                <p className="mt-3 text-2xl font-bold">
                  {isLoading
                    ? "—"
                    : attractionsWithCoordinates.length}
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Mapped places
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <Compass
                  size={20}
                  className="text-sky-300"
                  aria-hidden="true"
                />

                <p className="mt-3 text-2xl font-bold">
                  25 km
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Project radius
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-300">
              Powered by Leaflet and OpenStreetMap community
              map data.
            </p>
          </aside>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <div className="text-center">
                <LoaderCircle
                  size={42}
                  className="mx-auto animate-spin text-teal-700"
                  aria-hidden="true"
                />

                <p className="mt-4 font-medium text-slate-600">
                  Loading map locations...
                </p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-rose-200 bg-white p-8">
              <div className="max-w-lg text-center">
                <AlertTriangle
                  size={42}
                  className="mx-auto text-rose-600"
                  aria-hidden="true"
                />

                <h2 className="mt-5 text-2xl font-bold text-slate-950">
                  Map locations could not be loaded
                </h2>

                <p className="mt-3 text-slate-600">
                  {errorMessage}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setRetryCount((count) => count + 1)
                  }
                  className="mt-7 rounded-full bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-600"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <>
              {selectedPlaceHasNoCoordinates && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
                  <TriangleAlert
                    size={21}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="font-bold">
                      Location currently unavailable
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-900/80">
                      Precise coordinates for{" "}
                      {requestedAttraction.name} have not yet
                      been verified.
                    </p>
                  </div>
                </div>
              )}

              {mapResourceError && (
                <div
                  role="alert"
                  className="mb-6 flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={21}
                      className="mt-0.5 shrink-0 text-rose-700"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="font-bold">
                        Map is currently unavailable
                      </p>

                      <p className="mt-1 text-sm leading-6 text-rose-800/80">
                        {mapResourceError}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={retryMapResources}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-rose-700 px-5 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    <RefreshCw size={17} aria-hidden="true" />
                    Retry map
                  </button>
                </div>
              )}

              <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                {selectedAttraction ? (
                  <div className="flex min-w-0 items-center gap-4">
                    <SafeImage
                      src={selectedAttraction.primaryImage}
                      alt={selectedAttraction.name}
                      className="h-16 w-20 shrink-0 rounded-2xl object-cover"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                        Selected location
                      </p>

                      <p className="mt-1 truncate font-bold text-slate-950">
                        {selectedAttraction.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-950">
                      Viewing all mapped attractions
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Select a location from the list or map.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedAttraction && (
                    <Link
                      to={`/places/${selectedAttraction.id}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-600"
                    >
                      View details
                      <ExternalLink
                        size={16}
                        aria-hidden="true"
                      />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={resetMapView}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
                  >
                    <RotateCcw
                      size={17}
                      aria-hidden="true"
                    />
                    Reset view
                  </button>
                </div>
              </div>

              <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 to-teal-950 p-6 text-white">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg">
                      <RouteIcon size={24} aria-hidden="true" />
                    </span>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
                        Optional planning tool
                      </p>
                      <h2 className="mt-2 text-2xl font-bold">
                        Approximate route preview
                      </h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                        Select two locations to preview an approximate driving
                        route, distance and travel time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-700">
                        Start point
                      </span>
                      <select
                        value={routeStartId}
                        onChange={(event) =>
                          updateRouteStart(event.target.value)
                        }
                        className="min-h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                      >
                        {routeLocations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-700">
                        Destination
                      </span>
                      <select
                        value={routeDestinationId}
                        onChange={(event) =>
                          updateRouteDestination(event.target.value)
                        }
                        className="min-h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                      >
                        <option value="">Select destination</option>
                        {routeLocations.map((location) => (
                          <option
                            key={location.id}
                            value={location.id}
                            disabled={location.id === routeStartId}
                          >
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={showRoute}
                        disabled={
                          isRouteLoading || !routeDestinationId
                        }
                        className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 lg:flex-none"
                      >
                        {isRouteLoading ? (
                          <>
                            <LoaderCircle
                              size={19}
                              className="animate-spin"
                              aria-hidden="true"
                            />
                            Calculating...
                          </>
                        ) : (
                          <>
                            <RouteIcon size={19} aria-hidden="true" />
                            Show route
                          </>
                        )}
                      </button>

                      {routeData && (
                        <button
                          type="button"
                          onClick={clearRoute}
                          className="min-h-12 rounded-2xl border border-slate-300 px-5 font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {routeError && (
                    <div
                      role="alert"
                      className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"
                    >
                      <AlertTriangle
                        size={20}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium">{routeError}</p>
                    </div>
                  )}

                  {routeData && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px]">
                      <div className="rounded-2xl bg-slate-100 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          Route
                        </p>
                        <p className="mt-2 font-bold text-slate-950">
                          {routeData.startName} → {routeData.destinationName}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-teal-50 p-4 text-teal-900">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <RouteIcon size={17} aria-hidden="true" />
                          Distance
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {routeData.distanceKm.toFixed(1)} km
                        </p>
                      </div>

                      <div className="rounded-2xl bg-amber-50 p-4 text-amber-900">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <Clock3 size={17} aria-hidden="true" />
                          Travel time
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {Math.max(
                            1,
                            Math.round(routeData.durationMinutes),
                          )} min
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <aside className="flex max-h-[620px] flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
                      Map locations
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-950">
                      Available attractions
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Select a place to move the map to its
                      location.
                    </p>
                  </div>

                  <div className="relative mb-4">
                    <label
                      htmlFor="map-location-search"
                      className="sr-only"
                    >
                      Search map locations
                    </label>

                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />

                    <input
                      id="map-location-search"
                      type="search"
                      value={locationSearch}
                      onChange={(event) =>
                        setLocationSearch(event.target.value)
                      }
                      placeholder="Search locations..."
                      className="min-h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                    />
                  </div>

                  {filteredAttractions.length > 0 ? (
                    <div className="space-y-3 overflow-y-auto pr-1">
                      {filteredAttractions.map(
                        (attraction) => {
                          const hasCoordinates =
                            Number.isFinite(
                              attraction.latitude,
                            ) &&
                            Number.isFinite(
                              attraction.longitude,
                            );

                          const isSelected =
                            selectedAttraction?.id ===
                            attraction.id;

                          return (
                            <button
                              key={attraction.id}
                              type="button"
                              onClick={() =>
                                selectAttraction(
                                  attraction.id,
                                )
                              }
                              disabled={!hasCoordinates}
                              className={`w-full rounded-2xl border p-4 text-left transition ${
                                isSelected
                                  ? "border-teal-600 bg-teal-50 shadow-sm"
                                  : hasCoordinates
                                    ? "border-slate-200 hover:border-teal-400 hover:bg-slate-50"
                                    : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                    isSelected
                                      ? "bg-teal-700 text-white"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  <MapPin
                                    size={18}
                                    aria-hidden="true"
                                  />
                                </span>

                                <span>
                                  <span className="block font-bold leading-6 text-slate-900">
                                    {attraction.name}
                                  </span>

                                  <span className="mt-1 block text-xs text-slate-500">
                                    {!hasCoordinates
                                      ? "Coordinates unavailable"
                                      : attraction.distanceKm !==
                                          null
                                        ? `Approx. ${attraction.distanceKm} km`
                                        : "Distance unavailable"}
                                  </span>
                                </span>
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                      <Search
                        size={28}
                        className="mx-auto text-slate-400"
                        aria-hidden="true"
                      />

                      <p className="mt-3 font-semibold text-slate-700">
                        No matching locations
                      </p>
                    </div>
                  )}
                </aside>

                <div className="min-h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 lg:h-[620px]">
                  <AttractionMap
                    key={mapRetryCount}
                    attractions={attractionsWithCoordinates}
                    selectedAttraction={selectedAttraction}
                    onAttractionSelect={selectAttraction}
                    onMapError={setMapResourceError}
                    routeCoordinates={
                      routeData?.coordinates || []
                    }
                  />
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Map data © OpenStreetMap contributors. Locations
                and distances are approximate. DayTrace does not
                provide live traffic or turn-by-turn navigation.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default MapPage;
