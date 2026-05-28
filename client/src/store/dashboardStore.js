import { create } from "zustand";

import api from "../config/axios";

const useDashboardStore =
create((set) => ({

   stats: null,

   recentApplications: [],

   upcomingDrives: [],

   isLoading: false,

   error: null,

   fetchDashboardData:
   async () => {

      set({
         isLoading: true,
         error: null
      });

      try {

         const response =
         await api.get(
            "/dashboard-api/student"
         );

         const data =
         response.data.dashboardData;

         set({

            stats:
            data.stats,

            recentApplications:
            data.recentApplications,

            upcomingDrives:
            data.upcomingDrives,

            isLoading: false
         });

      } catch(error){

         set({

            error:
            error.response?.data?.message ||
            "Dashboard load failed",

            isLoading: false
         });
      }
   }
}));

export default useDashboardStore;