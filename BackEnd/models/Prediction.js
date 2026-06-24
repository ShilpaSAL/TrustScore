// backend/models/Prediction.js
const mongoose = require("mongoose");

const predSchema = new mongoose.Schema({
  recruiterId            : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  number_of_jobs_posted  : Number,
  avg_job_description_length: Number,
  company_logo_present   : Number,
  response_time_hours    : Number,
  job_posting_frequency  : Number,
  complaints_count       : Number,
  approval_rate          : Number,
  trust_label            : { type: String, enum: ["High Trust", "Medium Trust", "Low Trust"] },
  confidence_score       : Number,
  class_probabilities    : mongoose.Schema.Types.Mixed,
  createdAt              : { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", predSchema);