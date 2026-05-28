import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiLayout,
  FiBriefcase,
  FiFileText,
  FiUsers,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiCheckCircle,
} from "react-icons/fi";

import useAuthStore
from "../../store/authStore";

const AdminSidebar = () => {

  const location =
  useLocation();

  const navigate =
  useNavigate();

  const {
    logout,
  } = useAuthStore();

  // ====================================
  // LOGOUT
  // ====================================
  const handleLogout =
  async () => {

    await logout();

    navigate("/login");
  };

  return (

    <aside className="fixed left-0 top-0 h-full w-72 bg-[#0b4141] border-r border-slate-200 flex flex-col z-50">

      {/* ================================= */}
      {/* LOGO */}
      {/* ================================= */}
      <div className="p-7 border-b border-slate-100">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">

            <FiCheckCircle className="text-white text-2xl" />

          </div>

          <div>

            <h2 className="text-xl font-black tracking-tight">

              PlacementHub

            </h2>

            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">

              Admin Portal

            </p>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* NAVIGATION */}
      {/* ================================= */}
      <nav className="flex-1 px-5 py-6 space-y-2">

        <NavItem
          to="/admin"
          label="Dashboard"
          icon={<FiLayout />}
          active={
            location.pathname ===
            "/admin"
          }
        />

        <NavItem
          to="/admin/companies"
          label="Companies"
          icon={<FiBriefcase />}
          active={
            location.pathname.includes(
              "/admin/companies"
            )
          }
        />

        <NavItem
          to="/admin/applications"
          label="Applications"
          icon={<FiFileText />}
          active={
            location.pathname.includes(
              "/admin/applications"
            )
          }
        />

        <NavItem
          to="/admin/students"
          label="Students"
          icon={<FiUsers />}
          active={
            location.pathname.includes(
              "/admin/students"
            )
          }
        />

        <NavItem
          to="/admin/notifications"
          label="Notifications"
          icon={<FiBell />}
          active={
            location.pathname.includes(
              "/admin/notifications"
            )
          }
        />

      </nav>

      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}
      <div className="p-5 border-t border-slate-100 space-y-2">

        <NavItem
          to="/admin/settings"
          label="Settings"
          icon={<FiSettings />}
        />

        <NavItem
          to="/admin/help"
          label="Help Center"
          icon={<FiHelpCircle />}
        />

        <button

          onClick={
            handleLogout
          }

          className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
        >

          <FiLogOut />

          Logout

        </button>

      </div>

    </aside>
  );
};

// ======================================
// NAV ITEM
// ======================================
const NavItem = ({
  to,
  label,
  icon,
  active = false,
}) => (

  <Link

    to={to}

    className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all font-bold ${
      active

      ? "bg-blue-50 text-blue-600"

      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >

    <span>

      {icon}

    </span>

    <span className="text-sm">

      {label}

    </span>

  </Link>
);

export default AdminSidebar;