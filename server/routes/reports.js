const router = require("express").Router();
const Report = require("../models/Report");
const Activity = require("../models/Activity");
const multer = require("multer");
const fs = require("fs");
const Tesseract = require("tesseract.js");

// 1. CONFIGURE MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// 2. ADD REPORT + AUTO-EXTRACT ACTIVITIES
router.post("/add", upload.single("file"), async (req, res) => {
  try {
    // A. Save the Report
    const reportData = {
      userId: req.body.userId,
      title: req.body.title,
      doctorName: req.body.doctorName,
      date: req.body.date,
      type: req.body.type,
      notes: req.body.notes,
      fileUrl: req.file ? req.file.path : "", 
    };
    const newReport = new Report(reportData);
    const savedReport = await newReport.save();

    // B. IMMEDIATE PROCESSING (No Python needed)
    if (req.file) {
      console.log("🔍 Processing file with Tesseract:", req.file.path);
      
      Tesseract.recognize(
        req.file.path,
        'eng',
      ).then(async ({ data: { text } }) => {
        const lowerText = text.toLowerCase();
        console.log("📄 Extracted Text:", lowerText);
        
        const newActivities = [];

        // --- RULE 1: Morning Walk ---
        if (lowerText.includes("walk") || lowerText.includes("walking")) {
            newActivities.push({
                userId: req.body.userId,
                title: "Morning Brisk Walk (30 mins)",
                category: "Exercise",
                source: "Smart Scan",
                isCompleted: false
            });
        }

        // --- RULE 2: Yoga ---
        if (lowerText.includes("yoga")) {
            newActivities.push({
                userId: req.body.userId,
                title: "Yoga Session",
                category: "Exercise",
                source: "Smart Scan",
                isCompleted: false
            });
        }

        // --- RULE 3: Therapy ---
        if (lowerText.includes("therapy") || lowerText.includes("physio")) {
            newActivities.push({
                userId: req.body.userId,
                title: "Physical Therapy",
                category: "Medical",
                source: "Smart Scan",
                isCompleted: false
            });
        }

        // --- SAVE TO DB ---
        if (newActivities.length > 0) {
            await Activity.insertMany(newActivities);
            console.log("✅ SUCCESS: Added", newActivities.length, "activities from report.");
        } else {
            console.log("⚠️ No specific keywords (walk, yoga, therapy) found in text.");
        }

      }).catch(err => console.error("❌ OCR Error:", err));
    }

    res.status(200).json(savedReport);

  } catch (err) {
    console.error(err);
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