import axios from "axios";
import { SERVER_URL } from "../../config/constants";

const API_URL = `${SERVER_URL}api/contests`;

// Creates a new contest.
const createContest = async (contestData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/create`, contestData, config);
  return response.data;
};

// Fetches all contests of a user.
const getContests = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/all`, config);

  return response.data;
};

// Fetches all contests of a user.
const getOngoingContest = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/ongoing`, config);

  return response.data;
};

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

// Adds a user in the contest.
const joinContest = async (contestId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/join/${contestId}`, {}, config);
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

const contestService = {
  createContest,
  getContests,
  solveProblem,
  joinContest,
  getOngoingContest,
  invalidateContest,
};

export default contestService;
