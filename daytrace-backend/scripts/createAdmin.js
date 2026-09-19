import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDatabase from "../config/database.js";
import Admin from "../models/Admin.js";

dotenv.config();

const createOrUpdateAdmin = async () => {
  try {
    const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "ADMIN_USERNAME and ADMIN_PASSWORD must be added to the .env file",
      );
    }

    if (password.length < 8) {
      throw new Error("ADMIN_PASSWORD must contain at least 8 characters");
    }

    await connectDatabase();

    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      existingAdmin.password = password;
      await existingAdmin.save();

      console.log(`Admin password updated for: ${username}`);
    } else {
      await Admin.create({
        username,
        password,
      });

      console.log(`Admin account created: ${username}`);
    }
  } catch (error) {
    console.error(`Admin setup failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

createOrUpdateAdmin();