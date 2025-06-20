import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoctors, getAvailability, bookAppointment, getDoctorAppointments } from "../../api/appointments";

export const fetchDoctors = createAsyncThunk(
  "appointment/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const doctors = await getDoctors();
      return doctors;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAvailability = createAsyncThunk(
  "appointment/fetchAvailability",
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const slots = await getAvailability(doctorId, date);
      return { doctorId, date, slots };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookAppointmentThunk = createAsyncThunk(
  "appointment/bookAppointment",
  async ({ doctorId, patientId, date, time }, { rejectWithValue }) => {
    try {
      const response = await bookAppointment({ doctorId, patientId, date, time });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  "appointment/fetchDoctorAppointments",
  async (doctorId, { rejectWithValue }) => {
    try {
      const appointments = await getDoctorAppointments(doctorId);
      return appointments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    doctors: [],
    availability: {},
    appointments: [],
    loading: false,
    error: null,
  },
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
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const { doctorId, date, slots } = action.payload;
        state.availability[`${doctorId}_${date}`] = slots;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointmentThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchDoctorAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;