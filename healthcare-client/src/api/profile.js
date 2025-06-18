import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { updateProfile } from '../redux/slice/authSlice'; 

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000/api';

export const getUserProfile = async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    console.log('getUserProfile: Token found:', !!token);
    if (!token) {
      return {
        success: false,
        message: 'No token found. Please log in.',
      };
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      console.log('getUserProfile: Decoded token:', decoded);
      userId = decoded.id; // Match backend JWT payload
    } catch (err) {
      console.error('getUserProfile: Token decode error:', err);
      return {
        success: false,
        message: 'Invalid token format.',
      };
    }

    if (!userId) {
      return {
        success: false,
        message: 'Invalid token: User ID not found.',
      };
    }

    const response = await axios.get(`${API_URL}/getuser/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('getUserProfile: API response:', response.data);

    if (response.data && response.data.user) {
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
    console.error('getUserProfile: API error:', error.response?.data || error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      return {
        success: false,
        message: 'Session expired or unauthorized. Please log in again.',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'API request failed',
    };
  }
};

export const updateUserProfile = async (userId, data, dispatch) => {
  try {
    const token = localStorage.getItem('token');
    console.log('updateUserProfile: Token found:', !!token);
    if (!token) {
      return {
        success: false,
        message: 'No token found. Please log in.',
      };
    }

    const response = await axios.put(`${API_URL}/updateuser/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('updateUserProfile: API response:', response.data);

    if (response.data && response.data.user) {
      dispatch && dispatch(updateProfile(response.data.user));
      return {
        success: true,
        message: response.data.message || 'Profile updated successfully',
        user: response.data.user,
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Failed to update profile',
      };
    }
  } catch (error) {
    console.error('updateUserProfile: API error:', error.response?.data || error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      return {
        success: false,
        message: 'Session expired or unauthorized. Please log in again.',
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'API request failed',
    };
  }
};