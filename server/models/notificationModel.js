import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["event", "announcement"],
      required: true,
    },

    message: {
      type: String,
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
