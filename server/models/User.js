const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  age: { type: String, default: "" },
  gender: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  address: { type: String },
  photo: { type: String, default: "" }
  },
  { timestamps: true });

module.exports = mongoose.model('User', UserSchema);