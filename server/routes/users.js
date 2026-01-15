const router = require("express").Router();
const User = require("../models/User");
const crypto = require("crypto"); // 1. For generating secure tokens
const nodemailer = require("nodemailer"); // 2. For sending emails
const dotenv = require("dotenv");

dotenv.config();

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// UPDATE USER DETAILS
router.put("/:id", async (req, res) => {
  try {
    // 1. Find the User first (We need to compare old vs new data)
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");

    // 2. Separate guardianEmail from the rest of the updates
    const { guardianEmail, ...otherUpdates } = req.body;

    // 3. CHECK: Has the Guardian Email changed?
    if (guardianEmail && guardianEmail !== user.guardianEmail) {
        console.log("🛡️ Guardian Email Changed. Sending Verification...");

        // A. Generate a random secure token
        const token = crypto.randomBytes(32).toString("hex");

        // B. Update Guardian Fields specifically
        user.guardianEmail = guardianEmail;
        user.isGuardianVerified = false; // Reset status to unverified
        user.guardianToken = token;      // Save the token

        // C. Send Verification Email
        const verificationLink = `https://medcare-project-green.vercel.app/verify-guardian/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: guardianEmail,
            subject: "Action Required: Verify Guardian Status for MedCare",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #8B5E3C;">MedCare Guardian Request</h2>
                <p>Hello,</p>
                <p><strong>${user.firstName} ${user.lastName}</strong> has listed you as their Emergency Guardian.</p>
                <p>To receive emergency alerts (like missed medicines or appointments), please verify your email address by clicking the button below:</p>
                
                <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
                  ✅ Verify Email Address
                </a>

                <p style="font-size: 0.9rem; color: #666;">If you do not know this person, please ignore this email.</p>
              </div>
            `
        });
        console.log("✅ Verification Email Sent to:", guardianEmail);
    }

    // 4. Apply all other updates (Name, Age, Address, etc.)
    // We use Object.assign to merge new data into the existing user object
    Object.assign(user, otherUpdates);

    // 5. Save the final user object
    const updatedUser = await user.save();
    
    // Return the updated user (excluding password)
    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json(err);
  }
});

module.exports = router;