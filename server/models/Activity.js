const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true }, // e.g., "Morning Walk"
  category: { type: String, default: "General" }, // Exercise, Diet, Mental Health
  source: { type: String, enum: ["System", "Doctor"], default: "System" }, // Who recommended it?
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", ActivitySchema);