const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect } = require("../middleware/auth");


// ============================================================
// Test Route
// ============================================================

router.get("/test", (req, res) => {
  res.json({
    message: "Job route working",
  });
});


// ============================================================
// Get All Jobs for Job Seekers
// ============================================================

router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);

  } catch (error) {
    console.error(
      "Get all jobs error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve jobs.",
    });
  }
});


// ============================================================
// Create Job
// ============================================================

router.post("/", protect, async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,

      // Always use the logged-in recruiter ID.
      // Never accept recruiterId from the frontend.
      recruiterId: req.user._id,
    });

    return res.status(201).json({
      message: "Job posted successfully.",
      job,
    });

  } catch (error) {
    console.error(
      "Create job error:",
      error.message
    );

    return res.status(500).json({
      message: error.message,
    });
  }
});


// ============================================================
// Get Logged-in Recruiter's Jobs
// ============================================================

router.get("/", protect, async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiterId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(jobs);

  } catch (error) {
    console.error(
      "Get recruiter jobs error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve recruiter jobs.",
    });
  }
});


// ============================================================
// Update Recruiter's Own Job
// ============================================================

router.put("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      recruiterId: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found or you are not authorized to update it.",
      });
    }

    // Prevent recruiter ownership from being changed
    delete req.body.recruiterId;
    delete req.body._id;

    Object.assign(job, req.body);

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
    });

  } catch (error) {
    console.error(
      "Update job error:",
      error.message
    );

    return res.status(500).json({
      message: error.message,
    });
  }
});


// ============================================================
// Delete Recruiter's Own Job
// ============================================================

router.delete("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      recruiterId: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found or you are not authorized to delete it.",
      });
    }

    // Remove applications connected to the deleted job
    await Application.deleteMany({
      jobId: job._id,
    });

    await job.deleteOne();

    return res.status(200).json({
      message: "Job deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete job error:",
      error.message
    );

    return res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;