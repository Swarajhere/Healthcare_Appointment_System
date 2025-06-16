import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { updateProfile } from '../redux/slices/authSlice'; 

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

export const getUserProfile = async (dispatch) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        message: 'No token found. Please log in.',
      };
    }

    // Decode token to get userId
    const decoded = jwtDecode(token);
    const userId = decoded.id; // Adjust 'id' to match your token's payload structure
    if (!userId) {
      return {
        success: false,
        message: 'Invalid token: User ID not found.',
      };
    }

    // Make API request with Authorization header
    const response = await axios.get(`${API_URL}/getuser/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Profile response:', response);

    if (response.data && response.data.user) {
      // Optionally dispatch Redux action to update profile
      dispatch && dispatch(updateProfile(response.data.user));

      return {
        success: true,
        message: response.data.message || 'Profile fetched successfully',
        user: response.data.user,
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to fetch profile',
      };
    }
  } catch (error) {
    console.error('Profile API error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'API request failed',
    };
  }
};