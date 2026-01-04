const router = require("express").Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); 
const bcrypt = require("bcrypt"); 

// EMAIL CONFIGURATION 
// EMAIL CONFIGURATION (Updated for Render/Cloud)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,        // <--- CHANGE THIS (Was 587)
  secure: true,     // <--- CHANGE THIS (Was false)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Loaded' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Loaded' : '❌ Missing');

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('✅ Server is ready to send emails');
  }
});

// 1. REGISTER ROUTE
// 1. REGISTER ROUTE (Modified for EmailJS)
router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).json("Email already registered!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      verificationToken: verificationToken,
      isVerified: false,
    });

    await newUser.save();

    // --------------------------------------------------------------------
    // CHANGE: We removed transporter.sendMail()
    // INSTEAD: We send the token to the Frontend
    // --------------------------------------------------------------------
    res.status(200).json({
      message: "User created successfully!",
      verificationToken: verificationToken, // <--- Frontend needs this!
      firstName: newUser.firstName
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// 2. VERIFY EMAIL ROUTE
router.post("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json("Invalid link.");
    
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json("Email verified successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");
    if (!user.isVerified) return res.status(400).json("Please verify your email first.");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    const { password, verificationToken, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    console.error("Error:", err); 
    res.status(500).json({ message: err.message || "Server Error" });
  }
});

// 4. FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Account not found." });

    const clientURL = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${clientURL}/#/reset-password/${user._id}`;
    await transporter.sendMail({
      from: `MedCare Support <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Password",
      html: `<a href="${resetLink}">Reset Password</a>`,
    });
    res.status(200).json({ message: "Reset link sent." });
  } catch (err) {
    res.status(500).json({ message: "Error sending email." });
  }
});

// 5. RESET PASSWORD
router.post("/reset-password/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
});

// 6. UPDATE PROFILE (Triggers Guardian Verification)
router.put("/update/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { guardianEmail, ...otherUpdates } = req.body;

    // Check if Guardian Email changed
    if (guardianEmail && guardianEmail !== user.guardianEmail) {
        const token = crypto.randomBytes(32).toString("hex");
        user.guardianToken = token;
        user.isGuardianVerified = false;
        user.guardianEmail = guardianEmail;

        const clientURL = process.env.FRONTEND_URL || "http://localhost:3000";
        // Added /#/ to match your frontend routing style
        const verificationLink = `${clientURL}/#/verify-guardian/${token}`;
        
        await transporter.sendMail({
            from: "MedCare Support <${process.env.EMAIL_USER}>",
            to: guardianEmail,
            subject: "MedCare: Verify Guardian Status",
            html: `
              <h3>Hello,</h3>
              <p>${user.firstName} added you as a Guardian.</p>
              <a href="${verificationLink}">Verify Email</a>
            `
        });
    }

    Object.assign(user, otherUpdates);
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 7. VERIFY GUARDIAN TOKEN (The link clicked in email)
router.post("/verify-guardian", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ guardianToken: token });

    if (!user) return res.status(400).json({ message: "Invalid link." });

    user.isGuardianVerified = true;
    user.guardianToken = undefined; 
    await user.save();

    res.status(200).json({ message: "Guardian verified!" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed." });
  }
});

// ⭐ 8. RESEND GUARDIAN LINK 
router.post("/resend-guardian-link", async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find user by GUARDIAN email
        const user = await User.findOne({ guardianEmail: email });
        if (!user) return res.status(404).json({ message: "No user found with this guardian." });

        // Generate new token
        const token = crypto.randomBytes(32).toString("hex");
        user.guardianToken = token;
        await user.save();

        // ⭐ HERE IS THE FIX: Added /#/ 
        const clientURL = process.env.FRONTEND_URL || "http://localhost:3000";
        const verificationLink = `${clientURL}/#/verify-guardian/${token}`;

        await transporter.sendMail({
            from: "MedCare Support <${process.env.EMAIL_USER}>",
            to: email,
            subject: "Action Required: Verify Guardian Access (Resent)",
            html: `
                <h3>Guardian Verification Needed</h3>
                <p>You have been listed as a Guardian for <strong>${user.firstName}</strong>.</p>
                <a href="${verificationLink}" style="padding: 10px; background: #C05621; color: white;">Verify Now</a>
            `,
        });

        res.status(200).json({ message: "Link resent successfully!" });
    } catch (err) {
        console.error("Resend Error:", err);
        res.status(500).json({ message: "Failed to resend link." });
    }
});

// 8.5 RESEND VERIFICATION (Updated for EmailJS)
router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found." });
        if (user.isVerified) return res.status(400).json({ message: "Account already verified." });

        // Generate new token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        await user.save();

        // STOP sending email here. Return the token to React instead.
        res.status(200).json({
            message: "Token generated",
            verificationToken: verificationToken,
            firstName: user.firstName
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: err.message || "Server Error" });
    }
});

// 9. DELETE ACCOUNT
router.delete("/delete-account/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Account deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;