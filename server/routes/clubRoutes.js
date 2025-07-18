import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createClub,
  deleteClub,
  getAllClubs,
  getClubById,
  getUserClubs,
  joinClub,
  leaveClub,
  removeMemberFromClub,
  toggleAdmin,
  updateClub,
} from "../controllers/clubController.js";
import { clubUpload } from "../middleware/clubUploadMiddleware.js";

const clubRouter = express.Router();

clubRouter
  .route("/")
  .post(protect, clubUpload.single("coverImage"), createClub)
  .get(protect, getAllClubs);
clubRouter.route("/user").get(protect, getUserClubs);
clubRouter
  .route("/:id")
  .get(protect, getClubById)
  .put(protect, clubUpload.single("coverImage"), updateClub)
  .delete(protect, deleteClub);
clubRouter.route("/:id/join").post(protect, joinClub);
clubRouter.route("/:id/leave").post(protect, leaveClub);
clubRouter.route("/:id/admin/toggle").patch(protect, toggleAdmin);
clubRouter.route("/:id/members").patch(protect, removeMemberFromClub);
export default clubRouter;
