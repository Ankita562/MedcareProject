const router = require("express").Router();
const Reminder = require("../models/Reminder");

// GET ALL ACTIVE REMINDERS
router.get("/:userId", async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId });
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD NEW REMINDER
router.post("/add", async (req, res) => {
  try {
    const newReminder = new Reminder(req.body);
    const saved = await newReminder.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE REMINDER (Permanently remove)
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;