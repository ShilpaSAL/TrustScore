const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const { protect } = require("../middleware/auth");

// Test Route
router.get("/test", (req, res) => {
  res.json({ message: "Job route working" });
});

// Create Job
router.post("/", protect, async (req, res) => {
  try {
    console.log("JOB DATA:", req.body);
    console.log("USER:", req.user);

    const job = await Job.create({
      ...req.body,
      recruiterId: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    console.log("JOB ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Recruiter's Jobs
router.get("/", protect, async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiterId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// Delete Job
router.delete("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// Update Job
router.put("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// Get All Jobs For Job Seekers
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;