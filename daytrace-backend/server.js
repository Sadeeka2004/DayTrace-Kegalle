import path from "node:path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import connectDatabase from "./config/database.js";
import attractionRoutes from "./routes/attractionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import brandingRoutes from "./routes/brandingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import validateEnvironment from "./config/environment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

app.get("/api/health", (request, response) => {
  const databaseStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  response.status(200).json({
    success: true,
    message: "DayTrace Kegalle API is running",
    database: databaseStatus,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/branding", brandingRoutes);
app.use("/api/attractions", attractionRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.originalUrl}`,
  });
});

app.use((error, request, response, next) => {
  console.error(error);

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? error.field === "logo"
          ? "Logo image must be 2 MB or smaller"
          : "Each attraction image must be 5 MB or smaller"
        : error.code === "LIMIT_FILE_COUNT"
          ? "A maximum of 10 images can be uploaded"
          : error.code === "LIMIT_UNEXPECTED_FILE" &&
              error.field === "logo"
            ? "Only one logo image can be uploaded"
          : error.message;

    return response.status(400).json({
      success: false,
      message,
    });
  }

  response.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
