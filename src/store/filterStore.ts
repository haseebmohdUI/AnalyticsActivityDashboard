import { create } from 'zustand';

interface FilterStore {
  // Common filters
  startDate: string;
  endDate: string;
  selectedCompanies: string[];
  searchUsername: string;
  page: number;
  pageSize: number;

  // Data Table filters
  year: string;
  program: string;
  manufacturer: string;

  // All Licensees filters
  oemName: string;
  status: string;

  // Query Activity filters
  operationName: string;
  email: string;

  // Actions
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSelectedCompanies: (companies: string[]) => void;
  toggleCompany: (company: string) => void;
  setSearchUsername: (username: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setYear: (year: string) => void;
  setProgram: (program: string) => void;
  setManufacturer: (manufacturer: string) => void;
  setOemName: (oemName: string) => void;
  setStatus: (status: string) => void;
  setOperationName: (operationName: string) => void;
  setEmail: (email: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  // Common filters
  startDate: '',
  endDate: '',
  selectedCompanies: [],
  searchUsername: '',
  page: 1,
  pageSize: 9999,

  // Data Table filters
  year: '',
  program: '',
  manufacturer: '',

  // All Licensees filters
  oemName: '',
  status: '',

  // Query Activity filters
  operationName: '',
  email: '',

  // Common actions
  setStartDate: (date) => set({ startDate: date, page: 1 }),
  setEndDate: (date) => set({ endDate: date, page: 1 }),
  setSelectedCompanies: (companies) => set({ selectedCompanies: companies, page: 1 }),
  toggleCompany: (company) => {
    const currentCompanies = get().selectedCompanies;
    if (currentCompanies.includes(company)) {
      set({ selectedCompanies: currentCompanies.filter(c => c !== company), page: 1 });
    } else {
      set({ selectedCompanies: [...currentCompanies, company], page: 1 });
    }
  },
  setSearchUsername: (username) => set({ searchUsername: username, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),

  // Data Table actions
  setYear: (year) => set({ year, page: 1 }),
  setProgram: (program) => set({ program, page: 1 }),
  setManufacturer: (manufacturer) => set({ manufacturer, page: 1 }),

  // All Licensees actions
  setOemName: (oemName) => set({ oemName, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),

  // Query Activity actions
  setOperationName: (operationName) => set({ operationName, page: 1 }),
  setEmail: (email) => set({ email, page: 1 }),

  resetFilters: () => set({
    startDate: '',
    endDate: '',
    selectedCompanies: [],
    searchUsername: '',
    year: '',
    program: '',
    manufacturer: '',
    oemName: '',
    status: '',
    operationName: '',
    email: '',
    page: 1,
    pageSize: 9999
  })
}));
