// server/routes/auth.js
const router = require("express").Router();
const User = require("../models/User");
const nodemailer = require("nodemailer"); // 👈 1. Import Nodemailer

// 1. REGISTER ROUTE (Sign Up)
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json("Email already registered!");
    }

    // Create new user
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, 
    });

    // Save to MongoDB
    const user = await newUser.save();
    res.status(200).json(user);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    
    // If no user found
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Check Password
    if (user.password !== req.body.password) {
      return res.status(400).json("Wrong password");
    }

    // Success! Send user data back
    res.status(200).json(user);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 👇 3. NEW: FORGOT PASSWORD ROUTE
// ==========================================
router.post("/forgot-password", async (req, res) => {
  try {
    // A. Check if user exists in Database
    const user = await User.findOne({ email: req.body.email });
    
    // B. If NOT found, send specific error message
    if (!user) {
      return res.status(404).json({ message: "Account not found from this email. Create account." });
    }

    // C. Configure Email Sender (Nodemailer)
    // ⚠️ IMPORTANT: Replace with your REAL Gmail and APP PASSWORD
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "medcares832@gmail.com", // 📧 PUT YOUR GMAIL HERE
        pass: "ecip vfek jtmi pdiz",     // 🔑 PUT YOUR GMAIL APP PASSWORD HERE
      },
    });

    // D. Create the Reset Link
    // (This link points to your React Frontend route)
    const resetLink = `http://localhost:3000/reset-password/${user._id}`;

    const mailOptions = {
      from: "MedCare Support <medcares832@gmail.com>",
      to: user.email,
      subject: "Password Reset Request - MedCare",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h3 style="color: #8B5E3C;">Hello ${user.firstName},</h3>
          <p>We received a request to reset your password for your MedCare account.</p>
          <p>Click the button below to reset it:</p>
          <a href="${resetLink}" style="background-color: #8B5E3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 0.9em; color: #777;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    // E. Send Email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });

  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Error sending email. Check server logs." });
  }
});

  // ==========================================
// 👇 4. NEW: RESET PASSWORD CONFIRMATION ROUTE
// ==========================================
router.post("/reset-password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // 1. Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Update password (In real app, hash it here first!)
    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating password" });
  }
});

module.exports = router;