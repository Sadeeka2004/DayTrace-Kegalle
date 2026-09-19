import fs from "node:fs/promises";
import path from "node:path";

const brandingUploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "branding",
);

const storedFilenamePattern =
  /^\d{13}-[0-9a-f-]{36}\.(jpg|png|webp)$/i;

export const deleteStoredBrandingLogo = async (logoUrl = "") => {
  try {
    const parsedUrl = new URL(logoUrl);

    if (!parsedUrl.pathname.startsWith("/uploads/branding/")) {
      return;
    }

    const filename = path.basename(
      decodeURIComponent(parsedUrl.pathname),
    );

    if (!storedFilenamePattern.test(filename)) {
      return;
    }

    await fs.unlink(path.join(brandingUploadDirectory, filename));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Failed to delete old logo: ${error.message}`);
    }
  }
};
