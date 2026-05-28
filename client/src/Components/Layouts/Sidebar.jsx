import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiLayout,
  FiBriefcase,
  FiFileText,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiGrid,
  FiFilePlus
} from "react-icons/fi";

import { motion } from "framer-motion";

import { toast } from "sonner";

import useAuthStore
from "../../store/authStore";

const Sidebar = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const {
    logout,
    currentUser,
  } = useAuthStore();

  // ====================================
  // LOGOUT
  // ====================================
  const handleLogout = () => {

    logout();

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  return (

    <aside className="fixed left-0 top-0 h-screen w-[250px] bg-[#0b4141] border-r border-slate-200 flex flex-col z-50">

      {/* ================================= */}
      {/* LOGO */}
      {/* ================================= */}
      <div className="h-[82px] px-5 border-b border-slate-100 flex items-center">

        <div className="flex items-center gap-3">

          {/* LOGO */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">

            <FiGrid className="text-white text-[18px]" />

          </div>

          {/* TEXT */}
          <div className="leading-tight">

            <h1 className="text-[20px] font-black tracking-tight">

              PlacementHub

            </h1>

            <p className="text-[11px] font-semibold tracking-wide mt-0.5">

              STUDENT PORTAL

            </p>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* PROFILE */}
      {/* ================================= */}
      <div className="px-5 py-5 border-b border-slate-100">

        <div className="flex items-center gap-3">

          {/* AVATAR */}
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shrink-0">

            <img
              src={
                currentUser?.profileImage ||

                `https://ui-avatars.com/api/?name=${currentUser?.name}&background=eff6ff&color=2563eb`
              }

              alt="Profile"

              className="w-full h-full object-cover"
            />
          </div>

          {/* USER INFO */}
          <div className="min-w-0 flex-1">

            <h3 className="text-[17px] font-bold truncate">

              {currentUser?.name}

            </h3>

            <p className="text-[13px] truncate mt-0.5">

              {
                currentUser?.branch ||
                "Student"
              }

            </p>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* NAVIGATION */}
      {/* ================================= */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto">

        <SidebarTitle
          title="MENU"
        />

        <div className="space-y-1.5">

          <NavItem
            to="/dashboard"
            label="Dashboard"
            icon={<FiLayout />}
            active={
              location.pathname ===
              "/dashboard"
            }
          />

          <NavItem
            to="/companies"
            label="Companies"
            icon={<FiBriefcase />}
            active={
              location.pathname ===
              "/companies"
            }
          />

          <NavItem
            to="/applications"
            label="Applications"
            icon={<FiFileText />}
            active={
              location.pathname ===
              "/applications"
            }
          />

          <NavItem
            to="/profile"
            label="Profile"
            icon={<FiUser />}
            active={
              location.pathname ===
              "/profile"
            }
          />
          <NavItem
            to="/resume-builder"
            label="Resume Builder"
            icon={<FiFilePlus />}
            active={
              location.pathname ===
              "/resume-builder"
              }
            />
        </div>

        {/* SUPPORT */}
        <div className="mt-8">

          <SidebarTitle
            title="SUPPORT"
          />

          <div className="space-y-1.5">

            <NavItem
              to="/settings"
              label="Settings"
              icon={<FiSettings />}
            />

            <NavItem
              to="/help"
              label="Help Center"
              icon={<FiHelpCircle />}
            />
          </div>
        </div>
      </nav>

      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}
      <div className="p-4 border-t border-slate-100">

        <motion.button

          whileTap={{
            scale: 0.98
          }}

          onClick={handleLogout}

          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-semibold"
        >

          <FiLogOut size={17} />

          Logout

        </motion.button>
      </div>
    </aside>
  );
};

// ====================================
// NAV ITEM
// ====================================
const NavItem = ({
  to,
  label,
  icon,
  active = false,
}) => (

  <Link
    to={to}

    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
      ? "bg-blue-50 text-blue-600"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >

    {/* ICON */}
    <span
      className={`text-[18px] ${
        active
        ? "text-blue-600"
        : "text-slate-400 group-hover:text-slate-700"
      }`}
    >

      {icon}

    </span>

    {/* LABEL */}
    <span className={`text-[14px] font-semibold`}>

      {label}

    </span>

  </Link>
);

// ====================================
// SIDEBAR TITLE
// ====================================
const SidebarTitle = ({
  title,
}) => (

  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-black px-4 mb-3">

    {title}

  </p>
);

export default Sidebar;