import mongoose from "mongoose";
import Club from "../models/clubModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  const userId = req.user._id;
  const clubId = req.body.clubId;
  const dID = req.body.dID;

  try {
    const club = await Club.findById(clubId);
    const isMember = club.members.includes(userId);

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "Not allowed to perform this action",
      });
    }

    const newMessage = req.body.message;

    if (!newMessage?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message can't be empty",
      });
    }

    const createdMessage = await Message.create({
      sender: userId,
      club: clubId,
      message: newMessage,
      dID,
    });

    const io = req.app.get("io");
    const otherMembers = club.members.filter((member) => {
      return member._id.toString() !== userId.toString();
    });
    otherMembers.forEach((member) => {
      io.updateMessageCount(member._id.toString(), { clubId });
    });

    res.status(201).json({
      success: true,
      message: "message sent",
      newMessage: createdMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage Controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  const clubId = req.query.clubId;
  const userId = req.user._id;
  try {
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const isMember = club.members.includes(userId);
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "Not allowed to perform this action",
      });
    }

    const messages = await Message.find({
      club: clubId,
      deleteFor: { $ne: userId },
    })
      .sort({
        createdAt: 1,
      })
      .populate("sender", "name profileImageUrl");

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Error in getMessages controller : ", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUnreadMessagesCount = async (req, res) => {
  const { clubId, clubIds } = req.query;
  const userId = req.user._id;

  try {
    if (clubId) {
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({
          success: false,
          message: "Club not found",
        });
      }

      const isMember = club.members.includes(userId);
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to perform this action",
        });
      }

      const unreadMessagesCount = await Message.countDocuments({
        club: clubId,
        readBy: { $ne: userId },
      });

      return res.status(200).json({
        success: true,
        unreadMessagesCount,
      });
    }

    if (clubIds) {
      const clubIdArray = Array.isArray(clubIds) ? clubIds : clubIds.split(",");

      const clubs = await Club.find({
        _id: { $in: clubIdArray },
        members: userId,
      });

      if (clubs.length !== clubIdArray.length) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access one or more clubs",
        });
      }

      const unreadCounts = await Message.aggregate([
        {
          $match: {
            club: {
              $in: clubIdArray.map((id) => new mongoose.Types.ObjectId(id)),
            },
            sender: { $ne: userId },
            readBy: { $ne: userId },
          },
        },
        {
          $group: {
            _id: "$club",
            count: { $sum: 1 },
          },
        },
      ]);

      const result = clubIdArray.reduce((acc, clubId) => {
        const found = unreadCounts.find(
          (item) => item._id.toString() === clubId
        );
        acc[clubId] = found ? found.count : 0;
        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        unreadMessagesCounts: result,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Either clubId or clubIds parameter is required",
    });
  } catch (error) {
    console.log("Error in getUnreadMessagesCount controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error in fetching unread messages count",
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  const userId = req.user._id;
  const { clubId, messageIds } = req.body;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const isMember = club.members.includes(userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    let updateQuery = {
      club: clubId,
      readBy: { $ne: userId },
    };

    if (messageIds && Array.isArray(messageIds) && messageIds.length > 0) {
      updateQuery._id = { $in: messageIds };
    }

    const result = await Message.updateMany(updateQuery, {
      $addToSet: { readBy: userId },
    });

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} messages marked as read`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    });
  } catch (error) {
    console.log("Error in markMessagesAsRead controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message,
    });
  }
};

export const markMessageAsRead = async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.body;

  try {
    const message = await Message.findById(messageId).populate("club");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const isMember = message.club.members.includes(userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    if (message.readBy.includes(userId)) {
      return res.status(200).json({
        success: true,
        message: "Message already marked as read",
      });
    }

    message.readBy.push(userId);
    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.log("Error in markMessageAsRead controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Error marking message as read",
      error: error.message,
    });
  }
};

export const deleteMessageForUser = async (req, res) => {
  const userId = req.user._id;
  const { dID } = req.body;

  try {
    const message = await Message.findOne({ dID });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.deleteFor.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Message already deleted for this user",
      });
    }

    message.deleteFor.push(userId);
    await message.save();

    return res.status(200).json({
      success: true,
      message: "Message deleted for user",
    });
  } catch (error) {
    console.error("Error in deleteMessageForUser:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete message for user",
      error: error.message,
    });
  }
};
