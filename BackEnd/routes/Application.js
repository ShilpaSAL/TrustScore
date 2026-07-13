const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");


// ============================================================
// Apply for a Job
// Job Seeker Only
// ============================================================

router.post("/apply/:jobId", protect, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs.",
      });
    }

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

    // Create application
    const application = await Application.create({
      jobId: job._id,
      recruiterId: job.recruiterId,
      applicantId: req.user._id,
      status: "Pending",
    });

    // Notify recruiter
    await Notification.create({
      recipientId: job.recruiterId,
      type: "NEW_APPLICATION",
      title: "New Job Application",
      message: `${req.user.name} applied for ${job.jobTitle}.`,
      jobId: job._id,
      applicationId: application._id,
      isRead: false,
    });

    return res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });

  } catch (error) {
    console.error("Apply job error:", error);

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
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can access applied jobs.",
      });
    }

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
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can view applicants.",
      });
    }

    const applications = await Application.find({
      recruiterId: req.user._id,
    })
      .populate("jobId")
      .populate(
        "applicantId",
        "name email phone location education experience skills resume"
      )
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
// Recruiter Only
// ============================================================

router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message:
          "Only recruiters can update application status.",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    // Find recruiter's own application
    const application = await Application.findOne({
      _id: req.params.id,
      recruiterId: req.user._id,
    }).populate("jobId");

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found or you are not authorized to update it.",
      });
    }

    // Save old status to prevent duplicate notifications
    const previousStatus = application.status;

    // Record first recruiter response time
    if (
      previousStatus === "Pending" &&
      status !== "Pending" &&
      !application.respondedAt
    ) {
      application.respondedAt = new Date();
    }

    application.status = status;

    await application.save();

    // Notify job seeker only when status actually changes
    if (
      previousStatus !== status &&
      (status === "Accepted" || status === "Rejected")
    ) {
      await Notification.create({
        recipientId: application.applicantId,
        type: "APPLICATION_STATUS",
        title: "Application Status Updated",
        message: `Your application for ${
          application.jobId?.jobTitle || "the job"
        } has been ${status.toLowerCase()}.`,
        jobId: application.jobId?._id || application.jobId,
        applicationId: application._id,
        isRead: false,
      });
    }

    return res.status(200).json({
      message: "Application status updated successfully.",
      _id: application._id,
      status: application.status,
      respondedAt: application.respondedAt,
    });

  } catch (error) {
    console.error(
      "Update application status error:",
      error
    );

    return res.status(500).json({
      message: "Unable to update application status.",
    });
  }
});


module.exports = router;