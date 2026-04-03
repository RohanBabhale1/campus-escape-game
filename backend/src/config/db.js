const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  } else {
    console.log("✅ PostgreSQL connected successfully");
    release();
  }
});

const query = (text, params) => pool.query(text, params);
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
