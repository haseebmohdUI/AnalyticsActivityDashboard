import { apiClient, type ApiResponse, type ApiError } from './api';

// Define API response types matching the structure
export interface LoginDataResponse {
  datetime: string;
  username: string;
  firstName: string;
  lastName: string;
  company: string;
}

export interface QueryActivityResponse {
  operation: string;
  count: number;
  uniqueUsers: number;
  firstQuery: string;
  lastQuery: string;
}

export interface LicenseeDataResponse {
  "OEM Name": string;
  "OEM ORG ID": string;
  "PBM Name": string;
  "PBM ORG ID": string;
  "Program": string;
  "Status": string;
  "Total Active & PS": number;
  "Active": number;
  "Production Stopped": number;
  "Discontinued": number;
  "Obsolete (min and other)": number;
  "total_tests": string | number;
  "fail_rate": string | number;
}

/**
 * Fetch login activity data
 * Endpoint: /api/login-data
 * Returns empty array on failure
 */
export const fetchLoginData = async (): Promise<{
  data: LoginDataResponse[];
  error: ApiError | null;
  isFromFallback: boolean;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<LoginDataResponse[]>>('/api/login-data');

    if (response.data.success && response.data.data) {
      return {
        data: response.data.data,
        error: null,
        isFromFallback: false,
      };
    }

    // API returned unsuccessful response, return empty array
    console.warn('API returned unsuccessful response, no data available');
    return {
      data: [],
      error: { message: response.data.message || 'Unsuccessful API response' },
      isFromFallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching login data:', error);

    // Return empty array on error
    return {
      data: [],
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch login data',
        status: error.response?.status,
      },
      isFromFallback: true,
    };
  }
};

/**
 * Fetch query activity data
 * Endpoint: /api/query-activity
 * Returns empty array on failure
 */
export const fetchQueryActivity = async (): Promise<{
  data: QueryActivityResponse[];
  error: ApiError | null;
  isFromFallback: boolean;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<QueryActivityResponse[]>>('/api/query-activity');

    if (response.data.success && response.data.data) {
      return {
        data: response.data.data,
        error: null,
        isFromFallback: false,
      };
    }

    console.warn('API returned unsuccessful response, no data available');
    return {
      data: [],
      error: { message: response.data.message || 'Unsuccessful API response' },
      isFromFallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching query activity data:', error);

    return {
      data: [],
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch query activity',
        status: error.response?.status,
      },
      isFromFallback: true,
    };
  }
};

/**
 * Fetch licensee data
 * Endpoint: /api/licensee
 * Returns empty array on failure
 */
export const fetchLicenseeData = async (): Promise<{
  data: LicenseeDataResponse[];
  error: ApiError | null;
  isFromFallback: boolean;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<LicenseeDataResponse[]>>('/api/licensee');

    if (response.data.success && response.data.data) {
      return {
        data: response.data.data,
        error: null,
        isFromFallback: false,
      };
    }

    console.warn('API returned unsuccessful response, no data available');
    return {
      data: [],
      error: { message: response.data.message || 'Unsuccessful API response' },
      isFromFallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching licensee data:', error);

    return {
      data: [],
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch licensee data',
        status: error.response?.status,
      },
      isFromFallback: true,
    };
  }
};

/**
 * Fetch all data concurrently
 * This is the main function to be called after login
 */
export const fetchAllData = async () => {
  const [loginData, queryActivity, licenseeData] = await Promise.allSettled([
    fetchLoginData(),
    fetchQueryActivity(),
    fetchLicenseeData(),
  ]);

  return {
    loginData: loginData.status === 'fulfilled' ? loginData.value : null,
    queryActivity: queryActivity.status === 'fulfilled' ? queryActivity.value : null,
    licenseeData: licenseeData.status === 'fulfilled' ? licenseeData.value : null,
  };
};
