import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { USER_KEY } from "../../config/constants";

// Get user from localStorage.
const user = JSON.parse(localStorage.getItem(USER_KEY));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Register the user.
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const res = await authService.register(user);
      if (res.success) {
        return thunkAPI.fulfillWithValue(res.user);
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

// Login the user.
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const res = await authService.login(user);
    if (res.success) {
      return thunkAPI.fulfillWithValue(res.user);
    }
    return thunkAPI.rejectWithValue(res.error);
  } catch (error) {
    const message =
      error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Log out user
export const logout = createAsyncThunk("auth/logout", () => {
  authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    resetIsSucess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { reset, resetIsSucess } = authSlice.actions;
export default authSlice.reducer;
