const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from headers.
      token = req.headers.authorization.split(" ")[1];
      if (token === "undefined" || token === "null") {
        throw new Error("No token provided.");
      }

      // Verify token.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        throw new Error("Invalid token.");
      }

      // Get user from the token and embed in the req.
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        throw new Error("User not found.");
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized for this request.");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

module.exports = { protect };
