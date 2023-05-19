const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: String,
  otpTimestamp: Date,
  wrongAttempts: Number,
  blockedUntil: Date,
});

module.exports = mongoose.model('User', userSchema);
