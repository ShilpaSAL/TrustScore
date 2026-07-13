const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect } = require("../middleware/auth");


// ============================================================
// Apply for a Job
// ============================================================

router.post("/apply/:jobId", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      jobId: job._id,
      applicantId: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }

    const application = await Application.create({
      jobId: job._id,
      recruiterId: job.recruiterId,
      applicantId: req.user._id,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });

  } catch (error) {
    console.error("Apply job error:", error.message);

    // Duplicate index protection
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }

    return res.status(500).json({
      message: "Unable to submit application.",
    });
  }
});


// ============================================================
// Get Logged-in Job Seeker Applications
// ============================================================

router.get("/my", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user._id,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);

  } catch (error) {
    console.error(
      "Get job seeker applications error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve applications.",
    });
  }
});


// ============================================================
// Get Applications Received by Recruiter
// ============================================================

router.get("/recruiter", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      recruiterId: req.user._id,
    })
      .populate("jobId")
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);

  } catch (error) {
    console.error(
      "Get recruiter applications error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve applicants.",
    });
  }
});


// ============================================================
// Update Application Status
// Recruiter Only for Their Own Applications
// ============================================================

router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate application status
    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid application status. Use Pending, Accepted, or Rejected.",
      });
    }

    // Find application
    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    // Ensure only the recruiter who owns the application
    // can update its status
    if (
      application.recruiterId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this application.",
      });
    }

    // Set response time only on the recruiter's first response
    if (
      application.status === "Pending" &&
      status !== "Pending" &&
      !application.respondedAt
    ) {
      application.respondedAt = new Date();
    }

    application.status = status;

    await application.save();

    return res.status(200).json({
      message:
        "Application status updated successfully.",
      application,
    });

  } catch (error) {
    console.error(
      "Update application status error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to update application status.",
    });
  }
});


module.exports = router;