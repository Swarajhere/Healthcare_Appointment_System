import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDoctors, getAvailability, bookAppointment, getDoctorAppointments, updateDoctorHours, getPatientAppointments, markAppointmentCompleted, deleteAppointment } from "../../api/appointments";

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

export const fetchPatientAppointments = createAsyncThunk(
  "appointment/fetchPatientAppointments",
  async (patientId, { rejectWithValue }) => {
    try {
      const appointments = await getPatientAppointments(patientId);
      return appointments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDoctorHoursThunk = createAsyncThunk(
  "appointment/updateDoctorHours",
  async ({ doctorId, date, start, end }, { rejectWithValue }) => {
    try {
      const response = await updateDoctorHours(doctorId, date, start, end);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAppointmentCompletedThunk = createAsyncThunk(
  "appointment/markAppointmentCompleted",
  async ({ appointmentId, doctorId }, { rejectWithValue }) => {
    try {
      const updatedAppointment = await markAppointmentCompleted(appointmentId, doctorId);
      return updatedAppointment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAppointmentThunk = createAsyncThunk(
  "appointment/deleteAppointment",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await deleteAppointment(appointmentId); // Use the service
      return appointmentId;
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
    patientAppointments: [],
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
        state.availability[`${doctorId}_${date}`] = { slots };
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
      })
      .addCase(fetchPatientAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.patientAppointments = action.payload;
      })
      .addCase(fetchPatientAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAppointmentCompletedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAppointmentCompletedThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAppointment = action.payload;
        const index = state.appointments.findIndex(
          (apt) => apt.id === updatedAppointment.id
        );
        if (index !== -1) {
          state.appointments[index] = updatedAppointment;
        }
      })
      .addCase(markAppointmentCompletedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.patientAppointments = state.patientAppointments.filter(
          (appt) => appt.id !== action.payload
        );
      })
      .addCase(deleteAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default appointmentSlice.reducer;