const REQUIRED_VARS = ["DATABASE_URL", "JWT_SECRET", "REDIS_URL"];

const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missing.join(", "),
    );
    process.exit(1);
  }
  console.log("✅ Environment variables validated");
};

module.exports = { validateEnv };
