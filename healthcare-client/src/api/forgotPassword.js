import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};