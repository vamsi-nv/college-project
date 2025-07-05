import Event from "../models/eventModel.js";
import Club from "../models/clubModel.js";

export const createEvent = async (req, res) => {
  const userId = req.user?._id;
  const { title, description, date, location, bannerImage, club } = req.body;

  try {
    const foundClub = await Club.findById(club);
    if (!foundClub) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (!foundClub.admins.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create the club",
      });
    }

    const newEvent = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      bannerImage,
      club,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.log("Error in createEvent controller : ", error.message);

    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  const userId = req.user?._id;
  const { clubId, userOnly, createdByMe } = req.query;

  try {
    let filter = {};

    if (userOnly === "true" && userId) {
      const userClubs = await Club.find({ members: userId }).select("_id");
      const clubIds = userClubs.map((club) => club._id);

      if (clubIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No clubs found for this user",
          events: [],
        });
      }

      filter.club = { $in: clubIds };
    } else if (clubId) {
      filter.club = clubId;
    } else if (createdByMe === "true" && userId) {
      filter.createdBy = userId;
    } else {
      filter = {};
    }

    const events = await Event.find(filter)
      .populate("club", "name")
      .populate("createdBy", "name email profileImageUrl")
      

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.log("Error in getEvents controller: ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id.toString())
      .populate("club", "name")
      .populate("createdBy", "name email profileImageUrl");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.log("Error in getEventById controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  const userId = req.user._id;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const club = await Club.findById(event.club);

    if (!club.admins.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update event",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.log("Error in updateEvent controller : ", error.message);

    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  const userId = req.user._id;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const club = await Club.findById(event.club);
    if (
      !club.admins.some((adminId) => adminId.toString() === userId.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteEvent controller : ", error.message);

    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};

export const rsvpEvent = async (req, res) => {
  const userId = req.user._id;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot RSVP to a past event",
      });
    }

    const alreadyAttending = event.attendees.includes(userId);

    if (!alreadyAttending) {
      event.attendees.push(userId);
    } else {
      event.attendees.pull(userId);
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: alreadyAttending ? "RSVP Cancelled" : "RSVP confirmed",
      attendees: event.attendees,
    });
  } catch (error) {
    console.log("Error in rsvpEvent controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating RSVP",
      error: error.message,
    });
  }
};

// export const getUserClubEvents = async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const userClubs = await Club.find({ members: userId }).select("_id");
//     const clubIds = userClubs.map((club) => club._id);
//     // const userClubs = await Club.find({
//     //   $or: [{ members: userId }, { admins: userId }]
//     // }).select("_id");
//     if (clubIds.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No Clubs found for this user",
//         events: [],
//       });
//     }

//     const events = await Event.find({ club: { $in: clubIds } })
//       .populate("club", "name")
//       .populate("createdBy", "name email profileImageUrl")
//       .sort({ date: -1 });

//     res.status(200).json({
//       success: true,
//       events,
//     });
//   } catch (error) {
//     console.error("Error in getUserClubEvents controller:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user club events.",
//       error: error.message,
//     });
//   }
// };
