import Branding from "../models/Branding.js";
import { deleteStoredBrandingLogo } from "../utils/brandingStorage.js";

const getBrandingDocument = async () => {
  return Branding.findOneAndUpdate(
    { settingKey: "main-branding" },
    { $setOnInsert: { settingKey: "main-branding" } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

const createBrandingResponse = (branding) => ({
  logoUrl: branding.logoUrl,
  logoSource: branding.logoSource,
});

const validateExternalLogoUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Logo URL is required");
  }

  const parsedUrl = new URL(value.trim());

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Logo URL must use HTTP or HTTPS");
  }

  return parsedUrl.toString();
};

export const getBranding = async (request, response, next) => {
  try {
    const branding = await getBrandingDocument();

    response.status(200).json({
      success: true,
      branding: createBrandingResponse(branding),
    });
  } catch (error) {
    next(error);
  }
};

export const updateLogoFromUrl = async (request, response, next) => {
  try {
    let logoUrl;

    try {
      logoUrl = validateExternalLogoUrl(request.body.logoUrl);
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const branding = await getBrandingDocument();
    const previousLogoUrl = branding.logoUrl;
    const previousLogoWasUploaded = branding.logoSource === "upload";

    branding.logoUrl = logoUrl;
    branding.logoSource = "url";
    await branding.save();

    if (previousLogoWasUploaded) {
      await deleteStoredBrandingLogo(previousLogoUrl);
    }

    response.status(200).json({
      success: true,
      message: "Website logo updated successfully",
      branding: createBrandingResponse(branding),
    });
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (request, response, next) => {
  if (!request.file) {
    return response.status(400).json({
      success: false,
      message: "Please select a logo image",
    });
  }

  const serverUrl = `${request.protocol}://${request.get("host")}`;
  const newLogoUrl = `${serverUrl}/uploads/branding/${request.file.filename}`;

  try {
    const branding = await getBrandingDocument();
    const previousLogoUrl = branding.logoUrl;
    const previousLogoWasUploaded = branding.logoSource === "upload";

    branding.logoUrl = newLogoUrl;
    branding.logoSource = "upload";
    await branding.save();

    if (previousLogoWasUploaded) {
      await deleteStoredBrandingLogo(previousLogoUrl);
    }

    response.status(200).json({
      success: true,
      message: "Website logo uploaded successfully",
      branding: createBrandingResponse(branding),
    });
  } catch (error) {
    await deleteStoredBrandingLogo(newLogoUrl);
    next(error);
  }
};

export const resetLogo = async (request, response, next) => {
  try {
    const branding = await getBrandingDocument();
    const previousLogoUrl = branding.logoUrl;
    const previousLogoWasUploaded = branding.logoSource === "upload";

    branding.logoUrl = "";
    branding.logoSource = "default";
    await branding.save();

    if (previousLogoWasUploaded) {
      await deleteStoredBrandingLogo(previousLogoUrl);
    }

    response.status(200).json({
      success: true,
      message: "Default DayTrace logo restored",
      branding: createBrandingResponse(branding),
    });
  } catch (error) {
    next(error);
  }
};
