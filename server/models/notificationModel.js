import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
    },

    type: {
      type: String,
      enum: ["event", "announcement", "general"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    relatedClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
