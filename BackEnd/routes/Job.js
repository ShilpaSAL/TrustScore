const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");
const User = require("../models/User");
const Notification = require("../models/Notification");
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
// Includes Real Recruiter Credibility Information
// ============================================================

router.get("/all", async (req, res) => {
  try {
    // Get all available jobs
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();

    // Get recruiter IDs from jobs
    const recruiterIds = jobs
      .map((job) => job.recruiterId)
      .filter(Boolean);

    // Get company profiles belonging to those recruiters
    const companies = await Company.find({
      userId: {
        $in: recruiterIds,
      },
    }).lean();

    // Create recruiter ID -> company profile map
    const companyMap = {};

    companies.forEach((company) => {
      companyMap[
        company.userId.toString()
      ] = company;
    });

    // Attach recruiter credibility information
    // to each job
    const jobsWithCredibility = jobs.map(
      (job) => {
        const recruiterId =
          job.recruiterId?.toString();

        const company =
          companyMap[recruiterId] || null;

        return {
          ...job,

          // ML Prediction Result
          trustLabel:
            company?.trustLabel ||
            "Not Assessed",

          confidenceScore:
            company?.confidenceScore ??
            null,

          // Recruiter Behavioural Metrics
          profileCompletion:
            company?.profileCompletion ??
            0,

          approval_rate:
            company?.approval_rate ??
            0,

          response_time_hours:
            company?.response_time_hours ??
            null,

          complaints_count:
            company?.complaints_count ??
            0,

          // Additional Company Information
          companyDescription:
            company?.companyDescription ||
            "",

          industryType:
            company?.industryType ||
            "",

          companyWebsite:
            company?.companyWebsite ||
            "",
        };
      }
    );

    return res
      .status(200)
      .json(jobsWithCredibility);

  } catch (error) {
    console.error(
      "Get all jobs error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve jobs.",
    });
  }
});

// ============================================================
// Create Job and Notify Job Seekers
// ============================================================

router.post("/", protect, async (req, res) => {
  try {
    // Only recruiters can post jobs
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can post jobs.",
      });
    }

    // Create the job
    const job = await Job.create({
      ...req.body,
      recruiterId: req.user._id,
    });

    // Find all job seekers
    const jobSeekers = await User.find({
      role: "jobseeker",
    }).select("_id");

    // Create one notification for each job seeker
    if (jobSeekers.length > 0) {
      const notifications = jobSeekers.map(
        (jobSeeker) => ({
          recipientId: jobSeeker._id,
          type: "NEW_JOB",
          title: "New Job Posted",
          message: `${job.companyName || "A company"
            } posted a new job: ${job.jobTitle}`,
          jobId: job._id,
          isRead: false,
        })
      );

      await Notification.insertMany(notifications);
    }

    return res.status(201).json({
      message: "Job posted successfully.",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});


// ============================================================
// Update Recruiter's Own Job
// ============================================================

router.put("/:id", protect, async (req, res) => {
  try {
    // Find only a job owned by
    // the logged-in recruiter
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

    // Prevent ownership and ID modification
    delete req.body.recruiterId;
    delete req.body._id;

    // Update job fields
    Object.assign(
      job,
      req.body
    );

    await job.save();

    return res.status(200).json({
      message:
        "Job updated successfully.",
      job,
    });

  } catch (error) {
    console.error(
      "Update job error:",
      error
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
    // Find only a job belonging
    // to the logged-in recruiter
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

    // Delete applications related
    // to this job
    await Application.deleteMany({
      jobId: job._id,
    });

    // Delete the job
    await job.deleteOne();

    return res.status(200).json({
      message:
        "Job deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete job error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;