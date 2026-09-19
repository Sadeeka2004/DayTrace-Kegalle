import express from "express";
import {
  getBranding,
  resetLogo,
  updateLogoFromUrl,
  uploadLogo,
} from "../controllers/brandingController.js";
import protectAdmin from "../middleware/authMiddleware.js";
import uploadBrandingLogo from "../middleware/logoUploadMiddleware.js";

const router = express.Router();

router.get("/", getBranding);

router.patch("/logo-url", protectAdmin, updateLogoFromUrl);

router.post(
  "/logo-upload",
  protectAdmin,
  uploadBrandingLogo.single("logo"),
  uploadLogo,
);

router.delete("/logo", protectAdmin, resetLogo);

export default router;
