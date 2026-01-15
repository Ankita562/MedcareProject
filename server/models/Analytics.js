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
  },
  value: {
    type: String, 
    required: true,
  },
  unit: {
    type: String,
    default: "" 
  },
  source: {
    type: String,
    default: "manual" 
  },
  status: { 
    type: String 
  },
  message: { 
    type: String 
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);