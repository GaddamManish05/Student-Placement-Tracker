import {
  useEffect,
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { motion }
from "framer-motion";

import useAdminStore
from "../../store/adminStore";

const AdminAnalyticsChart = () => {

  // ====================================
  // STORE
  // ====================================
  const {

    analytics,

    analyticsLoading,

    fetchAnalytics,

  } = useAdminStore();

  // ====================================
  // FETCH
  // ====================================
  useEffect(() => {

    fetchAnalytics();

  }, []);

  // ====================================
  // LOADING
  // ====================================
  if (analyticsLoading) {

    return (

      <div className="bg-white border border-slate-200 rounded-3xl p-10 flex items-center justify-center">

        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

      </div>
    );
  }

  // ====================================
  // DATA
  // ====================================
  const data =
  analytics.monthlyData || [];

  const totalApplications =
  analytics.totalApplications || 0;

  const selectedCount =
  analytics.selectedCount || 0;

  const rejectedCount =
  analytics.rejectedCount || 0;

  const interviewCount =
  analytics.interviewCount || 0;

  const successRate =
  analytics.successRate || 0;

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

          <h3 className="text-2xl font-black text-slate-900">

            Placement Analytics

          </h3>

          <p className="text-sm text-slate-500 mt-2">

            Real-time placement performance overview

          </p>

        </div>

        {/* MINI STATS */}
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
            value={interviewCount}
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
      <div className="h-[260px]">

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
                id="analyticsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#ff6864"
                  stopOpacity={0.25}
                />

                <stop
                  offset="95%"
                  stopColor="#ff6864"
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
                  stopColor="#0b4141"
                  stopOpacity={0.25}
                />

                <stop
                  offset="95%"
                  stopColor="#0b4141"
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

              stroke="#ff6864"

              strokeWidth={3}

              fillOpacity={1}

              fill="url(#analyticsGradient)"
            />

            <Area

              type="monotone"

              dataKey="selected"
              name="Selections"

              stroke="#0b4141"

              strokeWidth={3}

              fillOpacity={1}

              fill="url(#selectedGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

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

export default AdminAnalyticsChart;