import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  LoaderCircle,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import useAdminAuth from "../hooks/useAdminAuth";
import {
  deleteUploadedAttractionImages,
  getAttractionById,
  updateAttraction,
  uploadAttractionImages,
} from "../services/api";

const getExistingImageKey = (image) =>
  `existing-${image._id || image.url}`;

const getNewImageKey = (file) =>
  `new-${file.name}-${file.size}-${file.lastModified}`;

function ManageAttractionImagesPage() {
  const { attractionId } = useParams();
  const navigate = useNavigate();
  const { token } = useAdminAuth();

  const [attraction, setAttraction] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const previewUrlsRef = useRef(new Set());
  const [primaryImageKey, setPrimaryImageKey] = useState("");
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
        const attractionData = response.attraction;
        const currentImages = attractionData.images || [];

        if (!requestIsActive) {
          return;
        }

        setAttraction(attractionData);
        setExistingImages(currentImages);

        const primaryImage =
          currentImages.find((image) => image.isPrimary) ||
          currentImages[0];

        if (primaryImage) {
          setPrimaryImageKey(getExistingImageKey(primaryImage));
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

    loadAttraction();

    return () => {
      requestIsActive = false;
    };
  }, [attractionId]);

  useEffect(() => {
  const previewUrls = previewUrlsRef.current;

  return () => {
    previewUrls.forEach((previewUrl) => {
      URL.revokeObjectURL(previewUrl);
    });

    previewUrls.clear();
  };
}, []);

const replaceNewImages = (files) => {
  previewUrlsRef.current.forEach((previewUrl) => {
    URL.revokeObjectURL(previewUrl);
  });

  previewUrlsRef.current.clear();

  const previews = files.map((file) => {
    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.add(previewUrl);

    return {
      key: getNewImageKey(file),
      name: file.name,
      url: previewUrl,
    };
  });

  setNewImageFiles(files);
  setNewImagePreviews(previews);
};

  const selectFallbackPrimary = (
    remainingExistingImages,
    remainingNewFiles,
  ) => {
    if (remainingExistingImages.length > 0) {
      return getExistingImageKey(remainingExistingImages[0]);
    }

    if (remainingNewFiles.length > 0) {
      return getNewImageKey(remainingNewFiles[0]);
    }

    return "";
  };

  const handleNewImages = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    const invalidFile = selectedFiles.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      setErrorMessage(
        "Every image must be JPG, PNG or WebP and 5 MB or smaller.",
      );
      event.target.value = "";
      return;
    }

    const combinedFiles = [...newImageFiles, ...selectedFiles];

    const uniqueFiles = combinedFiles.filter(
      (file, index, files) =>
        index ===
        files.findIndex(
          (otherFile) =>
            otherFile.name === file.name &&
            otherFile.size === file.size &&
            otherFile.lastModified === file.lastModified,
        ),
    );

    if (existingImages.length + uniqueFiles.length > 10) {
      setErrorMessage(
        "An attraction can contain a maximum of 10 images.",
      );
      event.target.value = "";
      return;
    }

    if (!primaryImageKey && uniqueFiles.length > 0) {
      setPrimaryImageKey(getNewImageKey(uniqueFiles[0]));
    }

    replaceNewImages(uniqueFiles);
    setErrorMessage("");
    event.target.value = "";
  };

  const removeExistingImage = (imageToRemove) => {
    const removedKey = getExistingImageKey(imageToRemove);

    const remainingImages = existingImages.filter(
      (image) => getExistingImageKey(image) !== removedKey,
    );

    setExistingImages(remainingImages);

    if (primaryImageKey === removedKey) {
      setPrimaryImageKey(
        selectFallbackPrimary(remainingImages, newImageFiles),
      );
    }
  };

  const removeNewImage = (fileToRemove) => {
    const removedKey = getNewImageKey(fileToRemove);

    const remainingFiles = newImageFiles.filter(
      (file) => getNewImageKey(file) !== removedKey,
    );

    replaceNewImages(remainingFiles);

    if (primaryImageKey === removedKey) {
      setPrimaryImageKey(
        selectFallbackPrimary(existingImages, remainingFiles),
      );
    }
  };

  const handleSave = async () => {
  if (
    existingImages.length + newImageFiles.length ===
    0
  ) {
    setErrorMessage(
      "An attraction must contain at least one image.",
    );
    return;
  }

  if (!primaryImageKey) {
    setErrorMessage(
      "Please select one primary image.",
    );
    return;
  }

  let uploadedImages = [];

  try {
    setIsSaving(true);
    setErrorMessage("");

    if (newImageFiles.length > 0) {
      const uploadResponse =
        await uploadAttractionImages(
          newImageFiles,
          token,
        );

      uploadedImages = uploadResponse.images;
    }

    const preparedExistingImages =
      existingImages.map((image, index) => ({
        _id: image._id,
        url: image.url,

        altText:
          image.altText ||
          `${attraction.name} photo ${index + 1}`,

        isPrimary:
          primaryImageKey ===
          getExistingImageKey(image),
      }));

    const preparedNewImages =
      uploadedImages.map((image, index) => ({
        url: image.url,

        altText: `${attraction.name} photo ${
          preparedExistingImages.length + index + 1
        }`,

        isPrimary:
          primaryImageKey ===
          getNewImageKey(newImageFiles[index]),
      }));

    await updateAttraction(
      attractionId,
      {
        images: [
          ...preparedExistingImages,
          ...preparedNewImages,
        ],
      },
      token,
    );

    navigate("/admin", {
      replace: true,

      state: {
        successMessage:
          `Photos for ${attraction.name} were updated successfully.`,
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
            Loading attraction images...
          </p>
        </div>
      </main>
    );
  }

  if (!attraction) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f8f7] px-5">
        <section className="rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-slate-950">
            Attraction could not be loaded
          </h1>
          <p className="mt-3 text-rose-700">{errorMessage}</p>
          <Link
            to="/admin"
            className="mt-6 inline-flex rounded-full bg-teal-700 px-5 py-3 font-semibold text-white"
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
              Image Management
            </p>
            <h1 className="mt-1 text-xl font-bold">
              {attraction.name}
            </h1>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>
      </header>

      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
              Destination gallery
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Manage photographs
            </h2>
            <p className="mt-3 text-slate-600">
              Select the primary image and manage additional gallery images.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 font-medium text-rose-700"
            >
              {errorMessage}
            </div>
          )}

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-slate-950">
                Current images
              </h3>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                {existingImages.length + newImageFiles.length} / 10
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {existingImages.map((image) => {
                const imageKey = getExistingImageKey(image);
                const isPrimary = primaryImageKey === imageKey;

                return (
                  <div
                    key={imageKey}
                    className={`relative overflow-hidden rounded-2xl border-2 bg-slate-100 ${
                      isPrimary
                        ? "border-teal-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || ""}
                      className="aspect-[4/3] w-full object-cover"
                    />

                    {isPrimary && (
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">
                        <Check size={13} />
                        Primary
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryImageKey(imageKey)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-amber-600 shadow"
                        aria-label="Make primary image"
                      >
                        <Star size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeExistingImage(image)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-rose-600 shadow"
                        aria-label="Remove image"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {newImagePreviews.map((preview, index) => {
                const file = newImageFiles[index];
                const isPrimary =
                  primaryImageKey === preview.key;

                return (
                  <div
                    key={preview.key}
                    className={`relative overflow-hidden rounded-2xl border-2 bg-slate-100 ${
                      isPrimary
                        ? "border-teal-600"
                        : "border-dashed border-sky-400"
                    }`}
                  >
                    <img
                      src={preview.url}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />

                    <span className="absolute right-2 top-2 rounded-full bg-sky-600 px-2.5 py-1 text-xs font-bold text-white">
                      New
                    </span>

                    {isPrimary && (
                      <span className="absolute left-2 top-2 rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">
                        Primary
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setPrimaryImageKey(preview.key)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-amber-600 shadow"
                      >
                        <Star size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeNewImage(file)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-rose-600 shadow"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-9 text-center transition hover:border-teal-500 hover:bg-teal-50">
              <ImagePlus size={34} className="text-teal-700" />
              <span className="mt-3 font-bold text-slate-900">
                Add more images
              </span>
              <span className="mt-1 text-sm text-slate-500">
                JPG, PNG or WebP · maximum 5 MB each
              </span>

              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleNewImages}
                className="sr-only"
              />
            </label>
          </section>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/admin"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 font-semibold text-slate-700"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-7 font-bold text-white transition hover:bg-teal-600 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Saving images...
                </>
              ) : (
                <>
                  <Save size={19} />
                  Save Image Changes
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ManageAttractionImagesPage;