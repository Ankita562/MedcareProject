const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  condition: { type: String, required: true }, // e.g., "Diabetes"
  diagnosisDate: { type: String }, 
  treatment: { type: String },     
  doctor: { type: String },        
  status: { type: String, default: "Ongoing" } 
}, { timestamps: true });

module.exports = mongoose.model("History", HistorySchema);