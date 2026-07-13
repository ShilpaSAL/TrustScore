const express = require("express");
const router = express.Router();
const axios = require("axios");

const Prediction = require("../models/Prediction");
const { protect } = require("../middleware/auth");

const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5001";

const REQUIRED_FEATURES = [
  "number_of_jobs_posted",
  "avg_job_description_length",
  "company_logo_present",
  "response_time_hours",
  "job_posting_frequency",
  "complaints_count",
  "approval_rate",
];

// ─────────────────────────────────────────────────────────────────────────────
// Create Recruiter Credibility Prediction
// ─────────────────────────────────────────────────────────────────────────────

router.post("/", protect, async (req, res) => {
  try {
    // Check all required ML features
    const missingFields = REQUIRED_FEATURES.filter(
      (field) =>
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required recruiter behavioural features.",
        missingFields,
      });
    }

    // Convert all ML inputs to numbers
    const payload = {
      number_of_jobs_posted: Number(req.body.number_of_jobs_posted),
      avg_job_description_length: Number(
        req.body.avg_job_description_length
      ),
      company_logo_present: Number(req.body.company_logo_present),
      response_time_hours: Number(req.body.response_time_hours),
      job_posting_frequency: Number(req.body.job_posting_frequency),
      complaints_count: Number(req.body.complaints_count),
      approval_rate: Number(req.body.approval_rate),
    };

    // Validate numerical values
    const invalidFields = Object.entries(payload)
      .filter(([, value]) => !Number.isFinite(value))
      .map(([field]) => field);

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid numerical values provided.",
        invalidFields,
      });
    }

    // Send recruiter behavioural data to Flask ML API
    const { data } = await axios.post(
      `${FLASK_URL}/predict`,
      payload,
      {
        timeout: 10000,
      }
    );

    if (data.status !== "success") {
      return res.status(502).json({
        message: "Machine learning prediction failed.",
      });
    }

    // Save prediction result
    const prediction = await Prediction.create({
      recruiterId: req.user.id,

      ...payload,

      trust_label: data.trust_label,

      // This is ML prediction confidence,
      // NOT a numerical recruiter trust score.
      confidence_score: data.confidence_score,

      class_probabilities: data.class_probabilities,
    });

    return res.status(201).json({
      message: "Recruiter credibility prediction generated successfully.",
      prediction,
    });

  } catch (error) {
    console.error(
      "Prediction route error:",
      error.response?.data || error.message
    );

    // Flask API unavailable
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message:
          "Machine learning service is unavailable. Start the Flask server.",
      });
    }

    // Flask API returned an error
    if (error.response) {
      return res.status(error.response.status || 500).json({
        message:
          error.response.data?.error ||
          "Machine learning prediction failed.",
      });
    }

    return res.status(500).json({
      message: "Unable to generate recruiter credibility prediction.",
    });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// Get Prediction History
// ─────────────────────────────────────────────────────────────────────────────

router.get("/history", protect, async (req, res) => {
  try {
    const history = await Prediction.find({
      recruiterId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json(history);

  } catch (error) {
    console.error("Prediction history error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve prediction history.",
    });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// Get Single Prediction
// ─────────────────────────────────────────────────────────────────────────────

router.get("/:id", protect, async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      recruiterId: req.user.id,
    });

    if (!prediction) {
      return res.status(404).json({
        message: "Prediction not found.",
      });
    }

    return res.json(prediction);

  } catch (error) {
    console.error("Get prediction error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve prediction.",
    });
  }
});

module.exports = router;