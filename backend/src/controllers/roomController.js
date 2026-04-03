const db = require("../config/db");
const redisClient = require("../config/redis");

const getRooms = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const result = await db.query(
      `SELECT
          r.id, r.slug, r.name, r.description,
          r.order_index, r.theme_color, r.icon,
          COALESCE(rp.is_unlocked,   FALSE) AS is_unlocked,
          COALESCE(rp.is_completed,  FALSE) AS is_completed,
          COALESCE(rp.key_collected, FALSE) AS key_collected,
          rp.attempts, rp.time_spent_secs
        FROM rooms r
        LEFT JOIN room_progress rp ON rp.room_id = r.id
        LEFT JOIN game_sessions gs ON gs.id = rp.session_id
          AND gs.is_active = TRUE
          AND gs.user_id   = $1
        ORDER BY r.order_index`,
      [userId],
    );

    res.json({ rooms: result.rows });
  } catch (err) {
    next(err);
  }
};

const completeRoom = async (req, res, next) => {
  const client = await require("../config/db").getClient();
  try {
    await client.query("BEGIN");

    const { userId } = req.user;
    const { slug } = req.params;
    const { timeTaken } = req.body;

    const roomResult = await client.query(
      "SELECT * FROM rooms WHERE slug = $1",
      [slug],
    );
    if (roomResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: `Room '${slug}' not found.` });
    }
    const room = roomResult.rows[0];

    const sessionResult = await client.query(
      "SELECT id FROM game_sessions WHERE user_id = $1 AND is_active = TRUE LIMIT 1",
      [userId],
    );
    if (sessionResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "No active game session found." });
    }
    const sessionId = sessionResult.rows[0].id;

    await client.query(
      `UPDATE room_progress
        SET is_completed    = TRUE,
            key_collected   = TRUE,
            completed_at    = NOW(),
            time_spent_secs = $1
        WHERE session_id = $2 AND room_id = $3`,
      [timeTaken || 0, sessionId, room.id],
    );

    const baseScore = 1000;
    const timePenalty = Math.min(timeTaken || 0, 800);
    const roomScore = Math.max(baseScore - timePenalty, 200);

    await client.query(
      "UPDATE game_sessions SET score = score + $1 WHERE id = $2",
      [roomScore, sessionId],
    );

    const nextRoomResult = await client.query(
      "SELECT id FROM rooms WHERE order_index = $1",
      [room.order_index + 1],
    );

    let nextRoomUnlocked = false;
    let gameCompleted = false;

    if (nextRoomResult.rows.length > 0) {
      await client.query(
        `UPDATE room_progress SET is_unlocked = TRUE
          WHERE session_id = $1 AND room_id = $2`,
        [sessionId, nextRoomResult.rows[0].id],
      );
      nextRoomUnlocked = true;
    } else {
      await client.query(
        `UPDATE game_sessions
          SET is_active       = FALSE,
              is_escaped      = TRUE,
              completed_at    = NOW(),
              total_time_secs = EXTRACT(EPOCH FROM (NOW() - started_at))::INTEGER
          WHERE id = $1`,
        [sessionId],
      );
      gameCompleted = true;
    }

    await client.query("COMMIT");

    try {
      await redisClient.del(`progress:${userId}`);
    } catch (_) {}

    res.json({
      message: `Room "${room.name}" cleared!`,
      roomScore,
      keyEarned: true,
      nextRoomUnlocked,
      gameCompleted,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

const trackAttempt = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { slug } = req.params;

    await db.query(
      `UPDATE room_progress rp
        SET attempts = rp.attempts + 1
        FROM game_sessions gs, rooms r
        WHERE rp.session_id = gs.id
          AND rp.room_id    = r.id
          AND gs.user_id    = $1
          AND gs.is_active  = TRUE
          AND r.slug        = $2`,
      [userId, slug],
    );

    res.json({ message: "Attempt recorded." });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRooms, completeRoom, trackAttempt };
