import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data; // Expecting { success: true, message: '...', data: {...} }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'API request failed');
  }
};