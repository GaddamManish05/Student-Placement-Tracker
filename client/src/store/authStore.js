import { create } from "zustand";
import api from "../config/axios";

const useAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authLoading: true,
  // ======================
  // LOGIN
  // ======================
  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post(
        "/common-api/login",
        credentials
      );

      const currentUser = response.data.payload;

      set({
        currentUser,
        isAuthenticated: true,
        isLoading: false,
        error : response.data.message
      });

      return {
        success: true,
        role: currentUser.role,
      };

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed";

      set({
        error: message,
        isLoading: false,
      });

      return {
        success: false,
        error: message,
      };
    }
  },

  // ======================
  // REGISTER
  // ======================
  register: async (userData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post(
        "/common-api/register",
        userData
      );

      set({
        currentUser : null,
        isAuthenticated: false,
        isLoading: false,
      });

      return { success: true };

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      set({
        error: message,
        isLoading: false,
      });

      return {
        success: false,
        error: message,
      };
    }
  },

  // ======================
  // LOGOUT
  // ======================
  logout: async () => {
    try {
      await api.post("/common-api/logout");

      set({
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });

    } catch (error) {
      console.log(error);
    }
  },

  // ======================
  // CHECK AUTH
  // ======================
  checkAuth: async () => {

  try {

    const response =
    await api.get(
      "/common-api/current-user"
    );

    set({

      currentUser:
        response.data.payload,

      isAuthenticated: true,

      authLoading: false,
    });

  } catch (error) {

    set({

      currentUser: null,

      isAuthenticated: false,

      authLoading: false,

      error : error.message
    });
  }
},

  // ======================
  // UPDATE USER
  // ======================
  updateCurrentUser: (updatedData) => {
    set({
      currentUser: {
        ...get().currentUser,
        ...updatedData,
      },
    });
  },
  updateProfile: async (updatedData) => {

   set({
      isLoading: true,
      error: null
   });

   try {

      const response = await api.put(
         "/common-api/update-profile",
         updatedData
      );

      const updatedUser =
      response.data.payload;

      set({
         currentUser: updatedUser,
         isLoading: false
      });

      return {
         success: true
      };

   } catch(error){

      const message =
      error.response?.data?.message ||
      "Profile update failed";

      set({
         error: message,
         isLoading: false
      });

      return {
         success: false,
         error: message
      };
   }
},
// ======================
// UPLOAD RESUME
// ======================
uploadResume: async (
  file
) => {

  try {

    set({
      isLoading: true,
    });

    const formData =
    new FormData();

    formData.append(
      "resume",
      file
    );

    const response =
    await api.post(

      "/common-api/upload-resume",

      formData,

      {
        headers: {

          "Content-Type":
          "multipart/form-data",
        },
      }
    );

    set({

      currentUser:
      response.data.payload,

      isLoading: false,
    });

    return {

      success: true,
    };

  } catch (error) {

    console.log(error);

    set({
      isLoading: false,
    });

    return {

      success: false,
    };
  }
},
  
  // ======================
  // CLEAR ERROR
  // ======================
  clearError: () =>
    set({ error: null }),
}));

export default useAuthStore;