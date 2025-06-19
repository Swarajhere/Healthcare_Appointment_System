import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authSlice';
import adminReducer from "./slice/adminSlice"; // New slice

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("auth");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Load state error:", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      admin: state.admin,
    });
    localStorage.setItem("auth", serializedState);
  } catch (err) {
    console.error("Save state error:", err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;