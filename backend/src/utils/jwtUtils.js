const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (payload) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "escape-room-game",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, { issuer: "escape-room-game" });
};

module.exports = { generateToken, verifyToken };
