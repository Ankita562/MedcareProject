const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true, 
    // Examples: "Blood Pressure", "Heart Rate", "Weight", "Temperature"
  },
  value: {
    type: String, 
    required: true,
    // Examples: "120/80", "72", "85", "98.6"
  },
  unit: {
    type: String,
    default: "" 
    // Examples: "mmHg", "bpm", "kg", "F"
  },
  source: {
    type: String,
    default: "manual" 
    // ⭐ NEW: Helps distinguish between "manual" entry and "device" or "report"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);