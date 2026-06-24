const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    companyName: {
      type: String,
      required: true,
    },

    companyDescription: {
      type: String,
    },

    companyWebsite: {
      type: String,
    },

    companyEmail: {
      type: String,
    },

    companyPhone: {
      type: String,
    },

    companyLocation: {
      type: String,
    },

    industryType: {
      type: String,
    },

    companySize: {
      type: String,
    },

    foundedYear: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);