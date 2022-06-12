const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

router.get(
  "/test",
  asyncHandler(async (req, res) => {
    res.status(200).json({ sucess: "Hello world!!" });
  })
);

module.exports = router;
