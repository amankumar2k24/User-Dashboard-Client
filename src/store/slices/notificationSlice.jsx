import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder;
  },
});

export default notificationsSlice.reducer;
