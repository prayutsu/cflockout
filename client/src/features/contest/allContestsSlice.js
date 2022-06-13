import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contestService from "./contestService";

const initialState = {
  contestsList: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get user's list of contests.
export const getContests = createAsyncThunk(
  "allContests/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await contestService.getContests(token);
      if (res.success) {
        return res.contests;
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

export const allContestSlice = createSlice({
  name: "allContests",
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
      .addCase(getContests.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
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

export const {
  reset,
  resetAfterCreateContest,
  resetSuccessIndicators,
  resetAllContestantsList,
} = allContestSlice.actions;
export default allContestSlice.reducer;
