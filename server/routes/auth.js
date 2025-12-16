// server/routes/auth.js
const router = require("express").Router();
const User = require("../models/User");

// 1. REGISTER ROUTE (Sign Up)
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json("Email already registered!");
    }

    // Create new user with data from Frontend
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

    // Check Password (In real app, we use encryption here)
    if (user.password !== req.body.password) {
      return res.status(400).json("Wrong password");
    }

    // Success! Send user data back
    res.status(200).json(user);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;