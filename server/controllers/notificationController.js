import Notification from "../models/notificationModel.js";

export const getAllNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({
        createdAt: -1,
      })
      .populate("relatedEvent", "title")
      .populate("relatedClub", "name");

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log("Error in getAllNotifications controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  const userId = req.user._id;
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadNotificationCount: count,
    });
  } catch (error) {
    console.log("Error in getUnreadNotificationCount : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error in fetching unread count",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  const userId = req.user._id;
  try {
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    const notificationId = req.params.notificationId;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.log("Error in deleteNotification controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

export const deleteAllNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to perform this action",
      });
    }

    await Notification.deleteMany({ recipient: userId });

    res.status(200).json({
      success: true,
      message: "Notifications deleted",
    });
  } catch (error) {
    console.log("Error in deleteNotifications controller : ", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting notifications",
      error: error.message,
    });
  }
};
