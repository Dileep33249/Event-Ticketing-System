const express = require("express");
const { bookEvent, cancelBooking, myBookings } = require("../Controllers/bookingController");
const verifyToken = require("../middleware/VerifyToken");
const checkRole = require("../middleware/checkrole");

const router = express.Router();

router.post("/:eventId", verifyToken, checkRole("User", "Admin"), bookEvent);
router.delete("/:eventId", verifyToken, checkRole("User", "Admin"), cancelBooking);
router.get("/my", verifyToken, checkRole("User", "Admin"), myBookings);

module.exports = router;
