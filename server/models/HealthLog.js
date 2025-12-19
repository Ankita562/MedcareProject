const mongoose = require("mongoose");

const HealthLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  
  // What kind of data is this?
  category: { 
    type: String, 
    enum: ["Blood Pressure", "Blood Sugar", "Heart Rate", "Weight", "Temperature"], 
    required: true 
  },

  // The actual numbers (Stored as strings to handle "120/80" or "100 mg/dL")
  value: { type: String, required: true }, 

  // ⭐ MAGIC FIELD: Where did this come from?
  source: { 
    type: String, 
    enum: ["manual", "report"], 
    default: "manual" 
  },

  // If it came from a report, link it (Optional)
  linkedReportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  
  // Any extra notes ("Felt dizzy", "After lunch")
  note: { type: String }
});

module.exports = mongoose.model("HealthLog", HealthLogSchema);