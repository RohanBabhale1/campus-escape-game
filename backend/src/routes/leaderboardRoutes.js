const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  submitScore,
  getMyRank,
} = require("../controllers/leaderboardController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getLeaderboard);
router.post("/", authMiddleware, submitScore);
router.get("/me", authMiddleware, getMyRank);

module.exports = router;
