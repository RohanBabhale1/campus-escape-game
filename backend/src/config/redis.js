const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("❌ Redis: Too many reconnect attempts, giving up");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("error", (err) => console.error("❌ Redis error:", err.message));
redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("reconnecting", () => console.log("🔄 Redis reconnecting..."));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("❌ Redis initial connection failed:", err.message);
  }
})();

module.exports = redisClient;
