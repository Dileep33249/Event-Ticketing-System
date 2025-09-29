const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User", "Agent", "Admin"], default: "User" },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
  isVerified: { type: Boolean, default: false },
  gender: { type: String },
  contact: { type: String },
  resetToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  refreshTokens: [{ type: String }]
});

module.exports = mongoose.model("User", userSchema);
