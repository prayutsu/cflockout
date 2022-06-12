const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();


router.post(
  "/register",
  [
    body("name", "Name can not be empty.").isLength({ min: 1 }),
    body("email", "Email can not be empty.").isLength({ min: 1 }).isEmail(),
    body("password", "Password can not be empty.").isLength({ min: 1 }),
    body("username", "Username can not be empty").isLength({ min: 1 }),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email", "Email can not be empty.").isLength({ min: 1 }).isEmail(),
    body("password", "Password can not be empty.").isLength({ min: 1 }),
  ],
  loginUser
);

module.exports = router;
