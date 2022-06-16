const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const { TempUser } = require("../models/tempUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const axios = require("axios");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.CFLOCKOUT_REFRESH_TOKEN,
});

const sendMail = async (user) => {
  const accessToken = oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.CFLOCKOUT_EMAIL_ID,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.CFLOCKOUT_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
    (err, emailToken) => {
      console.log("JWT Token", emailToken);
      const url = `${clientUrl}/verify/?token=${emailToken}`;
      const mailOptions = {
        from: process.env.CFLOCKOUT_EMAIL_ID,
        to: user.email,
        subject: "Verify your account",
        text: `Please click on this link to verify your email.\n${url}`,
        html: `<h3>Please click on this link to verify your email\n <a href="${url}">Click here to verify</a></h3>`,
      };
      transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.email}`);
    }
  );
};

const clientUrl =
  process.env.NODE_ENV === "production"
    ? "https://cflockout.live"
    : "http://localhost:3000";

const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
  if (userAlreadyInDb.verified) {
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
    sendMail(user);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
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
    return res.status(400).json({ errors: errors.array() });
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
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials.");
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  if (!req.params.token) {
    throw new Error("Verification token not present.");
  }
  console.log(req.params.token);
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

module.exports = { registerUser, loginUser, verifyUser };
