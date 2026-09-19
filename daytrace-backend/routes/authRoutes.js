import express from "express";
import {
  getCurrentAdmin,
  loginAdmin,
} from "../controllers/authController.js";
import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getCurrentAdmin);

export default router;