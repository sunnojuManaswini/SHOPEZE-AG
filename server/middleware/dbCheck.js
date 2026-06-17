const mongoose = require("mongoose");

const checkDbConnection = (req, res, next) => {
  // 1 is connected. Anything else (0 = disconnected, 2 = connecting, 3 = disconnecting) means unavailable.
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database connection is temporarily unavailable. Utilizing fallback simulation.",
    });
  }
  next();
};

module.exports = checkDbConnection;
