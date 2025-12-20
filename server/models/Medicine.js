const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, 
  },
  name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String, // e.g., "500mg"
    required: true,
  },
  time: {
    type: String, // e.g., "8:00 AM"
    required: true,
  },
  frequency: {
    type: String, // e.g., "Daily"
    default: "Daily"
  },
  instructions: {
    type: String,
    required: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);