import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (user && token && isLoggedIn) {
        return {
          auth: {
            isLoggedIn: true,
            user: JSON.parse(user),
            token,
          },
        };
      }
      return undefined;
    }
    return { auth: JSON.parse(serializedState) };
  } catch (err) {
    console.error('Load state error:', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.auth);
    localStorage.setItem('auth', serializedState);
  } catch (err) {
    console.error('Save state error:', err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;