import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { USER_KEY } from "../../config/constants";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";

// Get user from localStorage.
const user = JSON.parse(localStorage.getItem(USER_KEY));

const initialState = {
  user: user ? user : null,
  imageUrl: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  passwordResetSuccess: false,
  profileUpdateSuccess: false,
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

// Verify the user.
export const verify = createAsyncThunk(
  "auth/verify",
  async (token, thunkAPI) => {
    try {
      const res = await authService.verify(token);
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

// Verify reset password token.
export const verifyResetPasswordToken = createAsyncThunk(
  "auth/verifyResetPasswordToken",
  async (token, thunkAPI) => {
    try {
      const res = await authService.verifyResetPasswordToken(token);
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

// Send reset password link
export const sendResetPasswordLink = createAsyncThunk(
  "auth/send-reset-password-link",
  async (email, thunkAPI) => {
    try {
      const res = await authService.sendResetPasswordLink(email);
      if (res.success) {
        return thunkAPI.fulfillWithValue(res.message);
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

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (password, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await authService.resetPassword(token, password);
      if (res.success) {
        return thunkAPI.fulfillWithValue(res.message);
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

// Update user profile.
export const updateProfile = createAsyncThunk(
  "auth/update-profile",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await authService.updateProfile(token, data);
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

export const getProfileImageUrl = createAsyncThunk(
  "auth/get-profile-image-url",
  async (userId, thunkAPI) => {
    try {
      const url = await getDownloadURL(ref(storage, `images/${userId}`))
        .then((url) => {
          return url;
        })
        .catch((error) => {
          return "";
        });
      return thunkAPI.fulfillWithValue(url);
    } catch (error) {
      return thunkAPI.fulfillWithValue("");
    }
  }
);

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
      state.passwordResetSuccess = false;
      state.profileUpdateSuccess = false;
      state.imageUrl = "";
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
      })
      .addCase(verify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(verify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(sendResetPasswordLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendResetPasswordLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendResetPasswordLink.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.passwordResetSuccess = false;
      })
      .addCase(verifyResetPasswordToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyResetPasswordToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(verifyResetPasswordToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.profileUpdateSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.profileUpdateSuccess = false;
        state.message = action.payload;
      })
      .addCase(getProfileImageUrl.pending, (state, acton) => {
        state.imageUrl = "";
      })
      .addCase(getProfileImageUrl.rejected, (state, action) => {
        state.imageUrl = "";
      })
      .addCase(getProfileImageUrl.fulfilled, (state, action) => {
        state.imageUrl = action.payload;
      });
  },
});

export const { reset, resetIsSucess } = authSlice.actions;
export default authSlice.reducer;
