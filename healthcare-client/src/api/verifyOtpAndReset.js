import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

export const verifyOtpAndReset = async ({ email, otp, newPassword, confirmPassword }) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp-reset`, {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};