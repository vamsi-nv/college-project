import Club from "../models/clubModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  const userId = req.user._id;
  const clubId = req.body.clubId;

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

export const deleteMessageForUser = async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.body;

  try {
    const message = await Message.findById(messageId);

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
