import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: {},
  },
  reducers: {
    login: (state, action) => {
      const currentTime = new Date().toISOString();
      state.isAuthenticated = true;
      state.user = { ...action.payload.user, lastLoginTime: currentTime };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
