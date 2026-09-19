import mongoose from "mongoose";
import { calculateDistanceFromReferenceKm } from "../utils/geography.js";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
      default: "",
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Attraction name is required"],
      trim: true,
      minlength: [2, "Attraction name must contain at least 2 characters"],
      maxlength: [120, "Attraction name cannot exceed 120 characters"],
      unique: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Nature",
          "Historical",
          "Religious",
          "Wildlife",
          "Cultural",
          "Recreational",
        ],
        message: "{VALUE} is not a supported attraction category",
      },
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must contain at least 20 characters"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    location: {
      name: {
        type: String,
        required: [true, "Location name is required"],
        trim: true,
      },
      address: {
        type: String,
        trim: true,
        default: "",
      },
      latitude: {
        type: Number,
        required: [true, "Latitude is required"],
        min: [-90, "Latitude cannot be below -90"],
        max: [90, "Latitude cannot exceed 90"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude is required"],
        min: [-180, "Longitude cannot be below -180"],
        max: [180, "Longitude cannot exceed 180"],
      },
    },

    openingHours: {
      openingTime: {
        type: String,
        trim: true,
        default: "",
      },
      closingTime: {
        type: String,
        trim: true,
        default: "",
      },
      note: {
        type: String,
        trim: true,
        default: "",
      },
    },

    distanceFromReferenceKm: {
      type: Number,
      min: [0, "Distance cannot be negative"],
      max: [25, "Attraction must be within 25 km of Wilpola"],
      default: null,
    },

    travelInformation: {
      type: String,
      trim: true,
      maxlength: [2000, "Travel information cannot exceed 2000 characters"],
      default: "",
    },

    travelTips: {
      type: [String],
      default: [],
    },

    facilities: {
      type: [String],
      default: [],
    },

    images: {
  type: [imageSchema],
  default: [],

  validate: {
    validator(images) {
      if (images.length > 10) {
        return false;
      }

      if (images.length === 0) {
        return true;
      }

      const primaryImageCount = images.filter(
        (image) => image.isPrimary,
      ).length;

      return primaryImageCount === 1;
    },

    message(properties) {
      if (properties.value.length > 10) {
        return "An attraction can contain a maximum of 10 images";
      }

      return "When images are provided, exactly one image must be selected as primary";
    },
  },
},
  },
  {
    timestamps: true,
  },
);

attractionSchema.pre(
  "validate",
  function validateProjectRadius() {
    const latitude = this.location?.latitude;
    const longitude = this.location?.longitude;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    const radiusDistance =
      calculateDistanceFromReferenceKm(
        latitude,
        longitude,
      );

    if (radiusDistance > 25) {
      this.invalidate(
        "location.latitude",
        `Attraction coordinates are approximately ${radiusDistance.toFixed(1)} km from the Wilpola reference point. Attractions must be within 25 km.`,
      );
    }
  },
);

const Attraction = mongoose.model("Attraction", attractionSchema);

export default Attraction;