import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchAllData as fetchAllDataService,
  type LoginDataResponse,
  type QueryActivityResponse,
  type LicenseeDataResponse
} from '@/services/dataService';
import type { ApiError } from '@/services/api';

// Data types
export type LoginDataEntry = LoginDataResponse;
export type QueryActivityEntry = QueryActivityResponse;
export type LicenseeDataEntry = LicenseeDataResponse;

// Store state interface
interface DataStore {
  // Data
  loginData: LoginDataEntry[];
  queryActivityData: QueryActivityEntry[];
  licenseeData: LicenseeDataEntry[];

  // Loading states
  isLoading: boolean;
  isLoginDataLoading: boolean;
  isQueryActivityLoading: boolean;
  isLicenseeDataLoading: boolean;

  // Error states
  errors: {
    loginData: ApiError | null;
    queryActivity: ApiError | null;
    licenseeData: ApiError | null;
  };

  // Metadata
  lastFetchTime: number | null;
  isDataFromFallback: {
    loginData: boolean;
    queryActivity: boolean;
    licenseeData: boolean;
  };

  // Actions
  fetchAllData: () => Promise<void>;
  clearData: () => void;
  clearErrors: () => void;
  isDataStale: () => boolean;

  // Getters for backward compatibility
  getLoginData: () => LoginDataEntry[];
  getQueryActivityData: () => QueryActivityEntry[];
  getLicenseeData: () => LicenseeDataEntry[];
}

// Stale data threshold (1 hour)
const STALE_DATA_THRESHOLD = 60 * 60 * 1000;

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial state
      loginData: [],
      queryActivityData: [],
      licenseeData: [],

      isLoading: false,
      isLoginDataLoading: false,
      isQueryActivityLoading: false,
      isLicenseeDataLoading: false,

      errors: {
        loginData: null,
        queryActivity: null,
        licenseeData: null,
      },

      lastFetchTime: null,
      isDataFromFallback: {
        loginData: false,
        queryActivity: false,
        licenseeData: false,
      },

      // Fetch all data
      fetchAllData: async () => {
        set({
          isLoading: true,
          isLoginDataLoading: true,
          isQueryActivityLoading: true,
          isLicenseeDataLoading: true,
        });

        try {
          const result = await fetchAllDataService();

          // Update login data
          if (result.loginData) {
            set({
              loginData: result.loginData.data,
              isLoginDataLoading: false,
              errors: {
                ...get().errors,
                loginData: result.loginData.error,
              },
              isDataFromFallback: {
                ...get().isDataFromFallback,
                loginData: result.loginData.isFromFallback,
              },
            });
          }

          // Update query activity data
          if (result.queryActivity) {
            set({
              queryActivityData: result.queryActivity.data,
              isQueryActivityLoading: false,
              errors: {
                ...get().errors,
                queryActivity: result.queryActivity.error,
              },
              isDataFromFallback: {
                ...get().isDataFromFallback,
                queryActivity: result.queryActivity.isFromFallback,
              },
            });
          }

          // Update licensee data
          if (result.licenseeData) {
            set({
              licenseeData: result.licenseeData.data,
              isLicenseeDataLoading: false,
              errors: {
                ...get().errors,
                licenseeData: result.licenseeData.error,
              },
              isDataFromFallback: {
                ...get().isDataFromFallback,
                licenseeData: result.licenseeData.isFromFallback,
              },
            });
          }

          set({
            isLoading: false,
            lastFetchTime: Date.now(),
          });
        } catch (error) {
          console.error('Critical error fetching all data:', error);
          set({
            isLoading: false,
            isLoginDataLoading: false,
            isQueryActivityLoading: false,
            isLicenseeDataLoading: false,
          });
        }
      },

      // Clear all data (called on logout)
      clearData: () => {
        set({
          loginData: [],
          queryActivityData: [],
          licenseeData: [],
          errors: {
            loginData: null,
            queryActivity: null,
            licenseeData: null,
          },
          lastFetchTime: null,
          isDataFromFallback: {
            loginData: false,
            queryActivity: false,
            licenseeData: false,
          },
        });
      },

      // Clear errors
      clearErrors: () => {
        set({
          errors: {
            loginData: null,
            queryActivity: null,
            licenseeData: null,
          },
        });
      },

      // Check if data is stale
      isDataStale: () => {
        const lastFetch = get().lastFetchTime;
        if (!lastFetch) return true;
        return Date.now() - lastFetch > STALE_DATA_THRESHOLD;
      },

      // Getters
      getLoginData: () => get().loginData,
      getQueryActivityData: () => get().queryActivityData,
      getLicenseeData: () => get().licenseeData,
    }),
    {
      name: 'data-storage', // localStorage key
      // Only persist data, not loading states or errors
      partialize: (state) => ({
        loginData: state.loginData,
        queryActivityData: state.queryActivityData,
        licenseeData: state.licenseeData,
        lastFetchTime: state.lastFetchTime,
        isDataFromFallback: state.isDataFromFallback,
      }),
    }
  )
);
