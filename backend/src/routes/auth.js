// // backend/src/routes/auth.js
// const express = require("express");
// const router = express.Router();
// const pool = require("../../db"); // path to db.js
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // ------------------- SIGNUP ROUTE -------------------
// router.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     // Check if user already exists
//     const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password (recommended)
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert new user
//     const result = await pool.query(
//       "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
//       [name, email, hashedPassword, role]
//     );

//     const newUser = result.rows[0];

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: newUser.id, role: newUser.role },
//       process.env.JWT_SECRET || "secret123",
//       { expiresIn: "1h" }
//     );

//     res.json({ token, user: newUser });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error during signup" });
//   }
// });

// // ------------------- LOGIN ROUTE -------------------
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Login failed: user not found" });
//     }

//     const user = result.rows[0];

//     // Compare hashed password
//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) {
//       return res.status(401).json({ message: "Login failed: wrong password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET || "secret123",
//       { expiresIn: "1h" }
//     );

//     res.json({ token, user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });

const express = require("express");
const router = express.Router();
const pool = require("../../db"); // db.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ------------------- SIGNUP ROUTE -------------------
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role || "user"]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token, user: newUser });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ------------------- LOGIN ROUTE -------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request body:", req.body);

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Fetch user
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
      // `SELECT * FROM users WHERE email = '${email}'`
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Login failed: user not found" });
    }

    const user = result.rows[0];

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Login failed: wrong password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    // Return only safe user info
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
