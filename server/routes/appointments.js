const router = require("express").Router();
const Appointment = require("../models/Appointment");

// 1. BOOK NEW APPOINTMENT
router.post("/add", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(200).json(savedAppointment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET ALL APPOINTMENTS (For a specific user)
router.get("/:userId", async (req, res) => {
  try {
    // Sort by date so the "Next" appointment is first
    const appointments = await Appointment.find({ userId: req.params.userId }).sort({ date: 1 });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;