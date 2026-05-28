import {
  FiEye,
} from "react-icons/fi";

import { motion } from "framer-motion";

const ApplicationsTable = ({
  applications,
}) => {

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

      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >

      {/* HEADER */}
      <div className="px-5 py-4 border-b border-slate-100">

        <h3 className="text-2xl font-black text-slate-900">

          Recent Applications

        </h3>

        <p className="text-sm text-slate-500 mt-1">

          Latest placement activity

        </p>
      </div>

      {/* EMPTY */}
      {
        applications.length === 0
        ? (

          <div className="py-16 text-center">

            <h4 className="text-lg font-bold text-slate-700">

              No Applications Yet

            </h4>

            <p className="text-sm text-slate-500 mt-2">

              Start applying to companies 🚀

            </p>
          </div>
        )
        : (

          <div className="overflow-x-auto">

            <table className="w-full">

              {/* HEAD */}
              <thead className="bg-slate-50 border-b border-slate-100">

                <tr>

                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-400">

                    Company

                  </th>

                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-400">

                    Role

                  </th>

                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-400">

                    Applied

                  </th>

                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-400">

                    Status

                  </th>

                  <th className="text-center px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-400">

                    Action

                  </th>

                </tr>
              </thead>

              {/* BODY */}
              <tbody>

                {
                  applications.map(
                    (app) => (

                      <tr

                        key={app._id}

                        className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                      >

                        {/* COMPANY */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            {/* LOGO */}
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 shrink-0">

                              {
                                app.companyId
                                  ?.companyName?.[0]
                              }

                            </div>

                            {/* INFO */}
                            <div>

                              <h4 className="text-sm font-bold text-slate-900">

                                {
                                  app.companyId
                                    ?.companyName
                                }

                              </h4>

                              <p className="text-xs text-slate-500 mt-1">

                                {
                                  app.companyId
                                    ?.location
                                }

                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">

                          {
                            app.companyId
                              ?.role
                          }

                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4 text-sm text-slate-500">

                          {
                            new Date(
                              app.createdAt
                            ).toLocaleDateString()
                          }

                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">

                          <StatusBadge
                            status={app.status}
                          />

                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-center">

                          <button className="w-9 h-9 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all inline-flex items-center justify-center">

                            <FiEye size={18} />

                          </button>

                        </td>
                      </tr>
                    )
                  )
                }
              </tbody>
            </table>
          </div>
        )
      }
    </motion.section>
  );
};
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

  return (

    <span
      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${
        styles[status]
      }`}
    >

      {status}

    </span>
  );
};

export default ApplicationsTable;