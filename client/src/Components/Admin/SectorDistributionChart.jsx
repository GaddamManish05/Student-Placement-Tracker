import {
  useEffect,
} from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import useAdminStore
from "../../store/adminStore";

const COLORS = [
  "#ff6864", // Vibrant Coral
  "#0b4141", // Deep Teal
  "rgba(11, 65, 65, 0.4)", // Deep Teal Tint
  "rgba(255, 104, 100, 0.5)", // Vibrant Coral Tint
];

const SectorDistributionChart = () => {

  // ====================================
  // STORE
  // ====================================
  const {

    analytics,

    fetchAnalytics,

  } = useAdminStore();

  // ====================================
  // FETCH
  // ====================================
  useEffect(() => {

    if (
      !analytics.sectorDistribution
    ) {

      fetchAnalytics();
    }

  }, []);

  // ====================================
  // DATA
  // ====================================
  const data =
  analytics
  .sectorDistribution || [];

  return (

    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm h-full">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}
      <div className="mb-4">

        <h3 className="text-xl font-black text-slate-900">

          Sector Distribution

        </h3>

        <p className="text-sm text-slate-500 mt-1">

          Hiring categories overview

        </p>

      </div>

      {/* ================================= */}
      {/* CHART */}
      {/* ================================= */}
      <div className="h-[220px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie

              data={data}

              dataKey="value"

              innerRadius={55}

              outerRadius={85}

              paddingAngle={4}
            >

              {
                data.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                          COLORS.length
                        ]
                      }
                    />
                  )
                )
              }

            </Pie>

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* ================================= */}
      {/* LEGENDS */}
      {/* ================================= */}
      <div className="space-y-4 mt-2">

        {
          data.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className="flex items-center justify-between"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3">

                  <div

                    className="w-3 h-3 rounded-full"

                    style={{

                      background:
                      COLORS[index],
                    }}
                  />

                  <p className="text-sm font-semibold text-slate-700">

                    {item.name}

                  </p>

                </div>

                {/* VALUE */}
                <p className="text-sm font-black text-slate-900">

                  {item.value}

                </p>

              </div>
            )
          )
        }

      </div>

    </div>
  );
};

export default
SectorDistributionChart;