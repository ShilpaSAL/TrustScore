const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");


// ============================================================
// Get Logged-in User's Notifications
// ============================================================

router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Get notifications error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve notifications.",
    });
  }
});


// ============================================================
// Get Unread Notification Count
// ============================================================

router.get("/unread-count", protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      unreadCount: count,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve unread count.",
    });
  }
});


// ============================================================
// Mark One Notification as Read
// ============================================================

router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          recipientId: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update notification.",
    });
  }
});


// ============================================================
// Mark All Notifications as Read
// ============================================================

router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipientId: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update notifications.",
    });
  }
});


module.exports = router;