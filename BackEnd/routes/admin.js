const router     = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const User       = require("../models/User");
const Prediction = require("../models/Prediction");

// Get Stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalPreds, labelCounts] = await Promise.all([
      User.countDocuments(),
      Prediction.countDocuments(),
      Prediction.aggregate([{ $group: { _id: "$trust_label", count: { $sum: 1 } } }])
    ]);
    res.json({ totalUsers, totalPredictions: totalPreds, labelCounts });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get All Users
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// Get All Predictions
router.get("/predictions", protect, adminOnly, async (req, res) => {
  const preds = await Prediction.find()
    .populate("recruiterId", "name email")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(preds);
});

module.exports = router;