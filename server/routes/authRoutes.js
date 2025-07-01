import express from "express";
import {
  getAllUsersAdmin,
  getCurrentUser,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import { upload } from "../middleware/authUploadMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("image"), registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/current-user", protect, upload.single("image"), updateUser);
userRouter.get("/current-user", protect, getCurrentUser);
userRouter.get("/", protect, getAllUsersAdmin);
export default userRouter;
