import Announcement from "../models/announcementModel.js";
import Club from "../models/clubModel.js";
import Notification from "../models/notificationModel.js";

export const createAnnoucement = async (req, res) => {
  const userId = req.user._id;

  const { title, content, club, pinned } = req.body;

  try {
    const foundClub = await Club.findById(club);
    if (!foundClub) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    if (!foundClub.admins.includes(userId)) {
      return (
        res.status(403),
        json({
          success: false,
          message: "Not authorized to perform this action",
        })
      );
    }

    const announcement = await Announcement.create({
      title,
      content,
      postedBy: userId,
      club,
      pinned,
    });

    const io = req.app.get("io");

    const otherMembers = foundClub.members.filter(
      (member) => member._id.toString() !== userId.toString()
    );

    otherMembers.forEach((member) => {
      io.sendNotification(member._id.toString(), {
        title: "",
        message: `${announcement.title} has been posted`,
        type: "announcement",
        club: foundClub.name,
      });
    });

    const notifications = otherMembers.map((member) => ({
      recipient: member._id,
      relatedClub: foundClub._id,
      type: "announcement",
      title: `New Announcement in ${foundClub.name}`,
      relatedAnnouncememt: announcement._id,
    }));

    await Notification.insertMany(notifications);

    otherMembers.forEach((member) => {
      io.updateUnreadCount(member._id.toString());
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.log("Error in createAnnouncement controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error creatign announcement",
      error: error.message,
    });
  }
};

export const getAllAnnouncements = async (req, res) => {
  const userId = req.user?._id;
  const { clubId, userOnly, postedByMe } = req.query;

  try {
    let filter = {};

    if (userOnly === "true" && userId) {
      const userClubs = await Club.find({ members: userId }).select("_id");
      const clubIds = userClubs.map((club) => club._id);

      if (clubIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No clubs found for this user",
          announcements: [],
        });
      }

      filter.club = { $in: clubIds };
    } else if (clubId) {
      filter.club = clubId;
    } else if (postedByMe === "true" && userId) {
      filter.postedBy = userId;
    } else {
      filter = {};
    }

    const announcements = await Announcement.find(filter)
      .populate("postedBy", "name email profileImageUrl")
      .populate("club", "name")
      .sort({ pinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.log("Error in getAnnouncements : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching announcements",
      error: error.message,
    });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.log("Error in getAnnouncementById : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching annoucement",
      error: error.message,
    });
  }
};

export const updateAnnouncement = async (req, res) => {
  const userId = req.user._id;

  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    const club = await Club.findById(announcement.club);
    if (!club.admins.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Announcement updated Successfully",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    console.log("Error in updateAnnouncement controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating announcement",
      error: error.message,
    });
  }
};

export const deleteAnnouncement = async (req, res) => {
  const userId = req.user._id;

  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    const club = await Club.findById(announcement.club);
    if (!club.admins.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Announcement deleted Successfully",
    });
  } catch (error) {
    console.log("Error in deleteAnnouncement controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting announcement",
    });
  }
};

export const togglePinAnnouncement = async (req, res) => {
  const userId = req.user._id;

  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    const club = await Club.findById(announcement.club);

    if (!club.admins.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    announcement.pinned = !announcement.pinned;

    await announcement.save();

    res.status(200).json({
      success: true,
      message: announcement.pinned
        ? "Announcement pinned"
        : "Announcement unpinned",
      announcement,
    });
  } catch (error) {
    console.log("Error in togglePinAnnouncement controller : ", error.message);

    res.status(500).json({
      success: false,
      message: "Error toggling pin",
      error: error.message,
    });
  }
};
