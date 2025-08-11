// backend/models/User.js
const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  step: Number,
  total: Number,
  correct: Number,
  wrong: Number,
  percent: Number,
  certificateLevel: String,
  certUrl: String,
  emailSent: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  attempts: [attemptSchema]
});

module.exports = mongoose.model("User", userSchema);
