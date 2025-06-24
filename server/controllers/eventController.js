import Event from "../models/eventModel.js";
import Club from "../models/clubModel.js";

export const createEvent = async (req, res) => {
  const userId = req.user._id;
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
      date,
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
  const { clubId } = req.query;
  try {
    const filter = clubId ? { club: clubId } : {};
    const events = await Event.find(filter)
      .populate("club", "name")
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.log("Error in getAllEvents controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("club", "name")
      .populate("createdBy", "name")
      .populate("attendees", "name email");

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

    const alreadyAttending = event.attendees.includes(userId);

    if (!alreadyAttending) {
      event.attendees.push(userId);
    } else {
      event.attendees.pull(userId);
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: alreadyAttending ? "RSVP removed" : "RSVP confirmed",
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
