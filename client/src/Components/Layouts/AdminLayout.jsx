import {
  useEffect,
  useState,
} from "react";

import {
  FiBell,
  FiSearch,
} from "react-icons/fi";

import AdminSidebar
from "../Admin/AdminSidebar";

import useNotificationStore
from "../../store/notificationStore";

const AdminLayout = ({
  children,
}) => {

  // ====================================
  // STORE
  // ====================================
  const {

    notifications,

    unreadCount,

    fetchNotifications,

    markAsRead,

  } = useNotificationStore();
  console.log("notifications :",notifications);

  // ====================================
  // STATES
  // ====================================
  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  // ====================================
  // FETCH
  // ====================================
  useEffect(() => {

    fetchNotifications();

  }, []);

  return (

    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex-1 ml-72">

        {/* HEADER */}
        <header className="h-24 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-10">

          {/* SEARCH */}
          <div className="relative w-full max-w-lg">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search students, companies..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
            />

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6">

            {/* ================================= */}
            {/* NOTIFICATIONS */}
            {/* ================================= */}
            <div className="relative">

              <button

                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }

                className="relative w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
              >

                <FiBell size={20} />

                {
                  unreadCount > 0 && (

                    <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">

                      {unreadCount}

                    </span>
                  )
                }

              </button>

              {/* ================================= */}
              {/* DROPDOWN */}
              {/* ================================= */}
              {
                showNotifications && (

                  <div className="absolute right-0 mt-4 w-[380px] bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden z-50">

                    {/* HEADER */}
                    <div className="p-6 border-b border-slate-100">

                      <h3 className="text-xl font-black text-slate-900">

                        Notifications

                      </h3>

                      <p className="text-sm text-slate-500 mt-1">

                        Latest placement updates

                      </p>

                    </div>

                    {/* LIST */}
                    <div className="max-h-[450px] overflow-y-auto">

                      {
                        notifications.length === 0

                        ? (

                          <div className="p-10 text-center">

                            <FiBell
                              size={40}
                              className="mx-auto text-slate-300 mb-4"
                            />

                            <h4 className="font-black text-slate-800">

                              No Notifications

                            </h4>

                            <p className="text-sm text-slate-500 mt-2">

                              You're all caught up.

                            </p>

                          </div>
                        )

                        : (

                          notifications.map(
                            (item) => (

                              <button

                                key={item._id}

                                onClick={() => {

                                  if (!item.isRead) {

                                    markAsRead(
                                      item._id
                                    );
                                  }
                                }}

                                className={`w-full text-left p-5 border-b border-slate-100 hover:bg-slate-50 transition-all ${
                                  !item.isRead
                                  ? "bg-blue-50/50"
                                  : ""
                                }`}
                              >

                                {/* TOP */}
                                <div className="flex items-center justify-between gap-4">

                                  <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-600 text-[10px] font-black">

                                    {item.type}

                                  </span>

                                  {
                                    !item.isRead && (

                                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                    )
                                  }

                                </div>

                                {/* TITLE */}
                                <h4 className="text-sm font-black text-slate-900 mt-3">

                                  {item.title}

                                </h4>

                                {/* MESSAGE */}
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">

                                  {item.message}

                                </p>

                                {/* DATE */}
                                <p className="text-[11px] text-slate-400 mt-3">

                                  {
                                    new Date(
                                      item.createdAt
                                    ).toLocaleString()
                                  }

                                </p>

                              </button>
                            )
                          )
                        )
                      }

                    </div>

                  </div>
                )
              }

            </div>

            {/* PROFILE */}
            <div className="flex items-center gap-4">

              <div className="text-right">

                <h4 className="text-sm font-black text-slate-900">

                  Admin

                </h4>

                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">

                  Placement Officer

                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">

                A

              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}
        <main className="p-10">

          {children}

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;