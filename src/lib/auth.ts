// auth.ts
import axios from './axios';
import { setStorageItem, removeStorageItem, getStorageItem } from './storage';
import Toast from 'react-native-toast-message';
import { CommonActions } from '@react-navigation/native';


export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    await setStorageItem('token', response.data.token);
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Registration failed',
    });
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<AuthResponse>('/auth/login', { email, password });
    await setStorageItem('token', response.data.token);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
    Toast.show({
      type: 'error',
      text1: 'Login Error',
      text2: errorMessage,
    });
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    await axios.post('/auth/forgot-password', { email });
    Toast.show({
      type: 'success',
      text1: 'Password reset instructions sent to your email',
    });
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Failed to send reset instructions',
    });
    throw error;
  }
};



export const logout = async (navigation: any) => {
  await removeStorageItem('token');

  // Show logout confirmation
  Toast.show({
    type: 'success',
    text1: 'Logged out successfully!',
  });

  // Ensure navigation works
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  );
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getStorageItem('token');
    return !!token; // Ensures it returns true/false properly
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false; // Ensure false is returned on failure
  }
};

