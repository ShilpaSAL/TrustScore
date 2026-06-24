const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const sign = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: "7d" }
  );

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      token: sign(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    const user = await User.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    res.json({
      token: sign(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.log("Login Error:", e);

    res.status(500).json({
      message: e.message,
    });
  }
});
// Get Profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});

// Update Profile
router.put("/me", protect, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
});
module.exports = router;