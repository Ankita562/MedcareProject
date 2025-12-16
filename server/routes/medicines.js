const router = require("express").Router();
const Medicine = require("../models/Medicine");

// 1. ADD MEDICINE (Create)
router.post("/add", async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    const savedMedicine = await newMedicine.save();
    res.status(200).json(savedMedicine);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET ALL MEDICINES (Read) - for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.params.userId });
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE MEDICINE (Delete)
router.delete("/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.status(200).json("Medicine has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;