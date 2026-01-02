// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
console.log("EMAIL PASS LOADED:", process.env.EMAIL_PASS ? "YES" : "NO");
// Import Routes
const authRoute = require("./routes/auth");
const analyticsRoute = require("./routes/analytics");
const medicineRoute = require("./routes/medicines");
const userRoute = require("./routes/users");
const appointmentRoute = require("./routes/appointments");
const reportRoute = require("./routes/reports");
const historyRoute = require("./routes/history");
const timelineRoute = require("./routes/timeline");
const reminderRoute = require("./routes/reminders");
const contactRoute = require("./routes/contacts");
const guardianRoute = require("./routes/guardian");
const activityRoute = require("./routes/activities");

const app = express();
// MIDDLEWARE
app.use(express.json());
app.use(cors({
    origin: "https://medcare-project-green.vercel.app", 
    credentials: true
}));

// ROUTES 
app.use("/api/auth", authRoute);
app.use("/api/reminders", reminderRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/medicines", medicineRoute);
app.use("/api/users", userRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/reports", reportRoute);
app.use("/api/history", historyRoute);
app.use("/api/timeline", timelineRoute);
app.use("/api/contacts", contactRoute); 
app.use("/api/guardian", guardianRoute);
// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/activities", activityRoute);
// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("MedCare Backend is Running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
