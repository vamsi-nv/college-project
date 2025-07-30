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
  const profileImageUrl = req.file?.path;
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
      profileImageUrl,
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
      error: error.message,
    });
  }
};

export const googleAuth = async (req, res) => {
  const { email, name, image } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        profileImageUrl: image,
      });
    }

    res.status(201).json({
      success: true,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Error in googleAuth controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Auth failed",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isAdmin = email === process.env.ADMIN_EMAIL;
    const plainUser = user.toObject();

    const ResponseUser = { ...plainUser, isAdmin };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: ResponseUser,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error in loginUser controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const plainUser = user.toObject();
    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    res.status(200).json({
      success: true,
      user: { ...plainUser, isAdmin },
    });
  } catch (error) {
    console.error("Error in getCurrentUser controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { name, removeProfileImage } = req.body;
  const profileImageUrl = req.file?.path;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to perform this action",
    });
  }

  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (profileImageUrl) updateFields.profileImageUrl = profileImageUrl;
    if (removeProfileImage) updateFields.profileImageUrl = "";
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

export const getAllUsersAdmin = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const users = await User.find({
      email: { $ne: process.env.ADMIN_EMAIL },
    }).select("-password -__v");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error in getAllUsersAdmin controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
