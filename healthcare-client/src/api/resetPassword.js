import axios from "axios";
const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api";

export const resetPassword = async ({ oldPassword, newPassword, confirmPassword     }) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await axios.post(
      `${API_URL}/reset-password`,
      {
        oldPassword,
        newPassword,
        confirmPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};