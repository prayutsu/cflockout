const AUTH_API_URL = "/api/auth";
const CF_API_URL = "https://codeforces.com/api";
const USER_KEY = "cf_lockout_user";
const MIN_DURATION = 1;
const MAX_DURATION = 180;
const MIN_NUMBER_OF_PROBLEMS = 1;
const MAX_NUMBER_OF_PROBLEMS = 10;
const MIN_PROBLEM_POINTS = 1;
const MAX_PROBLEM_POINTS = 100;
const MAX_PLAYERS = 6;
const MAX_PROBLEM_RATING = 3500;
const MIN_PROBLEM_RATING = 800;
const SERVER_URL =
  process.env.REACT_APP_ENV === "production"
    ? process.env.REACT_APP_SERVER_URL
    : "http://localhost:5000/";

module.exports = {
  CF_API_URL,
  AUTH_API_URL,
  USER_KEY,
  MIN_DURATION,
  MAX_DURATION,
  MIN_NUMBER_OF_PROBLEMS,
  MAX_NUMBER_OF_PROBLEMS,
  MIN_PROBLEM_POINTS,
  MAX_PROBLEM_POINTS,
  MAX_PLAYERS,
  MIN_PROBLEM_RATING,
  MAX_PROBLEM_RATING,
  SERVER_URL,
};
