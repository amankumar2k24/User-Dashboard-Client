import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import activityLogReducer from "./slices/activityLogSlice";
import friendReducer from "./slices/friendSlice";

const rootReducer = combineReducers({
  auth: persistReducer({ key: "auth", storage }, authReducer),
  user: userReducer,
  notifications: notificationReducer,
  theme: themeReducer,
  activityLog: activityLogReducer,
  friends: friendReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
