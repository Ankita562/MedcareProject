// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import your new Auth Route
const authRoute = require("./routes/auth");
const analyticsRoute = require("./routes/analytics");
const medicineRoute = require("./routes/medicines");
const userRoute = require("./routes/users");
const appointmentRoute = require("./routes/appointments");
const path = require("path");
const reportRoute = require("./routes/reports");
const historyRoute = require("./routes/history");
const timelineRoute = require("./routes/timeline");

dotenv.config();

const app = express();
const reminderRoute = require("./routes/reminders");
// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow your React Frontend
  credentials: true
}));

// Use the Auth Route
app.use("/api/auth", authRoute);
app.use("/api/reminders", reminderRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/medicines", medicineRoute);
app.use("/api/users", userRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/reports", reportRoute);
app.use("/api/history", historyRoute);
app.use("/api/timeline", timelineRoute);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medcare")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("MedCare Backend is Running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0",() => {
  console.log(`🚀 Server running on port ${PORT}`);
});