const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// ============================================================
// Import Routes
// ============================================================

const authRoutes = require("./routes/auth");
const predictionRoutes = require("./routes/prediction");
const adminRoutes = require("./routes/admin");
const companyRoutes = require("./routes/company");
const jobRoutes = require("./routes/Job");
const applicationRoutes = require("./routes/application");
const notificationRoutes = require("./routes/notification");

const app = express();


// ============================================================
// Middleware
// ============================================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


// ============================================================
// API Routes
// ============================================================

app.use("/api/auth", authRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/notification", notificationRoutes);

// ============================================================
// Backend Health Check
// ============================================================

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Recruiter Credibility Assessment backend is running.",
  });
});


// ============================================================
// Handle Unknown Routes
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});


// ============================================================
// MongoDB Connection and Server Startup
// ============================================================

const PORT = process.env.PORT || 4000;

mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb://localhost:27017/recruiter_db"
  )
  .then(() => {
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    process.exit(1);
  });