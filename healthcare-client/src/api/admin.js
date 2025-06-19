import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api";

export const getPendingDoctors = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/admin/doctors/pending`,
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      }
    );
    return response.data.doctors || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch pending doctors");
  }
};

export const approveDoctor = async (doctorId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/admin/doctors/approve/${doctorId}`,
      {},
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to approve doctor");
  }
};

export const rejectDoctor = async (doctorId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/admin/doctors/reject/${doctorId}`,
      {},
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to reject doctor");
  }
};