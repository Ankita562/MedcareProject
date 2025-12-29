const router = require("express").Router();
const Activity = require("../models/Activity");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const nodemailer = require("nodemailer");
const path = require('path'); 
const { spawn } = require('child_process');

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
// 2. ⭐ ADVANCED ADD (Med-SpaCy Integration)
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { userId, text } = req.body;
    
    // ⭐ POINT TO YOUR VIRTUAL ENVIRONMENT PYTHON
    // This path ensures we use the isolated Python 3.11 environment
    const venvPythonPath = path.join(__dirname, '../venv/Scripts/python.exe');
    const scriptPath = path.join(__dirname, '../process_prescription.py');

    console.log(`🔍 Spawning Python Logic...`);

    const pythonProcess = spawn(venvPythonPath, [scriptPath, text]);

    let pythonData = "";
    
    // Collect output from Python
    pythonProcess.stdout.on('data', (data) => {
      pythonData += data.toString();
    });

    // Handle standard errors (and debug logs)
    pythonProcess.stderr.on('data', (data) => {
      console.log(`Python Log: ${data}`); // Log it, but don't fail!
    });

    pythonProcess.on('close', async (code) => {
      console.log(`Python finished with code ${code}`);

      try {
        // ⭐ NOISE FILTER: Find the first '{' to ignore DEBUG logs
        const jsonStartIndex = pythonData.indexOf('{');
        
        if (jsonStartIndex === -1) {
            throw new Error("No JSON found in Python output");
        }

        const cleanJson = pythonData.substring(jsonStartIndex);
        const extracted = JSON.parse(cleanJson);
        
        const results = [];

        // A. Save Activities (Yoga, Walk)
        if (extracted.activities) {
            for (const act of extracted.activities) {
              const newAct = new Activity({
                userId,
                title: act.title,
                category: act.category || "General",
                source: "Doctor"
              });
              await newAct.save();
              results.push(newAct);
            }
        }

        // B. Save Medicines
        if (extracted.medicines) {
            for (const med of extracted.medicines) {
              const newMed = new Medicine({
                userId,
                name: med.name,
                dosage: med.dosage || "As prescribed",
                frequency: med.frequency || ""
              });
              await newMed.save();
            }
        }

        // C. Save Vitals (BP, Weight)
        if (extracted.vitals) {
            for (const vital of extracted.vitals) {
              const newLog = new Analytics({
                userId,
                category: vital.label, 
                value: vital.value,
                date: new Date()
              });
              await newLog.save();
            }
        }

        res.status(200).json(results); 

      } catch (e) {
        console.error("Parsing Error:", e);
        console.error("Raw Output was:", pythonData);
        res.status(500).json("Could not parse clinical data.");
      }
    });

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
        service: "gmail",
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