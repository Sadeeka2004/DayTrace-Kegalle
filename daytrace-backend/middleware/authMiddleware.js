import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const protectAdmin = async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return response.status(401).json({
        success: false,
        message: "Admin authentication is required",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decodedToken.adminId);

    if (!admin || admin.role !== "admin") {
      return response.status(401).json({
        success: false,
        message: "Invalid administrator session",
      });
    }

    request.admin = admin;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Administrator session has expired"
        : "Invalid administrator token";

    response.status(401).json({
      success: false,
      message,
    });
  }
};

export default protectAdmin;