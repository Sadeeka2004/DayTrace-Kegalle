import mongoose from "mongoose";
import Attraction from "../models/Attraction.js";
import { deleteStoredImages } from "../utils/imageStorage.js";

const escapeRegularExpression = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const sendValidationError = (error, response) => {
  const validationErrors = Object.values(error.errors).map(
    (validationError) => validationError.message,
  );

  return response.status(400).json({
    success: false,
    message: "Attraction validation failed",
    errors: validationErrors,
  });
};

const validateAttractionId = (id, response) => {
  if (!mongoose.isValidObjectId(id)) {
    response.status(400).json({
      success: false,
      message: "Invalid attraction ID",
    });

    return false;
  }

  return true;
};

export const getAttractions = async (request, response, next) => {
  try {
    const { search = "", category = "" } = request.query;
    const filter = {};

    if (search.trim()) {
      const safeSearch = escapeRegularExpression(search.trim());

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        { "location.name": { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    const attractions = await Attraction.find(filter).sort({ name: 1 });

    response.status(200).json({
      success: true,
      count: attractions.length,
      attractions,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttractionById = async (request, response, next) => {
  try {
    const { id } = request.params;

    if (!validateAttractionId(id, response)) {
      return;
    }

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return response.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    response.status(200).json({
      success: true,
      attraction,
    });
  } catch (error) {
    next(error);
  }
};

export const createAttraction = async (request, response, next) => {
  try {
    const attraction = await Attraction.create(request.body);

    response.status(201).json({
      success: true,
      message: "Attraction created successfully",
      attraction,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendValidationError(error, response);
    }

    if (error.code === 11000) {
      return response.status(409).json({
        success: false,
        message: "An attraction with this name already exists",
      });
    }

    next(error);
  }
};

export const updateAttraction = async (
  request,
  response,
  next,
) => {
  try {
    const { id } = request.params;

    if (!validateAttractionId(id, response)) {
      return;
    }

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return response.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    const previousImages = attraction.images.map((image) => ({
      url: image.url,
    }));

    Object.assign(attraction, request.body);

    const updatedAttraction = await attraction.save();

    if (request.body.images) {
      const remainingImageUrls = new Set(
        updatedAttraction.images.map((image) => image.url),
      );

      const removedImages = previousImages.filter(
        (image) => !remainingImageUrls.has(image.url),
      );

      await deleteStoredImages(removedImages);
    }

    response.status(200).json({
      success: true,
      message: "Attraction updated successfully",
      attraction: updatedAttraction,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendValidationError(error, response);
    }

    if (error.code === 11000) {
      return response.status(409).json({
        success: false,
        message: "An attraction with this name already exists",
      });
    }

    next(error);
  }
};

export const deleteAttraction = async (
  request,
  response,
  next,
) => {
  try {
    const { id } = request.params;

    if (!validateAttractionId(id, response)) {
      return;
    }

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return response.status(404).json({
        success: false,
        message: "Attraction not found",
      });
    }

    const attractionImages = attraction.images || [];

    await attraction.deleteOne();
    await deleteStoredImages(attractionImages);

    response.status(200).json({
      success: true,
      message: "Attraction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};