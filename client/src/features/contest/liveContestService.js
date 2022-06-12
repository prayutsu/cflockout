import axios from "axios";

import { SERVER_URL } from "../../config/constants";

const API_URL = `${SERVER_URL}api/contests`;

// Marks a problem of the contetst solved.
const solveProblem = async (
  contestId,
  timeStamp,
  problemName,
  username,
  token
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/solve/${contestId}`,
    { timeStamp, problemName, username },
    config
  );
  return response.data;
};

// Get a live contest.
const getLiveContest = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/ongoing`, config);

  return response.data;
};

// Startes a contest.
const startContest = async (contestId, problems, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/start/${contestId}`,
    { problems },
    config
  );
  return response.data;
};

// Adds a user in the contest.
const invalidateContest = async (contestId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/invalidate/${contestId}`,
    {},
    config
  );
  return response.data;
};

// Adds a user in the contest.
const leaveContest = async (contestId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/leave/${contestId}`, {}, config);
  return response.data;
};

const liveContestService = {
  solveProblem,
  invalidateContest,
  startContest,
  getLiveContest,
  leaveContest,
};

export default liveContestService;
