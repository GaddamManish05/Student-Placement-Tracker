import { useEffect } from "react";

import { motion } from "framer-motion";
import ResumeUploadCard
from "../../Components/Cards/ResumeUploadCard";

import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiCalendar,
} from "react-icons/fi";

import ApplicationsTable
from "../../Components/Cards/ApplicationsTable";

import QuickActionsCard
from "../../Components/Cards/QuickActionsCard";

import AnalyticsChart
from "../../Components/Cards/AnalyticsChart";

import PlacementJourney
from "../../Components/Cards/PlacementJourney";

import StatCard
from "../../Components/Cards/StatsCard";

import DashboardLayout
from "../../Components/Layouts/DashboardLayout";

import useDashboardStore
from "../../store/dashboardStore";

// ======================================
// DASHBOARD
// ======================================
const Dashboard = () => {

  // ====================================
  // STORE
  // ====================================
  const {

    stats,

    recentApplications,

    upcomingDrives,

    fetchDashboardData,

    isLoading,

  } = useDashboardStore();

  // ====================================
  // FETCH DATA
  // ====================================
  useEffect(() => {

    fetchDashboardData();

  }, []);

  // ====================================
  // STATS DATA
  // ====================================
  const dashboardStats = [

    {
      label: "Applications",

      value:
        stats?.totalApplications || 0,

      icon:
        <FiFileText size={18} />,

      color:
        "bg-blue-50 text-blue-600",

      badge:
        "+12%",
    },

    {
      label: "Offers",

      value:
        stats?.selectedCount || 0,

      icon:
        <FiCheckCircle size={18} />,

      color:
        "bg-emerald-50 text-emerald-600",

      badge:
        "3 Active",
    },

    {
      label: "Interviews",

      value:
        stats?.interviewCount || 0,

      icon:
        <FiClock size={18} />,

      color:
        "bg-amber-50 text-amber-600",

      badge:
        "Today",
    },

    {
      label: "Profile Score",

      value:
        stats?.profileScore || 0,

      icon:
        <FiTarget size={18} />,

      color:
        "bg-indigo-50 text-indigo-600",

      badge:
        "Top 5%",
    },
  ];

  // ====================================
  // LOADING
  // ====================================
  if (isLoading) {

    return (

      <DashboardLayout>

        <div className="flex items-center justify-center min-h-[70vh]">

          <div className="text-center">

            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm text-slate-500 font-medium">

              Loading dashboard...

            </p>

          </div>
        </div>

      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-4xl font-black tracking-tight text-slate-900">

          Dashboard

        </h1>

        <p className="text-sm text-slate-500 mt-1 font-medium">

          Track your placement journey and applications.

        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">

        {
          dashboardStats.map(
            (stat, i) => (

              <StatCard

                key={i}

                icon={stat.icon}

                label={stat.label}

                value={stat.value}

                badge={stat.badge}

                color={stat.color}
              />
            )
          )
        }
      </div>

      {/* JOURNEY */}
      <div className="mb-5">

        <PlacementJourney />

      </div>
      <div className="mb-5">
        <AnalyticsChart />
      </div>

      {/* MAIN GRID */}
      {/* MAIN GRID */}
<div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5 items-start">

  {/* LEFT */}
  <div className="space-y-5 min-w-0">

    <ApplicationsTable
      applications={recentApplications}
    />

  </div>

  {/* RIGHT */}
  <div className="space-y-5 sticky top-24">

    {/* RESUME */}
    <ResumeUploadCard />

    {/* QUICK ACTIONS */}
    <QuickActionsCard />

    {/* UPCOMING DRIVES */}
    <motion.section

      initial={{
        opacity: 0,
        y: 15,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="text-xl font-black text-slate-900">

            Upcoming Drives

          </h3>

          <p className="text-xs text-slate-500 mt-1">

            Latest opportunities

          </p>
        </div>

        <FiCalendar
          size={18}
          className="text-slate-300"
        />

      </div>

      {/* DRIVES */}
      <div className="space-y-4">

        {
          upcomingDrives.map(
            (drive) => (

              <motion.div

                whileHover={{
                  x: 2,
                }}

                key={drive._id}

                onClick={() => {
                   if (drive.isFallback) {
                      window.location.href = drive._id === "fallback-resume" ? "/resume-builder" : "/profile";
                   } else {
                      window.location.href = `/company/${drive._id}`;
                   }
                }}

                className="flex gap-3 group cursor-pointer"
              >

                {/* DATE */}
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">

                  <span className="text-sm font-black text-slate-900">

                    {
                      new Date(
                        drive.driveDate
                      ).getDate()
                    }

                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-all">
                      {drive.companyName}
                    </h4>
                    {drive.matchScore !== undefined && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full font-black shrink-0">
                        {drive.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {drive.role}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    {stats?.abGroup === "A" ? (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black">
                        {drive.packageOffered ? `${drive.packageOffered} LPA` : "Practice Module"}
                      </span>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        📍 {drive.location}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          )
        }
      </div>
    </motion.section>
  </div>
</div>
    </DashboardLayout>
  );
};

export default Dashboard;