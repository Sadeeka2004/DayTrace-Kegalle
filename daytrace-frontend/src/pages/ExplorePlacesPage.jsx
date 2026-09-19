import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Compass,
  Heart,
  Layers3,
  MapPin,
  SearchX,
} from "lucide-react";
import { useSearchParams } from "react-router";
import PlaceCard from "../components/places/PlaceCard";
import PlaceCardSkeleton from "../components/places/PlaceCardSkeleton";
import PlaceFilters from "../components/places/PlaceFilters";
import useFavorites from "../hooks/useFavorites";
import { getAttractions } from "../services/api";
import { normalizeAttractions } from "../utils/normalizeAttraction";
import exploreHeroImage from "../assets/images/bathalegala-view-placeholder.png";

function formatCategoryForApi(category) {
  if (!category) {
    return "";
  }

  return (
    category.charAt(0).toUpperCase() +
    category.slice(1).toLowerCase()
  );
}

function ExplorePlacesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoriteAttractionIds } = useFavorites();

  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const searchQuery = searchParams.get("search") ?? "";
  const selectedCategory =
    searchParams.get("category") ?? "";

  const showFavoritesOnly =
  searchParams.get("favorites") === "true";

const sortOption = searchParams.get("sort") ?? "name";

const displayedAttractions = useMemo(() => {
  const filteredAttractions = showFavoritesOnly
    ? attractions.filter((attraction) =>
        favoriteAttractionIds.includes(attraction.id),
      )
    : attractions;

  return [...filteredAttractions].sort(
    (firstAttraction, secondAttraction) => {
      if (sortOption === "distance-asc") {
        const firstDistance = Number.isFinite(
          firstAttraction.distanceKm,
        )
          ? firstAttraction.distanceKm
          : Number.POSITIVE_INFINITY;

        const secondDistance = Number.isFinite(
          secondAttraction.distanceKm,
        )
          ? secondAttraction.distanceKm
          : Number.POSITIVE_INFINITY;

        return firstDistance - secondDistance;
      }

      if (sortOption === "distance-desc") {
        const firstDistance = Number.isFinite(
          firstAttraction.distanceKm,
        )
          ? firstAttraction.distanceKm
          : Number.NEGATIVE_INFINITY;

        const secondDistance = Number.isFinite(
          secondAttraction.distanceKm,
        )
          ? secondAttraction.distanceKm
          : Number.NEGATIVE_INFINITY;

        return secondDistance - firstDistance;
      }

      return firstAttraction.name.localeCompare(
        secondAttraction.name,
      );
    },
  );
}, [
  attractions,
  favoriteAttractionIds,
  showFavoritesOnly,
  sortOption,
]);

  useEffect(() => {
    let requestIsActive = true;

    const requestTimer = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getAttractions({
          search: searchQuery,
          category: formatCategoryForApi(selectedCategory),
        });

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
    }, 300);

    return () => {
      requestIsActive = false;
      window.clearTimeout(requestTimer);
    };
  }, [searchQuery, selectedCategory, retryCount]);

  const updateSearchQuery = (newSearchQuery) => {
    const updatedParams = new URLSearchParams(searchParams);

    if (newSearchQuery.trim()) {
      updatedParams.set("search", newSearchQuery);
    } else {
      updatedParams.delete("search");
    }

    setSearchParams(updatedParams);
  };

  const updateCategory = (newCategory) => {
    const updatedParams = new URLSearchParams(searchParams);

    if (newCategory) {
      updatedParams.set("category", newCategory);
    } else {
      updatedParams.delete("category");
    }

    setSearchParams(updatedParams);
  };

  const updateFavoritesOnly = (
    shouldShowFavoritesOnly,
  ) => {
    const updatedParams = new URLSearchParams(searchParams);

    if (shouldShowFavoritesOnly) {
      updatedParams.set("favorites", "true");
    } else {
      updatedParams.delete("favorites");
    }

    setSearchParams(updatedParams);
  };

  const updateSortOption = (newSortOption) => {
  const updatedParams = new URLSearchParams(searchParams);

  if (newSortOption === "name") {
    updatedParams.delete("sort");
  } else {
    updatedParams.set("sort", newSortOption);
  }

  setSearchParams(updatedParams);
};

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f4f8f7]">
      <section className="relative isolate overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8 lg:py-24">
  <img
    src={exploreHeroImage}
    alt="Scenic landscape representing attractions around Kegalle"
    className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
    loading="eager"
    fetchPriority="high"
  />

  <div className="absolute inset-0 -z-20 bg-slate-950/45" />

  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/35" />

  <div className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />

  <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_320px]">
    <div className="max-w-3xl">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-teal-100 shadow-lg backdrop-blur-md">
        <MapPin size={17} aria-hidden="true" />
        Attractions within the approved 25 km area
      </div>

      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
        Explore places.

        <span className="block text-teal-300">
          Find your next stop.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
        Discover natural, historical, religious, cultural,
        wildlife and recreational attractions around Kegalle.
      </p>
    </div>

    <aside className="rounded-3xl border border-white/20 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-300">
        Explore smarter
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
            <Compass size={21} aria-hidden="true" />
          </span>

          <div>
            <p className="text-xl font-bold">25 km</p>
            <p className="text-sm text-slate-300">
              Discovery area
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400 text-slate-950">
            <Layers3 size={21} aria-hidden="true" />
          </span>

          <div>
            <p className="text-xl font-bold">6</p>
            <p className="text-sm text-slate-300">
              Tourism categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-400 text-slate-950">
            <Heart
              size={21}
              fill="currentColor"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-xl font-bold">
              {favoriteAttractionIds.length}
            </p>

            <p className="text-sm text-slate-300">
              Session favorites
            </p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</section>


      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <PlaceFilters
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            showFavoritesOnly={showFavoritesOnly}
            favoriteCount={favoriteAttractionIds.length}
            onSearchChange={updateSearchQuery}
            onCategoryChange={updateCategory}
            onFavoritesChange={updateFavoritesOnly}
            onClearFilters={clearFilters}
            sortOption={sortOption}
            onSortChange={updateSortOption}
          />
        </div>
      </section>

      <section
        aria-labelledby="attraction-results-heading"
        className="px-5 pb-16 sm:px-8 lg:pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
                Available destinations
              </p>

              <h2
                id="attraction-results-heading"
                className="mt-2 text-2xl font-bold text-slate-950"
                aria-live="polite"
              >
                {isLoading
                  ? "Loading places..."
                  : `${displayedAttractions.length} ${
                      displayedAttractions.length === 1
                        ? "place"
                        : "places"
                    } found`}
              </h2>
            </div>

            {showFavoritesOnly && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
                <Heart
                  size={16}
                  fill="currentColor"
                  aria-hidden="true"
                />
                Showing favorites
              </span>
            )}
          </div>

          {isLoading ? (
            <div
              className="grid gap-7 md:grid-cols-2 xl:grid-cols-3"
              aria-label="Loading attractions"
            >
              {Array.from(
                { length: 6 },
                (_, index) => (
                  <PlaceCardSkeleton key={index} />
                ),
              )}
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl border border-rose-200 bg-white px-6 py-16 text-center">
              <AlertTriangle
                size={38}
                className="mx-auto text-rose-600"
                aria-hidden="true"
              />

              <h3 className="mt-5 text-2xl font-bold text-slate-950">
                Attractions could not be loaded
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-600">
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
          ) : displayedAttractions.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {displayedAttractions.map((attraction) => (
                <PlaceCard
                  key={attraction.id}
                  attraction={attraction}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <SearchX
                size={38}
                className="mx-auto text-slate-500"
                aria-hidden="true"
              />

              <h3 className="mt-6 text-2xl font-bold text-slate-950">
                {showFavoritesOnly
                  ? "No favorite attractions found"
                  : "No matching attractions"}
              </h3>

              <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
                {showFavoritesOnly
                  ? "Select the heart icon on a place card, or change the current search and category filters."
                  : "Try a different keyword or select another category."}
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 rounded-full bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-600"
              >
                {showFavoritesOnly
                  ? "Show all places"
                  : "Clear filters"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ExplorePlacesPage;