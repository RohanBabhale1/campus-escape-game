const express = require("express");
const router = express.Router();
const {
  getRooms,
  completeRoom,
  trackAttempt,
} = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getRooms);
router.post("/:slug/complete", completeRoom);
router.post("/:slug/attempt", trackAttempt);

module.exports = router;
