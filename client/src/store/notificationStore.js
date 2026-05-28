import { create }
from "zustand";

import api
from "../config/axios";

const useNotificationStore =
create((set) => ({

  notifications: [],

  unreadCount: 0,

  loading: false,

  // ====================================
  // FETCH
  // ====================================
  fetchNotifications:
  async () => {

    try {

      set({
        loading: true,
      });

      const response =
      await api.get(
        "/notification-api"
      );

      set({

        notifications:
          response.data.notifications,

        unreadCount:
          response.data.unreadCount,

        loading: false,
      });

    } catch (error) {

      console.log(error);

      set({
        loading: false,
      });
    }
  },

  // ====================================
  // MARK AS READ
  // ====================================
  markAsRead:
  async (id) => {

    try {

      await api.put(
        `/notification-api/${id}`
      );

      set((state) => ({

        notifications:
          state.notifications.map(
            (item) =>

              item._id === id

              ? {
                  ...item,
                  isRead: true,
                }

              : item
          ),

        unreadCount:
          Math.max(
            state.unreadCount - 1,
            0
          ),
      }));

    } catch (error) {

      console.log(error);
    }
  },

  createBroadcastNotification:
  async (data) => {

    try {

      set({
        loading: true,
      });

      await api.post(

        "/notification-api/broadcast",

        data
      );

    } catch (error) {

      console.log(error);

    } finally {

      set({
        loading: false,
      });
    }
  },
}));

export default
useNotificationStore;