const Event = require("../Models/Event");

// Create event
exports.createEvent = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    const event = new Event({
      ...req.body,
      agentId: req.user._id,
      image: imagePath
    });
    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(400).json({ message: "Event creation failed", error: err.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Not found" });
  if (event.agentId.toString() !== req.user._id) return res.status(403).json({ message: "Forbidden" });

  Object.assign(event, req.body);
  await event.save();
  res.json({ message: "Event updated", event });
};

// Delete (soft)
exports.deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Not found" });
  if (event.agentId.toString() !== req.user._id) return res.status(403).json({ message: "Forbidden" });

  event.isActive = false;
  await event.save();
  res.json({ message: "Event deleted (soft)" });
};

// Get events (with filters)
exports.getEvents = async (req, res) => {
  const { category, search, fromDate, toDate, location } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (search) filter.$or = [
    { name: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } }
  ];
  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate);
    if (toDate) filter.date.$lte = new Date(toDate);
  }

  const events = await Event.find(filter).populate("agentId", "name email");
  res.json(events);
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("agentId", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: "Error fetching event", error: err.message });
  }
};
