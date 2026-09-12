import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";

const storage = {
  getItem: async (key) => {
    if (typeof window === "undefined") return null;

    try {
      const value = window.localStorage.getItem(key);
      if (value === null) return null;

      JSON.parse(value);
      return value;
    } catch (error) {
      window.localStorage.removeItem(key);
      return null;
    }
  },
  setItem: async (key, value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: async (key) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  },
  clear: async () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  },
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
