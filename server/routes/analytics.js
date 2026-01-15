const router = require("express").Router();
const Analytics = require("../models/Analytics");

// 1. POST: Add Entry (Now supports Height & BMI)
router.post("/add", async (req, res) => {
  try {
    const { userId, category, value, height } = req.body; // Expect height for BMI

    let status = "Normal";
    let message = "Maintained";

    // 🧠 SMART BMI LOGIC
    if (category === "Weight" && value && height) {
      const weightKg = parseFloat(value);
      const heightM = parseFloat(height) / 100; // Convert cm to meters

      if (heightM > 0) {
        // Calculate BMI: weight / (height * height)
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);

        if (bmi < 18.5) {
          status = "⚠️ Underweight";
          message = `BMI is ${bmi}. Consider a nutrition plan.`;
        } else if (bmi >= 18.5 && bmi < 24.9) {
          status = "✅ Healthy Weight";
          message = `BMI is ${bmi}. Great job!`;
        } else if (bmi >= 25 && bmi < 29.9) {
          status = "⚠️ Overweight";
          message = `BMI is ${bmi}. Try regular cardio.`;
        } else {
          status = "⚠️ Obese";
          message = `BMI is ${bmi}. Please consult a doctor.`;
        }
      }
    }
    // ... (Keep existing logic for BP/Sugar here if you have it) ...

    const newLog = new Analytics({
      userId,
      category,
      value: value, 
      status,  // Saves the calculated status
      message, // Saves the medical advice
      date: new Date(),
      source: "manual"
    });

    const savedLog = await newLog.save();
    res.status(200).json(savedLog);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// 2. GET: Fetch Data
router.get("/:userId", async (req, res) => {
  try {
    const logs = await Analytics.find({ userId: req.params.userId }).sort({ date: 1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;