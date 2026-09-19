import {
  ArrowUpRight,
  Camera,
  MapPin,
  Route as RouteIcon,
} from "lucide-react";
import { Link } from "react-router";
import SafeImage from "../common/SafeImage";
import AddToPlanButton from "./AddToPlanButton";
import FavoriteButton from "./FavoriteButton";

function PlaceCard({ attraction }) {
  const additionalPhotoCount = Math.max(
    attraction.images.length - 1,
    0,
  );

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10">
      <div className="relative">
        <Link
          to={`/places/${attraction.slug}`}
          className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-teal-500/40"
          aria-label={`View details about ${attraction.name}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
            <SafeImage
              src={attraction.primaryImage}
              alt={attraction.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-800 shadow-sm backdrop-blur-md">
              {attraction.category}
            </span>

            {attraction.imageIsPlaceholder && (
              <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                Development image
              </span>
            )}

            {additionalPhotoCount > 0 && (
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Camera size={15} aria-hidden="true" />
                +{additionalPhotoCount} photos
              </span>
            )}
          </div>
        </Link>

        <FavoriteButton
          attractionId={attraction.id}
          attractionName={attraction.name}
          className="absolute right-4 top-4 z-20"
        />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              to={`/places/${attraction.slug}`}
              className="focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
            >
              <h2 className="text-xl font-bold leading-7 text-slate-950 transition hover:text-teal-800">
                {attraction.name}
              </h2>
            </Link>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  size={16}
                  className="text-teal-700"
                  aria-hidden="true"
                />
                {attraction.location}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <RouteIcon
                  size={16}
                  className="text-teal-700"
                  aria-hidden="true"
                />
                Approx. {attraction.distanceKm} km
              </span>
            </div>
          </div>

          <Link
            to={`/places/${attraction.slug}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-teal-600 hover:bg-teal-600 hover:text-white"
            aria-label={`View ${attraction.name}`}
          >
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
          {attraction.shortDescription}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <AddToPlanButton attractionId={attraction.id} />

          <Link
            to={`/places/${attraction.slug}`}
            className="inline-flex items-center gap-2 font-semibold text-teal-800 transition hover:text-teal-600"
          >
            Details
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PlaceCard;