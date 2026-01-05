const router = require("express").Router();
const Analytics = require("../models/Analytics"); // ⭐ Keeping name consistent

// 1. POST: Add Entry (Matches Frontend "/add")
router.post("/add", async (req, res) => {
  try {
    const newLog = new Analytics({
      userId: req.body.userId,
      category: req.body.category,
      value: req.body.value,
      date: new Date(),
      source: "manual" // We tag this so we know the user typed it
    });
    
    const savedLog = await newLog.save();
    res.status(200).json(savedLog);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET: Fetch Data (Matches Frontend "/:userId")
router.get("/:userId", async (req, res) => {
  try {
    // Sort by date (Oldest -> Newest) so the graph draws correctly from left to right
    const logs = await Analytics.find({ userId: req.params.userId }).sort({ date: 1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;