require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("./models/order");
const Food = require("./models/Food");
const User = require("./models/user");
const authRoutes = require("./routes/authroutes");
const Razorpay = require("razorpay");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));
  const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= FOOD APIs =================

// GET foods
app.get("/api/foods", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// POST food
app.post("/api/foods", async (req, res) => {
  const food = new Food(req.body);
  const saved = await food.save();
  res.json(saved);
});

// ================= AUTH APIs =================

// ✅ Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secretkey", {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= PROTECTED =================

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/api/private", verifyToken, (req, res) => {
  res.json({ message: "Protected route working" });
});
// CREATE RAZORPAY ORDER

app.post("/api/create-order", async (req, res) => {
  try {

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_order",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
});

// ================= SERVER =================

const PORT = 5001;
app.listen(PORT, () => console.log("🚀 Server running on 5001"));