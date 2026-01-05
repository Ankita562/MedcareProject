const router = require("express").Router();
const Activity = require("../models/Activity");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const nodemailer = require("nodemailer");

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
// 2. ⭐ SAFE ADD (JavaScript Version - No Python Crash)
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { userId, text } = req.body;
    
    // Simple JS Logic to guess category (Replaces Python for now)
    let category = "General";
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("yoga") || lowerText.includes("walk") || lowerText.includes("run") || lowerText.includes("exercise")) {
        category = "Exercise";
    } else if (lowerText.includes("meditat") || lowerText.includes("sleep") || lowerText.includes("stress")) {
        category = "Mental Health";
    } else if (lowerText.includes("eat") || lowerText.includes("diet") || lowerText.includes("food") || lowerText.includes("drink")) {
        category = "Diet";
    }

    // 1. Create the Activity
    const newAct = new Activity({
        userId,
        title: text, // Use the raw text as the title
        category: category,
        source: "Doctor" // Scanned from prescription
    });

    await newAct.save();

    // 2. Return it in an array (to match frontend expectation)
    res.status(200).json([newAct]);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json(err);
  }
});

// ==========================================
// 3. COMPLETE ACTIVITY & NOTIFY GUARDIAN
// ==========================================
router.post("/complete", async (req, res) => {
  try {
    const { userId, title, category, source } = req.body;

    // A. Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    // B. Save as "Completed"
    const completedActivity = new Activity({
      userId,
      title,
      category,
      source,
      isCompleted: true
    });
    await completedActivity.save();

    // C. Notify Guardian
    if (user.guardianEmail && user.isGuardianVerified) {
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Explicit host
        port: 465,              // Secure port
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.guardianEmail,
        subject: `🎉 Activity Completed: ${user.firstName} finished a task!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #38A169;">✅ Activity Completed!</h2>
            <p><strong>${user.firstName}</strong> just completed a health activity:</p>
            <div style="background: #f0fff4; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin: 0; color: #2F855A;">${title}</h3>
              <p style="margin: 5px 0 0; color: #666;">Category: ${category}</p>
            </div>
            <p>Great job supporting them!</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json("Activity saved & Guardian notified!");
    } else {
      res.status(200).json("Activity saved (No guardian to notify).");
    }

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;