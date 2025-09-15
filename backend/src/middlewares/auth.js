// const jwt = require('jsonwebtoken');
// const { User } = require('../models');
// require('dotenv').config();

// const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization || '';
//   const token = authHeader.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ message: 'Missing auth token' });
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findByPk(payload.id);
//     if (!user) return res.status(401).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token', error: err.message });
//   }
// };

// const authorize = (roles = []) => (req, res, next) => {
//   // roles may be ['admin'] or ['owner','admin'] etc.
//   if (typeof roles === 'string') roles = [roles];
//   if (!roles.length) return next();
//   if (!req.user) return res.status(403).json({ message: 'Forbidden' });
//   if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
//   next();
// };

// module.exports = { authenticate, authorize };

const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Make sure this path is correct
require("dotenv").config();

// ----------------- AUTHENTICATE -----------------
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or malformed auth token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || !payload.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Find user from DB
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message); // ✅ log real error
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// ----------------- AUTHORIZE -----------------
const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (typeof roles === "string") {
        roles = [roles];
      }

      if (!roles.length) {
        return next(); // no roles required
      }

      if (!req.user) {
        return res.status(403).json({ message: "Forbidden: no user found in request" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      console.error("Authorization error:", err.message);
      return res.status(500).json({ message: "Authorization failed", error: err.message });
    }
  };
};

module.exports = { authenticate, authorize };
