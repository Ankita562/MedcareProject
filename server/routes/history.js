const router = require("express").Router();
const History = require("../models/History");

// 1. GET ALL History for User
router.get("/:userId", async (req, res) => {
  try {
    // Sort by date (newest first)
    const history = await History.find({ userId: req.params.userId }).sort({ date: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. ADD New Record
router.post("/add", async (req, res) => {
  try {
    const newHistory = new History(req.body);
    const saved = await newHistory.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE Record
router.delete("/:id", async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;