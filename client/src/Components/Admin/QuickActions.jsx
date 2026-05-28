import {
  motion,
} from "framer-motion";

import {
  FiPlus,
  FiBriefcase,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiBell,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

const QuickActions = ({gotoAnalytics}) => {

  const navigate =
  useNavigate();

  // ====================================
  // ACTIONS
  // ====================================
  const actions = [

    {
      title: "Add Company",

      icon:
      <FiPlus />,

      color:
      "bg-blue-50 text-blue-600 border-blue-100",

      onClick: () =>
        navigate(
          "/admin/companies"
        ),
    },

    {
      title: "Manage Applications",

      icon:
      <FiFileText />,

      color:
      "bg-emerald-50 text-emerald-600 border-emerald-100",

      onClick: () =>
        navigate(
          "/admin/applications"
        ),
    },

    {
      title: "Students",

      icon:
      <FiUsers />,

      color:
      "bg-purple-50 text-purple-600 border-purple-100",

      onClick: () =>
        navigate(
          "/admin/students"
        ),
    },
    {
      title: "Companies",

      icon:
      <FiBriefcase />,

      color:
      "bg-amber-50 text-amber-600 border-amber-100",
      onClick: () =>
        navigate(
          "/admin/companies"
        ),
    },

    {
      title: "Analytics",

      icon:
      <FiBarChart2 />,

      color:
      "bg-indigo-50 text-indigo-600 border-indigo-100",

      onClick:{gotoAnalytics}

    },

    {
      title: "Notifications",

      icon:
      <FiBell />,

      color:
      "bg-red-50 text-red-600 border-red-100",
      onClick: () =>
        navigate(
          "/admin/notifications"
        ),
    },
  ];

  return (

    <motion.section

      initial={false}

      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}
      <div className="mb-6">

        <h3 className="text-2xl font-black text-slate-900">

          Quick Actions

        </h3>

        <p className="text-sm text-slate-500 mt-1">

          Fast admin workflow shortcuts

        </p>

      </div>

      {/* ================================= */}
      {/* GRID */}
      {/* ================================= */}
      <div className="grid grid-cols-2 gap-4">

        {
          actions.map(
            (
              action,
              index
            ) => (

              <motion.button

                key={index}

                whileHover={{
                  y: -3,
                }}

                whileTap={{
                  scale: 0.98,
                }}

                onClick={
                  action.onClick
                }

                className="border border-slate-200 rounded-2xl p-5 text-left hover:shadow-md transition-all bg-white"
              >

                {/* ICON */}
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl ${action.color}`}>

                  {action.icon}

                </div>

                {/* CONTENT */}
                <div className="mt-4">

                  <h4 className="text-sm font-black text-slate-900">

                    {action.title}

                  </h4>

                  <p className="text-xs text-slate-500 mt-1">

                    Open module

                  </p>

                </div>

              </motion.button>
            )
          )
        }

      </div>

    </motion.section>
  );
};

export default
QuickActions;