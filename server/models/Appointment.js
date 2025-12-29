const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, 
    doctorName: { type: String, required: true },
    specialty: { type: String, default: "General" }, 
    date: { type: String, required: true }, 
    time: { type: String, required: true }, 
    location: { type: String, default: "Clinic" },
    status: { type: String, default: "Upcoming" } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);