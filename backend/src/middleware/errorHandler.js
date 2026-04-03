const errorHandler = (err, req, res, next) => {
  console.error(`\n🔴 [ERROR] ${req.method} ${req.path}`);
  console.error(err.message);
  if (process.env.NODE_ENV === "development") console.error(err.stack);

  if (err.code === "23505") {
    return res
      .status(409)
      .json({ error: "A record with that value already exists." });
  }
  if (err.code === "23503") {
    return res.status(400).json({ error: "Referenced record does not exist." });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token." });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
