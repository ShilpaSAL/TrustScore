const express = require("express");
const router = express.Router();
const axios = require("axios");

const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect } = require("../middleware/auth");

// Create / Update Company Profile
router.post("/", protect, async (req, res) => {
  try {
    // Count recruiter jobs
    const jobs = await Job.find({ recruiterId: req.user.id });

    const number_of_jobs_posted = jobs.length;
    // Calculate Job Posting Frequency

    let job_posting_frequency = 0;

    if (jobs.length > 1) {
      const oldestJob = jobs.reduce((oldest, current) =>
        new Date(oldest.createdAt) < new Date(current.createdAt)
          ? oldest
          : current
      );

      const days =
        (new Date() - new Date(oldestJob.createdAt)) /
        (1000 * 60 * 60 * 24);

      const months = Math.max(days / 30, 1);

      job_posting_frequency = Number(
        (jobs.length / months).toFixed(2)
      );
    } else if (jobs.length === 1) {
      job_posting_frequency = 1;
    }

    const avg_job_description_length =
      jobs.length === 0
        ? 0
        : Math.round(
          jobs.reduce(
            (sum, job) =>
              sum + (job.jobDescription || "").length,
            0
          ) / jobs.length
        );
    const profileFields = [
      req.body.companyName,
      req.body.companyDescription,
      req.body.companyWebsite,
      req.body.companyEmail,
      req.body.companyPhone,
      req.body.companyLocation,
      req.body.industryType,
      req.body.companySize,
      req.body.foundedYear,
    ];

    const completedFields = profileFields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;

    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );
    // Calculate Approval Rate

    const applications = await Application.find({
      recruiterId: req.user.id,
    });

    const totalApplications = applications.length;

    const acceptedApplications = applications.filter(
      (app) => app.status === "Accepted"
    ).length;

    const approval_rate =
      totalApplications === 0
        ? 0
        : Number(
          (
            acceptedApplications /
            totalApplications
          ).toFixed(2)
        );
    // Calculate Average Response Time (Hours)

    const respondedApplications = applications.filter(
      (app) => app.respondedAt
    );

    let response_time_hours = 24;

    if (respondedApplications.length > 0) {
      const totalHours = respondedApplications.reduce(
        (sum, app) => {
          const hours =
            (new Date(app.respondedAt) -
              new Date(app.createdAt)) /
            (1000 * 60 * 60);

          return sum + hours;
        },
        0
      );

      response_time_hours = Number(
        (
          totalHours /
          respondedApplications.length
        ).toFixed(2)
      );
    }
    const mlInput = {
      number_of_jobs_posted,
      avg_job_description_length,
      company_logo_present:
        req.body.company_logo_present ?? 1,

      response_time_hours,

      job_posting_frequency,

      complaints_count:
        req.body.complaints_count ?? 0,

      approval_rate,
    };

    // Call Flask ML API
    const mlResponse = await axios.post(
      "http://127.0.0.1:5001/predict",
      mlInput
    );

    const trustLabel =
      mlResponse.data.trust_label;

    const confidenceScore =
      mlResponse.data.confidence_score;
    const companyData = {
      ...req.body,
      ...mlInput,
      trustLabel,
      confidenceScore,
      profileCompletion,
    };

    let company = await Company.findOne({
      userId: req.user.id,
    });

    if (company) {
      company = await Company.findOneAndUpdate(
        { userId: req.user.id },
        companyData,
        { new: true }
      );

      return res.json(company);
    }

    company = await Company.create({
      ...companyData,
      userId: req.user.id,
    });

    res.status(201).json(company);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Company Profile
router.get("/", protect, async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user.id,
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete Company
router.delete("/", protect, async (req, res) => {
  try {
    await Company.findOneAndDelete({
      userId: req.user.id,
    });

    res.json({
      message: "Company profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;