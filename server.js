// server.js (Node.js with Express)
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Pool } = require("pg"); // Using PostgreSQL for this example

const app = express();
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: "Jack",
  host: "localhost",
  database: "users",
  password: "Moron8023$",
  port: 3306,
});

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { forename, surname, email, mobile, dob, password } = req.body;

    // Input validation
    if (!forename || !surname || !email || !mobile || !dob || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Hash password (server-side)
    // The saltRounds determines the complexity of the hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store user in database
    const result = await pool.query(
      "INSERT INTO users (forename, surname, email, mobile, dob, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [forename, surname, email, mobile, dob, hashedPassword]
    );

    res.status(201).json({
      message: "Registration successful",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*
Database schema (PostgreSQL):

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  forename VARCHAR(50) NOT NULL,
  surname VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  dob DATE NOT NULL,
  password VARCHAR(60) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/
