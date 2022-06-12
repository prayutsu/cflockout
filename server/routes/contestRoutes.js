const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  MIN_NUMBER_OF_PROBLEMS,
  MAX_NUMBER_OF_PROBLEMS,
  MIN_DURATION,
  MAX_DURATION,
  MIN_PROBLEM_POINTS,
  MAX_PROBLEM_POINTS,
  MAX_PROBLEM_RATING,
  MIN_PROBLEM_RATING,
} = require("../config/constants");

const {
  getContests,
  createContest,
  joinContest,
  solveProblem,
  invalidateContest,
  getOngoingContest,
  startContest,
  leaveContest,
} = require("../controllers/contestController");

const { protect } = require("../middleware/authMiddleware");

router.route("/all").get(protect, getContests);
router.route("/ongoing").get(protect, getOngoingContest);
router.route("/create").post(
  [
    // Validating number of problems
    body(
      "problems",
      `Number of problems should be in between ${MIN_NUMBER_OF_PROBLEMS} and ${MAX_NUMBER_OF_PROBLEMS} `
    ).isArray({
      min: MIN_NUMBER_OF_PROBLEMS,
      max: MAX_NUMBER_OF_PROBLEMS,
    }),
    // Validating contest duration
    body(
      "duration",
      `Contest Duration should be in between ${MIN_DURATION} minutes and ${MAX_DURATION} minutes`
    ).isFloat({ min: MIN_DURATION, max: MAX_DURATION }),
    // Validating points of every problem
    body(
      "problems.*.points",
      `Points of each problem should lie between ${MIN_PROBLEM_POINTS} and ${MAX_PROBLEM_POINTS}`
    ).isFloat({
      min: MIN_PROBLEM_POINTS,
      max: MAX_PROBLEM_POINTS,
    }),
    // Validating Problem Name
    body("problems.*.name", "Name of problem should not be empty").notEmpty(),
    // Validating Problem Link
    body("problems.*.problemLink", "Problem link is not specified").notEmpty(),
    // Validating Problem ID
    body("problems.*.problemId", "Problem ID is not specified").notEmpty(),
    // Validating Problem Rating
    body(
      "problems.*.rating",
      `Problem rating should lie between ${MIN_PROBLEM_RATING} and ${MAX_PROBLEM_RATING}`
    ).isFloat({ min: MIN_PROBLEM_RATING, max: MAX_PROBLEM_RATING }),
  ],
  protect,
  createContest
);

router.route("/join/:contestId").put(protect, joinContest);
router
  .route("/solve/:contestId")
  .put(
    [
      body("problemName", "problemName can't be empty").not().isEmpty(),
      body("username", "username can't be empty").not().isEmpty(),
      body("timeStamp", "timeStamp can't be empty").not().isEmpty(),
    ],
    protect,
    solveProblem
  );
router.route("/start/:contestId").put(
  [
    // Validating number of problems
    body(
      "problems",
      `Number of problems should be in between ${MIN_NUMBER_OF_PROBLEMS} and ${MAX_NUMBER_OF_PROBLEMS} `
    ).isArray({
      min: MIN_NUMBER_OF_PROBLEMS,
      max: MAX_NUMBER_OF_PROBLEMS,
    }),
    // Validating points of every problem
    body(
      "problems.*.points",
      `Points of each problem should lie between ${MIN_PROBLEM_POINTS} and ${MAX_PROBLEM_POINTS}`
    ).isFloat({
      min: MIN_PROBLEM_POINTS,
      max: MAX_PROBLEM_POINTS,
    }),
    // Validating Problem Name
    body("problems.*.name", "Name of problem should not be empty").notEmpty(),
    // Validating Problem Link
    body("problems.*.problemLink", "Problem link is not specified").notEmpty(),
    // Validating Problem ID
    body("problems.*.problemId", "Problem ID is not specified").notEmpty(),
    // Validating Problem Rating
    body(
      "problems.*.rating",
      `Problem rating should lie between ${MIN_PROBLEM_RATING} and ${MAX_PROBLEM_RATING}`
    ).isFloat({ min: MIN_PROBLEM_RATING, max: MAX_PROBLEM_RATING }),
  ],
  protect,
  startContest
);
router.route("/invalidate/:contestId").put(protect, invalidateContest);

router.route("/leave/:contestId").put(protect, leaveContest);

module.exports = router;
