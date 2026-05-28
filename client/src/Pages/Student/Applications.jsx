import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

import DashboardLayout
from "../../Components/Layouts/DashboardLayout";

import useApplicationStore
from "../../store/applicationStore";

// ======================================
// APPLICATIONS PAGE
// ======================================
const Applications = () => {

  // ====================================
  // STORE
  // ====================================
  const {

    studentApplications,

    fetchStudentApplications,

    isLoading,

  } = useApplicationStore();

  // ====================================
  // FILTER STATE
  // ====================================
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("All");

  // ====================================
  // FETCH DATA
  // ====================================
  useEffect(() => {

    fetchStudentApplications();

  }, []);

  // ====================================
  // FILTERED DATA
  // ====================================
  const filteredApplications =
  useMemo(() => {

    if(selectedStatus === "All"){

      return studentApplications;
    }

    return studentApplications.filter(
      (app) =>
        app.status === selectedStatus
    );

  }, [
    studentApplications,
    selectedStatus
  ]);

  // ====================================
  // STATUS COUNTS
  // ====================================
  const statusCounts =
  useMemo(() => {

    return {

      Applied:
        studentApplications.filter(
          (app) =>
            app.status ===
            "Applied"
        ).length,

      "Round 1":
        studentApplications.filter(
          (app) =>
            app.status ===
            "Round 1"
        ).length,

      "Round 2":
        studentApplications.filter(
          (app) =>
            app.status ===
            "Round 2"
        ).length,

      "HR Round":
        studentApplications.filter(
          (app) =>
            app.status ===
            "HR Round"
        ).length,

      Selected:
        studentApplications.filter(
          (app) =>
            app.status ===
            "Selected"
        ).length,

      Rejected:
        studentApplications.filter(
          (app) =>
            app.status ===
            "Rejected"
        ).length,
    };

  }, [studentApplications]);

  // ====================================
  // STATUS OPTIONS
  // ====================================
  const statusOptions = [

    "All",

    "Applied",

    "Round 1",

    "Round 2",

    "HR Round",

    "Selected",

    "Rejected",
  ];

  // ====================================
  // LOADING
  // ====================================
  if(isLoading){

    return (

      <DashboardLayout>

        <div className="flex items-center justify-center min-h-[70vh]">

          <div className="text-center">

            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

            <p className="text-slate-500 font-medium">

              Loading applications...

            </p>

          </div>
        </div>

      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-black text-slate-900 tracking-tight">

          My Applications

        </h1>

        <p className="text-slate-500 mt-2 font-medium">

          Track all your placement progress.

        </p>

      </div>

      {/* ================================= */}
      {/* STATUS SUMMARY */}
      {/* ================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">

        <SummaryCard
          title="Applied"
          count={statusCounts["Applied"]}
          color="blue"
        />

        <SummaryCard
          title="Round 1"
          count={statusCounts["Round 1"]}
          color="indigo"
        />

        <SummaryCard
          title="Round 2"
          count={statusCounts["Round 2"]}
          color="purple"
        />

        <SummaryCard
          title="HR Round"
          count={statusCounts["HR Round"]}
          color="amber"
        />

        <SummaryCard
          title="Selected"
          count={statusCounts["Selected"]}
          color="emerald"
        />

        <SummaryCard
          title="Rejected"
          count={statusCounts["Rejected"]}
          color="red"
        />

      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-10">

        {
          statusOptions.map(
            (status) => (

              <button

                key={status}

                onClick={() =>
                  setSelectedStatus(status)
                }

                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  selectedStatus === status
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >

                {status}

              </button>
            )
          )
        }
      </div>

      {/* EMPTY STATE */}
      {
        filteredApplications.length === 0
        ? (

          <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center">

            <FiFileText
              size={52}
              className="mx-auto text-slate-300 mb-5"
            />

            <h3 className="text-2xl font-black text-slate-800">

              No Applications Found

            </h3>

            <p className="text-slate-500 mt-2">

              Start applying to companies 🚀

            </p>

          </div>
        )
        : (

          <div className="space-y-6">

            {
              filteredApplications.map(
                (application, i) => (

                  <motion.div

                    key={application._id}

                    initial={{
                      opacity: 0,
                      y: 20
                    }}

                    animate={{
                      opacity: 1,
                      y: 0
                    }}

                    transition={{
                      delay: i * 0.08
                    }}

                    whileHover={{
                      y: -3
                    }}

                    className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all"
                  >

                    {/* TOP */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                      {/* LEFT */}
                      <div className="flex items-start gap-5">

                        {/* ICON */}
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                          <FiBriefcase size={26} />

                        </div>

                        {/* CONTENT */}
                        <div>

                          <h3 className="text-2xl font-black text-slate-900">

                            {
                              application.companyId
                                ?.companyName
                            }

                          </h3>

                          <p className="text-slate-500 font-medium mt-1">

                            {
                              application.companyId
                                ?.role
                            }

                          </p>

                          <div className="flex flex-wrap gap-4 mt-4">

                            <InfoBadge
                              icon={<FiMapPin />}
                              label={
                                application.companyId
                                  ?.location
                              }
                            />

                            <InfoBadge
                              icon={<FiClock />}
                              label={
                                new Date(
                                  application.createdAt
                                ).toDateString()
                              }
                            />

                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col items-start xl:items-end gap-4">

                        <StatusBadge
                          status={
                            application.status
                          }
                        />

                        <p className="text-sm text-slate-400 font-medium">

                          Applied Recently

                        </p>
                      </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="mt-8 pt-8 border-t border-slate-100">

                      <div className="flex flex-wrap gap-4">

                        <TimelineStep
                          label="Applied"
                          active
                        />

                        <TimelineStep
                          label="Round 1"
                          active={
                            [
                              "Round 1",
                              "Round 2",
                              "HR Round",
                              "Selected"
                            ].includes(
                              application.status
                            )
                          }
                        />

                        <TimelineStep
                          label="Round 2"
                          active={
                            [
                              "Round 2",
                              "HR Round",
                              "Selected"
                            ].includes(
                              application.status
                            )
                          }
                        />

                        <TimelineStep
                          label="HR Round"
                          active={
                            [
                              "HR Round",
                              "Selected"
                            ].includes(
                              application.status
                            )
                          }
                        />

                        <TimelineStep
                          label="Selected"
                          active={
                            application.status ===
                            "Selected"
                          }
                        />

                      </div>
                    </div>

                  </motion.div>
                )
              )
            }

          </div>
        )
      }

    </DashboardLayout>
  );
};

// ======================================
// SUMMARY CARD
// ======================================
const SummaryCard = ({
  title,
  count,
  color,
}) => {

  const styles = {

    blue:
      "bg-blue-50 border-blue-100 text-blue-600",

    indigo:
      "bg-indigo-50 border-indigo-100 text-indigo-600",

    purple:
      "bg-purple-50 border-purple-100 text-purple-600",

    amber:
      "bg-amber-50 border-amber-100 text-amber-600",

    emerald:
      "bg-emerald-50 border-emerald-100 text-emerald-600",

    red:
      "bg-red-50 border-red-100 text-red-600",
  };

  return (

    <motion.div

      whileHover={{
        y: -3,
      }}

      className={`rounded-3xl border p-5 shadow-sm transition-all ${styles[color]}`}
    >

      <p className="text-sm font-bold">

        {title}

      </p>

      <h2 className="text-3xl font-black mt-3">

        {count}

      </h2>

    </motion.div>
  );
};

// ======================================
// STATUS BADGE
// ======================================
const StatusBadge = ({
  status,
}) => {

  const styles = {

    Applied:
      "bg-blue-50 text-blue-600",

    "Round 1":
      "bg-indigo-50 text-indigo-600",

    "Round 2":
      "bg-purple-50 text-purple-600",

    "HR Round":
      "bg-amber-50 text-amber-600",

    Selected:
      "bg-emerald-50 text-emerald-600",

    Rejected:
      "bg-red-50 text-red-600",
  };

  const icons = {

    Applied:
      <FiClock />,

    "Round 1":
      <FiClock />,

    "Round 2":
      <FiClock />,

    "HR Round":
      <FiClock />,

    Selected:
      <FiCheckCircle />,

    Rejected:
      <FiXCircle />,
  };

  return (

    <div
      className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-black ${styles[status]}`}
    >

      {icons[status]}

      {status}

    </div>
  );
};

// ======================================
// INFO BADGE
// ======================================
const InfoBadge = ({
  icon,
  label,
}) => (

  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-600 font-medium">

    {icon}

    {label}

  </div>
);

// ======================================
// TIMELINE STEP
// ======================================
const TimelineStep = ({
  label,
  active = false,
}) => (

  <div
    className={`px-5 py-2 rounded-2xl text-sm font-bold transition-all ${
      active
      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
      : "bg-slate-100 text-slate-400"
    }`}
  >

    {label}

  </div>
);

export default Applications;