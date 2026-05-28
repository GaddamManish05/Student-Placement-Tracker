import { create } from "zustand";

import api from "../config/axios";

const useAdminStore = create((set,get) => ({

  // ====================================
  // DASHBOARD STATS
  // ====================================
  dashboardStats: {
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    placedStudents: 0,
    interviewCount: 0,
  },

  // ====================================
  // COMPANIES
  // ====================================
  companies: [],

  companyStats: {
    totalPartners: 0,
    activeDrives: 0,
    pendingDrives: 0,
    avgPackage: "0 LPA",
  },

  // ====================================
  // RECENT APPLICATIONS
  // ====================================
  recentApplications: [],
  applications: [],

  // ====================================
  // ACTIVITIES
  // ====================================
  activities: [],

  // ====================================
  // ANALYTICS
  // ====================================
  analytics: {},

  // ====================================
  // STUDENTS
  // ====================================
  students: [],

  // ====================================
  // NOTIFICATIONS
  // ====================================
  notifications: [],

  // ====================================
  // LOADING STATES
  // ====================================
  dashboardLoading: false,

  companiesLoading: false,

  applicationsLoading: false,

  analyticsLoading: false,

  studentsLoading: false,

  notificationsLoading: false,

  // ====================================
  // ERROR STATE
  // ====================================
  error: null,

  // ====================================
  // FETCH DASHBOARD STATS
  // ====================================
  fetchDashboardStats: async () => {

    try {

      set({
        dashboardLoading: true,
        error: null,
      });

      const response =
      await api.get(
        "/admin-api/dashboard-stats"
      );

      set({
        dashboardStats:
        response.data.stats,
      });

    } catch (error) {

      console.log(error);

      set({
        error:
        error.response?.data?.message ||
        "Failed to fetch dashboard stats",
      });

    } finally {

      set({
        dashboardLoading: false,
      });
    }
  },

  // ====================================
  // FETCH COMPANIES
  // ====================================
  fetchCompanies: async () => {

    try {

      set({
        companiesLoading: true,
        error: null,
      });

      const response =
      await api.get(
        "/admin-api/companies"
      );

      set({

        companies:
        response.data.companies,

        companyStats:
        response.data.stats,
      });

    } catch (error) {

      console.log(error);

      set({
        error:
        error.response?.data?.message ||
        "Failed to fetch companies",
      });

    } finally {

      set({
        companiesLoading: false,
      });
    }
  },

  // ====================================
  // FETCH RECENT APPLICATIONS
  // ====================================
  fetchRecentApplications: async () => {

    try {

      set({
        applicationsLoading: true,
        error: null,
      });

      const response =
      await api.get(
        "/admin-api/recent-applications"
      );

      set({

        recentApplications:
        response.data.applications,
      });

    } catch (error) {

      console.log(error);

      set({
        error:
        error.response?.data?.message ||
        "Failed to fetch applications",
      });

    } finally {

      set({
        applicationsLoading: false,
      });
    }
  },

  // ====================================
// FETCH APPLICATIONS
// ====================================
fetchApplications: async () => {

  try {

    set({
      applicationsLoading: true,
      error: null,
    });

    const response =
    await api.get(
      "/admin-api/applications"
    );

    set({

      applications:
      response.data.applications,
    });

  } catch (error) {

    console.log(error);

    set({
      error:
      error.response?.data?.message ||
      "Failed to fetch applications",
    });

  } finally {

    set({
      applicationsLoading: false,
    });
  }
},

  // ====================================
  // FETCH ACTIVITIES
  // ====================================
  fetchActivities: async () => {

    try {

      const response =
      await api.get(
        "/admin-api/activities"
      );

      set({

        activities:
        response.data.activities,
      });

    } catch (error) {

      console.log(error);
    }
  },

  // ====================================
  // FETCH ANALYTICS
  // ====================================
  fetchAnalytics: async () => {

    try {

      set({
        analyticsLoading: true,
      });

      const response =
      await api.get(
        "/admin-api/analytics"
      );

      set({

        analytics:
        response.data.analytics,
      });

    } catch (error) {

      console.log(error);
    } finally {

      set({
        analyticsLoading: false,
      });
    }
  },

  // ====================================
  // FETCH STUDENTS
  // ====================================
  fetchStudents: async () => {

    try {

      set({
        studentsLoading: true,
      });

      const response =
      await api.get(
        "/admin-api/students"
      );

      set({

        students:
        response.data.students,
      });

    } catch (error) {

      console.log(error);

    } finally {

      set({
        studentsLoading: false,
      });
    }
  },

  // ====================================
  // FETCH NOTIFICATIONS
  // ====================================
  fetchNotifications: async () => {

    try {

      set({
        notificationsLoading: true,
      });

      const response =
      await api.get(
        "/admin-api/notifications"
      );

      set({

        notifications:
        response.data.notifications,
      });

    } catch (error) {

      console.log(error);

    } finally {

      set({
        notificationsLoading: false,
      });
    }
  },

// ====================================
// TOGGLE STUDENT STATUS
// ====================================
toggleStudentStatus: async (id) => {

  try {

    const response =
    await api.patch(
      `/admin-api/students/${id}/status`
    );

    set((state) => ({

      students:
      state.students.map(
        (student) =>

          student._id === id

          ? {
              ...student,

              isActive:
              !student.isActive,
            }

          : student
      ),
    }));

  } catch (error) {

    console.log(error);

    set({
      error:
      error.response?.data?.message ||
      "Failed to update student status",
    });
  }
},

// ====================================
// CREATE COMPANY
// ====================================
createCompany:
async (companyData) => {

  try {

    set({
      loading: true,
    });

    const response =
    await api.post(

      "/company-api/add-company",

      companyData
    );

    // REFRESH
    get().fetchCompanies();
    get().fetchDashboardStats();
    get().fetchAnalytics();

    return {

      success: true,
    };

  } catch (error) {

    console.log(error);

    return {

      success: false,

      message:
      error.response?.data?.message,
    };

  } finally {

    set({
      loading: false,
    });
  }
},

// ====================================
// UPDATE COMPANY
// ====================================
updateCompany:
async (
  id,
  companyData
) => {

  try {

    set({
      loading: true,
    });

    await api.put(

      `/company-api/update-company/${id}`,

      companyData
    );

    // REFRESH
    await get().fetchCompanies();
    get().fetchDashboardStats();
    get().fetchAnalytics();

    return {

      success: true,
    };

  } catch (error) {

    console.log(error);

    return {

      success: false,

      message:
      error.response?.data?.message,
    };

  } finally {

    set({
      loading: false,
    });
  }
},

// ====================================
// DELETE COMPANY
// ====================================
deleteCompany: async (id) => {
  try {
    set({ loading: true });
    await api.put(`/company-api/${id}`);
    get().fetchCompanies();
    get().fetchDashboardStats();
    get().fetchAnalytics();
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete company",
    };
  } finally {
    set({ loading: false });
  }
},

// ====================================
// UPDATE APPLICATION STATUS
// ====================================
updateApplicationStatus:
async (
  id,
  status
) => {

  try {

    await api.patch(

      `/admin-api/applications/${id}/status`,

      {
        status,
      }
    );

    // ==================================
    // UPDATE UI
    // ==================================
    set((state) => ({

      applications:
      state.applications.map(
        (app) =>

          app._id === id

          ? {
              ...app,
              status,
            }

          : app
      ),
    }));

    get().fetchDashboardStats();
    get().fetchAnalytics();

  } catch (error) {

    console.log(error);

    set({
      error:
      error.response?.data?.message ||
      "Failed to update application status",
    });
  }
},
}));



export default useAdminStore;