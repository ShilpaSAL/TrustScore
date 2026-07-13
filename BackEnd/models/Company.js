const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    // ========================================================
    // Recruiter / User Reference
    // ========================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ========================================================
    // Company Information
    // ========================================================

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyDescription: {
      type: String,
      default: "",
      trim: true,
    },

    companyWebsite: {
      type: String,
      default: "",
      trim: true,
    },

    companyEmail: {
      type: String,
      default: "",
      trim: true,
    },

    companyPhone: {
      type: String,
      default: "",
      trim: true,
    },

    companyLocation: {
      type: String,
      default: "",
      trim: true,
    },

    industryType: {
      type: String,
      default: "",
      trim: true,
    },

    companySize: {
      type: String,
      default: "",
      trim: true,
    },

    foundedYear: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================================================
    // MACHINE LEARNING INPUT FEATURES
    // ========================================================

    number_of_jobs_posted: {
      type: Number,
      default: 0,
      min: 0,
    },

    avg_job_description_length: {
      type: Number,
      default: 0,
      min: 0,
    },

    company_logo_present: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    response_time_hours: {
      type: Number,
      default: 24,
      min: 0,
    },

    job_posting_frequency: {
      type: Number,
      default: 0,
      min: 0,
    },

    complaints_count: {
      type: Number,
      default: 0,
      min: 0,
    },

    approval_rate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    // ========================================================
    // MACHINE LEARNING OUTPUT
    // ========================================================

    trustLabel: {
      type: String,
      enum: [
        "High Trust",
        "Medium Trust",
        "Low Trust",
      ],
      default: "Medium Trust",
    },

    // Confidence of the Random Forest prediction.
    // This is NOT the numerical recruiter trust score.
    confidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ========================================================
    // PROFILE INFORMATION
    // ========================================================

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Company",
  companySchema
);