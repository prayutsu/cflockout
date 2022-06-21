const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Contest = require("../models/contestModel");
const { MAX_PLAYERS } = require("../config/constants");
const { getUpdatedRankList, myVar } = require("../services/cfService");
const types = require("mongoose").Types;

const getUpdatedContestantsList = async (
  contestantsList,
  username,
  pointsAwarded
) => {
  contestantsList.forEach((contestant) => {
    if (contestant.username === username) {
      contestant.points += pointsAwarded;
    }
  });
  contestantsList.sort(
    (contestant1, contestant2) => contestant1.points > contestant2.points
  );
  let rank = 1;
  for (contestant in contestantsList) {
    contestant.rank = rank++;
  }
  return contestantsList;
};

/** Fetches all contests related to a user. */
const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find({ users: req.user._id });
  res.status(200).json({ success: true, contests });
});

/** Fetches the ongoing contest related to a user. */
const getOngoingContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findOne({
    users: req.user._id,
    isFinished: false,
  });
  if (!contest) {
    res.status(404);
    throw Error("No ongoing contests found!");
  }
  res.status(200).json({ success: true, contest });
});

/** Creates a new contest. */
const createContest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
  const { duration, problems } = req.body;

  const admin = req.user.id;
  const users = [admin];
  const contestants = [
    {
      username: req.user.username,
      userId: req.user.id,
      points: 0,
      rank: 1,
    },
  ];

  const ongoingContest = await Contest.findOne({
    users: req.user._id,
    isFinished: false,
  });

  if (ongoingContest) {
    res.status(409);
    throw Error("The user is already participating in a running contest.");
  }

  const contest = await Contest.create({
    users,
    admin,
    duration,
    problems,
    contestants,
  });

  res.status(201).json({ success: true, contest });
});

/** Allows a user to join a contest. */
const joinContest = asyncHandler(async (req, res) => {
  const isValid = types.ObjectId.isValid(req.params.contestId);
  if (!isValid) {
    res.status(400);
    throw new Error("Invalid contest id!");
  }
  const ongoingContest = await Contest.findById(req.params.contestId);
  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found with the given ID!");
  }

  if (ongoingContest.isFinished) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  ongoingContest.users.forEach((user) => {
    if (user === req.user.id) {
      res.status(409);
      throw new Error("User is already participating in the contest!");
    }
  });

  if (ongoingContest.users.length >= MAX_PLAYERS) {
    res.status(400);
    throw new Error("Maximum limit of players reached!");
  }

  const alreadyRunningContest = await Contest.findOne({
    users: req.user._id,
    isStarted: true,
    isFinished: false,
  });

  if (alreadyRunningContest) {
    res.status(409);
    throw Error("The user is already participating in a running contest.");
  }

  const contestant = {
    username: req.user.username,
    points: 0,
    rank: ongoingContest.contestants.length + 1,
    userId: req.user.id,
  };

  const updatedContest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    {
      $addToSet: { contestants: contestant, users: req.user._id },
    },
    { returnOriginal: false }
  );

  res.status(201).json({ success: true, contest: updatedContest });
});

/**
 * Sets a problem as solved and doesn't allow to be solved again.
 * Body of the request needs problemId and userId who solved the question.
 * @param contestId
 */
const solveProblem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }

  const isValid = types.ObjectId.isValid(req.params.contestId);
  if (!isValid) {
    res.status(400);
    throw new Error("Invalid contest id!");
  }

  const ongoingContest = await Contest.findById(req.params.contestId);
  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found!");
  }
  const contestDuration =
    ongoingContest.startedAt.getTime() + ongoingContest.duration * 60 * 1000;

  if (ongoingContest.isFinished || req.body.timeStamp > contestDuration) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  const problems = ongoingContest.problems.filter(
    (problem) => problem.name === req.body.problemName
  );

  if (problems.length === 0) {
    res.status(400);
    throw Error("Invalid problemId");
  }

  if (problems[0].isSolved) {
    res.status(400);
    throw Error("This problem has already been solved!");
  }

  let contestantsList = ongoingContest.contestants;

  contestantsList = await getUpdatedContestantsList(
    contestantsList,
    req.body.username,
    problems[0].points
  );

  const updatedContest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    {
      $set: {
        "problems.$[element].isSolved": true,
        "problems.$[element].solvedBy": req.body.username,
        contestants: contestantsList,
      },
    },
    {
      arrayFilters: [{ "element.name": req.body.problemName }],
      returnOriginal: false,
    }
  );

  res.status(201).json({ success: true, contest: updatedContest });
});

/** Starts a contest with the given id. */
const startContest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
  const { problems } = req.body;

  const isValid = types.ObjectId.isValid(req.params.contestId);
  if (!isValid) {
    res.status(400);
    throw new Error("Invalid contest id!");
  }

  const ongoingContest = await Contest.findById(req.params.contestId);

  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found!");
  }

  if (ongoingContest.isFinished) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  if (ongoingContest.isStarted) {
    res.status(408);
    throw new Error("This contest is already started!");
  }

  if (req.user.id !== ongoingContest.admin) {
    res.status(401);
    throw new Error("Not authorized for this request.");
  }

  const startedContest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    { isStarted: true, startedAt: new Date(), problems: problems },
    { returnOriginal: false }
  );

  res.status(200).json({ success: true, contest: startedContest });
});

/** Ends a contest with the given id. */
const invalidateContest = asyncHandler(async (req, res) => {
  const isValid = types.ObjectId.isValid(req.params.contestId);
  if (!isValid) {
    res.status(400);
    throw new Error("Invalid contest id!");
  }

  const ongoingContest = await Contest.findById(req.params.contestId);

  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found!");
  }

  if (ongoingContest.isFinished) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  const contestDuration =
    ongoingContest.startedAt.getTime() + ongoingContest.duration * 60 * 1000;

  const solvedProblems = await getUpdatedRankList(ongoingContest);

  const updatedProblems = [];

  for (const problem of ongoingContest.problems) {
    updatedProblems.push(problem);
    for (let i = 0; i < solvedProblems.length; i++) {
      if (solvedProblems[i].timeStamp > contestDuration) {
        solvedProblems.splice(i, 1);
        --i;
        continue;
      }
      if (problem.name === solvedProblems[i].problemName && !problem.isSolved) {
        updatedProblems[updatedProblems.length - 1].isSolved = true;
        updatedProblems[updatedProblems.length - 1].solvedBy =
          solvedProblems[i].username;
        break;
      }
    }
  }

  let contestantsList = ongoingContest.contestants;

  contestantsList = await getUpdatedContestantsList(contestantsList, "", 0);

  const invalidatedContest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    {
      isFinished: true,
      $set: {
        problems: updatedProblems,
        contestants: contestantsList,
      },
    },
    {
      arrayFilters: [{ "element.name": req.body.problemName }],
      returnOriginal: false,
    }
  );

  res.status(201).json(invalidatedContest);
});

/** Ends a contest with the given id. */
const leaveContest = asyncHandler(async (req, res) => {
  const isValid = types.ObjectId.isValid(req.params.contestId);
  if (!isValid) {
    res.status(400);
    throw new Error("Invalid contest id!");
  }

  const ongoingContest = await Contest.findById(req.params.contestId);

  if (!ongoingContest) {
    res.status(404);
    throw new Error("No contest found!");
  }

  if (ongoingContest.isFinished) {
    res.status(408);
    throw new Error("This contest is already finished!");
  }

  const contest = await Contest.findOneAndUpdate(
    { _id: req.params.contestId },
    {
      $pull: { users: req.user.id },
    },
    { returnOriginal: false }
  );

  res.status(201).json({ success: true, contest });
});

module.exports = {
  getContests,
  createContest,
  joinContest,
  solveProblem,
  invalidateContest,
  getOngoingContest,
  startContest,
  leaveContest,
};
