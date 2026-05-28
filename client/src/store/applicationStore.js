import { create } from 'zustand';
import axios from '../config/axios';

const useApplicationStore = create((set, get) => ({
  applications: [],
  studentApplications: [],
  isLoading: false,
  error: null,

  // Fetch applications for a specific student
  fetchStudentApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/application-api/my-applications');
      set({ studentApplications: response.data.applications, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch your applications', isLoading: false });
    }
  },

  // Student: Apply for a company
  applyForCompany: async (companyId, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/application-api/apply', { companyId, role });
      // UPDATE LOCAL STATE
      set((state) => ({
          applications: [

    ...state.applications,
    response.data.application,
  ],
}));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to submit application', isLoading: false });
      return { success: false, error: get().error };
    }
  },

  // Admin: Fetch all applications across the system
  fetchAllApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/admin/applications');
      set({ applications: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch applications', isLoading: false });
    }
  },

  // Admin: Update application status (Shortlist, Reject, Hired, etc.)
  updateApplicationStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`/admin/applications/${id}/status`, { status });
      set((state) => ({
        applications: state.applications.map((app) => (app._id === id ? response.data : app)),
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update status', isLoading: false });
      return { success: false, error: get().error };
    }
  }
}));

export default useApplicationStore;