import axios, { type AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// Base API configuration
const BASE_URL = 'https://internal.ahrianalytics.org/api';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      console.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Generic API response wrapper type
export interface ApiResponse<T> {
  success: boolean;
  total_records?: number;
  data: T;
  message?: string;
}

// Error response type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
