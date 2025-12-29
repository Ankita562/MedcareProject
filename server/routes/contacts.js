const router = require("express").Router();
const Contact = require("../models/Contact");

// 1. ADD Contact (The URL is just "/")
router.post("/", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(200).json(savedContact);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET Contacts (Fetch by User ID)
router.get("/:userId", async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.params.userId });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE Contact
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
