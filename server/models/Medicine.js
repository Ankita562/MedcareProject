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
    type: String, 
    required: true,
  },
  time: {
    type: String, 
    required: true,
  },
  frequency: {
    type: String,
    default: "Daily"
  },
  instructions: {
    type: String,
    required: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);