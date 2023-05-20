import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user"))?.name || null,
    role: JSON.parse(localStorage.getItem("user"))?.role || null,
    token: JSON.parse(localStorage.getItem("user"))?.accessToken || null,
    error: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.name;
      state.role = action.payload.role;
      state.token = action.payload.accessToken;
      state.error = false;
    },
    loginFailure: (state, action) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.error = false;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
