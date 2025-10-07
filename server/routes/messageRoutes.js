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

messageRouter.route("/").post(protect, sendMessage).get(protect, getMessages);
messageRouter.route("/unread-count").get(protect, getUnreadMessagesCount);
messageRouter.route("/mark-read-many").patch(protect, markMessagesAsRead);
messageRouter.route("/delete-for-me").patch(protect, deleteMessageForUser);

export default messageRouter;
