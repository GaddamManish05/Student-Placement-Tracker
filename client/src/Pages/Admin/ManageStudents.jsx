import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiBriefcase,
} from "react-icons/fi";

import AdminLayout from "../../Components/Layouts/AdminLayout";

import useAdminStore from "../../store/adminStore";

import StudentDetailModal from "../../Components/Admin/StudentDetailModal";

const ManageStudents = () => {

  // ====================================
  // STATES
  // ====================================
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // ====================================
  // STORE
  // ====================================
  const {

    students,

    studentsLoading,

    fetchStudents,

    toggleStudentStatus

  } = useAdminStore();

  // ====================================
  // FETCH
  // ====================================
  useEffect(() => {

    fetchStudents();

  }, []);

  // ====================================
  // FILTER
  // ====================================
  const filteredStudents =
  useMemo(() => {

    return students.filter(
      (student) =>

        student.name
          ?.toLowerCase()
          .includes(
            searchQuery
              .toLowerCase()
          )
    );

  }, [
    students,
    searchQuery,
  ]);


  // ====================================
// DELETE STUDENT
// ====================================
const handleToggleStatus =
async (id) => {

  const confirmDelete =
  window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return;

  await toggleStudentStatus(id);
};
  // ====================================
  // STATS
  // ====================================
  const studentStats = {

    total:
    students.length,

    placed:
    students.filter(
      (student) =>
        student.placementStatus ===
        "placed"
    ).length,

    unplaced:
    students.filter(
      (student) =>
        student.placementStatus !==
        "placed"
    ).length,

    active:
    students.filter(
      (student) =>
        student.isBlocked !== true
    ).length,
  };

  // ====================================
  // LOADING
  // ====================================
  if (studentsLoading) {

    return (

      <AdminLayout>

        <div className="flex items-center justify-center min-h-[70vh]">

          <div className="text-center">

            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

            <p className="text-slate-500 font-medium">

              Loading students...

            </p>

          </div>

        </div>

      </AdminLayout>
    );
  }

  return (

    <AdminLayout>

      <div className="max-w-[1600px] mx-auto">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">

          <div>

            <h1 className="text-4xl font-black text-slate-900">

              Manage Students

            </h1>

            <p className="text-slate-500 mt-2 font-medium">

              Track and manage student placement records

            </p>

          </div>

        </div>

        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}
        <div className="relative mb-8 max-w-md">

          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
          />

        </div>

        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Total Students"
            value={studentStats.total}
            icon={<FiUsers />}
            color="blue"
          />

          <StatCard
            title="Placed"
            value={studentStats.placed}
            icon={<FiCheckCircle />}
            color="emerald"
          />

          <StatCard
            title="Unplaced"
            value={studentStats.unplaced}
            icon={<FiXCircle />}
            color="red"
          />

          <StatCard
            title="Active"
            value={studentStats.active}
            icon={<FiBriefcase />}
            color="amber"
          />

        </div>

        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="p-7 border-b border-slate-100">

            <h3 className="text-2xl font-black text-slate-900">

              Students

            </h3>

            <p className="text-sm text-slate-500 mt-1">

              Registered student records

            </p>

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
                    Email
                  </TableHead>

                  <TableHead>
                    Branch
                  </TableHead>

                  <TableHead>
                    CGPA
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Actions
                  </TableHead>

                </tr>

              </thead>

              <tbody>

                {
                  filteredStudents.map(
                    (student) => (

                      <tr
                        key={student._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                      >

                        {/* STUDENT */}
                        <td className="px-8 py-6">

                          <div className="flex items-center gap-4">

                            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">

                              {
                                student.name?.[0]
                              }

                            </div>

                            <div>

                              <h4 className="font-bold text-slate-900">

                                {
                                  student.name
                                }

                              </h4>

                              <p className="text-xs text-slate-500 mt-1">

                                Student

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}
                        <td className="px-8 py-6 text-sm text-slate-600">

                          {
                            student.email
                          }

                        </td>

                        {/* BRANCH */}
                        <td className="px-8 py-6 text-sm text-slate-600">

                          {
                            student.branch || "N/A"
                          }

                        </td>

                        {/* CGPA */}
                        <td className="px-8 py-6 font-bold text-slate-700">

                          {
                            student.cgpa || "N/A"
                          }

                        </td>

                        {/* STATUS */}
                        <td className="px-8 py-6">

                          <StatusBadge
                            status={
                              student.placementStatus
                            }
                          />

                        </td>

                        {/* ACTIONS */}
                        <td className="px-8 py-6">

                          <div className="flex items-center gap-3">

                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowStudentModal(true);
                              }}
                              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer"
                            >
                              <FiEye />
                            </button>

                            <button

  onClick={() =>
    handleToggleStatus(
      student._id
    )
  }

  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
    student.isActive

    ? "border border-red-100 text-red-500 hover:bg-red-50"

    : "border border-emerald-100 text-emerald-600 hover:bg-emerald-50"
  }`}
>

  {
    student.isActive

    ? <FiTrash2 />

    : <FiCheckCircle />
  }

</button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

      <StudentDetailModal
        isOpen={showStudentModal}
        onClose={() => {
          setShowStudentModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

    </AdminLayout>
  );
};

// ======================================
// TABLE HEAD
// ======================================
const TableHead = ({
  children,
}) => (

  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">

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

    placed:
      "bg-emerald-50 text-emerald-600",

    unplaced:
      "bg-red-50 text-red-600",
  };

  return (

    <span className={`px-4 py-2 rounded-xl text-xs font-black ${styles[status] || styles.unplaced}`}>

      {status || "unplaced"}

    </span>
  );
};

// ======================================
// STAT CARD
// ======================================
const StatCard = ({
  title,
  value,
  icon,
  color,
}) => {

  const styles = {

    blue:
      "bg-blue-50 text-blue-600",

    emerald:
      "bg-emerald-50 text-emerald-600",

    amber:
      "bg-amber-50 text-amber-600",

    red:
      "bg-red-50 text-red-600",
  };

  return (

    <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${styles[color]}`}>

        {icon}

      </div>

      <h3 className="text-3xl font-black text-slate-900">

        {value}

      </h3>

      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">

        {title}

      </p>

    </div>
  );
};

export default ManageStudents;