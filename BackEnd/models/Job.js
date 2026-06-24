const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    jobTitle: {
      type: String,
      required: true,
    },

    companyName: String,
    jobDescription: String,
    location: String,
    salary: String,
    experience: String,
    qualification: String,
    skills: String,
    jobType: String,
    vacancies: String,
    deadline: String,
    website: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);