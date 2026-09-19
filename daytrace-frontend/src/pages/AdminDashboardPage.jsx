import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Image,
  Images,
  LoaderCircle,
  MapPin,
  MapPinned,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import AdminHeader from "../components/admin/AdminHeader";
import SafeImage from "../components/common/SafeImage";
import { categories } from "../data/categories";
import useAdminAuth from "../hooks/useAdminAuth";
import { Link, useLocation, useNavigate } from "react-router";
import {
  deleteAttraction,
  getAttractions,
} from "../services/api";
import { normalizeAttractions } from "../utils/normalizeAttraction";


function AdminDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    () => location.state?.successMessage || "",
  );
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [attractionToDelete, setAttractionToDelete] =
    useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!location.state?.successMessage) {
      return;
    }

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate]);

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
    if (!attractionToDelete) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        setAttractionToDelete(null);
        setDeleteError("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [attractionToDelete, isDeleting]);

  const dashboardStatistics = useMemo(() => {
    const mappedAttractions = attractions.filter(
      (attraction) =>
        Number.isFinite(attraction.latitude) &&
        Number.isFinite(attraction.longitude),
    ).length;

    const uploadedPhotos = attractions.reduce(
      (total, attraction) =>
        total +
        (attraction.imageIsPlaceholder
          ? 0
          : attraction.images.length),
      0,
    );

    return {
      totalAttractions: attractions.length,
      categoryCount: categories.length,
      mappedAttractions,
      uploadedPhotos,
    };
  }, [attractions]);

  const filteredAttractions = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return attractions.filter((attraction) => {
      const matchesCategory =
        selectedCategory === "" ||
        attraction.category.toLowerCase() ===
          selectedCategory.toLowerCase();

      const searchableContent = [
        attraction.name,
        attraction.category,
        attraction.location,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        searchableContent.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [attractions, searchQuery, selectedCategory]);

  const hasActiveFilters = searchQuery || selectedCategory;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  const statisticCards = [
  {
    label: "Total attractions",
    value: dashboardStatistics.totalAttractions,
    icon: MapPinned,
    colour: "bg-teal-50 text-teal-700",
  },
  {
    label: "Categories",
    value: dashboardStatistics.categoryCount,
    icon: SlidersHorizontal,
    colour: "bg-amber-50 text-amber-700",
  },
  {
    label: "Mapped locations",
    value: dashboardStatistics.mappedAttractions,
    icon: MapPin,
    colour: "bg-sky-50 text-sky-700",
  },
  {
    label: "Uploaded photos",
    value: dashboardStatistics.uploadedPhotos,
    icon: Images,
    colour: "bg-violet-50 text-violet-700",
  },
];

  const openDeleteDialog = (attraction) => {
    setAttractionToDelete(attraction);
    setDeleteError("");
    setSuccessMessage("");
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setAttractionToDelete(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!attractionToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteAttraction(attractionToDelete.id, token);

      setAttractions((currentAttractions) =>
        currentAttractions.filter(
          (attraction) =>
            attraction.id !== attractionToDelete.id,
        ),
      );

      setSuccessMessage(
        `${attractionToDelete.name} was deleted successfully.`,
      );

      setAttractionToDelete(null);
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#f4f8f7]">
        <AdminHeader
          title="Admin Dashboard"
          description="Manage tourism attraction information"
        />

        <section className="px-5 py-10 sm:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
                  Management overview
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-950">
                  Tourism attractions
                </h2>

                <p className="mt-3 text-slate-600">
                  Add, edit and maintain verified attraction
                  information.
                </p>
              </div>

              <Link
                to="/admin/attractions/new"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 font-semibold text-white transition hover:bg-teal-600 focus:ring-4 focus:ring-teal-600/20"
              >
                <Plus size={19} />
                Add Attraction
              </Link>
            </div>

            {successMessage && (
              <div
                role="status"
                className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800"
              >
                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0"
                />
                <p className="font-medium">{successMessage}</p>
              </div>
            )}

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {statisticCards.map((card) => {
                const Icon = card.icon;

                return (
                  <section
                    key={card.label}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.colour}`}
                    >
                      <Icon size={24} />
                    </span>

                    <p className="mt-5 text-3xl font-bold text-slate-950">
                      {isLoading ? "—" : card.value}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {card.label}
                    </p>
                  </section>
                );
              })}
            </div>

            <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Attraction records
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Information currently visible to website visitors.
                  </p>
                </div>

                <Link
                  to="/places"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                >
                  <ExternalLink size={16} />
                  Public view
                </Link>
              </div>

              {!isLoading && !errorMessage && attractions.length > 0 && (
                <div className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                      <SlidersHorizontal
                        size={17}
                        className="text-teal-700"
                      />
                      Find a record
                    </p>

                    <p className="text-sm font-medium text-slate-500">
                      {filteredAttractions.length} of {attractions.length}
                    </p>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[1fr_240px_auto]">
                    <label className="relative block">
                      <span className="sr-only">Search attractions</span>
                      <Search
                        size={19}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                          setSearchQuery(event.target.value)
                        }
                        placeholder="Search name or location..."
                        className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                      />
                    </label>

                    <label>
                      <span className="sr-only">Filter by category</span>
                      <select
                        value={selectedCategory}
                        onChange={(event) =>
                          setSelectedCategory(event.target.value)
                        }
                        className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                      >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <X size={17} />
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex min-h-72 items-center justify-center">
                  <div className="text-center">
                    <LoaderCircle
                      size={38}
                      className="mx-auto animate-spin text-teal-700"
                    />
                    <p className="mt-4 text-slate-600">
                      Loading attraction records...
                    </p>
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="px-6 py-16 text-center">
                  <AlertTriangle
                    size={40}
                    className="mx-auto text-rose-600"
                  />

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    Records could not be loaded
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setRetryCount((count) => count + 1)
                    }
                    className="mt-6 rounded-full bg-teal-700 px-5 py-2.5 font-semibold text-white"
                  >
                    Try again
                  </button>
                </div>
              ) : attractions.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <MapPinned
                    size={42}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    No attractions available
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Add the first verified attraction using the
                    management form.
                  </p>
                </div>
              ) : filteredAttractions.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Search size={42} className="mx-auto text-slate-400" />

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    No matching records
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Try another search or clear the selected category.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-full bg-teal-700 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-600"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredAttractions.map((attraction) => {
                

                    return (
                    <article
                      key={attraction.id}
                      className="grid gap-5 p-5 transition hover:bg-slate-50 sm:grid-cols-[100px_1fr_auto] sm:items-center"
                    >
                      <SafeImage
                        src={attraction.primaryImage}
                        alt={`${attraction.name} preview`}
                        className="h-24 w-full rounded-2xl object-cover sm:h-20 sm:w-24"
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">
                            {attraction.name}
                          </h3>

                          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
                            {attraction.category}
                          </span>
                        </div>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin
                            size={15}
                            className="text-teal-700"
                          />
                          {attraction.location}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                          <Image
                            size={15}
                            className="text-teal-700"
                          />

                          {attraction.imageIsPlaceholder
                            ? "No uploaded photos"
                            : `${attraction.images.length} uploaded ${
                                attraction.images.length === 1
                                  ? "photo"
                                  : "photos"
                              }`}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Link
                          to={`/admin/attractions/${attraction.id}/edit`}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          <Pencil size={15} />
                          Edit
                        </Link>

                        <Link
                          to={`/admin/attractions/${attraction.id}/images`}
                          className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
                        >
                          <Images size={15} />
                          Photos
                        </Link>

                        <Link
                          to={`/places/${attraction.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                        >
                          View
                          <ExternalLink size={15} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            openDeleteDialog(attraction)
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>

      {attractionToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteDialog();
            }
          }}
        >
          <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <Trash2 size={23} />
              </span>

              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                aria-label="Close delete confirmation"
              >
                <X size={21} />
              </button>
            </div>

            <h2
              id="delete-dialog-title"
              className="mt-6 text-2xl font-bold text-slate-950"
            >
              Delete this attraction?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              You are about to permanently delete{" "}
              <strong className="text-slate-950">
                {attractionToDelete.name}
              </strong>
              . Its database information and uploaded images will be
              removed.
            </p>

            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
              This action cannot be undone.
            </div>

            {deleteError && (
              <p className="mt-4 text-sm font-medium text-rose-700">
                {deleteError}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className="min-h-11 rounded-full border border-slate-300 px-5 font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-rose-700 px-5 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default AdminDashboardPage;
