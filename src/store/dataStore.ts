import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  fetchLoginData,
  fetchQueryActivity,
  fetchLicenseeData,
  fetchACSParticipantData,
  type LoginDataResponse,
  type QueryActivityResponse,
  type LicenseeDataResponse,
  type ACSParticipantDataResponse,
  type LoginDataParams,
  type ACSParticipantParams,
  type LicenseeDataParams
} from '@/services/dataService';
import type { ApiError } from '@/services/api';

// Data types
export type LoginDataEntry = LoginDataResponse;
export type QueryActivityEntry = QueryActivityResponse;
export type LicenseeDataEntry = LicenseeDataResponse;
export type ACSParticipantDataEntry = ACSParticipantDataResponse;

// Store state interface
interface DataStore {
  // Data
  loginData: LoginDataEntry[];
  queryActivityData: QueryActivityEntry[];
  licenseeData: LicenseeDataEntry[];
  acsParticipantData: ACSParticipantDataEntry[];

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
  isACSParticipantDataLoading: boolean;

  // Error states
  errors: {
    loginData: ApiError | null;
    queryActivity: ApiError | null;
    licenseeData: ApiError | null;
    acsParticipantData: ApiError | null;
  };

  // Metadata
  lastFetchTime: number | null;
  isDataFromFallback: {
    loginData: boolean;
    queryActivity: boolean;
    licenseeData: boolean;
    acsParticipantData: boolean;
  };

  // Actions
  fetchAllData: () => Promise<void>;
  fetchLoginDataPaginated: (params?: LoginDataParams, append?: boolean) => Promise<void>;
  loadMoreLoginData: () => Promise<void>;
  fetchACSParticipantDataFiltered: (params?: ACSParticipantParams) => Promise<void>;
  fetchLicenseeDataFiltered: (params?: LicenseeDataParams) => Promise<void>;
  clearData: () => void;
  clearErrors: () => void;
  isDataStale: () => boolean;

  // Getters for backward compatibility
  getLoginData: () => LoginDataEntry[];
  getQueryActivityData: () => QueryActivityEntry[];
  getLicenseeData: () => LicenseeDataEntry[];

  // Get loading status for all data sources
  getLoadingStatuses: () => Array<{
    name: string;
    isLoading: boolean;
    isCompleted: boolean;
  }>;
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
      acsParticipantData: [],

      loginDataPagination: {
        currentPage: 1,
        pageSize: 99999,
        totalRecords: 0,
        loadedRecords: 0,
      },

      isLoading: false,
      isLoginDataLoading: false,
      isQueryActivityLoading: false,
      isLicenseeDataLoading: false,
      isACSParticipantDataLoading: false,

      errors: {
        loginData: null,
        queryActivity: null,
        licenseeData: null,
        acsParticipantData: null,
      },

      lastFetchTime: null,
      isDataFromFallback: {
        loginData: false,
        queryActivity: false,
        licenseeData: false,
        acsParticipantData: false,
      },

      // Fetch all data (uses pagination for login data)
      fetchAllData: async () => {
        set({
          isLoading: true,
          isLoginDataLoading: true,
          isQueryActivityLoading: true,
          isLicenseeDataLoading: true,
          isACSParticipantDataLoading: true,
        });

        try {
          // Fetch all data concurrently with pagination for login data
          const [loginDataResult, queryActivityResult, licenseeDataResult, acsParticipantDataResult] = await Promise.allSettled([
            fetchLoginData({ page: 1, page_size: 99999 }), // Fetch all records
            fetchQueryActivity({ page_size: 99999 }), // Fetch all records
            fetchLicenseeData(),
            fetchACSParticipantData(),
          ]);

          // Update login data with pagination
          if (loginDataResult.status === 'fulfilled') {
            set({
              loginData: loginDataResult.value.data,
              loginDataPagination: {
                currentPage: 1,
                pageSize: 99999,
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

          // Update ACS participant data
          if (acsParticipantDataResult.status === 'fulfilled') {
            console.log('Setting ACS participant data in store:', {
              dataLength: acsParticipantDataResult.value.data.length,
              isFromFallback: acsParticipantDataResult.value.isFromFallback,
              error: acsParticipantDataResult.value.error
            });
            set({
              acsParticipantData: acsParticipantDataResult.value.data,
              isACSParticipantDataLoading: false,
              errors: {
                ...get().errors,
                acsParticipantData: acsParticipantDataResult.value.error,
              },
              isDataFromFallback: {
                ...get().isDataFromFallback,
                acsParticipantData: acsParticipantDataResult.value.isFromFallback,
              },
            });
          } else {
            console.error('ACS participant data fetch failed:', acsParticipantDataResult);
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
            isACSParticipantDataLoading: false,
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
              pageSize: params?.page_size || 99999,
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

      // Fetch ACS participant data with filters
      fetchACSParticipantDataFiltered: async (params?: ACSParticipantParams) => {
        set({ isACSParticipantDataLoading: true });

        try {
          console.log('Fetching filtered ACS participant data...', params);
          const result = await fetchACSParticipantData(params);

          set({
            acsParticipantData: result.data,
            isACSParticipantDataLoading: false,
            errors: {
              ...get().errors,
              acsParticipantData: result.error,
            },
            isDataFromFallback: {
              ...get().isDataFromFallback,
              acsParticipantData: result.isFromFallback,
            },
            lastFetchTime: Date.now(),
          });
        } catch (error) {
          console.error('Error fetching filtered ACS participant data:', error);
          set({ isACSParticipantDataLoading: false });
        }
      },

      // Fetch licensee data with filters
      fetchLicenseeDataFiltered: async (params?: LicenseeDataParams) => {
        set({ isLicenseeDataLoading: true });

        try {
          console.log('Fetching filtered licensee data...', params);
          const result = await fetchLicenseeData(params);

          set({
            licenseeData: result.data,
            isLicenseeDataLoading: false,
            errors: {
              ...get().errors,
              licenseeData: result.error,
            },
            isDataFromFallback: {
              ...get().isDataFromFallback,
              licenseeData: result.isFromFallback,
            },
            lastFetchTime: Date.now(),
          });
        } catch (error) {
          console.error('Error fetching filtered licensee data:', error);
          set({ isLicenseeDataLoading: false });
        }
      },

      // Clear all data (called on logout)
      clearData: () => {
        set({
          loginData: [],
          queryActivityData: [],
          licenseeData: [],
          acsParticipantData: [],
          loginDataPagination: {
            currentPage: 1,
            pageSize: 99999,
            totalRecords: 0,
            loadedRecords: 0,
          },
          errors: {
            loginData: null,
            queryActivity: null,
            licenseeData: null,
            acsParticipantData: null,
          },
          lastFetchTime: null,
          isDataFromFallback: {
            loginData: false,
            queryActivity: false,
            licenseeData: false,
            acsParticipantData: false,
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
            acsParticipantData: null,
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

      // Get loading statuses for GlobalLoader
      getLoadingStatuses: () => {
        const state = get();
        return [
          {
            name: 'Login Activity Data',
            isLoading: state.isLoginDataLoading,
            isCompleted: !state.isLoginDataLoading && state.loginData.length > 0
          },
          {
            name: 'Query Activity Data',
            isLoading: state.isQueryActivityLoading,
            isCompleted: !state.isQueryActivityLoading && state.queryActivityData.length > 0
          },
          {
            name: 'Licensee Directory Data',
            isLoading: state.isLicenseeDataLoading,
            isCompleted: !state.isLicenseeDataLoading && state.licenseeData.length > 0
          },
          {
            name: 'ACS Participant Data',
            isLoading: state.isACSParticipantDataLoading,
            isCompleted: !state.isACSParticipantDataLoading && state.acsParticipantData.length > 0
          }
        ];
      },
    }),
    {
      name: 'data-storage', // localStorage key
      // Only persist data, not loading states or errors
      partialize: (state) => ({
        loginData: state.loginData,
        queryActivityData: state.queryActivityData,
        licenseeData: state.licenseeData,
        acsParticipantData: state.acsParticipantData,
        loginDataPagination: state.loginDataPagination,
        lastFetchTime: state.lastFetchTime,
        isDataFromFallback: state.isDataFromFallback,
      }),
    }
  )
);
