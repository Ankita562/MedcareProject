const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  relation: { type: String },
  phone: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"] 
  }, 
}, { timestamps: true });

module.exports = mongoose.model("Contact", ContactSchema);