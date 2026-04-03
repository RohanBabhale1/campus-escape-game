const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const redisClient = require("../config/redis");

const getOrCreateSession = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const existing = await db.query(
      `SELECT
          gs.id, gs.started_at, gs.score, gs.is_active, gs.is_escaped,
          COALESCE(
            json_agg(
              json_build_object(
                'room_id',       rp.room_id,
                'slug',          r.slug,
                'name',          r.name,
                'order_index',   r.order_index,
                'theme_color',   r.theme_color,
                'icon',          r.icon,
                'is_unlocked',   rp.is_unlocked,
                'is_completed',  rp.is_completed,
                'key_collected', rp.key_collected,
                'puzzle_states', rp.puzzle_states,
                'attempts',      rp.attempts
              ) ORDER BY r.order_index
            ) FILTER (WHERE rp.id IS NOT NULL),
            '[]'
          ) AS room_progress
        FROM game_sessions gs
        LEFT JOIN room_progress rp ON rp.session_id = gs.id
        LEFT JOIN rooms r ON r.id = rp.room_id
        WHERE gs.user_id = $1 AND gs.is_active = TRUE
        GROUP BY gs.id
        LIMIT 1`,
      [userId],
    );

    if (existing.rows.length > 0) {
      return res.json({ session: existing.rows[0], isNew: false });
    }

    const sessionId = uuidv4();
    const newSession = await db.query(
      `INSERT INTO game_sessions (id, user_id) VALUES ($1, $2) RETURNING *`,
      [sessionId, userId],
    );

    const rooms = await db.query(
      "SELECT id, order_index FROM rooms ORDER BY order_index",
    );

    const insertPromises = rooms.rows.map((room) =>
      db.query(
        `INSERT INTO room_progress (id, session_id, user_id, room_id, is_unlocked)
         VALUES ($1, $2, $3, $4, $5)`,
        [uuidv4(), sessionId, userId, room.id, room.order_index === 1],
      ),
    );
    await Promise.all(insertPromises);

    res.status(201).json({ session: newSession.rows[0], isNew: true });
  } catch (err) {
    next(err);
  }
};

const getProgress = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const cacheKey = `progress:${userId}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json({ progress: JSON.parse(cached), fromCache: true });
      }
    } catch (_) {}

    const result = await db.query(
      `SELECT
          r.slug, r.name, r.description, r.order_index, r.theme_color, r.icon,
          rp.is_unlocked, rp.is_completed, rp.key_collected,
          rp.puzzle_states, rp.attempts, rp.time_spent_secs
        FROM room_progress rp
        JOIN rooms         r  ON r.id  = rp.room_id
        JOIN game_sessions gs ON gs.id = rp.session_id
        WHERE gs.user_id = $1 AND gs.is_active = TRUE
        ORDER BY r.order_index`,
      [userId],
    );

    const progress = result.rows;

    try {
      await redisClient.setEx(cacheKey, 30, JSON.stringify(progress));
    } catch (_) {}

    res.json({ progress });
  } catch (err) {
    next(err);
  }
};

const savePuzzleState = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { roomSlug, puzzleKey, state } = req.body;

    if (!roomSlug || !puzzleKey) {
      return res
        .status(400)
        .json({ error: "roomSlug and puzzleKey are required." });
    }

    const progressResult = await db.query(
      `SELECT rp.id FROM room_progress rp
        JOIN game_sessions gs ON gs.id = rp.session_id
        JOIN rooms         r  ON r.id  = rp.room_id
        WHERE gs.user_id = $1 AND gs.is_active = TRUE AND r.slug = $2`,
      [userId, roomSlug],
    );

    if (progressResult.rows.length === 0) {
      return res.status(404).json({ error: "Room progress not found." });
    }

    await db.query(
      `UPDATE room_progress
        SET puzzle_states = puzzle_states || $1::jsonb
        WHERE id = $2`,
      [JSON.stringify({ [puzzleKey]: state }), progressResult.rows[0].id],
    );

    try {
      await redisClient.del(`progress:${userId}`);
    } catch (_) {}

    res.json({ message: "Puzzle state saved" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrCreateSession, getProgress, savePuzzleState };
