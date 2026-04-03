const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "supersecretclubversekey";

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password, gender } = req.body;
    if (!username || !password || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, password_hash, gender) VALUES ($1, $2, $3) RETURNING id, username, gender",
      [username, password_hash, gender.toUpperCase()]
    );

    const user = newUser.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username, gender: user.gender, type: 'user' }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { username: user.username, gender: user.gender } });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (query.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = query.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, gender: user.gender, type: 'user' }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { username: user.username, gender: user.gender } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Guest Login
app.post("/api/guest", async (req, res) => {
  try {
    const guestGender = Math.random() > 0.5 ? "MALE" : "FEMALE";
    const guestUsername = "Guest_" + Math.floor(Math.random() * 10000);

    const token = jwt.sign({ id: "guest", username: guestUsername, gender: guestGender, type: 'guest' }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { username: guestUsername, gender: guestGender } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Me
app.get("/api/me", (req, res) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    res.json({ user: { username: decoded.username, gender: decoded.gender, type: decoded.type } });
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
