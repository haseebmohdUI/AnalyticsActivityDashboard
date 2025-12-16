import { create } from 'zustand';

export interface CompanyData {
  company: string;
  totalLogins: number;
  uniqueUsers: number;
  firstLogin: string;
  lastLogin: string;
}

interface AnalyticsStore {
  companyData: CompanyData[];
  setCompanyData: (data: CompanyData[]) => void;
  getTopCompaniesByLogins: (limit: number) => CompanyData[];
  getTopCompaniesByUsers: (limit: number) => CompanyData[];
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  companyData: [
    { company: "Rheem Sales Company, Inc.", totalLogins: 347, uniqueUsers: 13, firstLogin: "2021-03-29", lastLogin: "2025-10-31" },
    { company: "A. O. Smith Corporation", totalLogins: 292, uniqueUsers: 8, firstLogin: "2021-10-18", lastLogin: "2025-12-04" },
    { company: "Johnson Controls, Inc.", totalLogins: 248, uniqueUsers: 10, firstLogin: "2021-04-05", lastLogin: "2025-03-31" },
    { company: "Lochinvar, LLC", totalLogins: 245, uniqueUsers: 6, firstLogin: "2021-03-24", lastLogin: "2025-12-04" },
    { company: "Rheem Manufacturing Company", totalLogins: 182, uniqueUsers: 8, firstLogin: "2021-03-29", lastLogin: "2025-10-31" },
    { company: "Hajoca Corporation", totalLogins: 169, uniqueUsers: 1, firstLogin: "2021-04-13", lastLogin: "2025-10-31" },
    { company: "American Water Heaters", totalLogins: 166, uniqueUsers: 1, firstLogin: "2021-03-24", lastLogin: "2025-12-04" },
    { company: "A.O. Smith Enterprises, LTD.", totalLogins: 166, uniqueUsers: 1, firstLogin: "2021-03-24", lastLogin: "2025-12-04" },
    { company: "Carrier Corporation", totalLogins: 166, uniqueUsers: 19, firstLogin: "2021-04-16", lastLogin: "2025-12-05" },
    { company: "Nortek Global HVAC LLC", totalLogins: 133, uniqueUsers: 7, firstLogin: "2021-10-18", lastLogin: "2024-11-20" },
    { company: "LG Electronics, Inc.", totalLogins: 107, uniqueUsers: 4, firstLogin: "2021-07-07", lastLogin: "2025-06-16" },
    { company: "Laars Heating Systems Company", totalLogins: 86, uniqueUsers: 3, firstLogin: "2021-04-16", lastLogin: "2025-10-06" },
    { company: "Bradford White Corp.", totalLogins: 86, uniqueUsers: 2, firstLogin: "2021-04-16", lastLogin: "2025-10-06" },
    { company: "Trane U.S. Inc.", totalLogins: 83, uniqueUsers: 10, firstLogin: "2021-03-25", lastLogin: "2025-05-20" },
    { company: "R. E. Michel Company, LLC", totalLogins: 72, uniqueUsers: 2, firstLogin: "2021-03-25", lastLogin: "2025-10-31" },
    { company: "Navien, Inc.", totalLogins: 70, uniqueUsers: 8, firstLogin: "2021-03-24", lastLogin: "2025-11-19" },
    { company: "NORDYNE INC.", totalLogins: 56, uniqueUsers: 1, firstLogin: "2021-03-25", lastLogin: "2024-10-09" },
    { company: "WaterFurnace International, Inc.", totalLogins: 48, uniqueUsers: 4, firstLogin: "2021-05-25", lastLogin: "2025-12-15" },
    { company: "GE Appliances, a Haier Company", totalLogins: 47, uniqueUsers: 9, firstLogin: "2021-09-23", lastLogin: "2025-11-20" },
    { company: "Lennox International Inc.", totalLogins: 44, uniqueUsers: 6, firstLogin: "2021-05-11", lastLogin: "2025-11-18" }
  ],

  setCompanyData: (data) => set({ companyData: data }),

  getTopCompaniesByLogins: (limit) => {
    const data = get().companyData;
    return [...data].sort((a, b) => b.totalLogins - a.totalLogins).slice(0, limit);
  },

  getTopCompaniesByUsers: (limit) => {
    const data = get().companyData;
    return [...data].sort((a, b) => b.uniqueUsers - a.uniqueUsers).slice(0, limit);
  }
}));
