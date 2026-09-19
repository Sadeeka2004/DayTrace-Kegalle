import fs from "node:fs/promises";
import path from "node:path";

const attractionUploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "attractions",
);

const storedFilenamePattern =
  /^\d{13}-[0-9a-f-]{36}\.(jpg|png|webp)$/i;

const deleteStoredImage = async (imageUrl) => {
  try {
    const parsedUrl = new URL(imageUrl);

    if (!parsedUrl.pathname.startsWith("/uploads/attractions/")) {
      return;
    }

    const filename = path.basename(
      decodeURIComponent(parsedUrl.pathname),
    );

    if (!storedFilenamePattern.test(filename)) {
      return;
    }

    const imagePath = path.join(
      attractionUploadDirectory,
      filename,
    );

    await fs.unlink(imagePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        `Failed to delete attraction image: ${error.message}`,
      );
    }
  }
};

export const deleteStoredImages = async (images = []) => {
  await Promise.all(
    images.map((image) => deleteStoredImage(image.url)),
  );
};