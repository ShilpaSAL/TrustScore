const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ============================================================
// Protect Private Routes
// ============================================================

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Authentication required. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key"
    );

    // Find authenticated user
    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message:
          "User associated with this token no longer exists.",
      });
    }

    // Attach authenticated user to request
    req.user = user;

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message:
          "Your session has expired. Please login again.",
      });
    }

    return res.status(401).json({
      message:
        "Invalid authentication token.",
    });
  }
};


// ============================================================
// Admin-Only Route Protection
// ============================================================

const adminOnly = (req, res, next) => {
  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message:
        "Administrator access is required.",
    });
  }

  next();
};


module.exports = {
  protect,
  adminOnly,
};