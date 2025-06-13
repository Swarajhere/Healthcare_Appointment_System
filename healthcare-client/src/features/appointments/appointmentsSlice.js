import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDoctors = createAsyncThunk('appointments/fetchDoctors', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch doctors');
  }
});

export const fetchAvailableSlots = createAsyncThunk(
  'appointments/fetchAvailableSlots',
  async ({ doctorId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/${doctorId}/availability`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch available slots');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async ({ doctorId, date, startTime, endTime }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/appointments`,
        { doctorId, date, startTime, endTime },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to book appointment');
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async ({ userId, role }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const endpoint = role === 'patient' ? `/appointments/patient/${userId}` : 
                      role === 'doctor' ? `/appointments/doctor/${userId}` : 
                      '/appointments';
      const res = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch appointments');
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: { doctors: [], appointments: [], availableSlots: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentsSlice.reducer;