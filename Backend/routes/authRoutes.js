const express = require("express");
const { signup, login, forgotPassword, resetPassword, verifyEmail, refresh, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
