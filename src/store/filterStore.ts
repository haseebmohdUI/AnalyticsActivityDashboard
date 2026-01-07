import { create } from 'zustand';

interface FilterStore {
  startDate: string;
  endDate: string;
  selectedCompanies: string[];
  searchUsername: string;
  page: number;
  pageSize: number;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSelectedCompanies: (companies: string[]) => void;
  toggleCompany: (company: string) => void;
  setSearchUsername: (username: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  startDate: '',
  endDate: '',
  selectedCompanies: [],
  searchUsername: '',
  page: 1,
  pageSize: 100,

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

  resetFilters: () => set({
    startDate: '',
    endDate: '',
    selectedCompanies: [],
    searchUsername: '',
    page: 1,
    pageSize: 100
  })
}));
