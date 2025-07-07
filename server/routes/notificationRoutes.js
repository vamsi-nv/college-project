import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllNotifications,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protect, getAllNotifications);
notificationRouter.get("/unread-count", protect, getUnreadNotificationCount);

export default notificationRouter;
