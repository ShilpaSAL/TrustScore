const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // User who receives the notification
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "NEW_JOB",
        "NEW_APPLICATION",
        "APPLICATION_STATUS",
      ],
      required: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
    },

    // Optional related job
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    // Optional related application
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    // Read / unread status
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);