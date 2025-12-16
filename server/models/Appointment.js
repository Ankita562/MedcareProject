const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Links appointment to YOU
    doctorName: { type: String, required: true },
    specialty: { type: String, default: "General" }, // e.g., Dentist, Cardio
    date: { type: String, required: true }, // e.g., 2025-10-20
    time: { type: String, required: true }, // e.g., 10:30 AM
    location: { type: String, default: "Clinic" },
    status: { type: String, default: "Upcoming" } // Upcoming / Completed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);