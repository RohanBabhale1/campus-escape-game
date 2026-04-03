require("dotenv").config();

const { validateEnv } = require("./src/config/env");
validateEnv();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./src/routes/authRoutes");
const gameRoutes = require("./src/routes/gameRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const leaderboardRoutes = require("./src/routes/leaderboardRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Slow down!" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many login attempts. Try again later." },
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Escape Room Server is running",
    timestamp: new Date(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let chatMessages = [];
const MAX_MESSAGES = 1000;

io.on("connection", (socket) => {
  // Send existing messages to the newly connected client
  socket.emit("initialMessages", chatMessages);

  socket.on("chatMessage", (data) => {
    // Basic validation
    if (!data.username || !data.text) return;
    
    // Construct message
    const newMessage = {
      username: String(data.username).substring(0, 50),
      text: String(data.text).substring(0, 500)
    };
    
    // Push and manage limit
    chatMessages.push(newMessage);
    if (chatMessages.length > MAX_MESSAGES) {
      chatMessages = chatMessages.slice(-MAX_MESSAGES);
    }
    
    // Broadcast to everyone
    io.emit("message", newMessage);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🎮 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
