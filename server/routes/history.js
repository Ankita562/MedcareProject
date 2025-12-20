const router = require("express").Router();
const History = require("../models/History"); // 👈 Importing your existing model

// 1. ADD RECORD
router.post("/add", async (req, res) => {
  try {
    const newRecord = new History(req.body);
    const savedRecord = await newRecord.save();
    res.status(200).json(savedRecord);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET ALL RECORDS
router.get("/:userId", async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE RECORD
router.delete("/:id", async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;