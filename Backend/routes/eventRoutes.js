const express = require("express");
const { createEvent, updateEvent, deleteEvent, getEvents, getEventById } = require("../Controllers/eventController");
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/VerifyToken");
const checkRole = require("../middleware/checkrole");

const router = express.Router();

router.post("/", verifyToken, checkRole("Agent", "Admin"), upload.single("image"), createEvent);
router.put("/:id", verifyToken, checkRole("Agent", "Admin"), updateEvent);
router.delete("/:id", verifyToken, checkRole("Agent", "Admin"), deleteEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);

module.exports = router;
