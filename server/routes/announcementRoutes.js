import express from "express";
import {
  createAnnoucement,
  deleteAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  togglePinAnnouncement,
  updateAnnouncement,
} from "../controllers/announcementController.js";
import protect from "../middleware/authMiddleware.js";

const annoucementRouter = express.Router();

annoucementRouter
  .route("/")
  .get(getAllAnnouncements)
  .post(protect, createAnnoucement);

annoucementRouter
  .route("/:id")
  .get(getAnnouncementById)
  .put(protect, updateAnnouncement)
  .delete(protect, deleteAnnouncement);

annoucementRouter.route("/:id/pin").patch(protect, togglePinAnnouncement);

export default annoucementRouter;
