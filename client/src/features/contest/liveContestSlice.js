import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import liveContestService from "./liveContestService";
import dayjs from "dayjs";

const initialState = {
  liveContest: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  leaveSuccess: false,
  loadingContestFinished: false,
  message: "",
};

// Invalidates a contest
export const invalidateContest = createAsyncThunk(
  "liveContests/invalidate",
  async (contestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await liveContestService.invalidateContest(
        contestId,
        token
      );
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Leave a contest
export const leaveContest = createAsyncThunk(
  "liveContests/leave",
  async (contestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await liveContestService.leaveContest(contestId, token);
      if (res.success) {
        return thunkAPI.fulfillWithValue(res.contest);
      }
      return thunkAPI.rejectWithValue(res.error);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get an ongoing contest.
export const getLiveContest = createAsyncThunk(
  "liveContests/ongoing",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await liveContestService.getLiveContest(token);
      if (res.success) {
        const liveContest = res.contest;
        const contestEndTime =
          new Date(liveContest.startedAt).getTime() +
          liveContest.duration * 60 * 1000;
        const timeStampDayjs = dayjs(contestEndTime);
        const nowDayjs = dayjs();
        if (timeStampDayjs.isBefore(nowDayjs)) {
          await liveContestService.invalidateContest(liveContest._id, token);
          return thunkAPI.rejectWithValue("No ongoing contest found!!");
        }
        return thunkAPI.fulfillWithValue(liveContest);
      } else {
        return thunkAPI.rejectWithValue(res.error);
      }
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Marks a problem as solved in an ongoing contest.
export const solveProblem = createAsyncThunk(
  "liveContests/solve",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await liveContestService.solveProblem(
        data.contestId,
        data.timeStamp,
        data.problemName,
        data.username,
        token
      );
      if (res.success) {
        return thunkAPI.fulfillWithValue(res.contest);
      }
      return thunkAPI.rejectWithValue(res.error);
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Starts a contest.
export const startContest = createAsyncThunk(
  "liveContests/start",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await liveContestService.startContest(
        data.id,
        data.problems,
        token
      );
      if (res.success) {
        return thunkAPI.fulfillWithValue(res.contest);
      }
      return thunkAPI.rejectWithValue(res.error);
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const liveContestSlice = createSlice({
  name: "liveContests",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetError: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: String,
      },
    }),
  extraReducers: (builder) => {
    builder
      .addCase(solveProblem.pending, (state) => {
        state.isLoading = true;
        state.loadingContestFinished = false;
      })
      .addCase(solveProblem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.liveContest = action.payload;
        state.loadingContestFinished = true;
      })
      .addCase(solveProblem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.loadingContestFinished = true;
      })
      .addCase(getLiveContest.pending, (state) => {
        state.isLoading = true;
        state.loadingContestFinished = false;
      })
      .addCase(getLiveContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.liveContest = action.payload;
        state.loadingContestFinished = true;
      })
      .addCase(getLiveContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.liveContest = null;
        state.message = action.payload;
        state.loadingContestFinished = true;
      })
      .addCase(leaveContest.pending, (state) => {
        state.isLoading = true;
        state.loadingContestFinished = false;
      })
      .addCase(leaveContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.liveContest = null;
        state.leaveSuccess = true;
        state.loadingContestFinished = true;
      })
      .addCase(leaveContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.loadingContestFinished = true;
      })
      .addCase(startContest.pending, (state) => {
        state.isLoading = true;
        state.loadingContestFinished = false;
      })
      .addCase(startContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.liveContest = action.payload;
        state.isSuccess = true;
        state.isError = false;
        state.loadingContestFinished = true;
      })
      .addCase(startContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.loadingContestFinished = true;
      });
  },
});

export const { reset, resetError } = liveContestSlice.actions;
export default liveContestSlice.reducer;
