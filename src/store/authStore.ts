import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useDataStore } from './dataStore';

interface DecodedToken {
  sub: string;
  company: string[];
  hasCeoAccess: string[];
  companyAppAccess: string[];
  internalAppAccess: string[];
  indId: string;
  iat: number;
  exp: number;
}

interface AuthState {
  token: string | null;
  user: {
    email: string;
    company: string[];
    hasCeoAccess: string[];
    companyAppAccess: string[];
    internalAppAccess: string[];
    indId: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(
            'https://portal.ahrianalytics.org/api/api/auth',
            {
              username,
              password,
            }
          );
          console.log(response)
          const token = response.data.token;

          if (!token) {
            set({
              isLoading: false,
              error: 'No token received from server',
            });
            return false;
          }

          // Decode the JWT token
          const decoded: DecodedToken = jwtDecode(token);
          

          // Check if user has company access
          if (!decoded.company || decoded.company.length === 0) {
            set({
              isLoading: false,
              error: 'Access denied. No company associated with this account.',
            });
            return false;
          }

          // Store token and user data
          set({
            token,
            user: {
              email: decoded.sub,
              company: decoded.company,
              hasCeoAccess: decoded.hasCeoAccess,
              companyAppAccess: decoded.companyAppAccess,
              internalAppAccess: decoded.internalAppAccess,
              indId: decoded.indId,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message ||
              error.response?.statusText ||
              'Authentication failed. Please check your credentials.';
            set({
              isLoading: false,
              error: errorMessage,
            });
          } else {
            set({
              isLoading: false,
              error: 'An unexpected error occurred. Please try again.',
            });
          }
          return false;
        }
      },

      logout: () => {
        // Clear data store on logout
        useDataStore.getState().clearData();

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
