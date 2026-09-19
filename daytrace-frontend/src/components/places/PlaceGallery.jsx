import { useEffect, useState } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";

function PlaceGallery({ attraction }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imageCount = attraction.images.length;

  const openGallery = (imageIndex = 0) => {
    setActiveImageIndex(imageIndex);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? imageCount - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === imageCount - 1 ? 0 : currentIndex + 1,
    );
  };

  useEffect(() => {
  if (!isGalleryOpen) {
    return undefined;
  }

  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsGalleryOpen(false);
    }

    if (event.key === "ArrowLeft") {
      setActiveImageIndex((currentIndex) =>
        currentIndex === 0 ? imageCount - 1 : currentIndex - 1,
      );
    }

    if (event.key === "ArrowRight") {
      setActiveImageIndex((currentIndex) =>
        currentIndex === imageCount - 1 ? 0 : currentIndex + 1,
      );
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    document.body.style.overflow = originalOverflow;
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [isGalleryOpen, imageCount]);

  return (
    <>
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-200 shadow-2xl shadow-slate-900/15 sm:aspect-[16/8] lg:aspect-[16/7]">
            <img
              src={attraction.primaryImage}
              alt={`Development preview representing ${attraction.name}`}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

            <button
              type="button"
              onClick={() => openGallery(0)}
              className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-teal-300"
              aria-label={`Open photo gallery for ${attraction.name}`}
            />

            <div className="pointer-events-none absolute right-4 top-4 z-20 flex flex-wrap justify-end gap-2 sm:right-6 sm:top-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <Camera size={17} aria-hidden="true" />
                {imageCount} {imageCount === 1 ? "photo" : "photos"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <Expand size={17} aria-hidden="true" />
                View gallery
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-8">
              <span className="inline-flex rounded-full bg-teal-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-950">
                {attraction.category}
              </span>

              <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-5xl">
                {attraction.name}
              </h1>

              {attraction.imageIsPlaceholder && (
                <span className="mt-4 inline-flex rounded-full border border-white/20 bg-slate-950/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                  Development images
                </span>
              )}
            </div>
          </div>

          {imageCount > 1 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {attraction.images.map((image, index) => (
                <button
                  key={`${attraction.id}-image-${index}`}
                  type="button"
                  onClick={() => openGallery(index)}
                  className={`group relative aspect-[16/9] overflow-hidden rounded-2xl border-2 bg-slate-200 transition focus:outline-none focus:ring-4 focus:ring-teal-500/20 ${
                    index === 0
                      ? "border-teal-600"
                      : "border-transparent hover:border-teal-400"
                  }`}
                  aria-label={`Open image ${index + 1} of ${imageCount}`}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  <span className="absolute bottom-2 right-2 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {isGalleryOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-slate-950/98"
          role="dialog"
          aria-modal="true"
          aria-label={`${attraction.name} image gallery`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeGallery();
            }
          }}
        >
          <div className="flex items-center justify-between px-4 py-4 text-white sm:px-6">
            <p className="text-sm font-semibold">
              {activeImageIndex + 1} / {imageCount}
            </p>

            <button
              type="button"
              onClick={closeGallery}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
              aria-label="Close image gallery"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20">
            {imageCount > 1 && (
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-white/20 sm:left-6"
                aria-label="View previous image"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <img
              src={attraction.images[activeImageIndex]}
              alt={`${attraction.name} gallery image ${activeImageIndex + 1}`}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />

            {imageCount > 1 && (
              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-white/20 sm:right-6"
                aria-label="View next image"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {imageCount > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
              {attraction.images.map((image, index) => (
                <button
                  key={`gallery-thumbnail-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activeImageIndex === index
                      ? "border-teal-300"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View gallery image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PlaceGallery;