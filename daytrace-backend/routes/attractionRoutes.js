import express from "express";
import {
  createAttraction,
  deleteAttraction,
  getAttractionById,
  getAttractions,
  updateAttraction,
} from "../controllers/attractionController.js";
import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAttractions)
  .post(protectAdmin, createAttraction);

router
  .route("/:id")
  .get(getAttractionById)
  .patch(protectAdmin, updateAttraction)
  .delete(protectAdmin, deleteAttraction);

export default router;