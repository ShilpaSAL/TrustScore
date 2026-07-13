const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/auth");

const User = require("../models/User");
const Prediction = require("../models/Prediction");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");


// ============================================================
// Get Admin Dashboard Statistics
// ============================================================

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalRecruiters,
      totalJobSeekers,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalPredictions,
      labelCounts,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "recruiter",
      }),

      User.countDocuments({
        role: "jobseeker",
      }),

      Company.countDocuments(),

      Job.countDocuments(),

      Application.countDocuments(),

      Prediction.countDocuments(),

      Prediction.aggregate([
        {
          $group: {
            _id: "$trust_label",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      totalUsers,
      totalRecruiters,
      totalJobSeekers,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalPredictions,
      labelCounts,
    });

  } catch (error) {
    console.error(
      "Admin statistics error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Unable to retrieve administrator statistics.",
    });
  }
});


// ============================================================
// Get All Users
// ============================================================

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(users);

  } catch (error) {
    console.error(
      "Get all users error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve users.",
    });
  }
});


// ============================================================
// Get All Recruiter Predictions
// ============================================================

router.get(
  "/predictions",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const predictions = await Prediction.find()
        .populate(
          "recruiterId",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(100);

      return res.status(200).json(
        predictions
      );

    } catch (error) {
      console.error(
        "Get predictions error:",
        error.message
      );

      return res.status(500).json({
        message:
          "Unable to retrieve predictions.",
      });
    }
  }
);


module.exports = router;