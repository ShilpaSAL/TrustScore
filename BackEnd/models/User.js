const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ========================================================
    // Basic Account Information
    // ========================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: true,
    },

    role: {
      type: String,
      enum: ["recruiter", "jobseeker", "admin"],
      default: "jobseeker",
    },

    // ========================================================
    // Job Seeker Profile Information
    // ========================================================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: String,
      default: "",
      trim: true,
    },

    resume: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


// ============================================================
// Hash Password Before Saving
// ============================================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(
    this.password,
    12
  );
});


// ============================================================
// Compare Login Password
// ============================================================

userSchema.methods.comparePassword =
  function (plainPassword) {
    return bcrypt.compare(
      plainPassword,
      this.password
    );
  };


module.exports = mongoose.model(
  "User",
  userSchema
);