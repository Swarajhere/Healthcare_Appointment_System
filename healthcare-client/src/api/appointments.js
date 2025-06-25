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
    console.log("Doctors fetched successfully:", response.data);
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

export const getPatientAppointments = async (patientId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/appointments/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.appointments;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch patient appointments");
  }
};

export const updateDoctorHours = async (doctorId, date, start, end) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/doctors/${doctorId}/availability/hours`,
      { date, start, end },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update doctor hours");
  }
};

export const markAppointmentCompleted = async (appointmentId, doctorId) => {
  try {
    const token = localStorage.getItem("token");
    console.log(`Marking appointment completed: ID=${appointmentId}, doctorId=${doctorId}, token: ${token}`);
    const response = await axios.post(
      `${API_URL}/appointments/complete/${appointmentId}`,
      { doctorId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Appointment marked completed:", response.data);
    return response.data.appointment;
  } catch (error) {
    console.error("markAppointmentCompleted error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to mark appointment as completed");
  }
};