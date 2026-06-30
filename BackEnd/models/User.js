// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["recruiter", "jobseeker", "admin"],
    default: "jobseeker"
  },
  phone: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  education: {
    type: String,
    default: "",
  },

  experience: {
    type: String,
    default: "",
  },

  skills: {
    type: String,
    default: "",
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
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);