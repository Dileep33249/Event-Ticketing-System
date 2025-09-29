const mongoose = require('mongoose');
require('dotenv').config();

// Simple MongoDB connection
const mongoUrl = process.env.MONGO_URI;

module.exports = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database error:', err.message);
    throw err;
  }
};