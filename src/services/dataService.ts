import { apiClient, type ApiResponse, type ApiError } from './api';

// Define API response types matching the structure
export interface LoginDataResponse {
  datetime: string;
  username: string;
  firstName: string;
  lastName: string;
  company: string;
}

// Raw query log from API
export interface RawQueryLog {
  _id: string;
  email: string;
  timestamp: string;
  operationName: string;
  timestamp_parsed: string;
  date: string;
  hour: number;
  day_of_week: string;
  year_month_str: string;
}

// Aggregated query activity (what components expect)
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
 * Pagination and filter parameters for login data
 */
export interface LoginDataParams {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  company?: string;
  username?: string;
}

/**
 * Pagination and filter parameters for query activity data
 */
export interface QueryActivityParams {
  page_size?: number;
  start_date?: string;
  end_date?: string;
  operation_name?: string;
  email?: string;
}

/**
 * Fetch login activity data
 * Endpoint: /api/login-data
 * Returns empty array on failure
 */
export const fetchLoginData = async (params: LoginDataParams = {}): Promise<{
  data: LoginDataResponse[];
  totalRecords: number;
  error: ApiError | null;
  isFromFallback: boolean;
}> => {
  try {
    // Build query params, only include defined values
    const queryParams: Record<string, string> = {};

    if (params.page !== undefined) queryParams.page = String(params.page);
    if (params.page_size !== undefined) queryParams.page_size = String(params.page_size);
    if (params.start_date) queryParams.start_date = params.start_date;
    if (params.end_date) queryParams.end_date = params.end_date;
    if (params.company) queryParams.company = params.company;
    if (params.username) queryParams.username = params.username;

    const response = await apiClient.get<ApiResponse<LoginDataResponse[]>>('/api/login-data', {
      params: queryParams
    });

    if (response.data.success && response.data.data) {
      return {
        data: response.data.data,
        totalRecords: response.data.total_records || 0,
        error: null,
        isFromFallback: false,
      };
    }

    // API returned unsuccessful response, return empty array
    console.warn('API returned unsuccessful response, no data available');
    return {
      data: [],
      totalRecords: 0,
      error: { message: response.data.message || 'Unsuccessful API response' },
      isFromFallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching login data:', error);

    // Return empty array on error
    return {
      data: [],
      totalRecords: 0,
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch login data',
        status: error.response?.status,
      },
      isFromFallback: true,
    };
  }
};

/**
 * Aggregate raw query logs into operation summaries
 */
function aggregateQueryLogs(rawLogs: RawQueryLog[]): QueryActivityResponse[] {
  const operationMap = new Map<string, {
    count: number;
    users: Set<string>;
    firstTimestamp: Date;
    lastTimestamp: Date;
  }>();

  rawLogs.forEach((log) => {
    const operation = log.operationName;
    const timestamp = new Date(log.timestamp_parsed || log.timestamp);

    if (!operationMap.has(operation)) {
      operationMap.set(operation, {
        count: 0,
        users: new Set(),
        firstTimestamp: timestamp,
        lastTimestamp: timestamp
      });
    }

    const opData = operationMap.get(operation)!;
    opData.count++;
    opData.users.add(log.email);

    if (timestamp < opData.firstTimestamp) {
      opData.firstTimestamp = timestamp;
    }
    if (timestamp > opData.lastTimestamp) {
      opData.lastTimestamp = timestamp;
    }
  });

  // Convert to array and sort by count descending
  return Array.from(operationMap.entries())
    .map(([operation, data]) => ({
      operation,
      count: data.count,
      uniqueUsers: data.users.size,
      firstQuery: data.firstTimestamp.toISOString().slice(0, 16).replace('T', ' '),
      lastQuery: data.lastTimestamp.toISOString().slice(0, 16).replace('T', ' ')
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Fetch query activity data
 * Endpoint: /api/query-activity
 * Returns empty array on failure
 */
export const fetchQueryActivity = async (params: QueryActivityParams = {}): Promise<{
  data: QueryActivityResponse[];
  error: ApiError | null;
  isFromFallback: boolean;
}> => {
  try {
    // Build query params, only include defined values
    const queryParams: Record<string, string> = {};

    if (params.page_size !== undefined) queryParams.page_size = String(params.page_size);
    if (params.start_date) queryParams.start_date = params.start_date;
    if (params.end_date) queryParams.end_date = params.end_date;
    if (params.operation_name) queryParams.operation_name = params.operation_name;
    if (params.email) queryParams.email = params.email;

    const response = await apiClient.get<ApiResponse<RawQueryLog[]>>('/api/query-activity', {
      params: queryParams
    });

    if (response.data.success && response.data.data) {
      // Aggregate the raw logs into operation summaries
      const aggregatedData = aggregateQueryLogs(response.data.data);

      return {
        data: aggregatedData,
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
