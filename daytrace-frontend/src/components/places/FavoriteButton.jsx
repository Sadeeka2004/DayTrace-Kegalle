import { Heart } from "lucide-react";
import useFavorites from "../../hooks/useFavorites";

function FavoriteButton({
  attractionId,
  attractionName,
  className = "",
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favoriteIsSelected = isFavorite(attractionId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(attractionId)}
      aria-pressed={favoriteIsSelected}
      aria-label={`${favoriteIsSelected ? "Remove" : "Add"} ${
        attractionName || "this attraction"
      } ${favoriteIsSelected ? "from" : "to"} favorites`}
      title={
        favoriteIsSelected
          ? "Remove from favorites"
          : "Add to favorites"
      }
      className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition duration-200 hover:scale-105 active:scale-90 focus:outline-none focus:ring-4 focus:ring-rose-400/30 motion-reduce:transform-none ${
        favoriteIsSelected
          ? "border-rose-300 bg-rose-600 text-white"
          : "border-white/40 bg-white/90 text-slate-700 hover:border-rose-300 hover:text-rose-600"
      } ${className}`}
    >
      <Heart
        size={20}
        fill={favoriteIsSelected ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );
}

export default FavoriteButton;