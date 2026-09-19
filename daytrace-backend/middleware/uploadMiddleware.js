import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "attractions",
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedImageTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, uploadDirectory);
  },

  filename(request, file, callback) {
    const fileExtension = allowedImageTypes[file.mimetype];
    const uniqueFilename = `${Date.now()}-${randomUUID()}${fileExtension}`;

    callback(null, uniqueFilename);
  },
});

const imageFilter = (request, file, callback) => {
  if (!allowedImageTypes[file.mimetype]) {
    const error = new Error(
      "Only JPG, PNG and WebP images are allowed",
    );

    error.status = 400;
    return callback(error);
  }

  callback(null, true);
};

const uploadAttractionImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

export default uploadAttractionImages;