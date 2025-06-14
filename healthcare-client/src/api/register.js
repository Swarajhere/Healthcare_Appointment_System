import axios from 'axios';
// console.log(import.meta.env.VITE_APP_API_URL);
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

export const registerUser = async ({ name, age, gender, username, password }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      age,
      gender,
      username,
      password,
    });
    return response.data; // Expecting { success: true, message: '...', data: {...} }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'API request failed');
  }
};