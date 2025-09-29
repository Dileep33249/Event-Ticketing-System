const express = require("express");
const User = require("../Models/User");
const farmer = require("../Models/farmerschema");
const verifyToken = require("../middleware/VerifyToken");

const router = express.Router();

// Simple test endpoint without authentication
router.get("/health", (req, res) => {
  res.json({ 
    message: "User routes are working", 
    timestamp: new Date().toISOString(),
    jwtSecret: process.env.JWT_SECRET ? "Secret present" : "No secret"
  });
});

// Test endpoint to check if user exists
router.get("/test", verifyToken, async (req, res) => {
  try {
    console.log("Test endpoint - User ID:", req.user._id);
    console.log("Test endpoint - User email:", req.user.email);
    
    // Check in User model
    const userInUserModel = await User.findById(req.user._id);
    console.log("Test endpoint - User found in User model:", userInUserModel ? "Yes" : "No");
    
    // Check in farmer model
    const userInFarmerModel = await farmer.findById(req.user._id);
    console.log("Test endpoint - User found in farmer model:", userInFarmerModel ? "Yes" : "No");
    
    // Check by email in both models
    const userByEmailInUserModel = await User.findOne({ email: req.user.email });
    const userByEmailInFarmerModel = await farmer.findOne({ email: req.user.email });
    
    console.log("Test endpoint - User found by email in User model:", userByEmailInUserModel ? "Yes" : "No");
    console.log("Test endpoint - User found by email in farmer model:", userByEmailInFarmerModel ? "Yes" : "No");
    
    res.json({ 
      message: "Test endpoint working", 
      userId: req.user._id,
      userEmail: req.user.email,
      userExistsInUserModel: !!userInUserModel,
      userExistsInFarmerModel: !!userInFarmerModel,
      userByEmailInUserModel: userByEmailInUserModel ? { name: userByEmailInUserModel.name, email: userByEmailInUserModel.email, role: userByEmailInUserModel.role } : null,
      userByEmailInFarmerModel: userByEmailInFarmerModel ? { name: userByEmailInFarmerModel.name, email: userByEmailInFarmerModel.email, role: userByEmailInFarmerModel.role } : null
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ message: "Test endpoint error", error: error.message });
  }
});

// Get profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log("Fetching profile for user ID:", req.user._id);
    console.log("Fetching profile for user email:", req.user.email);
    
    // First try to find in User model
    let user = await User.findById(req.user._id).select("-password");
    console.log("User found in User model:", user ? "Yes" : "No");
    
    // If not found in User model, try farmer model
    if (!user) {
      console.log("Checking farmer model...");
      const farmerUser = await farmer.findById(req.user._id);
      if (farmerUser) {
        console.log("User found in farmer model, converting to User format");
        // Convert farmer user to User format
        user = {
          _id: farmerUser._id,
          name: farmerUser.name,
          email: farmerUser.email,
          role: farmerUser.role === 'user' ? 'User' : farmerUser.role === 'organiser' ? 'Agent' : 'User',
          gender: null,
          contact: null
        };
      }
    }
    
    if (!user) {
      console.log("User not found in any model");
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("Profile found:", { name: user.name, email: user.email, role: user.role });
    res.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Update profile
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email, gender, contact } = req.body;
    console.log("Updating profile for user ID:", req.user._id);
    
    // First try to update in User model
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, gender, contact },
      { new: true, runValidators: true }
    );
    
    // If not found in User model, try farmer model
    if (!user) {
      console.log("User not found in User model, checking farmer model");
      const farmerUser = await farmer.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true }
      );
      
      if (farmerUser) {
        console.log("Updated user in farmer model");
        // Convert farmer user to User format for response
        user = {
          _id: farmerUser._id,
          name: farmerUser.name,
          email: farmerUser.email,
          role: farmerUser.role === 'user' ? 'User' : farmerUser.role === 'organiser' ? 'Agent' : 'User',
          gender: null,
          contact: null
        };
      }
    }
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
