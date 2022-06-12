import codeforcesService from "./codeforcesService";

const getSolvedProblemsByAllUsers = async (handles) => {
  const solvedProblems = new Set();
  for (const handle of handles) {
    const submissions = await codeforcesService.fetchUserSubmissions(handle);
    console.log(submissions, handle);
    if (submissions.status === "OK") {
      for (const submission of submissions.result) {
        if (submission.verdict === "OK")
          solvedProblems.add(submission.problem.name);
      }
    } else {
      if (submissions.error) {
        return {
          status: "FAILED",
          error: submissions.error,
        };
      }
      return { status: "FAILED", error: "Codeforces request failed." };
    }
  }
  return { status: "OK", solvedProblems };
};

const getUnsolvedProblemsWithRating = async (handles, requirements) => {
  const res = await getSolvedProblemsByAllUsers(handles);
  if (res.status !== "OK") {
    if (res.error) {
      return { status: "FAILED", error: res.error };
    }
    return { status: "FAILED", problems: {} };
  }
  const solvedProblems = res.solvedProblems;
  const response = await codeforcesService.fetchProblems();
  if (response.status !== "OK") {
    return { status: "FAILED", error: "Unable to fetch problems." };
  }
  const allProblems = response.problems;
  if (allProblems.length === 0) {
    return { status: "FAILED", error: "Unable to fetch problems." };
  }
  const problems = {};
  for (const rating of Object.keys(requirements)) problems[rating] = [];
  for (const problem of allProblems) {
    if (solvedProblems.has(problem.name) || !problem.rating) continue;
    for (const [rating, required] of Object.entries(requirements)) {
      if (
        rating === problem.rating.toString() &&
        problems[rating].length < required
      ) {
        problems[rating].push(problem);
      }
    }
    let fetchedAllProblems = true;
    for (const [rating, required] of Object.entries(requirements)) {
      if (problems[rating].length < required) {
        fetchedAllProblems = false;
      }
    }
    if (fetchedAllProblems) {
      return { status: "OK", problems };
    }
  }

  return {
    status: "FAILED",
    error:
      "Not enough problems available to start the contest. Try changing the ratings of the problems.",
  };
};

export { getUnsolvedProblemsWithRating, getSolvedProblemsByAllUsers };
