const router = require("express").Router();
const User = require("../models/User");

// UPDATE USER DETAILS
router.put("/:id", async (req, res) => {
  try {
    // Find the user by ID and update their info
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true } // Return the NEW updated data, not the old data
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;