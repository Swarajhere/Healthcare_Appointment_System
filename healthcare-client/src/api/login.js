import axios from "axios";
import { loginSuccess } from "../redux/slice/authSlice";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api";

export const loginUser = async ({ email, password }, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data && response.data.user) {
      dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
      return {
        success: true,
        message: response.data.message || "Login successful",
        user: response.data.user,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "API request failed",
    };
  }
};