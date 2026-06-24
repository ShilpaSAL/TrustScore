const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const { protect } = require("../middleware/auth");

// Create or Update Company Profile
router.post("/", protect, async (req, res) => {
  try {
    let company = await Company.findOne({
      userId: req.user.id,
    });

    if (company) {
      company = await Company.findOneAndUpdate(
        { userId: req.user.id },
        req.body,
        { new: true }
      );

      return res.json(company);
    }

    company = await Company.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Company Profile
router.get("/", protect, async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user.id,
    });

    res.json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete Company Profile
router.delete("/", protect, async (req, res) => {
  try {
    await Company.findOneAndDelete({
      userId: req.user.id,
    });

    res.json({
      message: "Company profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;