import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  deleteMessageForUser,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter
  .route("/")
  .post(protect, sendMessage)
  .get(protect, getMessages)
  .patch(protect, deleteMessageForUser);

export default messageRouter;
