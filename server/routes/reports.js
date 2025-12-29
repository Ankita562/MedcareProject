const router = require("express").Router();
const Report = require("../models/Report");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. CONFIGURE MULTER (File Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 2. ADD REPORT (Now handles files!)
router.post("/add", upload.single("file"), async (req, res) => {
  try {
    const reportData = {
      userId: req.body.userId,
      title: req.body.title,
      doctorName: req.body.doctorName,
      date: req.body.date,
      type: req.body.type,
      notes: req.body.notes,
      // If a file was uploaded, save its path
      fileUrl: req.file ? req.file.path : "", 
    };

    const newReport = new Report(reportData);
    const savedReport = await newReport.save();
    res.status(200).json(savedReport);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET REPORTS
router.get("/:userId", async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.params.userId }).sort({ date: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;