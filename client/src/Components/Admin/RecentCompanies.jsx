import {
  motion,
} from "framer-motion";

import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RecentCompanies = (
    {companies = []}
) => {
  let navigate = useNavigate();
  // ====================================
  // STATIC DATA
  // ====================================

  return (

    <motion.section

      initial={false}

      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h3 className="text-2xl font-black text-slate-900">

            Recent Companies

          </h3>

          <p className="text-sm text-slate-500 mt-1">

            Latest placement drives

          </p>

        </div>

        <button className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all"
          onClick={()=>{
            navigate('/admin/companies')
          }}>

          View All

        </button>

      </div>

      {/* ================================= */}
      {/* LIST */}
      {/* ================================= */}
      <div className="space-y-4">

        {
          companies.slice(0,2).map(
            (
              company,
              index
            ) => (

              <motion.div

                key={index}

                whileHover={{
                  y: -2,
                }}

                className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all"
              >

                {/* TOP */}
                <div className="flex items-start justify-between gap-4">

                  {/* LEFT */}
                  <div className="flex items-start gap-4">

                    {/* ICON */}
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">

                      <FiBriefcase />

                    </div>

                    {/* CONTENT */}
                    <div>

                      <h4 className="text-lg font-black text-slate-900">

                        {
                          company.companyName
                        }

                      </h4>

                      <p className="text-sm text-slate-500 mt-1">

                        {
                          company.role
                        }

                      </p>

                    </div>

                  </div>

                  {/* PACKAGE */}
                  <div className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 text-sm font-black">

                    {
                      company.package
                    }

                  </div>

                </div>

                {/* INFO */}
                <div className="flex flex-wrap gap-4 mt-5">

                  <InfoBadge
                    icon={<FiMapPin />}
                    label={
                      company.location
                    }
                  />

                  <InfoBadge
                    icon={<FiCalendar />}
                    label={
                      company.deadline
                    }
                  />

                  <InfoBadge
                    icon={<FiDollarSign />}
                    label={
                      company.package
                    }
                  />

                </div>

              </motion.div>
            )
          )
        }

      </div>

    </motion.section>
  );
};

// ======================================
// INFO BADGE
// ======================================
const InfoBadge = ({
  icon,
  label,
}) => (

  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold">

    {icon}

    {label}

  </div>
);

export default
RecentCompanies;