const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { protect } = require("../middleware/auth");


// ============================================================
// Generate JWT Token
// ============================================================

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: "7d" }
  );
};


// ============================================================
// Register User
// ============================================================

router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message:
          "Name, email, password, and role are required.",
      });
    }

    // Clean input values
    name = name.trim();
    email = email.trim().toLowerCase();
    role = role.trim().toLowerCase();

    // Validate role
    const allowedRoles = [
      "recruiter",
      "jobseeker",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role. Select Recruiter or Job Seeker.",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists.",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      message: "Registration successful.",

      token: signToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to register user.",
    });
  }
});


// ============================================================
// Login User
// ============================================================

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({
      email,
    });

    // Use one generic message for invalid credentials
    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const isPasswordValid =
      await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    return res.status(200).json({
      message: "Login successful.",

      token: signToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to login.",
    });
  }
});


// ============================================================
// Get Logged-In User Profile
// ============================================================

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error(
      "Get profile error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to retrieve profile.",
    });
  }
});


// ============================================================
// Update Logged-In User Profile
// ============================================================

router.put("/me", protect, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updateData = {};

    if (name) {
      updateData.name = name.trim();
    }

    if (email) {
      const normalizedEmail =
        email.trim().toLowerCase();

      // Prevent duplicate email
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message:
            "An account with this email already exists.",
        });
      }

      updateData.email = normalizedEmail;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message:
        "Profile updated successfully.",
      user,
    });

  } catch (error) {
    console.error(
      "Update profile error:",
      error.message
    );

    return res.status(500).json({
      message: "Unable to update profile.",
    });
  }
});


module.exports = router;