import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  deleteAllNotifications,
  deleteNotification,
  getAllNotifications,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protect, getAllNotifications);
notificationRouter.get("/unread-count", protect, getUnreadNotificationCount);
notificationRouter.delete("/:notificationId", protect, deleteNotification);
notificationRouter.delete("/", protect, deleteAllNotifications);

export default notificationRouter;
