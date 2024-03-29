const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const { TempUser } = require("../models/tempUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const axios = require("axios");
const { RESET_PASSWORD, VERIFY_EMAIL } = require("../config/constants");
const { sendMail } = require("../services/emailService");

const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
  const { name, email, password, username } = req.body;

  // Verify codeforces username.
  const response = await axios.get(
    `https://codeforces.com/api/user.info?handles=${username}`
  );
  if (response.data.status !== "OK") {
    res.status(400);
    throw new Error(`Invalid CF username ${username}!`);
  }

  // Check if user already exists.
  const userAlreadyInDb = await User.findOne({ email });
  if (userAlreadyInDb && userAlreadyInDb.verified) {
    res.status(400);
    throw new Error(`This email is already registered! ${userAlreadyInDb}`);
  }

  // Generate hash of the password.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user.
  const user = await TempUser.create({
    name,
    email,
    password: hashedPassword,
    username,
  });

  if (user) {
    sendMail(user, VERIFY_EMAIL);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        token: generateToken(user._id),
        verified: user.verified,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (!user.verified) {
      throw new Error("User not verified, please verify your email to login");
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        verified: user.verified,
        username: user.username,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials.");
  }
});

const sendResetPasswordLink = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`User not found with this email ${email}.`);
  }
  sendMail(user, RESET_PASSWORD);
  res.status(200).json({
    success: true,
    message: "Reset password link sent to your email.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
  const { password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("User not found with the given id.");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
  const { name, username } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("User not found with the given id.");
  }
  user.name = name;
  user.username = username;
  await user.save();
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      verified: user.verified,
      token: generateToken(user._id),
    },
  });
});

const verifyPasswordResetToken = asyncHandler(async (req, res) => {
  if (!req.params.token) {
    throw new Error("Verification token not present.");
  }
  const data = jwt.verify(req.params.token, process.env.JWT_SECRET);
  const { id } = data;
  const user = await User.findById(id);
  if (!user) {
    throw new Error("This email is not registered.");
  }
  await user.save();
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      verified: user.verified,
      token: generateToken(user._id),
    },
  });
});

const verifyUser = asyncHandler(async (req, res) => {
  if (!req.params.token) {
    throw new Error("Verification token not present.");
  }
  const data = jwt.verify(req.params.token, process.env.JWT_SECRET);
  const { id } = data;
  const tempUser = await TempUser.findById(id);

  if (!tempUser) {
    throw new Error("Invalid User ID!");
  }

  const user = await User.findOne({ email: tempUser.email });
  if (user) {
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        verified: user.verified,
        name: user.name,
        token: generateToken(user._id),
      },
    });
  }

  const newUser = await User.create({
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password,
    username: tempUser.username,
    verified: true,
  });

  res.status(200).json({
    success: true,
    user: {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
      verified: newUser.verified,
      token: generateToken(newUser._id),
    },
  });
});

const generateToken = (id, expirationTime = "30d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expirationTime,
  });
};

module.exports = {
  registerUser,
  updateProfile,
  resetPassword,
  loginUser,
  verifyUser,
  sendResetPasswordLink,
  verifyPasswordResetToken,
};
