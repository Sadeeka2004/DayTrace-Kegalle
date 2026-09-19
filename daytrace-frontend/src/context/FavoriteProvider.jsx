import { useEffect, useState } from "react";
import FavoriteContext from "./FavoriteContext";

const STORAGE_KEY = "daytrace-favorites-v1";

function readStoredFavorites() {
  try {
    const storedFavorites = sessionStorage.getItem(STORAGE_KEY);

    if (!storedFavorites) {
      return [];
    }

    const parsedFavorites = JSON.parse(storedFavorites);

    if (!Array.isArray(parsedFavorites)) {
      return [];
    }

    return [
      ...new Set(
        parsedFavorites.filter(
          (attractionId) => typeof attractionId === "string",
        ),
      ),
    ];
  } catch {
    return [];
  }
}

function FavoriteProvider({ children }) {
  const [favoriteAttractionIds, setFavoriteAttractionIds] = useState(
    readStoredFavorites,
  );

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favoriteAttractionIds),
    );
  }, [favoriteAttractionIds]);

  const toggleFavorite = (attractionId) => {
    setFavoriteAttractionIds((currentFavorites) => {
      if (currentFavorites.includes(attractionId)) {
        return currentFavorites.filter(
          (id) => id !== attractionId,
        );
      }

      return [...currentFavorites, attractionId];
    });
  };

  const isFavorite = (attractionId) => {
    return favoriteAttractionIds.includes(attractionId);
  };

  const contextValue = {
    favoriteAttractionIds,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
}

export default FavoriteProvider;