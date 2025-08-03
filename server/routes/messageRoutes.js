import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  deleteMessageForUser,
  getMessages,
  getUnreadMessagesCount,
  markMessagesAsRead,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter
  .route("/")
  .post(protect, sendMessage)
  .get(protect, getMessages)
  .patch(protect, deleteMessageForUser);
messageRouter.route("/unread-count").get(protect, getUnreadMessagesCount);
messageRouter.route("/mark-read-many").patch(protect, markMessagesAsRead);

export default messageRouter;
