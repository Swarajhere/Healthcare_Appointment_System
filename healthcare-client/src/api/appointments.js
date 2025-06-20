import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api";

export const getDoctors = async () => {
  try {
    const token = localStorage.getItem("token");
    // console.log("Fetching doctors with token:", token);
    const response = await axios.get(`${API_URL}/doctors`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Doctors fetched successfully:", response.data);
    return response.data.doctors.map((doctor) => ({
      ...doctor,
      id: doctor.id.toString(),
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch doctors");
  }
};

export const getAvailability = async (doctorId, date) => {
  try {
    const token = localStorage.getItem("token");
    // console.log(`Fetching availability for doctor ${doctorId} on ${date} with token:`, token);
    const response = await axios.get(`${API_URL}/doctors/${doctorId}/availability`, {
      params: { date },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Availability fetched successfully:", response.data);
    return response.data.slots;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch availability");
  }
};

export const bookAppointment = async ({ doctorId, patientId, date, time }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/appointments`,
      {
        doctorId,
        patientId,
        date,
        time,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to book appointment");
  }
};

export const getDoctorAppointments = async (doctorId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/doctors/${doctorId}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.appointments;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch appointments");
  }
};