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

const announcementRouter = express.Router();

announcementRouter
  .route("/")
  .get(protect, getAllAnnouncements)
  .post(protect, createAnnoucement);

announcementRouter
  .route("/:id")
  .get(getAnnouncementById)
  .put(protect, updateAnnouncement)
  .delete(protect, deleteAnnouncement);

announcementRouter.route("/:id/pin").patch(protect, togglePinAnnouncement);

export default announcementRouter;
