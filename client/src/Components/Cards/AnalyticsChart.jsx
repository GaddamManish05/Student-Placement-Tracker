import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { motion } from "framer-motion";

import useApplicationStore
from "../../store/applicationStore";

const AnalyticsChart = () => {

  // ====================================
  // STORE
  // ====================================
  const {
    studentApplications,
  } = useApplicationStore();

  // ====================================
  // MONTHS
  // ====================================
  const months = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ====================================
  // DYNAMIC DATA
  // ====================================
  const data = months.map(
    (month, index) => {

      const applications =
      studentApplications.filter(
        (app) => {

          const appDate =
          new Date(
            app.createdAt
          );

          return (
            appDate.getMonth() === index
          );
        }
      ).length;

      const selected =
      studentApplications.filter(
        (app) => {

          const appDate =
          new Date(
            app.createdAt
          );

          return (

            appDate.getMonth() === index

            &&

            app.status ===
            "Selected"
          );
        }
      ).length;

      return {

        month,

        applications,

        selected,
      };
    }
  );

  // ====================================
  // TOTALS
  // ====================================
  const totalApplications =
  studentApplications.length;

  const selectedCount =
  studentApplications.filter(
    (app) =>
      app.status ===
      "Selected"
  ).length;

  const rejectedCount =
  studentApplications.filter(
    (app) =>
      app.status ===
      "Rejected"
  ).length;

  const activeInterviews =
  studentApplications.filter(
    (app) =>

      app.status ===
      "Round 1"

      ||

      app.status ===
      "Round 2"

      ||

      app.status ===
      "HR Round"
  ).length;

  return (

    <motion.section

      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.4,
      }}

      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">

        <div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight">

            Placement Analytics

          </h3>

          <p className="text-sm text-slate-500 mt-2 font-medium">

            Real-time application performance overview

          </p>

        </div>

        {/* STATS */}
        <div className="flex flex-wrap gap-3">

          <MiniStat
            label="Applications"
            value={totalApplications}
            color="blue"
          />

          <MiniStat
            label="Selected"
            value={selectedCount}
            color="emerald"
          />

          <MiniStat
            label="Interviews"
            value={activeInterviews}
            color="amber"
          />

          <MiniStat
            label="Rejected"
            value={rejectedCount}
            color="red"
          />

        </div>

      </div>

      {/* ================================= */}
      {/* CHART */}
      {/* ================================= */}
      <div className="h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >

            {/* GRADIENT */}
            <defs>

              <linearGradient
                id="applicationsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.25}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />

              </linearGradient>

              <linearGradient
                id="selectedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#10b981"
                  stopOpacity={0.25}
                />

                <stop
                  offset="95%"
                  stopColor="#10b981"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            {/* GRID */}
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e2e8f0"
            />

            {/* X AXIS */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#64748b",
                fontWeight: 600,
              }}
            />

            {/* Y AXIS */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#94a3b8",
              }}
            />

            {/* TOOLTIP */}
            <Tooltip

              contentStyle={{

                borderRadius: "16px",

                border:
                "1px solid #e2e8f0",

                boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",

                fontSize: "13px",
              }}
            />

            {/* AREA */}
            <Area

              type="monotone"

              dataKey="applications"
              name="Applications"

              stroke="#2563eb"

              strokeWidth={3}

              fillOpacity={1}

              fill="url(#applicationsGradient)"
            />

            <Area

              type="monotone"

              dataKey="selected"
              name="Selections"

              stroke="#10b981"

              strokeWidth={3}

              fillOpacity={1}

              fill="url(#selectedGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

        <FooterCard
          title="Highest Activity"
          value="May"
        />

        <FooterCard
          title="Success Rate"
          value={`${
            totalApplications > 0

            ? Math.round(
                (
                  selectedCount /
                  totalApplications
                ) * 100
              )

            : 0
          }%`}
        />

        <FooterCard
          title="Current Stage"
          value={
            activeInterviews > 0
            ? "Interviewing"
            : "Applying"
          }
        />

        <FooterCard
          title="Placement Status"
          value={
            selectedCount > 0
            ? "Placed"
            : "Unplaced"
          }
        />

      </div>

    </motion.section>
  );
};

// ======================================
// MINI STAT
// ======================================
const MiniStat = ({
  label,
  value,
  color,
}) => {

  const styles = {

    blue:
      "bg-blue-50 text-blue-600 border-blue-100",

    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100",

    amber:
      "bg-amber-50 text-amber-600 border-amber-100",

    red:
      "bg-red-50 text-red-600 border-red-100",
  };

  return (

    <div className={`px-4 py-3 rounded-2xl border ${styles[color]}`}>

      <p className="text-xs font-bold uppercase tracking-wide">

        {label}

      </p>

      <h4 className="text-xl font-black mt-1">

        {value}

      </h4>

    </div>
  );
};

// ======================================
// FOOTER CARD
// ======================================
const FooterCard = ({
  title,
  value,
}) => (

  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">

      {title}

    </p>

    <h4 className="text-lg font-black text-slate-900 mt-2">

      {value}

    </h4>

  </div>
);

export default AnalyticsChart;