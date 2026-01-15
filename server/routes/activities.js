const router = require("express").Router();
const Activity = require("../models/Activity");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const nodemailer = require("nodemailer");

// ==========================================
// 2. ⭐ SMART ADD (Fixes Giant Text Bug)
// ==========================================
router.post("/add", async (req, res) => {
  try {
    
    console.log("⭐ SMART ADD TRIGGERED with text length:", req.body.text?.length);
    const { userId, text } = req.body;
    
    // Convert to lowercase for checking
    const lowerText = text.toLowerCase();
    const newActivities = [];

    // --- RULE 1: Morning Walk ---
    if (lowerText.includes("walk") || lowerText.includes("walking")) {
        newActivities.push({
            userId,
            title: "Morning Brisk Walk (30 mins)",
            category: "Exercise",
            source: "Smart Scan"
        });
    }

    // --- RULE 2: Yoga ---
    if (lowerText.includes("yoga")) {
        newActivities.push({
            userId,
            title: "Yoga Session",
            category: "Exercise",
            source: "Smart Scan"
        });
    }

    // --- RULE 3: Therapy ---
    if (lowerText.includes("therapy") || lowerText.includes("physio")) {
        newActivities.push({
            userId,
            title: "Physical Therapy",
            category: "Medical",
            source: "Smart Scan"
        });
    }

    // --- FALLBACK (If no keywords found, THEN save the text as General) ---
    if (newActivities.length === 0) {
        newActivities.push({
            userId,
            title: "Check Medical Report", // Generic Title
            category: "General",
            source: "Smart Scan",
            notes: text // Save the full text in notes, NOT title
        });
    }

    // Save all found activities
    const savedActs = await Activity.insertMany(newActivities);

    res.status(200).json(savedActs);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json(err);
  }
});
// ==========================================
// 1. GET Activities (System Suggestions + DB)
// ==========================================
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const dbActivities = await Activity.find({ userId });
    const systemSuggestions = [];
    
    // Fetch latest health logs for smart suggestions
    const healthLogs = await Analytics.find({ userId }).sort({ date: -1 });
    const getLatest = (cat) => healthLogs.find(l => l.category === cat)?.value;

    const bp = getLatest("Blood Pressure");
    const weight = parseFloat(getLatest("Weight"));

    // Logic: High Blood Pressure
    if (bp) {
        const [sys, dia] = bp.split("/").map(Number);
        if (sys > 130 || dia > 85) {
            systemSuggestions.push({ _id: "sys_bp_1", title: "10 min Meditation (High BP Alert)", category: "Mental Health", source: "System" });
            systemSuggestions.push({ _id: "sys_bp_2", title: "Reduce Salt Intake Today", category: "Diet", source: "System" });
        }
    }

    // Logic: Weight Management
    if (weight && weight > 85) {
        systemSuggestions.push({ _id: "sys_weight_1", title: "30 min Brisk Walk", category: "Exercise", source: "System" });
        systemSuggestions.push({ _id: "sys_weight_2", title: "Avoid Sugary Drinks", category: "Diet", source: "System" });
    }

    // Logic: General Wellness
    systemSuggestions.push({ _id: "sys_gen_1", title: "Stand in Sun for 15 mins (Vitamin D)", category: "General", source: "System" });
    
    res.status(200).json({ db: dbActivities, system: systemSuggestions });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 3. COMPLETE ACTIVITY & NOTIFY GUARDIAN
// ==========================================
// 3. MARK AS COMPLETED & NOTIFY GUARDIAN (The Unified Fix)
router.put("/complete", async (req, res) => {
  try {
    const { activityId, userId } = req.body;

    // A. Update the Activity in Database (Make it Green ✅)
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { isCompleted: true },
      { new: true } // Return the updated document
    );

    if (!updatedActivity) return res.status(404).json("Activity not found");

    const user = await User.findById(userId);

    if (user && user.guardianEmail) {

      // 1. Setup Transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 2. Email Content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.guardianEmail,
        subject: `🎉 Activity Completed: ${user.firstName} finished a task!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #38A169;">✅ Activity Completed!</h2>
            <p><strong>${user.firstName}</strong> just completed:</p>
            <div style="background: #f0fff4; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin: 0; color: #2F855A;">${updatedActivity.title}</h3>
              <p style="margin: 5px 0 0; color: #666;">Category: ${updatedActivity.category}</p>
            </div>
            <p>Great job supporting them!</p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("Email Error:", err);
        else console.log("Email Sent:", info.response);
      });
    }

    res.status(200).json(updatedActivity);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;