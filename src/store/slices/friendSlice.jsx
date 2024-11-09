import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFriendList } from "../../services/api.services";

export const getFriendsList = createAsyncThunk(
  "friends/fetchFriendsList",
  async (userId) => {
    // console.log("userId inside friend slice", userId);
    const response = await fetchFriendList(userId);
    // console.log("response from friendSlice", response);
    return response?.data?.friends;
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFriendsList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFriendsList.fulfilled, (state, action) => {
        state.status = "succeeded";
        // console.log("action payload from friendlist", action.payload);
        state.list = action.payload;
      })
      .addCase(getFriendsList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default friendsSlice.reducer;
