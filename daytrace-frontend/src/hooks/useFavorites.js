import { useContext } from "react";
import FavoriteContext from "../context/FavoriteContext";

function useFavorites() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoriteProvider.",
    );
  }

  return context;
}

export default useFavorites;