import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api";

export const registerDoctor = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/doctor/register`, {
      ...data,
      status: "pending",
      isActive: false,
    });
    return {
      success: true,
      message: response.data.message || "Registration successful",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};