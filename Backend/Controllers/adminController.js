const User = require("../Models/User");
const Event = require("../Models/Event");
const Booking = require("../Models/Booking");

// Manage users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.blockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: "blocked" }, { new: true });
  res.json({ message: "User blocked", user });
};

exports.unblockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
  res.json({ message: "User unblocked", user });
};

// Manage events
exports.getAllEvents = async (req, res) => {
  const events = await Event.find().populate("agentId", "name email");
  res.json(events);
};

// Manage bookings
exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("userId", "name").populate("eventId", "name");
  res.json(bookings);
};
