import apiClient from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', { username, password });
    const { token } = response.data;
    await AsyncStorage.setItem('auth_token', token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  } catch (error) {
    return false;
  }
}

export default {
  login,
  logout,
  isAuthenticated
};