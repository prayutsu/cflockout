import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedIndex: 0,
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
  },
});

export const { changeIndex, changeToNone } = navSlice.actions;
export default navSlice.reducer;
