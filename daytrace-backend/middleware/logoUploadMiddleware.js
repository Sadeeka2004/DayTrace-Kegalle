import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "branding",
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedLogoTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, uploadDirectory);
  },

  filename(request, file, callback) {
    const fileExtension = allowedLogoTypes[file.mimetype];
    const filename = `${Date.now()}-${randomUUID()}${fileExtension}`;

    callback(null, filename);
  },
});

const logoFilter = (request, file, callback) => {
  if (!allowedLogoTypes[file.mimetype]) {
    const error = new Error(
      "Only JPG, PNG and WebP logo images are allowed",
    );

    error.status = 400;
    return callback(error);
  }

  callback(null, true);
};

const uploadBrandingLogo = multer({
  storage,
  fileFilter: logoFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

export default uploadBrandingLogo;
