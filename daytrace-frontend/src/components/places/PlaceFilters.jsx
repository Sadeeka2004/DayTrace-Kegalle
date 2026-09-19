import {
  ArrowUpDown,
  Compass,
  Flower2,
  Heart,
  Landmark,
  MapPinned,
  Mountain,
  Palette,
  PawPrint,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { categories } from "../../data/categories";

const categoryIcons = {
  mountain: Mountain,
  flower: Flower2,
  landmark: Landmark,
  palette: Palette,
  paw: PawPrint,
  compass: Compass,
};

function PlaceFilters({
  searchQuery,
  selectedCategory,
  showFavoritesOnly,
  favoriteCount,
  sortOption,
  onSearchChange,
  onCategoryChange,
  onFavoritesChange,
  onSortChange,
  onClearFilters,
}) {
  const hasActiveFilters =
    searchQuery ||
    selectedCategory ||
    showFavoritesOnly ||
    sortOption !== "name";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
          <SlidersHorizontal
            size={18}
            className="text-teal-700"
          />
          Search and filter
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <label htmlFor="place-search" className="sr-only">
              Search attractions
            </label>

            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="place-search"
              type="search"
              value={searchQuery}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search by place, category or location..."
              className="min-h-13 w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
            />
          </div>

          <div className="relative">
            <label htmlFor="place-sort" className="sr-only">
              Sort attractions
            </label>

            <ArrowUpDown
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-teal-700"
              aria-hidden="true"
            />

            <select
              id="place-sort"
              value={sortOption}
              onChange={(event) =>
                onSortChange(event.target.value)
              }
              className="min-h-13 w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-10 font-semibold text-slate-700 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
            >
              <option value="name">Name: A to Z</option>
              <option value="distance-asc">
                Nearest to Wilpola
              </option>
              <option value="distance-desc">
                Farthest from Wilpola
              </option>
            </select>

            <span
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500"
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Filter by category
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCategoryChange("")}
              aria-pressed={selectedCategory === ""}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === ""
                  ? "border-teal-700 bg-teal-700 text-white shadow-md"
                  : "border-slate-300 bg-white text-slate-600 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
              }`}
            >
              <MapPinned size={16} aria-hidden="true" />
              All places
            </button>

            {categories.map((category) => {
              const isSelected =
                selectedCategory === category.slug;

              const CategoryIcon =
                categoryIcons[category.icon];

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    onCategoryChange(category.slug)
                  }
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "border-teal-700 bg-teal-700 text-white shadow-md"
                      : "border-slate-300 bg-white text-slate-600 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
                  }`}
                >
                  <CategoryIcon
                    size={16}
                    aria-hidden="true"
                  />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() =>
              onFavoritesChange(!showFavoritesOnly)
            }
            aria-pressed={showFavoritesOnly}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-rose-400/20 ${
              showFavoritesOnly
                ? "border-rose-500 bg-rose-600 text-white shadow-md"
                : "border-slate-300 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            }`}
          >
            <Heart
              size={17}
              fill={showFavoritesOnly ? "currentColor" : "none"}
              aria-hidden="true"
            />

            Favorites only

            <span
              className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                showFavoritesOnly
                  ? "bg-white/20 text-white"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {favoriteCount}
            </span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex w-fit items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            <X size={17} aria-hidden="true" />
            Clear search and filters
          </button>
        )}
      </div>
    </div>
  );
}

export default PlaceFilters;