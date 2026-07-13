const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // Recruiter who posted the job
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // Used to calculate avg_job_description_length
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    salary: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: String,
      default: "",
      trim: true,
    },

    jobType: {
      type: String,
      default: "",
      trim: true,
    },

    vacancies: {
      type: String,
      default: "",
      trim: true,
    },

    deadline: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helps retrieve recruiter jobs efficiently
jobSchema.index({
  recruiterId: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Job",
  jobSchema
);