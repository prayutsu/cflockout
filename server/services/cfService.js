const axios = require("axios");
const { CF_API_URL } = require("../config/constants");

async function sleep(timeInMilliSeconds) {
  return new Promise((resolve) => setTimeout(resolve, timeInMilliSeconds));
}

// Make a Codeforces API request.
const makeCodeforcesRequest = async (config) => {
  let tries = 0;
  let errorMsg = null;
  while (tries < 5) {
    tries += 1;
    try {
      const data = await axios
        .request(config)
        .then((response) => {
          if (response.data && response.status === "OK") {
            return { status: "OK", data: response.data };
          } else {
            return {
              status: "FAILED",
              error:
                errorMsg || "Unable to fetch data. Codeforces API may be down.",
            };
          }
        })
        .catch((error) => {
          errorMsg = error.message.toString();
        });
      if (data.status && data.status === "OK") return data;
      await sleep(1000);
    } catch (error) {
      console.log(error);
    }
  }
  return {
    status: "FAILED",
    error: errorMsg || "Unable to fetch data. Codeforces API may be down.",
  };
};

// Fetches user's x submissions.
const fetchUserSubmissions = async (handle, from = 1, count = 100000) => {
  const res = await makeCodeforcesRequest({
    method: "get",
    url: `${CF_API_URL}/user.status/`,
    params: {
      handle: handle,
      from: from,
      count: count,
    },
  });
  if (res && res.status && res.status === "OK") return res.data;
  if (res && res.error) {
    return {
      status: "FAILED",
      error: res.error,
    };
  }
  return {
    status: "FAILED",
    error: `Unable to fetch user's submissions\n${
      res && res.error ? res.error : ""
    }`,
  };
};

// Determine the first person to solve each problem.
const findWinnerForEachProblem = async (handles, problemNames) => {
  const winners = {};
  for (const handle of handles) {
    const response = await fetchUserSubmissions(handle, 1, 100);
    if (response.status === "OK" && response.data && response.data.result) {
      for (const submission of response.result) {
        if (submission.verdict !== "OK") continue;
        for (const problemName of problemNames) {
          if (submission.problem.name === problemName) {
            if (
              !winners[problemName] ||
              winners[problemName].timeStamp > submission.creationTimeSeconds
            ) {
              winners[problemName] = {
                handle,
                timeStamp: submission.creationTimeSeconds,
              };
            }
          }
        }
      }
    } else {
      return {
        status: "FAILED",
        error:
          response && response.data && response.error
            ? response.error
            : "An error occured while determining solved problems.",
      };
    }
  }
  return { status: "OK", winners };
};

const getUpdatedRankList = async (liveContest) => {
  // Fetch last 100 submissions for each user.
  // Determine if any user solved the problem.
  // dispatch(getLiveContest());
  const unsolvedProblems = [];
  const handles = [];
  if (liveContest) {
    for (const contestant of liveContest.contestants) {
      handles.push(contestant.username);
    }
    for (const problem of liveContest.problems) {
      if (!problem.isSolved) {
        unsolvedProblems.push(problem.name);
      }
    }

    const res = await findWinnerForEachProblem(handles, unsolvedProblems);
    if (res.status !== "OK") {
      return [];
    }
    const winners = res.winners;

    const solvedProblems = [];
    for (const [problem, winner] of Object.entries(winners)) {
      solvedProblems.push({
        problemName: problem,
        username: winner[problem].handle,
        timeStamp: winner[problem].timeStamp,
      });
    }
    return solvedProblems;
  }
  return [];
};

const myVar = "Hello world!!";

module.exports = {
  getUpdatedRankList,
  myVar,
};
