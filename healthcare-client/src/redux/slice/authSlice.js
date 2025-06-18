import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = { ...action.payload.user, id: action.payload.user.id };
      state.token = action.payload.token;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify({ ...action.payload.user, id: action.payload.user.id }));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateProfile: (state, action) => {
      state.user = { ...action.payload, id: action.payload.id };
      localStorage.setItem('user', JSON.stringify({ ...action.payload, id: action.payload.id }));
    },
  },
});

export const { loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;