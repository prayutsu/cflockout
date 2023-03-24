const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { CLIENT_URL, VERIFY_EMAIL } = require("../config/constants");

const getVerifyMailOptions = (user, emailToken) => {
  const url = `${CLIENT_URL}/verify?token=${emailToken}`;
  return {
    from: process.env.CFLOCKOUT_EMAIL_ID,
    to: user.email,
    subject: "Verify your account",
    html: `<p>Hi <strong>${user.name}</strong>,<br>Welcome to CfLockout.<br></p><p><br><strong>Note: If this mail appears in spam folder, make sure to report it <i>not phishing<i> to be able to click the link.</strong></p><h3><br>Please click the below link to verify your email.<br> <a href="${url}">Click here to verify</a></h3>`,
  };
};

const getResetPasswordMailOptions = (user, emailToken) => {
  const url = `${CLIENT_URL}/auth/verify/reset-password-token?token=${emailToken}`;
  return {
    from: process.env.CFLOCKOUT_EMAIL_ID,
    to: user.email,
    subject: "Reset your password",
    html: `<p>Hi <strong>${user.name}</strong>,<br>Welcome to CfLockout.<br></p><p><br><strong>Note: If this mail appears in spam folder, make sure to report it <i>not phishing<i> to be able to click the link.</strong></p><h3><br>Please click the below link to reset your password.<br> <a href="${url}">Click here to reset</a></h3>`,
  };
};

const sendMail = async (user, mailType) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CFLOCKOUT_GMAIL_ID,
      pass: process.env.CFLOCKOUT_GMAIL_PASSWORD,
    },
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const mailOptions =
    mailType === VERIFY_EMAIL
      ? getVerifyMailOptions(user, token)
      : getResetPasswordMailOptions(user, token);

  await transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("Email sent successfully!");
    })
    .catch((err) => {
      console.log("Error sending email: ", err);
    });
};

module.exports = { sendMail };
