const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Company Information
    companyName: {
      type: String,
      required: true,
    },

    companyDescription: String,
    companyWebsite: String,
    companyEmail: String,
    companyPhone: String,
    companyLocation: String,
    industryType: String,
    companySize: String,
    foundedYear: String,

    // ==========================
    // ML INPUT FEATURES
    // ==========================

    number_of_jobs_posted: {
      type: Number,
      default: 0,
    },

    avg_job_description_length: {
      type: Number,
      default: 0,
    },

    company_logo_present: {
      type: Number,
      default: 0,
    },

    response_time_hours: {
      type: Number,
      default: 24,
    },

    job_posting_frequency: {
      type: Number,
      default: 1,
    },

    complaints_count: {
      type: Number,
      default: 0,
    },

    approval_rate: {
      type: Number,
      default: 0.8,
    },

    // ==========================
    // ML OUTPUT
    // ==========================

    trustLabel: {
      type: String,
      default: "Medium Trust",
    },

    confidenceScore: {
      type: Number,
      default: 0,
    },
    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);