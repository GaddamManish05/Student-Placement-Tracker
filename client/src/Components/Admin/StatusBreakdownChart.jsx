import { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import useAdminStore from "../../store/adminStore";

const STATUS_COLORS = {
  "Applied": "#ff6864",     // Vibrant Coral
  "Round 1": "rgba(255, 104, 100, 0.7)",
  "Round 2": "rgba(255, 104, 100, 0.4)",
  "HR Round": "rgba(11, 65, 65, 0.4)",
  "Selected": "#0b4141",     // Deep Teal
  "Rejected": "rgba(11, 65, 65, 0.7)",
};

const StatusBreakdownChart = () => {
  const { analytics, analyticsLoading, fetchAnalytics } = useAdminStore();

  useEffect(() => {
    if (!analytics.statusDistribution) {
      fetchAnalytics();
    }
  }, []);

  if (analyticsLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-10 flex items-center justify-center h-[350px]">
        <div className="w-12 h-12 border-4 border-[#ff6864] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const data = analytics.statusDistribution || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full"
    >
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900">Application Statuses</h3>
        <p className="text-sm text-slate-500 mt-1">Breakdown of applications by progress level</p>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={STATUS_COLORS[entry.name] || "#ff6864"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default StatusBreakdownChart;
