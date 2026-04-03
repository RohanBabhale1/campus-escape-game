const db = require("../config/db");
const redisClient = require("../config/redis");

const LEADERBOARD_CACHE_KEY = "leaderboard:top50";
const CACHE_TTL = 60;

const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    if (Number(offset) === 0) {
      try {
        const cached = await redisClient.get(LEADERBOARD_CACHE_KEY);
        if (cached) {
          return res.json({ leaderboard: JSON.parse(cached), fromCache: true });
        }
      } catch (_) {}
    }

    const result = await db.query(
      `SELECT
          username,
          score,
          total_time_secs,
          rooms_completed,
          achieved_at,
          RANK() OVER (
            ORDER BY score DESC, total_time_secs ASC
          ) AS rank
        FROM leaderboard
        ORDER BY score DESC, total_time_secs ASC
        LIMIT $1 OFFSET $2`,
      [Math.min(Number(limit), 100), Number(offset)],
    );

    const leaderboard = result.rows;

    if (Number(offset) === 0) {
      try {
        await redisClient.setEx(
          LEADERBOARD_CACHE_KEY,
          CACHE_TTL,
          JSON.stringify(leaderboard),
        );
      } catch (_) {}
    }

    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
};

const submitScore = async (req, res, next) => {
  try {
    const { userId, username } = req.user;
    const { score, totalTimeSecs, roomsCompleted, sessionId } = req.body;

    if (score == null || totalTimeSecs == null) {
      return res
        .status(400)
        .json({ error: "score and totalTimeSecs are required." });
    }

    await db.query(
      `INSERT INTO leaderboard (user_id, username, score, total_time_secs, rooms_completed, session_id)
        VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        username,
        score,
        totalTimeSecs,
        roomsCompleted || 0,
        sessionId || null,
      ],
    );

    try {
      await redisClient.del(LEADERBOARD_CACHE_KEY);
    } catch (_) {}

    res.status(201).json({ message: "Score submitted to leaderboard!" });
  } catch (err) {
    next(err);
  }
};

const getMyRank = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `WITH ranked AS (
          SELECT *,
            RANK() OVER (ORDER BY score DESC, total_time_secs ASC) AS rank
          FROM leaderboard
        )
        SELECT * FROM ranked
        WHERE user_id = $1
        ORDER BY score DESC
        LIMIT 1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.json({ myRank: null, message: "No score submitted yet." });
    }

    res.json({ myRank: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLeaderboard, submitScore, getMyRank };
