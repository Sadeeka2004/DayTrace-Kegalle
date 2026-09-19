import { useCallback, useEffect, useMemo, useState } from "react";
import { getBranding } from "../services/api";
import BrandingContext from "./BrandingContext";

const defaultBranding = {
  logoUrl: "",
  logoSource: "default",
};

function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(defaultBranding);
  const [isBrandingLoading, setIsBrandingLoading] = useState(true);
  const [brandingError, setBrandingError] = useState("");

  const refreshBranding = useCallback(async () => {
    try {
      setIsBrandingLoading(true);
      setBrandingError("");

      const response = await getBranding();
      setBranding(response.branding || defaultBranding);

      return response.branding;
    } catch (error) {
      setBrandingError(error.message);
      setBranding(defaultBranding);

      return defaultBranding;
    } finally {
      setIsBrandingLoading(false);
    }
  }, []);

  useEffect(() => {
    let requestIsActive = true;

    const loadInitialBranding = async () => {
      try {
        const response = await getBranding();

        if (requestIsActive) {
          setBranding(response.branding || defaultBranding);
        }
      } catch (error) {
        if (requestIsActive) {
          setBrandingError(error.message);
          setBranding(defaultBranding);
        }
      } finally {
        if (requestIsActive) {
          setIsBrandingLoading(false);
        }
      }
    };

    loadInitialBranding();

    return () => {
      requestIsActive = false;
    };
  }, []);

  const applyBranding = useCallback((newBranding) => {
    setBranding(newBranding || defaultBranding);
    setBrandingError("");
  }, []);

  const contextValue = useMemo(
    () => ({
      branding,
      isBrandingLoading,
      brandingError,
      applyBranding,
      refreshBranding,
    }),
    [
      branding,
      isBrandingLoading,
      brandingError,
      applyBranding,
      refreshBranding,
    ],
  );

  return (
    <BrandingContext.Provider value={contextValue}>
      {children}
    </BrandingContext.Provider>
  );
}

export default BrandingProvider;
