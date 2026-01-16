const router = require("express").Router();
const User = require("../models/User");
const crypto = require("crypto"); 
const bcrypt = require("bcrypt"); 

// --------------------------------------------------------------------
// NOTE: All Email Sending has been moved to Frontend (EmailJS).
// This backend now only generates tokens and saves data.
// --------------------------------------------------------------------

// 1. REGISTER ROUTE
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

    // Return token to Frontend so IT can send the email
    res.status(200).json({
      message: "User created successfully!",
      verificationToken: verificationToken, 
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

    const { password, verificationToken, ...others } = user._doc;
    res.status(200).json(others);

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
    res.status(200).json({
        message: "User found",
        userId: user._id,       
        firstName: user.firstName,
        email: user.email,
        resetToken: user._id  
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 5. RESET PASSWORD
router.post("/reset-password/:id", async (req, res) => {
  try {
    // The 'id' in the URL comes from the link we sent in the email
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Error updating password" });
  }
});

// 6. UPDATE PROFILE
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
    }

    Object.assign(user, otherUpdates);
    const updatedUser = await user.save();
    
    res.status(200).json(updatedUser);
    
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json(err);
  }
});

// 7. GET SINGLE USER (Required for Auto-Refresh)
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 8. VERIFY GUARDIAN TOKEN
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

// 9. RESEND GUARDIAN LINK (Returns Token for Frontend)
router.post("/resend-guardian-link", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ guardianEmail: email });
        if (!user) return res.status(404).json({ message: "No user found with this guardian." });

        const token = crypto.randomBytes(32).toString("hex");
        user.guardianToken = token;
        await user.save();

        res.status(200).json({
            message: "Token generated",
            guardianToken: token, 
            firstName: user.firstName 
        });

    } catch (err) {
        console.error("Resend Error:", err);
        res.status(500).json({ message: "Failed to resend link." });
    }
});

// 10. RESEND VERIFICATION (Returns Token for Frontend)
router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found." });
        if (user.isVerified) return res.status(400).json({ message: "Account already verified." });

        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        await user.save();

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

// 11. DELETE ACCOUNT
router.delete("/delete-account/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Account deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;