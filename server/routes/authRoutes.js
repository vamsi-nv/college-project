import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../middleware/authUploadMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("image"), registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/current-user", protect, getCurrentUser);

export default authRouter;
