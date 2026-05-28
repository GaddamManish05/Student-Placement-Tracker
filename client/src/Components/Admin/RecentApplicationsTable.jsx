import { motion } from "framer-motion";
import { useState } from "react";
import { FiEye } from "react-icons/fi";
import StudentDetailModal from "./StudentDetailModal";

const RecentApplicationsTable = ({
  applications = [],
}) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentModal, setShowStudentModal] = useState(false);
  return (

    <motion.section
      initial={false}
      className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
    >

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

        <div>

          <h3 className="text-2xl font-black text-slate-900">

            Recent Applications

          </h3>

          <p className="text-sm text-slate-500 mt-1">

            Latest student placement activity

          </p>

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <TableHead>
                Student
              </TableHead>

              <TableHead>
                Company
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Action
              </TableHead>

            </tr>

          </thead>

          <tbody>

            {
              applications.map((app) => (

                <motion.tr

                  key={app._id}

                  whileHover={{
                    backgroundColor:
                    "#f8fafc"
                  }}

                  className="border-b border-slate-100"
                >

                  {/* STUDENT */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">

                        {
                          app.studentId?.name?.[0]
                        }

                      </div>

                      <div>

                        <h4 className="font-bold text-slate-900">

                          {
                            app.studentId?.name
                          }

                        </h4>

                        <p className="text-xs text-slate-500 mt-1">

                          {
                            app.studentId?.branch
                          }

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* COMPANY */}
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700">

                    {
                      app.companyId?.companyName
                    }

                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">

                    <StatusBadge
                      status={app.status}
                    />

                  </td>

                  {/* ACTION */}
                  <td className="px-8 py-6">

                    <button
                      onClick={() => {
                        setSelectedStudent(app.studentId);
                        setShowStudentModal(true);
                      }}
                    className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer"                        >
                      <FiEye />
                  </button>

                  </td>

                </motion.tr>
              ))
            }

          </tbody>

        </table>

      </div>
      <StudentDetailModal
        isOpen={showStudentModal}
        onClose={() => {
          setShowStudentModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

    </motion.section>
  );
};

// ======================================
// TABLE HEAD
// ======================================
const TableHead = ({
  children,
}) => (

  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wide text-slate-400">

    {children}

  </th>
);

// ======================================
// STATUS BADGE
// ======================================
const StatusBadge = ({
  status,
}) => {

  const styles = {

    Applied:
      "bg-blue-50 text-blue-600",

    Interview:
      "bg-indigo-50 text-indigo-600",

    Selected:
      "bg-emerald-50 text-emerald-600",

    Rejected:
      "bg-red-50 text-red-600",
  };

  return (

    <span className={`px-4 py-2 rounded-xl text-xs font-black ${styles[status]}`}>

      {status}

    </span>
  );
};

export default RecentApplicationsTable;