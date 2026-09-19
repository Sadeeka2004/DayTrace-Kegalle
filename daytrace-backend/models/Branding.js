import mongoose from "mongoose";

const brandingSchema = new mongoose.Schema(
  {
    settingKey: {
      type: String,
      default: "main-branding",
      unique: true,
      immutable: true,
    },
    logoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    logoSource: {
      type: String,
      enum: ["default", "upload", "url"],
      default: "default",
    },
  },
  {
    timestamps: true,
  },
);

const Branding = mongoose.model("Branding", brandingSchema);

export default Branding;
