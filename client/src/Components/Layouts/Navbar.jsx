import {
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  toast,
} from "sonner";

import useAuthStore
from "../../store/authStore";

import useNotificationStore
from "../../store/notificationStore";

const Navbar = () => {

  // ====================================
  // AUTH
  // ====================================
  const {
    currentUser,
    logout,
  } = useAuthStore();

  // ====================================
  // NOTIFICATIONS
  // ====================================
  const {

    notifications,

    unreadCount,

    fetchNotifications,

    markAsRead,

  } = useNotificationStore();

  // ====================================
  // STATES
  // ====================================
  const [
    showNotifications,

    setShowNotifications

  ] = useState(false);

  const [
    showProfileMenu,

    setShowProfileMenu

  ] = useState(false);

  const navigate =
  useNavigate();

  // ====================================
  // FETCH NOTIFICATIONS
  // ====================================
  useEffect(() => {

    fetchNotifications();

  }, []);

  // ====================================
  // LOGOUT
  // ====================================
  const handleLogout =
  async () => {

    await logout();

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  return (

    <header className="h-[78px] bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">

      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}
      <div className="relative w-full max-w-md">

        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search companies, applications..."
          className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* ================================= */}
      {/* RIGHT */}
      {/* ================================= */}
      <div className="flex items-center gap-5 ml-6">

        {/* ================================= */}
        {/* NOTIFICATIONS */}
        {/* ================================= */}
        <div className="relative">

          {/* BUTTON */}
          <motion.button

            whileTap={{
              scale: 0.95,
            }}

            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }

            className="relative w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all"
          >

            <FiBell
              size={18}
              className="text-slate-600"
            />

            {/* BADGE */}
            {
              unreadCount > 0 && (

                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">

                  {unreadCount}

                </span>
              )
            }

          </motion.button>

          {/* ================================= */}
          {/* DROPDOWN */}
          {/* ================================= */}
          <AnimatePresence>

            {
              showNotifications && (

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 10,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  exit={{
                    opacity: 0,
                    y: 10,
                  }}

                  transition={{
                    duration: 0.2,
                  }}

                  className="absolute right-0 top-14 w-[360px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden z-50"
                >

                  {/* HEADER */}
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

                    <div>

                      <h3 className="text-lg font-black text-slate-900">

                        Notifications

                      </h3>

                      <p className="text-xs text-slate-500 mt-1">

                        Recent placement updates

                      </p>
                    </div>

                    <span className="text-xs font-bold text-blue-600">

                      {unreadCount} New

                    </span>

                  </div>

                  {/* LIST */}
                  <div className="max-h-[400px] overflow-y-auto">

                    {
                      notifications.length > 0

                      ? (

                        notifications.map(
                          (item) => (

                            <motion.div

                              key={item._id}

                              whileHover={{
                                x: 2,
                              }}

                              onClick={() =>
                                markAsRead(
                                  item._id
                                )
                              }

                              className={`px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-all cursor-pointer ${
                                item.isRead
                                ? "bg-white"
                                : "bg-blue-50/40"
                              }`}
                            >

                              <div className="flex gap-3">

                                {/* DOT */}
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                  item.isRead
                                  ? "bg-slate-300"
                                  : "bg-blue-600"
                                }`} />

                                {/* CONTENT */}
                                <div>

                                  <h4 className="text-sm font-bold text-slate-900">

                                    {item.title}

                                  </h4>

                                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">

                                    {item.message}

                                  </p>

                                  <p className="text-[11px] text-slate-400 mt-2">

                                    {
                                      new Date(
                                        item.createdAt
                                      ).toLocaleDateString()
                                    }

                                  </p>

                                </div>
                              </div>
                            </motion.div>
                          )
                        )
                      )

                      : (

                        <div className="p-10 text-center">

                          <FiBell
                            size={30}
                            className="mx-auto text-slate-300 mb-3"
                          />

                          <h4 className="text-sm font-bold text-slate-700">

                            No Notifications

                          </h4>

                          <p className="text-xs text-slate-500 mt-1">

                            You're all caught up

                          </p>

                        </div>
                      )
                    }

                  </div>
                </motion.div>
              )
            }

          </AnimatePresence>

        </div>

        {/* ================================= */}
        {/* PROFILE */}
        {/* ================================= */}
        <div className="relative">

          {/* BUTTON */}
          <motion.button

            whileTap={{
              scale: 0.98,
            }}

            onClick={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }

            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:bg-white transition-all"
          >

            {/* AVATAR */}
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">

              <img
                src={
                  currentUser?.profileImage ||

                  `https://ui-avatars.com/api/?name=${currentUser?.name}&background=eff6ff&color=2563eb`
                }

                alt="Profile"

                className="w-full h-full object-cover"
              />

            </div>

            {/* INFO */}
            <div className="hidden md:block text-left leading-tight">

              <h4 className="text-sm font-bold text-slate-900">

                {currentUser?.name}

              </h4>

              <p className="text-xs text-slate-500 mt-1">

                {
                  currentUser?.role === "admin"

                  ? "Administrator"

                  : "Student"
                }

              </p>

            </div>

            <FiChevronDown
              size={16}
              className="text-slate-400"
            />

          </motion.button>

          {/* ================================= */}
          {/* PROFILE DROPDOWN */}
          {/* ================================= */}
          <AnimatePresence>

            {
              showProfileMenu && (

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 10,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  exit={{
                    opacity: 0,
                    y: 10,
                  }}

                  transition={{
                    duration: 0.2,
                  }}

                  className="absolute right-0 top-14 w-[240px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200 overflow-hidden z-50"
                >

                  {/* USER */}
                  <div className="px-5 py-4 border-b border-slate-100">

                    <h3 className="text-sm font-black text-slate-900">

                      {currentUser?.name}

                    </h3>

                    <p className="text-xs text-slate-500 mt-1">

                      {currentUser?.email}

                    </p>

                  </div>

                  {/* MENU */}
                  <div className="p-2">

                    <DropdownItem
                      icon={<FiUser />}
                      label="My Profile"
                      onClick={() =>
                        navigate("/profile")
                      }
                    />

                    <DropdownItem
                      icon={<FiSettings />}
                      label="Settings"
                    />

                    <DropdownItem
                      icon={<FiHelpCircle />}
                      label="Help Center"
                    />

                    <DropdownItem
                      icon={<FiLogOut />}
                      label="Logout"
                      danger
                      onClick={handleLogout}
                    />

                  </div>

                </motion.div>
              )
            }

          </AnimatePresence>

        </div>

      </div>
    </header>
  );
};

// ======================================
// DROPDOWN ITEM
// ======================================
const DropdownItem = ({
  icon,
  label,
  danger = false,
  onClick,
}) => (

  <button

    onClick={onClick}

    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
      danger
      ? "text-red-600 hover:bg-red-50"
      : "text-slate-700 hover:bg-slate-50"
    }`}
  >

    <span className="text-lg">

      {icon}

    </span>

    {label}

  </button>
);

export default Navbar;