const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  category: String,
  location: String,
  image: { type: String }, // Path to event image
  tags: [{ type: String }],
  capacity: { type: Number, default: 100 },
  bookedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
