const express = require("express");
const router = express.Router();
const {
  getOrCreateSession,
  getProgress,
  savePuzzleState,
  restartSession,
} = require("../controllers/gameController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/session", getOrCreateSession);
router.post("/session/restart", restartSession);
router.get("/progress", getProgress);
router.put("/progress/puzzle", savePuzzleState);

module.exports = router;
