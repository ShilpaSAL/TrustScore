const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");
const User = require("../models/User");
const Notification = require("../models/Notification");

const { protect } = require("../middleware/auth");

const recalculateCredibility = require(
  "../services/recalculateCredibility"
);


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
// Includes Recruiter Credibility Information
// ============================================================

router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();

    const recruiterIds = jobs
      .map((job) => job.recruiterId)
      .filter(Boolean);

    const companies = await Company.find({
      userId: {
        $in: recruiterIds,
      },
    }).lean();

    // Create recruiter -> company map
    const companyMap = {};

    companies.forEach((company) => {
      companyMap[
        company.userId.toString()
      ] = company;
    });

    // Attach recruiter credibility to every job
    const jobsWithCredibility = jobs.map(
      (job) => {
        const recruiterId =
          job.recruiterId?.toString();

        const company =
          companyMap[recruiterId] || null;

        return {
          ...job,

          // ML Result
          trustLabel:
            company?.trustLabel ||
            "Not Assessed",

          confidenceScore:
            company?.confidenceScore ??
            null,

          // Recruiter Behaviour Metrics
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

          number_of_jobs_posted:
            company?.number_of_jobs_posted ??
            0,

          job_posting_frequency:
            company?.job_posting_frequency ??
            0,

          // Company Information
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
// Create Job
// Recruiter Only
// Notify Job Seekers
// Recalculate Recruiter Credibility
// ============================================================

router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message:
          "Only recruiters can post jobs.",
      });
    }

    // Create job
    const job = await Job.create({
      ...req.body,

      // Always use logged-in recruiter
      recruiterId: req.user._id,
    });


    // ========================================================
    // Notify All Job Seekers
    // ========================================================

    const jobSeekers = await User.find({
      role: "jobseeker",
    }).select("_id");

    if (jobSeekers.length > 0) {
      const notifications =
        jobSeekers.map(
          (jobSeeker) => ({
            recipientId:
              jobSeeker._id,

            type:
              "NEW_JOB",

            title:
              "New Job Posted",

            message: `${
              job.companyName ||
              "A company"
            } posted a new job: ${
              job.jobTitle
            }`,

            jobId:
              job._id,

            isRead:
              false,
          })
        );

      await Notification.insertMany(
        notifications
      );
    }


    // ========================================================
    // Recalculate Recruiter Credibility
    // ========================================================

    const updatedCompany =
      await recalculateCredibility(
        req.user._id
      );


    return res.status(201).json({
      message:
        "Job posted successfully.",

      job,

      credibility: updatedCompany
        ? {
            trustLabel:
              updatedCompany.trustLabel,

            confidenceScore:
              updatedCompany.confidenceScore,

            number_of_jobs_posted:
              updatedCompany
                .number_of_jobs_posted,
          }
        : null,
    });

  } catch (error) {
    console.error(
      "Create job error:",
      error
    );

    return res.status(500).json({
      message:
        error.message,
    });
  }
});


// ============================================================
// Get Logged-in Recruiter's Own Posted Jobs
// ============================================================

router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message:
          "Only recruiters can access their posted jobs.",
      });
    }

    // IMPORTANT:
    // Only return jobs belonging to logged-in recruiter
    const jobs = await Job.find({
      recruiterId:
        req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(jobs);

  } catch (error) {
    console.error(
      "Get recruiter jobs error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve posted jobs.",
    });
  }
});


// ============================================================
// Update Recruiter's Own Job
// Recalculate Credibility
// ============================================================

router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message:
          "Only recruiters can update jobs.",
      });
    }

    // Find only job owned by logged-in recruiter
    const job = await Job.findOne({
      _id:
        req.params.id,

      recruiterId:
        req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found or you are not authorized to update it.",
      });
    }

    // Prevent ownership modification
    delete req.body.recruiterId;
    delete req.body._id;

    // Update job
    Object.assign(
      job,
      req.body
    );

    await job.save();


    // Recalculate credibility
    const updatedCompany =
      await recalculateCredibility(
        req.user._id
      );


    return res.status(200).json({
      message:
        "Job updated successfully.",

      job,

      credibility: updatedCompany
        ? {
            trustLabel:
              updatedCompany.trustLabel,

            confidenceScore:
              updatedCompany.confidenceScore,

            number_of_jobs_posted:
              updatedCompany
                .number_of_jobs_posted,
          }
        : null,
    });

  } catch (error) {
    console.error(
      "Update job error:",
      error
    );

    return res.status(500).json({
      message:
        error.message,
    });
  }
});


// ============================================================
// Delete Recruiter's Own Job
// Delete Related Applications
// Recalculate Credibility
// ============================================================

router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message:
          "Only recruiters can delete jobs.",
      });
    }

    // Find only recruiter's own job
    const job = await Job.findOne({
      _id:
        req.params.id,

      recruiterId:
        req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found or you are not authorized to delete it.",
      });
    }


    // Delete applications related to job
    await Application.deleteMany({
      jobId:
        job._id,
    });


    // Delete job
    await job.deleteOne();


    // Recalculate credibility
    const updatedCompany =
      await recalculateCredibility(
        req.user._id
      );


    return res.status(200).json({
      message:
        "Job deleted successfully.",

      credibility: updatedCompany
        ? {
            trustLabel:
              updatedCompany.trustLabel,

            confidenceScore:
              updatedCompany.confidenceScore,

            number_of_jobs_posted:
              updatedCompany
                .number_of_jobs_posted,
          }
        : null,
    });

  } catch (error) {
    console.error(
      "Delete job error:",
      error
    );

    return res.status(500).json({
      message:
        error.message,
    });
  }
});


module.exports = router;