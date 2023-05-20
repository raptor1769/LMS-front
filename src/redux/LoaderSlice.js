import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    value: false,
  },
  reducers: {
    loaderStart: (state) => {
      state.value = true;
    },
    loaderStop: (state) => {
      state.value = false;
    },
  },
});

export const { loaderStart, loaderStop } = loaderSlice.actions;

export default loaderSlice.reducer;
