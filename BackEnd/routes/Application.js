const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Job = require("../models/Job");
const { protect } = require("../middleware/auth");

// =====================================
// Apply for a Job
// =====================================
router.post("/apply/:jobId", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

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
    });

    res.status(201).json({
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================
// Get Logged-in Job Seeker Applications
// =====================================
router.get("/my", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user._id,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================
// Get Applicants for Recruiter
// =====================================
router.get("/recruiter", protect, async (req, res) => {
  try {
    const applications = await Application.find({
      recruiterId: req.user._id,
    })
      .populate("jobId")
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =====================================
// Update Application Status
// =====================================
router.put("/:id", protect, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        respondedAt: new Date(),
      },
      {
        new: true,
      }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;