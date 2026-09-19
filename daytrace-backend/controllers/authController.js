import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const createToken = (admin) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from the .env file");
  }

  return jwt.sign(
    {
      adminId: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    },
  );
};

export const loginAdmin = async (request, response, next) => {
  try {
    const username = request.body.username?.trim().toLowerCase();
    const password = request.body.password;

    if (!username || !password) {
      return response.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const admin = await Admin.findOne({ username }).select("+password");

    if (!admin) {
      return response.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const passwordIsCorrect = await admin.comparePassword(password);

    if (!passwordIsCorrect) {
      return response.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = createToken(admin);

    response.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin = async (request, response) => {
  response.status(200).json({
    success: true,
    admin: {
      id: request.admin._id,
      username: request.admin.username,
      role: request.admin.role,
    },
  });
};