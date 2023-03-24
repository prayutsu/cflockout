const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const { VERIFY_EMAIL } = require("../config/constants");
const { sendMail } = require("../services/emailService");

router.get(
  "/test",
  asyncHandler(async (req, res) => {
    res.status(200).json({ sucess: "Hello world!!" });
  })
);

router.post(
  "/email",
  asyncHandler(async (req, res) => {
    const { user } = req.body;
    await sendMail(user, VERIFY_EMAIL)
      .then(() =>
        res.status(200).json({ message: `Email sent to ${user.email}` })
      )
      .catch((err) => {
        res
          .status(400)
          .json({
            message: `Error sending email to ${user.email}`,
            error: err,
          });
      });
  })
);

module.exports = router;
