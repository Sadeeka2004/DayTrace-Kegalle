import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Save,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import useAdminAuth from "../hooks/useAdminAuth";
import {
  createAttraction,
  deleteUploadedAttractionImages,
  uploadAttractionImages,
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

const splitLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

    const getImageFileKey = (file) =>
  `${file.name}-${file.size}-${file.lastModified}`;

function AddAttractionPage() {
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const previewUrlsRef = useRef(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageMessage, setImageMessage] = useState("");

  useEffect(() => {
  const previewUrls = previewUrlsRef.current;

  return () => {
    previewUrls.forEach((previewUrl) => {
      URL.revokeObjectURL(previewUrl);
    });

    previewUrls.clear();
  };
}, []);

const replaceSelectedImages = (files) => {
  previewUrlsRef.current.forEach((previewUrl) => {
    URL.revokeObjectURL(previewUrl);
  });

  previewUrlsRef.current.clear();

  const previews = files.map((file) => {
    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.add(previewUrl);

    return {
      name: file.name,
      url: previewUrl,
    };
  });

  setImageFiles(files);
  setImagePreviews(previews);
};

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
  const newlySelectedFiles = Array.from(event.target.files || []);

  const invalidFile = newlySelectedFiles.find(
    (file) =>
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024,
  );

  if (invalidFile) {
    setImageMessage("");
    setErrorMessage(
      "Every image must be JPG, PNG or WebP and 5 MB or smaller.",
    );

    event.target.value = "";
    return;
  }

  const knownImageKeys = new Set(imageFiles.map(getImageFileKey));
  const uniqueNewFiles = [];
  const duplicateFileNames = [];

  newlySelectedFiles.forEach((file) => {
    const fileKey = getImageFileKey(file);

    if (knownImageKeys.has(fileKey)) {
      duplicateFileNames.push(file.name);
      return;
    }

    knownImageKeys.add(fileKey);
    uniqueNewFiles.push(file);
  });

  const updatedFiles = [...imageFiles, ...uniqueNewFiles];

  if (updatedFiles.length > 10) {
    setImageMessage("");
    setErrorMessage("You can upload a maximum of 10 images.");

    event.target.value = "";
    return;
  }

  setErrorMessage("");

  if (uniqueNewFiles.length > 0) {
    replaceSelectedImages(updatedFiles);
  }

  if (duplicateFileNames.length > 0) {
    const uniqueDuplicateNames = [...new Set(duplicateFileNames)];

    const imageWord =
      uniqueDuplicateNames.length === 1
        ? "image was"
        : "images were";

    setImageMessage(
      `Duplicate ${imageWord} not added: ${uniqueDuplicateNames.join(", ")}`,
    );
  } else {
    setImageMessage("");
  }

  // Allows the same file to be selected again after removing it.
  event.target.value = "";
};

  const removeImage = (imageIndex) => {
  const remainingFiles = imageFiles.filter(
    (file, index) => index !== imageIndex,
  );

  replaceSelectedImages(remainingFiles);
  setImageMessage("");
};

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (imageFiles.length === 0) {
    setErrorMessage(
      "Please select at least one attraction image.",
    );
    return;
  }

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

  let uploadedImages = [];

  try {
    setIsSubmitting(true);
    setErrorMessage("");

    const uploadResponse =
      await uploadAttractionImages(
        imageFiles,
        token,
      );

    uploadedImages = uploadResponse.images;

    const attractionData = {
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

      travelInformation:
        formData.travelInformation.trim(),

      travelTips: splitLines(formData.travelTips),
      facilities: splitLines(formData.facilities),
      images: uploadedImages,
    };

    await createAttraction(attractionData, token);

    navigate("/admin", {
      replace: true,
      state: {
        successMessage:
          `${formData.name.trim()} was added successfully.`,
      },
    });
  } catch (error) {
    const failureWasConfirmedByServer =
      error.status >= 400 && error.status < 500;

    if (
      uploadedImages.length > 0 &&
      failureWasConfirmedByServer
    ) {
      try {
        await deleteUploadedAttractionImages(
          uploadedImages,
          token,
        );
      } catch (cleanupError) {
        console.error(
          `Uploaded image cleanup failed: ${cleanupError.message}`,
        );
      }
    }

    setErrorMessage(error.message);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-[#f4f8f7]">
      <header className="border-b border-slate-800 bg-slate-950 px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-300">
              DayTrace Administration
            </p>
            <h1 className="mt-1 text-xl font-bold">
              Add Attraction
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
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
              New destination
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Attraction information
            </h2>

            <p className="mt-3 text-slate-600">
              Enter verified information that can be shown to tourists.
            </p>
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
              <label className="block">
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

              <label className="block">
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

              <label className="block sm:col-span-2">
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
            <div className="flex items-center gap-3">
              <MapPin className="text-teal-700" />
              <h3 className="text-xl font-bold text-slate-950">
                Location and distance
              </h3>
            </div>

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
                  Approximate distance from Wilpola (km)
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
                  placeholder="Example: Verify current opening times before visiting"
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
                  Travel tips
                </span>
                <textarea
                  name="travelTips"
                  value={formData.travelTips}
                  onChange={handleChange}
                  rows={5}
                  className={inputClassName}
                  placeholder={"Enter one tip per line\nCarry drinking water"}
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">
                  Facilities
                </span>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  rows={5}
                  className={inputClassName}
                  placeholder={"Enter one facility per line\nParking"}
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <ImagePlus className="text-teal-700" />
              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  Attraction images *
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  The first selected image becomes the primary image.
                </p>
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-teal-500 hover:bg-teal-50">
              <ImagePlus size={36} className="text-teal-700" />

              <span className="mt-4 font-bold text-slate-900">
                Select attraction images
              </span>

              <span className="mt-2 text-sm text-slate-500">
                JPG, PNG or WebP · maximum 5 MB each · up to 10 images
              </span>

              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleImagesChange}
                className="sr-only"
              />
            </label>
            {imageMessage && (
  <div
    role="status"
    className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900"
  >
    <AlertTriangle
      size={19}
      className="mt-0.5 shrink-0 text-amber-700"
      aria-hidden="true"
    />

    <span>{imageMessage}</span>
  </div>
)}

            {imagePreviews.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview.url}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={preview.url}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">
                        Primary
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white transition hover:bg-rose-600"
                      aria-label={`Remove ${preview.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/admin"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-7 font-bold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Uploading and saving...
                </>
              ) : (
                <>
                  <Save size={19} />
                  Save Attraction
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddAttractionPage;