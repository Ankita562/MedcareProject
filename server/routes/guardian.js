const router = require("express").Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Uses your existing .env variables
    pass: process.env.EMAIL_PASS,
  },
});

// ROUTE: Notify Guardian
router.post("/notify", async (req, res) => {
  const { userId, type, itemName } = req.body; 
  // type = "Medicine" or "Appointment"
  // itemName = "Paracetamol" or "Dr. Smith"

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");

    // 1. AGE CHECK LOGIC (< 18 or > 60)
    if (user.age < 18 || user.age > 60) {
      
      if (!user.guardianEmail) {
        return res.status(400).json("Guardian email not set in profile.");
      }

      // 2. Prepare Email Content
      const subject = `MedCare Alert: ${user.firstName} Update`;
      let text = "";

      if (type === "Medicine") {
        text = `Hello,\n\nThis is a notification that ${user.firstName} has just taken their medicine: ${itemName}.\n\nStay Healthy,\nMedCare Team`;
      } else {
        text = `Hello,\n\nThis is a notification that ${user.firstName} has successfully attended their appointment with ${itemName}.\n\nStay Healthy,\nMedCare Team`;
      }

      // 3. Send Email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.guardianEmail,
        subject: subject,
        text: text,
      });

      return res.status(200).json("Guardian notified successfully!");
    } 
    
    // If age is normal, do nothing but return success
    return res.status(200).json("Age not in range, no email needed.");

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ROUTE: Verify Guardian Token
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    
    // Find user with this specific token
    const user = await User.findOne({ guardianToken: token });
    if (!user) return res.status(400).json("Invalid or expired link.");

    // Verify User
    user.isGuardianVerified = true;
    user.guardianToken = null; // Clear the token so it can't be used again
    await user.save();

    res.status(200).json("Guardian verified successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;