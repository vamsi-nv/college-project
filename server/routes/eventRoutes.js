import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  rsvpEvent,
  updateEvent,
} from "../controllers/eventController.js";
import protect from "../middleware/authMiddleware.js";

const eventRouter = express.Router();

eventRouter.route("/").get(protect, getAllEvents).post(protect, createEvent);
eventRouter
  .route("/:id")
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);
eventRouter.route("/:id/rsvp").patch(protect, rsvpEvent);

export default eventRouter;
