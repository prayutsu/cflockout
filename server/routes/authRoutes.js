const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  verifyUser,
  sendResetPasswordLink,
  resetPassword,
  verifyPasswordResetToken,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post(
  "/register",
  [
    body("name", "Name can not be empty.").isLength({ min: 1 }),
    body("email", "Email can not be empty.").isLength({ min: 1 }).isEmail(),
    body("password", "Password can not be less than 4 characters.").isLength({
      min: 4,
    }),
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

router.put(
  "/profile",
  [
    body("name", "Name can not be empty.").isLength({ min: 1 }),
    body("username", "Username can not be empty").isLength({ min: 1 }),
  ],
  protect,
  updateProfile
);

router.post(
  "/send-reset-password-link",
  [body("email", "Email can not be empty.").isLength({ min: 1 }).isEmail()],
  sendResetPasswordLink
);

router.post("/verify-reset-password-token/:token", verifyPasswordResetToken);

router.put(
  "/reset-password",
  [
    body("password", "Password can not be less than 4 characters.").isLength({
      min: 4,
    }),
  ],
  protect,
  resetPassword
);

router.put("/verify/:token", verifyUser);

module.exports = router;
