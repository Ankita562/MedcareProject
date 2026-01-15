const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      default: "General" 
    },
    // ⭐ NEW FIELD: Tracks if it came from AI or User
    source: { 
      type: String, 
      default: "User" 
    },
    // ⭐ NEW FIELD: Tracks completion
    isCompleted: { 
      type: Boolean, 
      default: false 
    },
    notes: {
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);