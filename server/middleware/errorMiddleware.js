const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  let error = "";
  for (const ch of err.message) {
    if (ch === "{") break;
    error += ch;
  }
  res.status(statusCode).json({
    success: false,
    error: error,
    stack:
      process.env.NODE_ENV === "production" || !err.stack ? null : err.stack,
  });
  next();
};

module.exports = {
  errorHandler,
};
