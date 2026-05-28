import { create } from 'zustand';
import axios from '../config/axios';

const useCompanyStore = create((set, get) => ({
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,

  // Fetch all companies
  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/company-api');
      set({ companies: response.data.companies, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch companies', isLoading: false });
    }
  },

  // Fetch a single company by ID
  fetchCompanyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/company-api/companies/${id}`);
      set({ selectedCompany: response.data.companies, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch company details', isLoading: false });
    }
  },
}));

export default useCompanyStore;