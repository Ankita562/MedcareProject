const router = require("express").Router();
const Appointment = require("../models/Appointment"); // Assuming you have this model

// 1. GET ALL (Existing)
router.get("/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. ADD APPOINTMENT (Existing)
router.post("/add", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const saved = await newAppointment.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE APPOINTMENT (⭐ NEW)
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json("Appointment deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;