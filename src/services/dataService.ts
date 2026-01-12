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

export interface OEMPMBDataResponse {
  "OEM Name": string;
  "OEM ORG ID": string;
  "PBM Name": string | null;
  "PBM ORG ID": string | null;
  "Program": string;
  "Status": string;
  "Total Active & PS": number;
  "Active": number;
  "Production Stopped": number;
  "Discontinued": number;
  "Obsolete (min and other)": number;
}

export interface ACSParticipantDataResponse {
  manufacturernamerev: string;
  oemnetforumcompanyid: string;
  programname: string;
  total_tests: number;
  fail_rate: number;
}

/**
 * Filter parameters for ACS participant data
 */
export interface ACSParticipantParams {
  year?: string;
  program?: string;
  manufacturer?: string;
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
  page?: number;
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
 * Fetch query activity data with automatic pagination
 * Endpoint: /api/query-activity
 * Fetches all pages until data array is empty, then aggregates
 * Returns empty array on failure
 */
export const fetchQueryActivity = async (params: QueryActivityParams = {}): Promise<{
  data: QueryActivityResponse[];
  error: ApiError | null;
  isFromFallback: boolean;
}> => {
  try {
    const allRawLogs: RawQueryLog[] = [];
    let currentPage = 1;
    let hasMoreData = true;
    const pageSize = params.page_size || 99999;

    console.log('Starting query activity fetch with pagination...');

    // Loop through pages until data is empty
    while (hasMoreData) {
      // Build query params for current page
      const queryParams: Record<string, string> = {
        page: String(currentPage),
        page_size: String(pageSize),
      };

      if (params.start_date) queryParams.start_date = params.start_date;
      if (params.end_date) queryParams.end_date = params.end_date;
      if (params.operation_name) queryParams.operation_name = params.operation_name;
      if (params.email) queryParams.email = params.email;

      console.log(`Fetching page ${currentPage}...`);

      const response = await apiClient.get<ApiResponse<RawQueryLog[]>>('/api/query-activity', {
        params: queryParams
      });

      if (response.data.success) {
        const pageData = response.data.data || [];

        console.log(`Page ${currentPage}: Retrieved ${pageData.length} records. Total so far: ${allRawLogs.length + pageData.length}`);

        // Check if data array is empty (no more pages)
        if (pageData.length === 0) {
          hasMoreData = false;
          console.log('No more data, stopping pagination');
        } else {
          // Accumulate the data
          allRawLogs.push(...pageData);
          currentPage++;
        }
      } else {
        console.warn(`API returned unsuccessful response on page ${currentPage}`);
        hasMoreData = false;
      }
    }

    console.log(`Pagination complete. Total records fetched: ${allRawLogs.length}`);

    // Aggregate all accumulated logs
    const aggregatedData = aggregateQueryLogs(allRawLogs);

    return {
      data: aggregatedData,
      error: null,
      isFromFallback: false,
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
 * Fetch ACS participant data
 * Endpoint: /api/acs
 * Returns empty array on failure
 */
export const fetchACSParticipantData = async (params: ACSParticipantParams = {}): Promise<{
  data: ACSParticipantDataResponse[];
  error: ApiError | null;
  isFromFallback: boolean;
}> => {
  try {
    // Build query params, only include defined values
    const queryParams: Record<string, string> = {};

    if (params.year) queryParams.year = params.year;
    if (params.program) queryParams.program = params.program;
    if (params.manufacturer) queryParams.manufacturer = params.manufacturer;

    console.log('Fetching ACS participant data from /api/acs...', queryParams);
    const response = await apiClient.get<ApiResponse<ACSParticipantDataResponse[]>>('/api/acs', {
      params: queryParams
    });

    console.log('ACS participant API response:', {
      success: response.data.success,
      totalRecords: response.data.total_records,
      dataLength: response.data.data?.length || 0
    });

    if (response.data.success && response.data.data) {
      console.log(`Successfully fetched ${response.data.data.length} ACS participant records`);
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
    console.error('Error fetching ACS participant data:', error);

    return {
      data: [],
      error: {
        message: error.response?.data?.message || error.message || 'Failed to fetch ACS participant data',
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
  const [loginData, queryActivity, licenseeData, acsParticipantData] = await Promise.allSettled([
    fetchLoginData(),
    fetchQueryActivity(),
    fetchLicenseeData(),
    fetchACSParticipantData(),
  ]);

  return {
    loginData: loginData.status === 'fulfilled' ? loginData.value : null,
    queryActivity: queryActivity.status === 'fulfilled' ? queryActivity.value : null,
    licenseeData: licenseeData.status === 'fulfilled' ? licenseeData.value : null,
    acsParticipantData: acsParticipantData.status === 'fulfilled' ? acsParticipantData.value : null,
  };
};
