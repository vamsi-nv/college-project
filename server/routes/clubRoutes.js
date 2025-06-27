import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createClub,
  deleteClub,
  getAllClubs,
  getClubById,
  joinClub,
  leaveClub,
  updateClub,
} from "../controllers/clubController.js";
import { clubUpload } from "../middleware/clubUploadMiddleware.js";

const clubRouter = express.Router();

clubRouter
  .route("/")
  .post(protect, clubUpload.single("coverImage"), createClub)
  .get(protect, getAllClubs);
clubRouter
  .route("/:id")
  .get(protect, getClubById)
  .put(protect, updateClub)
  .delete(protect, deleteClub);
clubRouter.route("/:id/join").post(protect, joinClub);
clubRouter.route("/:id/leave").post(protect, leaveClub);
export default clubRouter;
