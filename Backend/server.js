const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import models
const farmer = require("./Models/farmerschema.js");
const Organiser = require("./Models/OrgansierSchema.js");
const Event = require("./Models/Event.js");

// Import routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

// Import middleware and utilities
const {
  signupValidation,
  LoginValidation,
} = require("./middleware/AuthValidation.js");
const varify = require("./varifyEmail.js");
const connectionWithDB = require("./Models/DB.js");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://event-ticket-system-tan.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Database connection
connectionWithDB().catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// Basic routes
app.get("/", (req, res) => res.send("Backend running!"));

// Organiser routes
app.post("/Organiser-Login", LoginValidation, async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await Organiser.findOne({ email });
    const errormsg = "Auth failed or password is wrong !";
    if (!user) {
      return res.status(403).json({ message: errormsg, success: false });
    }
    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      return res.status(403).json({ message: errormsg, success: false });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT Secret is not defined", success: false });
    }

    const jwtoken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({
        message: "Login successfully",
        success: true,
        jwtoken,
        email,
        name: user.name,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error ", success: false });
  }
});

app.post("/Organiser-Signup", signupValidation, async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const user = await Organiser.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({
          message: "User is already exist , you can login",
          success: false,
        });
    }
    const valid = await varify(email);
    if (!valid) {
      return res.status(400).json({ message: "Invalid Email", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userModel = new Organiser({ name, email, password: hashedPassword });
    await userModel.save();
    res.status(201).json({ message: "Signup successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error ", success: false });
  }
});

// User routes
app.post("/Signup", signupValidation, async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const role = "user";
    const user = await farmer.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({
          message: "User is already exist , you can login",
          success: false,
        });
    }
    const valid = await varify(email);
    if (!valid) {
      return res
        .status(400)
        .json({
          message: "Invalid or undeliverable email address ",
          success: false,
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userModel = new farmer({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await userModel.save();
    res.status(201).json({ message: "Signup successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error ", success: false });
  }
});

app.post("/googleLogin", async (req, res) => {
  try {
    const { name, email } = req.body;
    let existingUser = await farmer.findOne({ email });
    if (!existingUser) {
      const newUser = new farmer({ name, email, role: "user" });
      await newUser.save();
      return res.status(200).json({ success: true, user: newUser });
    }
    return res
      .status(200)
      .json({ success: false, message: "exist", user: existingUser });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "something went wrong !!" });
  }
});

app.post("/Login", LoginValidation, async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await farmer.findOne({ email });
    const errormsg = "Auth failed or password is wrong !";
    if (!user) {
      return res.status(403).json({ message: errormsg, success: false });
    }
    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      return res.status(403).json({ message: errormsg, success: false });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT Secret is not defined", success: false });
    }

    const jwtoken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successfully",
      success: true,
      jwtoken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error ", success: false });
  }
});

// Event routes
app.post("/add-event", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).send(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/delete-event/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
