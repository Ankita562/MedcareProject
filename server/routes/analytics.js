const router = require("express").Router();
const HealthLog = require("../models/HealthLog");

// 1. POST: Add Manual Entry
router.post("/log", async (req, res) => {
  try {
    const newLog = new HealthLog({
      ...req.body,
      source: "manual" // Force source to be manual here
    });
    const savedLog = await newLog.save();
    res.status(200).json(savedLog);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. POST: Add Entry from Report (This is called when parsing a PDF)
router.post("/log-from-report", async (req, res) => {
  try {
    const newLog = new HealthLog({
      ...req.body,
      source: "report" // Tag as report data
    });
    const savedLog = await newLog.save();
    res.status(200).json(savedLog);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET: Fetch Data for Graphs (Merges both sources!)
router.get("/:userId", async (req, res) => {
  try {
    const logs = await HealthLog.find({ userId: req.params.userId })
      .sort({ date: 1 }); // Oldest first for graphs
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;