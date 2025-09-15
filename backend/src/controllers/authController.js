// // backend/controllers/authController.js
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const { User } = require("../models");
// require("dotenv").config();

// function generateToken(user) {
//   return jwt.sign(
//     { id: user.id, role: user.role, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
//   );
// }

// // ✅ Signup
// const signup = async (req, res) => {
//   try {
//     const { name, email, password, address } = req.body;

//     console.log("🟢 Signup attempt:", email);

//     const existing = await User.findOne({ where: { email } });
//     if (existing) {
//       console.log("❌ Email already exists:", email);
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // hash password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       address,
//       role: "normal", // default role
//     });

//     console.log("✅ User created:", user.email);

//     const token = generateToken(user);
//     res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     console.error("⚠️ Signup error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ Login
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("🟢 Login attempt:", email, password);

//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       console.log("❌ User not found in DB:", email);
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     console.log("🟡 DB user found:", user.email, user.password);

//     // use bcrypt compare
//     const ok = await bcrypt.compare(password, user.password);
//     console.log("🔑 Password match result:", ok);

//     if (!ok) {
//       console.log("❌ Password mismatch for:", email);
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = generateToken(user);
//     console.log("✅ Login success for:", user.email);

//     res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     console.error("⚠️ Login error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { signup, login };

// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// require('dotenv').config();

// function generateToken(user){
//   return jwt.sign(
//     { id: user.id, role: user.role, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
//   );
// }

// const signup = async (req, res) => {
//   try {
//     const { name, email, password, address, role } = req.body;

//     const existing = await User.findOne({ where: { email }});
//     if (existing) return res.status(400).json({ message: 'Email already registered' });

//     const user = await User.create({ name, email, password, address, role: role || 'user' });
//     const token = generateToken(user);

//     res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Login attempt:", email, password);

//     const user = await User.findOne({ where: { email }});
//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     const ok = await user.comparePassword(password);
//     console.log("Password match:", ok);

//     if (!ok) return res.status(401).json({ message: "Invalid credentials" });

//     const token = generateToken(user);
//     console.log("Login success:", user.email);

//     res.json({
//       token,
//       user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { signup, login };

const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

function generateToken(user){
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

const signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    console.log("Signup request:", req.body);

    if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password required" });

    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, address, role: role || 'user' });
    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    console.log("Password match:", ok);

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    console.log("Login success:", user.email);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { signup, login };
