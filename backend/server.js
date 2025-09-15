// // backend/server.js
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const authRoutes = require("./src/routes/auth");


// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const authRoutes = require("./src/routes/auth");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json()); // parse JSON bodies

// // Routes
// app.use("/api/auth", authRoutes);

// // Default route
// app.get("/", (req, res) => res.send("API is running"));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/auth"); // adjust path if needed

const app = express();

// ----------------- Middleware -----------------
app.use(cors());                // enable CORS
app.use(express.json());        // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data

// ----------------- Routes -----------------
app.use("/api/auth", authRoutes);

// Health check / root route
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

// ----------------- Start server -----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
