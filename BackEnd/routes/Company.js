const express = require("express");
const router = express.Router();
const axios = require("axios");

const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect } = require("../middleware/auth");

const FLASK_URL =
  process.env.FLASK_URL || "http://127.0.0.1:5001";

// ============================================================
// Create / Update Company Profile and Recruiter Credibility
// ============================================================

router.post("/", protect, async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // --------------------------------------------------------
    // 1. Get Existing Company Profile
    // --------------------------------------------------------

    const existingCompany = await Company.findOne({
      userId: recruiterId,
    });

    // --------------------------------------------------------
    // 2. Get Recruiter's Jobs
    // --------------------------------------------------------

    const jobs = await Job.find({
      recruiterId,
    }).sort({ createdAt: 1 });

    // Number of jobs posted
    const number_of_jobs_posted = jobs.length;

    // --------------------------------------------------------
    // 3. Average Job Description Length
    // --------------------------------------------------------

    let avg_job_description_length = 0;

    if (jobs.length > 0) {
      const totalDescriptionLength = jobs.reduce(
        (total, job) =>
          total + (job.jobDescription || "").length,
        0
      );

      avg_job_description_length = Math.round(
        totalDescriptionLength / jobs.length
      );
    }

    // --------------------------------------------------------
    // 4. Job Posting Frequency
    // Average number of jobs posted per month
    // --------------------------------------------------------

    let job_posting_frequency = 0;

    if (jobs.length === 1) {
      job_posting_frequency = 1;
    }

    if (jobs.length > 1) {
      const oldestJobDate = new Date(jobs[0].createdAt);
      const currentDate = new Date();

      const totalDays =
        (currentDate - oldestJobDate) /
        (1000 * 60 * 60 * 24);

      const totalMonths = Math.max(
        totalDays / 30,
        1
      );

      job_posting_frequency = Number(
        (
          jobs.length /
          totalMonths
        ).toFixed(2)
      );
    }

    // --------------------------------------------------------
    // 5. Profile Completion Percentage
    // Used for profile information only.
    // It is NOT currently an ML input feature.
    // --------------------------------------------------------

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
      (field) =>
        field !== undefined &&
        field !== null &&
        field.toString().trim() !== ""
    ).length;

    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );

    // --------------------------------------------------------
    // 6. Company Logo Presence
    // --------------------------------------------------------

    const company_logo_present =
      req.body.company_logo_present !== undefined
        ? Number(req.body.company_logo_present)
        : existingCompany?.company_logo_present || 0;

    // --------------------------------------------------------
    // 7. Get Recruiter's Applications
    // --------------------------------------------------------

    const applications = await Application.find({
      recruiterId,
    });

    const totalApplications = applications.length;

    // --------------------------------------------------------
    // 8. Calculate Approval Rate
    // --------------------------------------------------------

    const acceptedApplications = applications.filter(
      (application) =>
        application.status === "Accepted"
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

    // --------------------------------------------------------
    // 9. Calculate Average Response Time
    // --------------------------------------------------------

    const respondedApplications = applications.filter(
      (application) =>
        application.respondedAt &&
        application.createdAt
    );

    let response_time_hours = 24;

    if (respondedApplications.length > 0) {
      const totalResponseHours =
        respondedApplications.reduce(
          (total, application) => {
            const responseHours =
              (
                new Date(application.respondedAt) -
                new Date(application.createdAt)
              ) /
              (1000 * 60 * 60);

            return total + Math.max(responseHours, 0);
          },
          0
        );

      response_time_hours = Number(
        (
          totalResponseHours /
          respondedApplications.length
        ).toFixed(2)
      );
    }

    // --------------------------------------------------------
    // 10. Complaints Count
    // --------------------------------------------------------
    // The current project does not yet contain a Complaint model.
    // Preserve the existing value until the complaint module is added.

    const complaints_count =
      existingCompany?.complaints_count || 0;

    // --------------------------------------------------------
    // 11. Prepare Machine Learning Input
    // --------------------------------------------------------

    const mlInput = {
      number_of_jobs_posted,
      avg_job_description_length,
      company_logo_present,
      response_time_hours,
      job_posting_frequency,
      complaints_count,
      approval_rate,
    };

    // --------------------------------------------------------
    // 12. Call Flask Machine Learning API
    // --------------------------------------------------------

    const mlResponse = await axios.post(
      `${FLASK_URL}/predict`,
      mlInput,
      {
        timeout: 10000,
      }
    );

    if (mlResponse.data.status !== "success") {
      return res.status(502).json({
        message:
          "Machine learning prediction service returned an error.",
      });
    }

    const trustLabel =
      mlResponse.data.trust_label;

    const confidenceScore =
      mlResponse.data.confidence_score;

    // --------------------------------------------------------
    // 13. Prepare Company Data
    // --------------------------------------------------------

    const companyData = {
      ...req.body,

      // Calculated behavioural features
      ...mlInput,

      // ML prediction output
      trustLabel,
      confidenceScore,

      // Profile information
      profileCompletion,
    };

    // --------------------------------------------------------
    // 14. Update Existing Company
    // --------------------------------------------------------

    if (existingCompany) {
      const updatedCompany =
        await Company.findOneAndUpdate(
          {
            userId: recruiterId,
          },
          companyData,
          {
            new: true,
            runValidators: true,
          }
        );

      return res.status(200).json({
        message:
          "Company profile and recruiter credibility updated successfully.",
        company: updatedCompany,
      });
    }

    // --------------------------------------------------------
    // 15. Create New Company
    // --------------------------------------------------------

    const company = await Company.create({
      ...companyData,
      userId: recruiterId,
    });

    return res.status(201).json({
      message:
        "Company profile created and recruiter credibility generated successfully.",
      company,
    });

  } catch (error) {
    console.error(
      "Company route error:",
      error.response?.data || error.message
    );

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message:
          "Machine learning service is unavailable. Start the Flask server on port 5001.",
      });
    }

    if (error.response) {
      return res.status(
        error.response.status || 500
      ).json({
        message:
          error.response.data?.error ||
          "Machine learning prediction failed.",
      });
    }

    return res.status(500).json({
      message:
        "Unable to process company profile.",
    });
  }
});


// ============================================================
// Get Logged-In Recruiter's Company Profile
// ============================================================

router.get("/", protect, async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user.id,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found.",
      });
    }

    return res.status(200).json(company);

  } catch (error) {
    console.error(
      "Get company profile error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Unable to retrieve company profile.",
    });
  }
});


// ============================================================
// Delete Company Profile
// ============================================================

router.delete("/", protect, async (req, res) => {
  try {
    const company =
      await Company.findOneAndDelete({
        userId: req.user.id,
      });

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found.",
      });
    }

    return res.status(200).json({
      message:
        "Company profile deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete company error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Unable to delete company profile.",
    });
  }
});


module.exports = router;