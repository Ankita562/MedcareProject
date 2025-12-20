const router = require("express").Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Built-in Node module for generating tokens
const bcrypt = require("bcrypt"); // For secure password hashing

// ==========================================
// EMAIL CONFIGURATION 
// ==========================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "medcares832@gmail.com",
    pass: "ecip vfek jtmi pdiz",
  },
});

// ==========================================
// 1. REGISTER ROUTE (Sends Verification Email)
// ==========================================
router.post("/register", async (req, res) => {
  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json("Email already registered!");
    }

    // 2. Hash the password (Security Best Practice)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Generate a Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 4. Create new user (isVerified is false by default from Model)
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword, // Store hashed password
      verificationToken: verificationToken,
      isVerified: false,
    });

    // 5. Save to MongoDB
    await newUser.save();

    // 6. Send Verification Email
    const verifyLink = `http://localhost:3000/#/verify-email/${verificationToken}`;

    const mailOptions = {
      from: "MedCare Support <medcares832@gmail.com>",
      to: newUser.email,
      subject: "Verify your MedCare Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #8B5E3C;">Welcome to MedCare, ${newUser.firstName}!</h2>
          <p>Please verify your email address to activate your account and access the dashboard.</p>
          <a href="${verifyLink}" style="background-color: #8B5E3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; font-weight: bold;">Verify Email</a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 7. Return success message (Do NOT log them in yet)
    res.status(200).json({ 
      message: "Registration successful! Please check your email to verify your account." 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ==========================================
// VERIFY EMAIL ROUTE
// ==========================================
router.post("/verify-email/:token", async (req, res) => {
  try {
    // Find user with this specific token
    const user = await User.findOne({ verificationToken: req.params.token });
    
    if (!user) {
      return res.status(400).json("Invalid or expired verification link.");
    }

    // Verify user and remove the token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json("Email verified successfully! You can now login.");

  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
//LOGIN ROUTE (Checks Verification)
// ==========================================
router.post("/login", async (req, res) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(404).json("User not found");
    }

    // 2. ⭐ CHECK IF VERIFIED
    if (!user.isVerified) {
      return res.status(400).json("Please verify your email address before logging in. Check your inbox.");
    }

    // 3. Check Password (Using bcrypt comparison)
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    // 4. Success! Send user data (excluding password)
    const { password, verificationToken, ...others } = user._doc;
    res.status(200).json(others);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// FORGOT PASSWORD ROUTE
// ==========================================
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    const resetLink = `http://localhost:3000/#/reset-password/${user._id}`;

    const mailOptions = {
      from: "MedCare Support <medcares832@gmail.com>",
      to: user.email,
      subject: "Password Reset Request - MedCare",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h3 style="color: #8B5E3C;">Hello ${user.firstName},</h3>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="background-color: #8B5E3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; font-weight: bold;">Reset Password</a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error sending email." });
  }
});

// ==========================================
//  RESET PASSWORD ROUTE
// ==========================================
router.post("/reset-password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
});

// ==========================================
// 6. RESEND VERIFICATION EMAIL ROUTE (Fixed)
// ==========================================
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User with this email does not exist.");
    }

    // 2. Check if already verified
    if (user.isVerified) {
      return res.status(400).json("This account is already verified. Please login.");
    }

    // ⭐ FIX: Generate a NEW token if one is missing
    let token = user.verificationToken;
    if (!token) {
       token = crypto.randomBytes(32).toString("hex");
       user.verificationToken = token;
       await user.save(); // Save the new token to DB
    }

    // 3. Prepare Link
    const verifyLink = `http://localhost:3000/#/verify-email/${token}`;

    // 4. Send Email
    const mailOptions = {
      from: "MedCare Support <medcares832@gmail.com>",
      to: user.email,
      subject: "Resend: Verify your MedCare Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #8B5E3C;">Verification Email Resent</h2>
          <p>You requested a new verification link. Click below to verify your account:</p>
          <a href="${verifyLink}" style="background-color: #8B5E3C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; font-weight: bold;">Verify Email</a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json("Verification email sent! Check your inbox.");

  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to send email.");
  }
});

// ==========================================
// 8. UPDATE PROFILE ROUTE
// ==========================================
router.put("/update/:id", async (req, res) => {
  try {
    // Find user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Updates only the fields provided
      { new: true }       // Returns the updated user object
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ==========================================
// 7. DELETE ACCOUNT ROUTE
// ==========================================
router.delete("/delete-account/:userId", async (req, res) => {
  try {
    // 1. Delete the user
    await User.findByIdAndDelete(req.params.userId);
    
    // Optional: You could also delete related data (appointments, etc.) here if needed
    // await Appointment.deleteMany({ userId: req.params.userId });

    res.status(200).json("Account has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;