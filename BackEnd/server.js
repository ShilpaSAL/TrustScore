const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();



const authRoutes = require("./routes/auth");
const predictionRoutes = require("./routes/prediction");
const adminRoutes = require("./routes/admin");
const companyRoutes = require("./routes/company");
const jobRoutes = require("./routes/Job");
const applicationRoutes = require("./routes/application");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/recruiter_db")
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 4000, () => {
      console.log(
        `Backend running on port ${process.env.PORT || 4000}`
      );
    });
  })
  .catch((err) => {
    console.error("DB error:", err);
    process.exit(1);
  });