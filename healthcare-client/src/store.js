import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import appointmentsReducer from './features/appointments/appointmentsSlice';
import analyticsReducer from './features/analytics/analyticsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    analytics: analyticsReducer,
  },
});