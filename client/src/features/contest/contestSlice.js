import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contestService from "./contestService";
import dayjs from "dayjs";

const initialState = {
  problems: [],
  contestsList: [],
  ongoingContest: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  update: 0,
  message: "",
};

// Creates new contest.
export const createContest = createAsyncThunk(
  "contests/create",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await contestService.createContest(data, token);
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

// Get user's list of contests.
export const getContests = createAsyncThunk(
  "contests/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contestService.getContests(token);
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user's running contest.
export const getOngoingContest = createAsyncThunk(
  "contests/ongoing",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const ongoingContest = await contestService.getOngoingContest(token);
      const contestEndTime =
        new Date(ongoingContest.startedAt).getTime() +
        ongoingContest.duration * 60 * 1000;
      const timeStampDayjs = dayjs(contestEndTime);
      const nowDayjs = dayjs();
      if (timeStampDayjs.isBefore(nowDayjs)) {
        await contestService.invalidateContest(ongoingContest._id, token);
        return thunkAPI.rejectWithValue("No ongoing contest found!!");
      }
      return ongoingContest;
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add a user in the ongoing contest.
export const joinContest = createAsyncThunk(
  "contests/join",
  async (contestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await contestService.joinContest(contestId, token);
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

export const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetAfterCreateContest: (state) => {
      return { ...initialState, ongoingContest: state.ongoingContest };
    },
    resetSuccessIndicators: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false;
      state.message = "";
    },
    resetAllContestantsList: (state) => {
      state.contestsList = [];
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contestsList.push(action.payload);
        state.ongoingContest = action.payload;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getOngoingContest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOngoingContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ongoingContest = action.payload;
      })
      .addCase(getOngoingContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(joinContest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ongoingContest = action.payload;
        state.update = state.update + 1;
      })
      .addCase(joinContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getContests.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getContests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contestsList = action.payload;
      })
      .addCase(getContests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetAfterCreateContest, resetSuccessIndicators } =
  contestSlice.actions;
export default contestSlice.reducer;
