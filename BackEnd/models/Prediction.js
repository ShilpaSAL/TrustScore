const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    // Recruiter Reference
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ========================================================
    // MACHINE LEARNING INPUT FEATURES
    // ========================================================

    number_of_jobs_posted: {
      type: Number,
      required: true,
      min: 0,
    },

    avg_job_description_length: {
      type: Number,
      required: true,
      min: 0,
    },

    company_logo_present: {
      type: Number,
      required: true,
      enum: [0, 1],
    },

    response_time_hours: {
      type: Number,
      required: true,
      min: 0,
    },

    job_posting_frequency: {
      type: Number,
      required: true,
      min: 0,
    },

    complaints_count: {
      type: Number,
      required: true,
      min: 0,
    },

    approval_rate: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    // ========================================================
    // MACHINE LEARNING OUTPUT
    // ========================================================

    trust_label: {
      type: String,
      required: true,
      enum: [
        "High Trust",
        "Medium Trust",
        "Low Trust",
      ],
    },

    // Confidence of the predicted trust class (0–100).
    // This is NOT a numerical recruiter trust score.
    confidence_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Probability assigned to each trust category
    class_probabilities: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Prediction",
  predictionSchema
);