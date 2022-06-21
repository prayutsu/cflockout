import axios from "axios";
import { CF_API_URL } from "../config/constants";

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
          if (response.data && response.data.status === "OK") {
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
      errorMsg = error.message.toString();
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

// Fetch problems of a specific rating.
const fetchProblems = async () => {
  const response = await makeCodeforcesRequest({
    method: "get",
    url: `${CF_API_URL}/problemset.problems/`,
  });
  if (response && response.status && response.status === "OK") {
    return { status: "OK", problems: response.data.result.problems };
  }
  if (response && response.error) {
    return { status: "FAILED", error: response.error, problems: [] };
  }
  return {
    status: "FAILED",
    error: "Unable to fetch problems from Codeforces API.",
    problems: [],
  };
};

// Determine the first person to solve each problem.
const findWinnerForEachProblem = async (handles, problemNames) => {
  const winners = {};
  for (const handle of handles) {
    const response = await fetchUserSubmissions(handle, 1, 100);
    if (response.status === "OK" && response.result) {
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
          response && response.data && response.data.error
            ? response.data.error
            : "An error occured while determining solved problems.",
      };
    }
  }
  return { status: "OK", winners };
};

const codeforcesService = {
  fetchUserSubmissions,
  fetchProblems,
  findWinnerForEachProblem,
};

export default codeforcesService;
