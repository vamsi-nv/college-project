import express from "express";
import Club from "../models/clubModel.js";
import Event from "../models/eventModel.js";

const exploreRouter = express.Router();

exploreRouter.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query is required",
    });
  }

  try {
    const regex = new RegExp(q, "i"); // i = case insensitive

    const clubs = await Club.find({ name: regex }).select(
      "name description coverImage members"
    );
    const events = await Event.find({ title: regex })
      .select("title description")
      .populate("club", "name")
      .populate("createdBy", "name profileImageUrl");

    const results = [
      ...clubs.map((club) => ({ ...club._doc, type: "club" })),
      ...events.map((event) => ({ ...event._doc, type: "event" })),
    ];

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.log("Error in explore Router : ", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again",
    });
  }
});

export default exploreRouter;
