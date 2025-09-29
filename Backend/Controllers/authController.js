const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_TOKEN_TTL = "24h"; // Changed from 15m to 24h for better UX
const REFRESH_TOKEN_TTL = "7d";
const { sendMail } = require("../utils/mailer");
const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL });

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate role
    const validRoles = ["User", "Agent", "Admin"];
    const userRole = role && validRoles.includes(role) ? role : "User";
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: userRole, 
      isVerified: true 
    });
    await newUser.save();
    
    res.status(201).json({ 
      message: "Signup successful.", 
      success: true,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.status === "blocked") {
      return res.status(403).json({ message: "Account disabled or not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ message: "Invalid credentials" });

    const payload = { _id: user._id.toString(), role: user.role, email: user.email };
    const token = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
    await user.save();

    res.json({ 
      message: "Login successful",
      success: true,
      token, 
      refreshToken, 
      role: user.role, 
      name: user.name, 
      email: user.email 
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString("hex");
  const user = await User.findOneAndUpdate({ email }, { resetToken: token }, { new: true });
  if (user) {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;
    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `<p>Hello ${user.name},</p><p>You requested a password reset. Click below to set a new password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });
  }
  res.json({ message: "If the email exists, a reset link has been sent." });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetToken: token });
  if (!user) return res.status(400).json({ message: "Invalid token" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) return res.status(400).json({ message: "Invalid verification token" });
  user.emailVerificationToken = null;
  user.isVerified = true;
  await user.save();
  res.json({ message: "Email verified successfully" });
};

// Refresh Token
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    const user = await User.findById(payload._id);
    if (!user || !(user.refreshTokens || []).includes(refreshToken)) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = signAccessToken({ _id: user._id.toString(), role: user.role, email: user.email });
    res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Logout - invalidate refresh token
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });
  try {
    const payload = jwt.decode(refreshToken);
    if (!payload) return res.status(200).json({ message: "Logged out" });
    const user = await User.findById(payload._id);
    if (user && user.refreshTokens) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }
    res.json({ message: "Logged out" });
  } catch (err) {
    res.json({ message: "Logged out" });
  }
};
