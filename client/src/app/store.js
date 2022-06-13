import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import contestReducer from "../features/contest/contestSlice";
import liveContestReducer from "../features/contest/liveContestSlice";
import navReducer from "../features/nav/navSlice";
import allContestsReducer from "../features/contest/allContestsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contest: contestReducer,
    liveContestState: liveContestReducer,
    nav: navReducer,
    allContests: allContestsReducer,
  },
});
