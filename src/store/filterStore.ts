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
  firstName: string;
  lastName: string;
  company: string;
  username: string;

  // Shared filter (used by All Licensees)
  year: string;

  // All Licensees filters
  program: string;
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
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setCompany: (company: string) => void;
  setUsername: (username: string) => void;
  setYear: (year: string) => void;
  setProgram: (program: string) => void;
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
  firstName: '',
  lastName: '',
  company: '',
  username: '',

  // Shared filter (used by All Licensees and ACS Participant Analysis)
  year: '2025',

  // All Licensees filters
  program: '',
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
  setFirstName: (firstName) => set({ firstName, page: 1 }),
  setLastName: (lastName) => set({ lastName, page: 1 }),
  setCompany: (company) => set({ company, page: 1 }),
  setUsername: (username) => set({ username, page: 1 }),
  setYear: (year) => set({ year, page: 1 }),

  // All Licensees actions
  setProgram: (program) => set({ program, page: 1 }),
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
    firstName: '',
    lastName: '',
    company: '',
    username: '',
    year: '2025',
    program: '',
    oemName: '',
    status: '',
    operationName: '',
    email: '',
    page: 1,
    pageSize: 9999
  })
}));
