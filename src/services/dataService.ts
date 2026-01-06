import { apiClient, type ApiResponse, type ApiError } from './api';

// Import fallback data
import rawDataFallback from '@/store/rawData.json';
import allLicenseesFallback from '@/store/AllLicenseesRawData.json';

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

// Fallback data for query activity (from QueryAnalysisChart.tsx)
const queryActivityFallback: QueryActivityResponse[] = [
  { operation: 'FirstTestSummary', count: 5268, uniqueUsers: 211, firstQuery: '2022-02-07 19:06', lastQuery: '2025-12-18 14:32' },
  { operation: 'SelectionInfo', count: 4969, uniqueUsers: 62, firstQuery: '2022-02-08 22:35', lastQuery: '2025-12-18 02:54' },
  { operation: 'FailRateHistory', count: 3904, uniqueUsers: 86, firstQuery: '2022-02-08 22:36', lastQuery: '2025-12-18 14:31' },
  { operation: 'AuditQuery', count: 3900, uniqueUsers: 125, firstQuery: '2022-02-04 20:10', lastQuery: '2025-12-18 14:31' },
  { operation: 'RatingRatioArr', count: 3508, uniqueUsers: 82, firstQuery: '2022-02-07 19:19', lastQuery: '2025-12-18 14:32' },
  { operation: 'getRecordFromNextGenRenamed', count: 3035, uniqueUsers: 34, firstQuery: '2023-11-30 16:54', lastQuery: '2025-12-18 02:54' },
  { operation: 'ResultReportType', count: 2712, uniqueUsers: 56, firstQuery: '2022-02-08 22:35', lastQuery: '2025-12-17 01:17' },
  { operation: 'AllProgramFirstTestSummary', count: 2218, uniqueUsers: 201, firstQuery: '2022-02-07 19:06', lastQuery: '2025-12-18 02:52' },
  { operation: 'LocationAllProgramFirstTestSummary', count: 1316, uniqueUsers: 162, firstQuery: '2022-02-07 19:06', lastQuery: '2025-12-18 02:52' },
  { operation: 'getPublicNotification', count: 792, uniqueUsers: 115, firstQuery: '2022-03-02 19:19', lastQuery: '2025-12-18 16:06' },
  { operation: 'getDirectoryFilerItems', count: 351, uniqueUsers: 91, firstQuery: '2022-02-08 22:34', lastQuery: '2025-12-18 14:33' },
  { operation: 'DecisionSummary', count: 341, uniqueUsers: 76, firstQuery: '2022-02-07 19:16', lastQuery: '2025-12-18 14:32' },
  { operation: 'singleVarRecordPaginated', count: 295, uniqueUsers: 45, firstQuery: '2022-02-08 22:37', lastQuery: '2025-10-06 14:30' },
  { operation: 'getRecordSingleVarACS', count: 240, uniqueUsers: 45, firstQuery: '2022-02-08 22:37', lastQuery: '2025-10-06 14:30' },
  { operation: 'getAllEmployeeWithCeoAccess', count: 232, uniqueUsers: 124, firstQuery: '2022-02-09 17:03', lastQuery: '2025-12-18 14:33' },
  { operation: 'SelectedVariable', count: 185, uniqueUsers: 67, firstQuery: '2022-02-08 22:37', lastQuery: '2025-12-18 14:33' },
  { operation: 'ushpHspfEnforcePrediction', count: 180, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
  { operation: 'ushpSeerEnforcePrediction', count: 176, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
  { operation: 'ushpHspfPrediction', count: 174, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
  { operation: 'ushpSeerPrediction', count: 174, uniqueUsers: 19, firstQuery: '2022-02-09 17:10', lastQuery: '2025-12-18 02:54' },
  { operation: 'updateUserCompanyAccess', count: 150, uniqueUsers: 32, firstQuery: '2022-02-14 21:48', lastQuery: '2025-09-04 18:06' },
  { operation: 'sendEmail', count: 150, uniqueUsers: 32, firstQuery: '2022-02-14 21:48', lastQuery: '2025-09-04 18:06' },
  { operation: 'singleVarRecordPaginatedOthers', count: 136, uniqueUsers: 29, firstQuery: '2022-02-08 22:38', lastQuery: '2025-10-06 14:30' },
  { operation: 'rwhUefenforcePrediction', count: 132, uniqueUsers: 12, firstQuery: '2022-02-08 22:35', lastQuery: '2025-08-06 15:46' },
  { operation: 'rwhUefPrediction', count: 129, uniqueUsers: 12, firstQuery: '2022-02-08 22:35', lastQuery: '2025-08-06 15:46' },
  { operation: 'getPageRecord', count: 123, uniqueUsers: 27, firstQuery: '2022-03-04 06:25', lastQuery: '2025-06-25 12:55' },
  { operation: 'usacSeerEnforcePrediction', count: 120, uniqueUsers: 15, firstQuery: '2022-02-11 16:35', lastQuery: '2025-12-03 16:56' },
  { operation: 'usacSeerPrediction', count: 120, uniqueUsers: 15, firstQuery: '2022-02-11 16:35', lastQuery: '2025-12-03 16:56' },
  { operation: 'getPageRecordSingleVarOthersHistogram', count: 66, uniqueUsers: 1, firstQuery: '2025-05-12 14:16', lastQuery: '2025-05-13 14:19' },
  { operation: 'rfrnAfueEnforcePrediction', count: 53, uniqueUsers: 13, firstQuery: '2022-02-09 17:18', lastQuery: '2025-12-05 15:20' },
  { operation: 'rfrnAfuePrediction', count: 53, uniqueUsers: 13, firstQuery: '2022-02-09 17:18', lastQuery: '2025-12-05 15:20' },
  { operation: 'AhriTestsWithDecisions', count: 41, uniqueUsers: 13, firstQuery: '2022-02-09 17:03', lastQuery: '2025-10-01 16:05' },
  { operation: 'getCompanyInfo', count: 35, uniqueUsers: 2, firstQuery: '2023-08-29 18:01', lastQuery: '2024-01-05 17:09' },
  { operation: 'getAllEmployeeInCompany', count: 30, uniqueUsers: 1, firstQuery: '2023-12-19 15:03', lastQuery: '2024-01-05 17:09' },
  { operation: 'uleIeerEnforcePrediction', count: 22, uniqueUsers: 9, firstQuery: '2022-05-03 14:14', lastQuery: '2025-11-19 02:57' },
  { operation: 'uleIeerPrediction', count: 22, uniqueUsers: 9, firstQuery: '2022-05-03 14:14', lastQuery: '2025-11-19 02:57' },
  { operation: 'getCompanyHierarchyStructured', count: 14, uniqueUsers: 2, firstQuery: '2023-08-29 18:00', lastQuery: '2024-01-10 21:21' },
  { operation: 'rblrAfuePrediction', count: 10, uniqueUsers: 6, firstQuery: '2022-06-29 17:06', lastQuery: '2025-05-23 12:53' },
  { operation: 'rblrAfueEnforcePrediction', count: 10, uniqueUsers: 6, firstQuery: '2022-06-29 17:06', lastQuery: '2025-05-23 12:53' },
  { operation: 'getPageRecordRange', count: 4, uniqueUsers: 3, firstQuery: '2022-02-08 22:39', lastQuery: '2022-04-08 21:04' },
  { operation: 'getRecord', count: 2, uniqueUsers: 1, firstQuery: '2023-04-30 14:33', lastQuery: '2023-04-30 14:33' },
  { operation: 'allParticipants', count: 1, uniqueUsers: 1, firstQuery: '2025-11-05 16:58', lastQuery: '2025-11-05 16:58' },
];

/**
 * Fetch login activity data
 * Endpoint: /api/login-data
 * Fallback: rawData.json
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

    // API returned unsuccessful response, use fallback
    console.warn('API returned unsuccessful response, using fallback data');
    return {
      data: rawDataFallback as LoginDataResponse[],
      error: { message: response.data.message || 'Unsuccessful API response' },
      isFromFallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching login data:', error);

    // Use fallback data on error
    return {
      data: rawDataFallback as LoginDataResponse[],
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
 * Fallback: Hardcoded array from QueryAnalysisChart
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

    console.warn('API returned unsuccessful response, using fallback data');
    return {
      data: queryActivityFallback,
      error: { message: response.data.message || 'Unsuccessful API response' },
      isFromFallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching query activity data:', error);

    return {
      data: queryActivityFallback,
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
 * Fallback: AllLicenseesRawData.json
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

    console.warn('API returned unsuccessful response, using fallback data');
    return {
      data: allLicenseesFallback as LicenseeDataResponse[],
      error: { message: response.data.message || 'Unsuccessful API response' },
      isFromFallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching licensee data:', error);

    return {
      data: allLicenseesFallback as LicenseeDataResponse[],
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
