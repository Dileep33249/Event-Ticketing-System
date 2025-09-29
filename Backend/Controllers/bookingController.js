const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

// Book event
exports.bookEvent = async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event || !event.isActive) return res.status(404).json({ message: "Event not found" });

  if (event.bookedCount >= event.capacity) return res.status(400).json({ message: "Event full" });

  const existing = await Booking.findOne({ userId: req.user._id, eventId: event._id });
  if (existing) return res.status(400).json({ message: "Already booked" });

  const booking = new Booking({ userId: req.user._id, eventId: event._id });
  await booking.save();

  event.bookedCount++;
  await event.save();

  res.status(201).json({ message: "Booking successful", booking });
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findOneAndDelete({ userId: req.user._id, eventId: req.params.eventId });
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  await Event.findByIdAndUpdate(req.params.eventId, { $inc: { bookedCount: -1 } });
  res.json({ message: "Booking cancelled" });
};

// My bookings
exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate("eventId");
  res.json(bookings);
};
