import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchActivityLogss } from "../../services/api.services";

export const fetchActivityLogs = createAsyncThunk(
  "activityLog/fetchActivityLogs",
  async (token) => {
    const response = await fetchActivityLogss();
    // console.log("response from activityLog slice", response);
    return response;
  }
);

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState: {
    logs: [],
    status: "idle", 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default activityLogSlice.reducer;
