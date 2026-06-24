const express     = require("express");
const router      = express.Router();
const axios       = require("axios");
const Prediction  = require("../models/Prediction");
const { protect } = require("../middleware/auth");

const FLASK_URL = process.env.FLASK_URL || "http://localhost:5001";

// Create Prediction
router.post("/", protect, async (req, res) => {
  try {
    const payload = {
      number_of_jobs_posted      : Number(req.body.number_of_jobs_posted),
      avg_job_description_length : Number(req.body.avg_job_description_length),
      company_logo_present       : Number(req.body.company_logo_present),
      response_time_hours        : Number(req.body.response_time_hours),
      job_posting_frequency      : Number(req.body.job_posting_frequency),
      complaints_count           : Number(req.body.complaints_count),
      approval_rate              : Number(req.body.approval_rate),
    };

    const { data } = await axios.post(`${FLASK_URL}/predict`, payload);

    const pred = await Prediction.create({
      recruiterId         : req.user.id,
      ...payload,
      trust_label         : data.trust_label,
      confidence_score    : data.confidence_score,
      class_probabilities : data.class_probabilities,
    });

    res.json({ prediction: pred, flaskResponse: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get History
router.get("/history", protect, async (req, res) => {
  try {
    const history = await Prediction.find({ recruiterId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get Single Prediction
router.get("/:id", protect, async (req, res) => {
  try {
    const pred = await Prediction.findOne({
      _id: req.params.id,
      recruiterId: req.user.id
    });
    if (!pred) return res.status(404).json({ message: "Not found" });
    res.json(pred);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;