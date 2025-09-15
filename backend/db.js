// // backend/db.js
// const { Pool } = require("pg");
// require("dotenv").config(); // Load DATABASE_URL from .env

// // Create a new Pool instance
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }, // Needed if using Render/Heroku
// });

// // Optional: test the connection immediately
// pool.connect()
//   .then(client => {
//     console.log("Connected to the database successfully");
//     client.release();
//   })
//   .catch(err => {
//     console.error("Database connection error:", err);
//   });

// module.exports = pool;

// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   dialectOptions: { ssl: { rejectUnauthorized: false } },
// });

// sequelize.authenticate()
//   .then(() => console.log("✅ Connected to DB"))
//   .catch(err => console.error("❌ DB connection error:", err));

// module.exports = sequelize;

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
});

// Test connection
sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ Database connection error:", err));

module.exports = sequelize;
