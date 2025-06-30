import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../middleware/authUploadMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("image"), registerUser);
authRouter.post("/login", loginUser);
authRouter.put("/current-user", protect, upload.single("image"), updateUser);
authRouter.get("/current-user", protect, getCurrentUser);

export default authRouter;
