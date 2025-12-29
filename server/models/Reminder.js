const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  datetime: { type: Date, required: true }, 
  
  // FIELDS FOR RECURRENCE
  frequency: { 
    type: String, 
    enum: ["once", "daily", "weekly", "custom"], 
    default: "once" 
  },
  selectedDays: { type: [String], default: [] }, 
  
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Reminder", ReminderSchema);