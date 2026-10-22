import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import Attraction from "../models/Attraction.js";
import Admin from "../models/Admin.js";
import Branding from "../models/Branding.js";

dotenv.config();

const exportData = async () => {
  try {
    await connectDatabase();

    const outputDirectory = path.join(process.cwd(), "..", "database");
    fs.mkdirSync(outputDirectory, { recursive: true });

    const collections = [
      { name: "attractions", model: Attraction },
      { name: "branding", model: Branding },
      { name: "admins", model: Admin },
    ];

    for (const { name, model } of collections) {
      const documents = await model.find().lean();

      fs.writeFileSync(
        path.join(outputDirectory, `${name}.json`),
        JSON.stringify(documents, null, 2),
      );

      console.log(`Exported ${documents.length} document(s) -> database/${name}.json`);
    }
  } catch (error) {
    console.error("Export failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

exportData();