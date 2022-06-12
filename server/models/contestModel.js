const mongoose = require("mongoose");

const problemSchema = mongoose.Schema({
  name: String,
  problemLink: String,
  rating: Number,
  points: Number,
  problemId: String,
  isSolved: Boolean,
  solvedBy: String,
});

const contestantSchema = {
  username: String,
  userId: String,
  points: Number,
  rank: Number,
};

const contestSchema = mongoose.Schema(
  {
    users: [
      {
        type: String,
        required: true,
        ref: "User",
      },
    ],
    admin: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    problems: {
      type: [problemSchema],
      required: true,
    },
    contestants: {
      type: [contestantSchema],
      default: [],
      required: true,
    },
    isFinished: {
      type: Boolean,
      default: false,
      required: true,
    },
    isStarted: {
      type: Boolean,
      default: false,
      required: true,
    },
    startedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);
