import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchLoginData,
  fetchQueryActivity,
  fetchLicenseeData,
  type LoginDataResponse,
  type QueryActivityResponse,
  type LicenseeDataResponse,
  type LoginDataParams
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

  // Pagination state for login data
  loginDataPagination: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    loadedRecords: number;
  };

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
  fetchLoginDataPaginated: (params?: LoginDataParams, append?: boolean) => Promise<void>;
  loadMoreLoginData: () => Promise<void>;
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

      loginDataPagination: {
        currentPage: 1,
        pageSize: 100,
        totalRecords: 0,
        loadedRecords: 0,
      },

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

      // Fetch all data (uses pagination for login data)
      fetchAllData: async () => {
        set({
          isLoading: true,
          isLoginDataLoading: true,
          isQueryActivityLoading: true,
          isLicenseeDataLoading: true,
        });

        try {
          // Fetch all data concurrently with pagination for login data
          const [loginDataResult, queryActivityResult, licenseeDataResult] = await Promise.allSettled([
            fetchLoginData({ page: 1, page_size: 100 }), // Default pagination
            fetchQueryActivity(),
            fetchLicenseeData(),
          ]);

          // Update login data with pagination
          if (loginDataResult.status === 'fulfilled') {
            set({
              loginData: loginDataResult.value.data,
              loginDataPagination: {
                currentPage: 1,
                pageSize: 100,
                totalRecords: loginDataResult.value.totalRecords,
                loadedRecords: loginDataResult.value.data.length,
              },
              isLoginDataLoading: false,
              errors: {
                ...get().errors,
                loginData: loginDataResult.value.error,
              },
              isDataFromFallback: {
                ...get().isDataFromFallback,
                loginData: loginDataResult.value.isFromFallback,
              },
            });
          }

          // Update query activity data
          if (queryActivityResult.status === 'fulfilled') {
            set({
              queryActivityData: queryActivityResult.value.data,
              isQueryActivityLoading: false,
              errors: {
                ...get().errors,
                queryActivity: queryActivityResult.value.error,
              },
              isDataFromFallback: {
                ...get().isDataFromFallback,
                queryActivity: queryActivityResult.value.isFromFallback,
              },
            });
          }

          // Update licensee data
          if (licenseeDataResult.status === 'fulfilled') {
            set({
              licenseeData: licenseeDataResult.value.data,
              isLicenseeDataLoading: false,
              errors: {
                ...get().errors,
                licenseeData: licenseeDataResult.value.error,
              },
              isDataFromFallback: {
                ...get().isDataFromFallback,
                licenseeData: licenseeDataResult.value.isFromFallback,
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

      // Fetch login data with pagination
      fetchLoginDataPaginated: async (params?: LoginDataParams, append = false) => {
        set({ isLoginDataLoading: true });

        try {
          const result = await fetchLoginData(params);

          const currentData = get().loginData;
          const newData = append ? [...currentData, ...result.data] : result.data;

          set({
            loginData: newData,
            isLoginDataLoading: false,
            loginDataPagination: {
              currentPage: params?.page || 1,
              pageSize: params?.page_size || 100,
              totalRecords: result.totalRecords,
              loadedRecords: newData.length,
            },
            errors: {
              ...get().errors,
              loginData: result.error,
            },
            isDataFromFallback: {
              ...get().isDataFromFallback,
              loginData: result.isFromFallback,
            },
            lastFetchTime: Date.now(),
          });
        } catch (error) {
          console.error('Error fetching paginated login data:', error);
          set({ isLoginDataLoading: false });
        }
      },

      // Load more login data (incremental pagination)
      loadMoreLoginData: async () => {
        const { loginDataPagination } = get();
        const nextPage = loginDataPagination.currentPage + 1;

        await get().fetchLoginDataPaginated(
          {
            page: nextPage,
            page_size: loginDataPagination.pageSize,
          },
          true // append = true
        );
      },

      // Clear all data (called on logout)
      clearData: () => {
        set({
          loginData: [],
          queryActivityData: [],
          licenseeData: [],
          loginDataPagination: {
            currentPage: 1,
            pageSize: 100,
            totalRecords: 0,
            loadedRecords: 0,
          },
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
        loginDataPagination: state.loginDataPagination,
        lastFetchTime: state.lastFetchTime,
        isDataFromFallback: state.isDataFromFallback,
      }),
    }
  )
);
