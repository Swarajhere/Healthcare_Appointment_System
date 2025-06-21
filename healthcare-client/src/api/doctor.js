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

export const checkEmail = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-email`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to check email");
  }
};

export const sendOtp = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-otp`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
};