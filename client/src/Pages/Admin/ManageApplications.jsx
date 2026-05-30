import {
  useState,
  useEffect,
  useMemo
} from "react";

import {
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

import AdminLayout
from "../../Components/Layouts/AdminLayout";

import useAdminStore from "../../store/adminStore";

import StudentDetailModal from "../../Components/Admin/StudentDetailModal";

const ManageApplications = () => {

  const [searchQuery,
  setSearchQuery] =
  useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // ====================================
  // APPLICATIONS
  // ====================================
const {

  applications,

  applicationsLoading,

  fetchApplications,

  updateApplicationStatus

} = useAdminStore();


  useEffect(() => {

  fetchApplications();

}, []);

const applicationStats = {

  total:
  applications.length,

  selected:
  applications.filter(
    (app) =>
      app.status ===
      "Selected"
  ).length,

  rejected:
  applications.filter(
    (app) =>
      app.status ===
      "Rejected"
  ).length,

  inProgress:
  applications.filter(
    (app) =>

      app.status !==
      "Selected" &&

      app.status !==
      "Rejected"
  ).length,
};


// ====================================
// UNIQUE BRANCHES
// ====================================
const uniqueBranches = useMemo(() => {
  if (!Array.isArray(applications)) return [];
  const branches = applications.map(app => app.studentId?.branch).filter(Boolean);
  return [...new Set(branches)];
}, [applications]);

// ====================================
// FILTERED APPLICATIONS
// ====================================
const filteredApplications = useMemo(() => {
  if (!Array.isArray(applications)) return [];
  return applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      app.studentId?.name?.toLowerCase().includes(query) ||
      app.companyId?.companyName?.toLowerCase().includes(query) ||
      app.companyId?.role?.toLowerCase().includes(query) ||
      app.studentId?.branch?.toLowerCase().includes(query)
    );

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesBranch = branchFilter === "All" || app.studentId?.branch === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });
}, [applications, searchQuery, statusFilter, branchFilter]);

console.log("applications :",applications);
  return (

    <AdminLayout>

      <div className="max-w-[1600px] mx-auto">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">

          <div>

            <h1 className="text-4xl font-black text-slate-900">

              Manage Applications

            </h1>

            <p className="text-slate-500 mt-2 font-medium">

              Track student applications and placement progress

            </p>

          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <div className="relative">

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
                className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none w-[260px]"
              />

            </div>

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Round 1">Round 1</option>
              <option value="Round 2">Round 2</option>
              <option value="HR Round">HR Round</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* BRANCH FILTER */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"
            >
              <option value="All">All Branches</option>
              {uniqueBranches.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <StatCard
            title="Total Applications"
            value={applicationStats.total}
            icon={<FiClock />}
            color="blue"
          />

          <StatCard
            title="Selected"
            value={applicationStats.selected}
            icon={<FiCheckCircle />}
            color="emerald"
          />

          <StatCard
            title="In Progress"
            value={applicationStats.inProgress}
            icon={<FiClock />}
            color="amber"
          />

          <StatCard
            title="Rejected"
            value={applicationStats.rejected}
            icon={<FiXCircle />}
            color="red"
          />

        </div>

        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="p-7 border-b border-slate-100 flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-black text-slate-900">

                Applications

              </h3>

              <p className="text-sm text-slate-500 mt-1">

                Student placement activity

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
                    Role
                  </TableHead>

                  <TableHead>
                    Branch
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
                  filteredApplications.map(
                    (app) => (

                      <tr
                        key={app._id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                      >

                        {/* STUDENT */}
                        <td className="px-8 py-6">

                          <div className="flex items-center gap-4">

                            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">

                              {
                                  app.studentId?.name?.[0] || "S"
                              }

                            </div>

                            <div>

                              <h4 className="font-bold text-slate-900">

                                {app.studentId?.name || "Unknown Student"}

                              </h4>

                              <p className="text-xs text-slate-500 mt-1">

                                Student

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* COMPANY */}
                        <td className="px-8 py-6 font-bold text-slate-700">

                          {
                            app.companyId?.companyName || "N/A"
                          }

                        </td>

                        {/* ROLE */}
                        <td className="px-8 py-6 text-sm text-slate-600">

                          {
                            app.companyId.role || "N/A"
                          }

                        </td>

                        {/* BRANCH */}
                        <td className="px-8 py-6 text-sm text-slate-600">

                          {
                            app.studentId.branch || "N/A"
                          }

                        </td>

                        {/* STATUS */}
                        <td className="px-8 py-6">

                          <select

  value={
    app.status
  }

  onChange={(e) =>
    updateApplicationStatus(

      app._id,

      e.target.value
    )
  }

  className={`px-4 py-2 rounded-xl text-xs font-black border-0 outline-none cursor-pointer ${getStatusStyles(
    app.status
  )}`}
>

  <option value="Applied">
    Applied
  </option>

  <option value="Round 1">
    Round 1
  </option>

  <option value="Round 2">
    Round 2
  </option>

  <option value="HR Round">
    HR Round
  </option>

  <option value="Selected">
    Selected
  </option>

  <option value="Rejected">
    Rejected
  </option>

</select>

                        </td>

                        {/* ACTIONS */}
                        <td className="px-8 py-6">

                          <button
                            onClick={() => {
                              setSelectedStudent(app.studentId);
                              setShowStudentModal(true);
                            }}
                            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            <FiEye />
                          </button>

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>
              {
  filteredApplications.length === 0 && (

    <tr>

      <td
        colSpan={6}
        className="text-center py-16"
      >

        <div>

          <h3 className="text-lg font-black text-slate-700">

            No Applications Found

          </h3>

          <p className="text-sm text-slate-500 mt-2">

            Try searching with another keyword

          </p>

        </div>

      </td>

    </tr>
  )
}

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

// ======================================
// STATUS STYLES
// ======================================
const getStatusStyles =
(status) => {

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

  return styles[status];
};

export default ManageApplications;

