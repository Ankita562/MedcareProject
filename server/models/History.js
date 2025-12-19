const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },  // e.g., "Diabetes Checkup"
  date: { type: String, required: true },   // e.g., "2025-06-10"
  description: { type: String },            // e.g., "HbA1c levels normal..."
  category: { type: String, default: "General" } 
});

module.exports = mongoose.model("History", HistorySchema);