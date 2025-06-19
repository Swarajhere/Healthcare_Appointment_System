import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPendingDoctors, approveDoctor as approveDoctorAPI, rejectDoctor as rejectDoctorAPI } from "../../api/admin";

export const fetchPendingDoctors = createAsyncThunk(
  "admin/fetchPendingDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const doctors = await getPendingDoctors();
      return doctors;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveDoctor = createAsyncThunk(
  "admin/approveDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      await approveDoctorAPI(doctorId);
      return doctorId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectDoctor = createAsyncThunk(
  "admin/rejectDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      await rejectDoctorAPI(doctorId);
      return doctorId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    pendingDoctors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingDoctors = action.payload;
      })
      .addCase(fetchPendingDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveDoctor.fulfilled, (state, action) => {
        state.pendingDoctors = state.pendingDoctors.filter(
          (doctor) => doctor._id !== action.payload
        );
      })
      .addCase(rejectDoctor.fulfilled, (state, action) => {
        state.pendingDoctors = state.pendingDoctors.filter(
          (doctor) => doctor._id !== action.payload
        );
      });
  },
});

export default adminSlice.reducer;