import {
  useEffect,
  useMemo,
  useState,
  useRef
} from "react";

import {
  FiSearch,
  FiDownload,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";

import AdminLayout from "../../Components/Layouts/AdminLayout";

import AdminStatCard from "../../Components/Admin/AdminStatCard";

import RecentApplicationsTable from "../../Components/Admin/RecentApplicationsTable";


import RecentCompanies from "../../Components/Admin/RecentCompanies";

import QuickActions from "../../Components/Admin/QuickActions";

import AdminAnalyticsChart
from "../../Components/Admin/AdminAnalyticsChart";

import SectorDistributionChart
from "../../Components/Admin/SectorDistributionChart";

import BranchPlacementChart
from "../../Components/Admin/BranchPlacementChart";

import StatusBreakdownChart
from "../../Components/Admin/StatusBreakdownChart";

import SectorSalaryChart
from "../../Components/Admin/SectorSalaryChart";

import DashboardSkeleton
from "../../Components/Admin/DashboardSkeleton";

import useAdminStore
from "../../store/adminStore";

const AdminDashboard = () => {

  // ====================================
  // STATES
  // ====================================
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
  showAddCompanyModal,
  setShowAddCompanyModal,
] = useState(false);

  const [
    timeRange,
    setTimeRange,
  ] = useState("This Month");

  const [
    showMoreAnalytics,
    setShowMoreAnalytics,
  ] = useState(false);

  const analyticsRef = useRef(null);

  // ====================================
  // STORE
  // ====================================
  const {

    dashboardStats,

    companies,

    recentApplications,

    dashboardLoading,

    fetchDashboardStats,

    fetchCompanies,

    fetchRecentApplications,

  } = useAdminStore();

  // ====================================
  // FETCH DATA
  // ====================================
  useEffect(() => {

    fetchDashboardStats();

    fetchCompanies();

    fetchRecentApplications();

  }, []);

   const goToAnalytics = () => {
    analyticsRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  

  // ====================================
  // FILTERED APPLICATIONS
  // ====================================
  const filteredApplications =
  useMemo(() => {

    return recentApplications.filter(
      (app) => {

        const student =
        app.studentId?.name
          ?.toLowerCase() || "";

        const company =
        app.companyId?.companyName
          ?.toLowerCase() || "";

        const studentMail = app.studentId?.email?.toLowerCase() || "";

        const studentCgpa = app.studentId?.cgpa || "N/A" ;

        return (

          student.includes(
            searchQuery.toLowerCase()
          )

          ||

          company.includes(
            searchQuery.toLowerCase()
          )
        );
      }
    );

  }, [
    recentApplications,
    searchQuery,
  ]);

  // ====================================
  // FILTERED COMPANIES
  // ====================================
  const filteredCompanies =
  useMemo(() => {

    return companies.filter(
      (company) => {

        return (

          company.companyName
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )

          ||

          company.role
            ?.toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
        );
      }
    );

  }, [
    companies,
    searchQuery,
  ]);

  // ====================================
  // STATS
  // ====================================
  const stats = [

    {
      title:
      "Total Students",

      value:
      dashboardStats.totalStudents,

      icon:
      <FiUser />,

      badge:
      "+12%",

      color:
      "blue",
    },

    {
      title:
      "Companies",

      value:
      dashboardStats.totalCompanies,

      icon:
      <FiBriefcase />,

      badge:
      "+5%",

      color:
      "emerald",
    },

    {
      title:
      "Applications",

      value:
      dashboardStats.totalApplications,

      icon:
      <FiFileText />,

      badge:
      "+18%",

      color:
      "amber",
    },

    {
      title:
      "Placed Students",

      value:
      dashboardStats.placedStudents,

      icon:
      <FiCheckCircle />,

      badge:
      "+8%",

      color:
      "purple",
    },
  ];

  // ====================================
  // LOADING
  // ====================================
  if (dashboardLoading) {

    return (

      <AdminLayout>

        <DashboardSkeleton />

      </AdminLayout>
    );
  }

  return (

    <AdminLayout>

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">

        {/* LEFT */}
        <div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight">

            Placement Overview

          </h1>

          <p className="text-slate-500 mt-2 font-medium">

            Academic Year 2025-26 Performance Dashboard

          </p>

        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-4">

          {/* SEARCH */}
          <div className="relative">

            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search companies or applications..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 w-[300px]"
            />

          </div>

          {/* FILTER */}
          <div className="relative">

            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <select

              value={timeRange}

              onChange={(e) =>
                setTimeRange(
                  e.target.value
                )
              }

              className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none appearance-none"
            >

              <option>
                This Month
              </option>

              <option>
                Last Quarter
              </option>

              <option>
                Full Year
              </option>

            </select>

          </div>

          {/* EXPORT */}
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">

            <FiDownload />

            Export Report

          </button>

        </div>

      </div>

      {/* ================================= */}
      {/* STATS */}
      {/* ================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        {
          stats.map(
            (
              stat,
              index
            ) => (

              <AdminStatCard

                key={index}

                title={stat.title}

                value={stat.value}

                icon={stat.icon}

                badge={stat.badge}

                color={stat.color}
              />
            )
          )
        }

      </div>

      {/* ================================= */}
      {/* ANALYTICS SECTION */}
      {/* ================================= */}
      <div className="grid grid-cols-12 gap-6 mb-6">

        {/* AREA CHART */}
        <div className="col-span-12 xl:col-span-8"
          ref={analyticsRef}>

          <AdminAnalyticsChart />

        </div>

        {/* PIE CHART */}
        <div className="col-span-12 xl:col-span-4">

          <SectorDistributionChart />

        </div>

      </div>

      {/* TOGGLE EXTRA ANALYTICS */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setShowMoreAnalytics(!showMoreAnalytics)}
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-700 shadow-sm"
        >
          {showMoreAnalytics ? "Hide Advanced Insights" : "Show Advanced Insights"}
        </button>
      </div>

      {showMoreAnalytics && (
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <BranchPlacementChart />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-4">
            <StatusBreakdownChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <SectorSalaryChart />
          </div>
        </div>
      )}

      {/* ================================= */}
      {/* EMPTY SEARCH */}
      {/* ================================= */}
      {
        filteredApplications.length === 0
        &&
        filteredCompanies.length === 0
        &&
        searchQuery
        && (

          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center mb-10">

            <FiSearch
              className="mx-auto text-slate-300 mb-5"
              size={48}
            />

            <h3 className="text-2xl font-black text-slate-800">

              No Results Found

            </h3>

            <p className="text-slate-500 mt-2">

              Try searching another company or student.

            </p>

          </div>
        )
      }

      {/* ================================= */}
      {/* APPLICATIONS + ACTIVITY */}
      {/* ================================= */}
      {
        (
          filteredApplications.length > 0
          ||
          filteredCompanies.length > 0
        ) && (

          <>
          
            <div className="grid grid-cols-12 gap-6 mb-10">

              {/* APPLICATIONS */}
              <div className="col-span-12 xl:col-span-8">

                <RecentApplicationsTable
                  applications={
                    filteredApplications
                  }
                />

              </div>

              {/* ACTIVITY */}
              <div className="col-span-12 xl:col-span-4">

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full">

                  {/* HEADER */}
                  <div className="mb-6">

                    <h3 className="text-2xl font-black text-slate-900">

                      Recent Activity

                    </h3>

                    <p className="text-sm text-slate-500 mt-1">

                      Latest placement updates

                    </p>

                  </div>

                  {/* ACTIVITIES */}
                  <div className="space-y-5">

                    {
                      recentApplications
                      .slice(0, 5)
                      .map((item) => (

                        <div
                          key={item._id}
                          className="flex gap-4"
                        >

                          {/* DOT */}
                          <div className="mt-2 w-3 h-3 rounded-full bg-blue-600 shrink-0" />

                          {/* CONTENT */}
                          <div>

                            <h4 className="text-sm font-bold text-slate-800 leading-relaxed">

                              {
                                item.studentId?.name
                              }

                              {" "}
                              applied to

                              {" "}

                              {
                                item.companyId?.companyName
                              }

                            </h4>

                            <p className="text-xs text-slate-500 mt-1">

                              {
                                new Date(
                                  item.createdAt
                                ).toLocaleDateString()
                              }

                            </p>

                          </div>

                        </div>
                      ))
                    }

                  </div>

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* QUICK ACTIONS + COMPANIES */}
            {/* ================================= */}
            <div className="grid grid-cols-12 gap-6">

              {/* QUICK ACTIONS */}
              <div className="col-span-12 xl:col-span-8">

                <QuickActions goToAnalytics={goToAnalytics} />

              </div>

              {/* COMPANIES */}
              <div className="col-span-12 xl:col-span-4">

                <RecentCompanies
                  companies={
                    filteredCompanies
                  }
                />

              </div>

            </div>

          </>
        )
      }

    </AdminLayout>
  );
};

export default AdminDashboard;