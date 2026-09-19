import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Images,
  LoaderCircle,
  Save,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import useAdminAuth from "../hooks/useAdminAuth";
import {
  getAttractionById,
  updateAttraction,
} from "../services/api";
import { calculateDistanceFromReferenceKm } from "../utils/geography";

const categories = [
  "Nature",
  "Historical",
  "Religious",
  "Wildlife",
  "Cultural",
  "Recreational",
];

const initialFormData = {
  name: "",
  category: "",
  description: "",
  locationName: "",
  address: "",
  latitude: "",
  longitude: "",
  openingTime: "",
  closingTime: "",
  openingNote: "",
  distanceFromReferenceKm: "",
  travelInformation: "",
  travelTips: "",
  facilities: "",
};

const inputClassName =
  "mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10";

const convertLinesToArray = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

function EditAttractionPage() {
  const { attractionId } = useParams();
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [attractionName, setAttractionName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let requestIsActive = true;

    const loadAttraction = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getAttractionById(attractionId);
        const attraction = response.attraction;

        if (!requestIsActive) {
          return;
        }

        setAttractionName(attraction.name);

        setFormData({
          name: attraction.name || "",
          category: attraction.category || "",
          description: attraction.description || "",
          locationName: attraction.location?.name || "",
          address: attraction.location?.address || "",
          latitude: attraction.location?.latitude ?? "",
          longitude: attraction.location?.longitude ?? "",
          openingTime:
            attraction.openingHours?.openingTime || "",
          closingTime:
            attraction.openingHours?.closingTime || "",
          openingNote: attraction.openingHours?.note || "",
          distanceFromReferenceKm:
            attraction.distanceFromReferenceKm ?? "",
          travelInformation:
            attraction.travelInformation || "",
          travelTips: (attraction.travelTips || []).join("\n"),
          facilities: (attraction.facilities || []).join("\n"),
        });
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

    loadAttraction();

    return () => {
      requestIsActive = false;
    };
  }, [attractionId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const latitude = Number(formData.latitude);
const longitude = Number(formData.longitude);

const radiusDistance =
  calculateDistanceFromReferenceKm(
    latitude,
    longitude,
  );

if (radiusDistance > 25) {
  setErrorMessage(
    `These coordinates are approximately ${radiusDistance.toFixed(1)} km from Wilpola. Attractions must be within the approved 25 km radius.`,
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return;
}

    try {
      setIsSaving(true);
      setErrorMessage("");

      const updatedData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),

        location: {
          name: formData.locationName.trim(),
          address: formData.address.trim(),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },

        openingHours: {
          openingTime: formData.openingTime,
          closingTime: formData.closingTime,
          note: formData.openingNote.trim(),
        },

        distanceFromReferenceKm:
          formData.distanceFromReferenceKm === ""
            ? null
            : Number(formData.distanceFromReferenceKm),

        travelInformation: formData.travelInformation.trim(),
        travelTips: convertLinesToArray(formData.travelTips),
        facilities: convertLinesToArray(formData.facilities),
      };

      await updateAttraction(attractionId, updatedData, token);

      navigate("/admin", {
  replace: true,
  state: {
    successMessage: `${formData.name.trim()} was updated successfully.`,
  },
});
    } catch (error) {
      setErrorMessage(error.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8f7]">
        <div className="text-center">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-teal-700"
          />
          <p className="mt-4 text-slate-600">
            Loading attraction information...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage && !attractionName) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8f7] px-5">
        <section className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-slate-950">
            Attraction could not be loaded
          </h1>

          <p className="mt-3 text-rose-700">
            {errorMessage}
          </p>

          <Link
            to="/admin"
            className="mt-6 inline-flex rounded-full bg-teal-700 px-6 py-3 font-semibold text-white"
          >
            Return to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8f7]">
      <header className="border-b border-slate-800 bg-slate-950 px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-300">
              Edit Attraction
            </p>
            <h1 className="mt-1 text-xl font-bold">
              {attractionName}
            </h1>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>
      </header>

      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-6xl space-y-7"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
                Destination management
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Update attraction details
              </h2>

              <p className="mt-3 text-slate-600">
                Review information carefully before saving changes.
              </p>
            </div>

            <Link
              to={`/admin/attractions/${attractionId}/images`}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-5 font-semibold text-teal-800 transition hover:bg-teal-100"
            >
              <Images size={18} />
              Manage Photos
            </Link>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-medium text-rose-700"
            >
              {errorMessage}
            </div>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              Basic information
            </h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Attraction name *
                </span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={120}
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Category *
                </span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Description *
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  minLength={20}
                  maxLength={5000}
                  rows={6}
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              Location and distance
            </h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Location name *
                </span>
                <input
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Address
                </span>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Latitude *
                </span>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Longitude *
                </span>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Distance from Wilpola (km)
                </span>
                <input
                  name="distanceFromReferenceKm"
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={formData.distanceFromReferenceKm}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">
              Visitor information
            </h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Opening time
                </span>
                <input
                  name="openingTime"
                  type="time"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Closing time
                </span>
                <input
                  name="closingTime"
                  type="time"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </label>

              <label className="sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Opening-hours note
                </span>
                <input
                  name="openingNote"
                  value={formData.openingNote}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </label>

              <label className="sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">
                  Travel information
                </span>
                <textarea
                  name="travelInformation"
                  value={formData.travelInformation}
                  onChange={handleChange}
                  rows={4}
                  maxLength={2000}
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Travel tips — one per line
                </span>
                <textarea
                  name="travelTips"
                  value={formData.travelTips}
                  onChange={handleChange}
                  rows={5}
                  className={inputClassName}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Facilities — one per line
                </span>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  rows={5}
                  className={inputClassName}
                />
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/admin"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 font-semibold text-slate-700"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-7 font-bold text-white transition hover:bg-teal-600 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <Save size={19} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditAttractionPage;