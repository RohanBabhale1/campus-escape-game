const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("./db");
const http = require("http");
const { Server } = require("socket.io");
const { createClient } = require("redis");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Redis Setup
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error);

// Socket.IO Setup
io.on("connection", async (socket) => {
  console.log("New client connected", socket.id);

  // Send the last 50 messages on connection
  try {
    const cachedMessages = await redisClient.lRange("messages", 0, 49);
    
    if (cachedMessages && cachedMessages.length > 0) {
      // Parse them and send
      const messages = cachedMessages.map(msg => JSON.parse(msg)).reverse();
      socket.emit("initialMessages", messages);
    } else {
      // Fetch from PostgreSQL if Redis is empty
      const query = await pool.query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 50");
      const messages = query.rows;
      
      // Cache them in Redis
      if (messages.length > 0) {
        for (let i = messages.length - 1; i >= 0; i--) {
          await redisClient.lPush("messages", JSON.stringify(messages[i]));
        }
      }
      
      socket.emit("initialMessages", messages.reverse());
    }
  } catch (err) {
    console.error("Error fetching messages:", err);
  }

  socket.on("chatMessage", async (data) => {
    // data should contain { username, text }
    try {
      const { username, text } = data;
      // Save to PostgreSQL
      const result = await pool.query(
        "INSERT INTO messages (username, text) VALUES ($1, $2) RETURNING id, username, text, created_at",
        [username, text]
      );
      const newMessage = result.rows[0];

      // Add to Redis Cache
      await redisClient.lPush("messages", JSON.stringify(newMessage));
      // Keep only last 50 messages in Redis
      await redisClient.lTrim("messages", 0, 49);

      // Broadcast to all clients
      io.emit("message", newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
