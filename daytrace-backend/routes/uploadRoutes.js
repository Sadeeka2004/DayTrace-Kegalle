import express from "express";
import {
  deleteUploadedImages,
  uploadImages,
} from "../controllers/uploadController.js";
import protectAdmin from "../middleware/authMiddleware.js";
import uploadAttractionImages from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/attractions",
  protectAdmin,
  uploadAttractionImages.array("images", 10),
  uploadImages,
);

router.delete(
  "/attractions",
  protectAdmin,
  deleteUploadedImages,
);

export default router;