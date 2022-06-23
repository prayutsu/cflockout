const MIN_DURATION = 1;
const MAX_DURATION = 180;
const MIN_NUMBER_OF_PROBLEMS = 1;
const MAX_NUMBER_OF_PROBLEMS = 10;
const MIN_PROBLEM_POINTS = 1;
const MAX_PROBLEM_POINTS = 100;
const MAX_PLAYERS = 6;
const MAX_PROBLEM_RATING = 3500;
const MIN_PROBLEM_RATING = 800;
const CF_API_URL = "https://codeforces.com/api";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const VERIFY_EMAIL = "VERIFY_EMAIL";
const RESET_PASSWORD = "RESET_PASSWORD";
const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://cflockout.live"
    : "http://localhost:3000";

module.exports = {
  MIN_DURATION,
  MAX_DURATION,
  MIN_NUMBER_OF_PROBLEMS,
  MAX_NUMBER_OF_PROBLEMS,
  MIN_PROBLEM_POINTS,
  MAX_PROBLEM_POINTS,
  MAX_PLAYERS,
  MIN_PROBLEM_RATING,
  MAX_PROBLEM_RATING,
  CF_API_URL,
  REDIRECT_URI,
  VERIFY_EMAIL,
  RESET_PASSWORD,
  CLIENT_URL,
};
