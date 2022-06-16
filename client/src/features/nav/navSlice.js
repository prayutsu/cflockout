import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedIndex: 0,
  isHeaderBannerOpen: false,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    changeIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
    changeToNone: (state) => {
      state.selectedIndex = 10;
    },
    toggleHeaderBanner: (state) => {
      state.isHeaderBannerOpen = !state.isHeaderBannerOpen;
    },
  },
});

export const { changeIndex, changeToNone, toggleHeaderBanner } =
  navSlice.actions;
export default navSlice.reducer;
