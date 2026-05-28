import { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import useAdminStore from "../../store/adminStore";

const SectorSalaryChart = () => {
  const { analytics, analyticsLoading, fetchAnalytics } = useAdminStore();

  useEffect(() => {
    if (!analytics.sectorAverageSalary) {
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

  const data = analytics.sectorAverageSalary || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full"
    >
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900">Average Salary by Sector</h3>
        <p className="text-sm text-slate-500 mt-1">Average packages offered (LPA) in key categories</p>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            />
            <Tooltip
              formatter={(value) => [`${value} LPA`, "Average Package"]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="avgPackage" name="Avg Package (LPA)" fill="#ff6864" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default SectorSalaryChart;
