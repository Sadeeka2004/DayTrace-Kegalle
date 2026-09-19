import { useContext } from "react";
import BrandingContext from "../context/BrandingContext";

function useBranding() {
  const context = useContext(BrandingContext);

  if (!context) {
    throw new Error(
      "useBranding must be used inside BrandingProvider.",
    );
  }

  return context;
}

export default useBranding;