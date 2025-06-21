import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registration successfull",
      user: newUser,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error("Error in registerUser controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const email = req.body.email.trim();
  const password = req.body.password.trim();

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "User login successfull",
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error in loginUser controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getCurrentUser controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
