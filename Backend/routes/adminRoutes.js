const express = require("express");
const { getAllUsers, blockUser, unblockUser, getAllEvents, getAllBookings } = require("../Controllers/adminController");
const verifyToken = require("../middleware/VerifyToken");
const checkRole = require("../middleware/checkrole");

const router = express.Router();

router.get("/users", verifyToken, checkRole("Admin"), getAllUsers);
router.put("/users/block/:id", verifyToken, checkRole("Admin"), blockUser);
router.put("/users/unblock/:id", verifyToken, checkRole("Admin"), unblockUser);

router.get("/events", verifyToken, checkRole("Admin"), getAllEvents);
router.get("/bookings", verifyToken, checkRole("Admin"), getAllBookings);

module.exports = router;
