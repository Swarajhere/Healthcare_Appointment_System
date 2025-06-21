import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  age,
  gender
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      firstName,
      lastName,
      email,
      password,
      age,
      gender
    });
    return response.data; // { success: true, message: 'Registered successfully', data: {...} }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'API request failed');
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