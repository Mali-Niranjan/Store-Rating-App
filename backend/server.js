require("dotenv").config();  
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/auth"); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

// ✅ Use .env PORT, fallback to 5000
const PORT = process.env.PORT || 5000;

const pool = require("./src/config/db");

// Test route to check DB connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});


app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

