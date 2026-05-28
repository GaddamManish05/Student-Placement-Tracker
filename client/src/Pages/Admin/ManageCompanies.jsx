import {
  useEffect,
  useMemo,
  useState,
  cloneElement,
} from "react";

import {
  FiSearch,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
} from "react-icons/fi";

import AdminLayout from "../../Components/Layouts/AdminLayout";
import useAdminStore from "../../store/adminStore.js";
import AddCompanyModal from "../../Components/Admin/AddCompanyModal";

const ManageCompanies = () => {
  // ====================================
  // STATES
  // ====================================
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
  showAddCompanyModal,
  setShowAddCompanyModal,
] = useState(false);

const [
  editCompany,
  setEditCompany,
] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [packageFilter, setPackageFilter] = useState("All");

  // ====================================
  // STORE
  // ====================================
  const {

    companies,

    companyStats,

    loading,

    fetchCompanies,

    updateCompany,

    deleteCompany,

  } = useAdminStore();
  console.log("companies : ",companies)
  // ====================================
  // FETCH DATA
  // ====================================
  useEffect(() => {

    fetchCompanies();

  }, []);

  // ====================================
  // UNIQUE LOCATIONS
  // ====================================
  const uniqueLocations = useMemo(() => {
    if (!Array.isArray(companies)) return [];
    const locations = companies.map((c) => c.location).filter(Boolean);
    return [...new Set(locations)];
  }, [companies]);

  // ====================================
  // FILTERED COMPANIES
  // ====================================
  const filteredCompanies = useMemo(() => {
    if (!Array.isArray(companies)) return [];

    return companies.filter((company) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        company.companyName?.toLowerCase().includes(query) ||
        company.role?.toLowerCase().includes(query) ||
        company.location?.toLowerCase().includes(query)
      );

      const matchesStatus = statusFilter === "All" || company.status === statusFilter;
      const matchesLocation = locationFilter === "All" || company.location === locationFilter;

      const pkg = parseFloat(company.packageOffered) || 0;
      let matchesPackage = true;
      if (packageFilter === "low") {
        matchesPackage = pkg < 5;
      } else if (packageFilter === "mid") {
        matchesPackage = pkg >= 5 && pkg <= 10;
      } else if (packageFilter === "high") {
        matchesPackage = pkg > 10;
      }

      return matchesSearch && matchesStatus && matchesLocation && matchesPackage;
    });
  }, [companies, searchQuery, statusFilter, locationFilter, packageFilter]);

  // ====================================
  // STATS
  // ====================================
  const stats = [

    {
      label:
      "Total Partners",

      value:
      companyStats.totalPartners,

      icon:
      <FiBriefcase />,

      color:
      "text-blue-600",

      bg:
      "bg-blue-50",
    },

    {
      label:
      "Active Drives",

      value:
      companyStats.activeDrives,

      icon:
      <FiCheckCircle />,

      color:
      "text-emerald-600",

      bg:
      "bg-emerald-50",
    },

    {
      label:
      "Avg Package",

      value:
      companyStats.avgPackage,

      icon:
      <FiTrendingUp />,

      color:
      "text-indigo-600",

      bg:
      "bg-indigo-50",
    },

    {
      label:
      "Pending",

      value:
      companyStats.pendingDrives,

      icon:
      <FiAlertCircle />,

      color:
      "text-amber-600",

      bg:
      "bg-amber-50",
    },
  ];

  // ====================================
  // LOADING
  // ====================================
  if (loading) {

    return (

      <AdminLayout>

        <div className="flex items-center justify-center min-h-[70vh]">

          <div className="text-center">

            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

            <p className="text-slate-500 font-medium">

              Loading companies...

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
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">

          {/* LEFT */}
          <div>

            <h1 className="text-4xl font-black text-slate-900">

              Manage Companies

            </h1>

            <p className="text-slate-500 mt-2 font-medium">

              Oversee placement partners and hiring drives

            </p>

          </div>

          {/* BUTTON */}
          <button

          onClick={() =>
          setShowAddCompanyModal(true)}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all">
          Add Company
        </button>

        </div>

        {/* ================================= */}
        {/* SEARCH & FILTERS */}
        {/* ================================= */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* SEARCH */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* LOCATION FILTER */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"
          >
            <option value="All">All Locations</option>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* PACKAGE FILTER */}
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-pointer"
          >
            <option value="All">All Packages</option>
            <option value="low">{"< 5 LPA"}</option>
            <option value="mid">5 - 10 LPA</option>
            <option value="high">10+ LPA</option>
          </select>
        </div>

        {/* ================================= */}
        {/* STATS */}
        {/* ================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          {
            stats.map(
              (
                stat,
                index
              ) => (

                <StatCard
                  key={index}
                  {...stat}
                />
              )
            )
          }

        </div>

        {/* ================================= */}
        {/* TABLE */}
        {/* ================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="p-7 border-b border-slate-100">

            <h3 className="text-2xl font-black text-slate-900">

              Company Drives

            </h3>

            <p className="text-sm text-slate-500 mt-1">

              Active placement partners and hiring details

            </p>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-100">

                  <TableHead>
                    Company
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Package
                  </TableHead>

                  <TableHead>
                    Roles
                  </TableHead>

                  <TableHead>
                    Actions
                  </TableHead>

                </tr>

              </thead>

              <tbody>

                {
                  filteredCompanies.map(
                    (
                      company
                    ) => (

                      <tr

                        key={
                          company._id
                        }

                        className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                      >

                        {/* COMPANY */}
                        <td className="px-8 py-6">

                          <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">

                              {
                                company.companyName?.[0]
                              }

                            </div>

                            <div>

                              <h4 className="font-bold text-slate-900">

                                {
                                  company.companyName
                                }

                              </h4>

                              <p className="text-xs text-slate-500 mt-1">

                                {
                                  company.industry ||
                                  "Placement Partner"
                                }

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* STATUS */}
                        <td className="px-8 py-6">

                          <select
                            value={company.status || "ACTIVE"}
                            onChange={(e) => updateCompany(company._id, { status: e.target.value })}
                            className="px-3 py-1.5 rounded-xl text-xs font-black border border-slate-200 bg-white outline-none cursor-pointer text-slate-700"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="PENDING">PENDING</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>

                        </td>

                        {/* PACKAGE */}
                        <td className="px-8 py-6 font-bold text-slate-700">

                          {
                            company.packageOffered ||
                            "N/A"
                          }

                        </td>

                        {/* ROLE */}
                        <td className="px-8 py-6">

                          <div className="flex flex-wrap gap-2">

                            <span className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">

                              {
                                company.role ||
                                "Software Engineer"
                              }

                            </span>

                          </div>

                        </td>

                        {/* ACTION */}
                        <td className="px-8 py-6">

                          <div className="flex items-center gap-2">

                            {/* EDIT */}
                            <button
                              onClick={() => {
                                setEditCompany(company);
                                setShowAddCompanyModal(true);
                              }}
                              className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer"
                            >
                              Edit
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${company.companyName}?`)) {
                                  deleteCompany(company._id);
                                }
                              }}
                              className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all cursor-pointer"
                            >
                              Delete
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

          {/* EMPTY */}
          {
            filteredCompanies.length === 0 && (

              <div className="py-16 text-center">

                <h3 className="text-xl font-black text-slate-900">

                  No Companies Found

                </h3>

                <p className="text-slate-500 mt-2">

                  Try adjusting your search query

                </p>

              </div>
            )
          }

          {/* FOOTER */}
          <div className="p-8 border-t border-slate-100 flex justify-between items-center">

            <p className="text-sm text-slate-400">

              Showing {
                filteredCompanies.length
              } companies

            </p>

            <div className="flex items-center gap-2">

              <PaginationBtn
                icon={<FiChevronLeft />}
              />

              <PaginationBtn
                label="1"
                active
              />

              <PaginationBtn
                icon={<FiChevronRight />}
              />

            </div>

          </div>

        </div>

      </div>
              {/* ================================= */}
    {/* ADD COMPANY MODAL */}
    {/* ================================= */}
    <AddCompanyModal

  isOpen={
    showAddCompanyModal
  }

  onClose={() => {

    setShowAddCompanyModal(
      false
    );

    setEditCompany(
      null
    );
  }}

  editCompany={
    editCompany
  }
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

    ACTIVE:
      "bg-emerald-50 text-emerald-600 border-emerald-100",

    PENDING:
      "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (

    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${styles[status] || styles.ACTIVE}`}>

      {status}

    </span>
  );
};

// ======================================
// STAT CARD
// ======================================
const StatCard = ({
  label,
  value,
  icon,
  color,
  bg,
}) => (

  <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">

    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${bg} ${color}`}>

      {
        cloneElement(
          icon,
          {
            size: 22,
          }
        )
      }

    </div>

    <h3 className="text-3xl font-black text-slate-900">

      {value}

    </h3>

    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">

      {label}

    </p>

  </div>
);

// ======================================
// PAGINATION
// ======================================
const PaginationBtn = ({
  label,
  icon,
  active,
}) => (

  <button className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
    active
    ? "bg-blue-600 text-white"
    : "border border-slate-200 text-slate-600"
  }`}>

    {icon || label}

  </button>
);

export default ManageCompanies;