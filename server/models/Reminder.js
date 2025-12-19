const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  datetime: { type: Date, required: true }, // The first occurrence
  
  // ⭐ NEW FIELDS FOR RECURRENCE
  frequency: { 
    type: String, 
    enum: ["once", "daily", "weekly", "custom"], 
    default: "once" 
  },
  selectedDays: { type: [String], default: [] }, // e.g. ["Mon", "Wed"] for custom
  
  isActive: { type: Boolean, default: true } // Instead of deleting, we can toggle off
});

module.exports = mongoose.model("Reminder", ReminderSchema);