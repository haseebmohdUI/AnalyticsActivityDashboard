import { create } from 'zustand';

interface FilterStore {
  startDate: string;
  endDate: string;
  selectedCompanies: string[];
  searchUsername: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setSelectedCompanies: (companies: string[]) => void;
  toggleCompany: (company: string) => void;
  setSearchUsername: (username: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  startDate: '',
  endDate: '',
  selectedCompanies: [],
  searchUsername: '',

  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setSelectedCompanies: (companies) => set({ selectedCompanies: companies }),
  toggleCompany: (company) => {
    const currentCompanies = get().selectedCompanies;
    if (currentCompanies.includes(company)) {
      set({ selectedCompanies: currentCompanies.filter(c => c !== company) });
    } else {
      set({ selectedCompanies: [...currentCompanies, company] });
    }
  },
  setSearchUsername: (username) => set({ searchUsername: username }),

  resetFilters: () => set({
    startDate: '',
    endDate: '',
    selectedCompanies: [],
    searchUsername: ''
  })
}));
