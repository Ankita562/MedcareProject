const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, default: "General" },
    notes: { type: String },
    fileUrl: { type: String }, // 👈 NEW FIELD
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);