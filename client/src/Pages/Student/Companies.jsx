import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import { toast } from "sonner";

import DashboardLayout
from "../../Components/Layouts/DashboardLayout";

import useCompanyStore
from "../../store/companyStore";

import useApplicationStore
from "../../store/applicationStore";

import useAuthStore
from "../../store/authStore";

const Companies = () => {

  // ====================================
  // STORE
  // ====================================
  const {
    companies,
    fetchCompanies,
    isLoading,
  } = useCompanyStore();

  const {
    applyForCompany,
    applications,
    fetchStudentApplications
  } = useApplicationStore();

  const {
    currentUser,
  } = useAuthStore();

  // ====================================
  // LOCAL STATE
  // ====================================
  const [
    search,
    setSearch,
  ] = useState("");

  // ====================================
  // FETCH COMPANIES
  // ====================================
  useEffect(() => {

    fetchCompanies();

    fetchStudentApplications();

  }, []);

  // ====================================
  // FILTERED COMPANIES
  // ====================================
  const filteredCompanies =
  useMemo(() => {

    return companies.filter(
      (company) => {

        return (

          company.companyName
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          company.role
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );
      }
    );

  }, [companies, search]);

  // ====================================
  // APPLY HANDLER
  // ====================================
  const handleApply =
  async (companyId, role) => {

    const loadingToast =
    toast.loading(
      "Submitting application..."
    );

    const result =
    await applyForCompany(
      companyId,
      role
    );

    if(result.success){
      // REFRESH APPLICATIONS
      await fetchStudentApplications();
      toast.success(
        "Application submitted 🚀",
        {
          id: loadingToast
        }
      );

    } else {

      toast.error(
        result.error,
        {
          id: loadingToast
        }
      );
    }
  };

  // ====================================
// CHECK APPLIED
// ====================================
const hasApplied =
(companyId) => {

  return applications.some(
    (app) =>

      app.companyId?._id ===
      companyId
  );
};

  // ====================================
  // ELIGIBILITY
  // ====================================
  const isEligible =
  (company) => {

    return (

      currentUser?.cgpa >=
      company.minCGPA

      &&

      company.allowedBranches
        ?.includes(
          currentUser?.branch
        )
    );
  };

  // ====================================
  // LOADING
  // ====================================
  if (isLoading) {

    return (

      <DashboardLayout>

        <div className="flex items-center justify-center min-h-[70vh]">

          <div className="text-center">

            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

            <p className="text-slate-500 font-medium">
              Loading companies...
            </p>

          </div>
        </div>

      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-black text-slate-900 tracking-tight">

          Explore Opportunities

        </h1>

        <p className="text-slate-500 mt-2 font-medium">

          Browse verified placement opportunities.

        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-10">

        <div className="relative max-w-xl">

          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search companies or roles..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
          />
        </div>
      </div>

      {/* EMPTY */}
      {
        filteredCompanies.length === 0
        ? (

          <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center">

            <FiBriefcase
              size={48}
              className="mx-auto text-slate-300 mb-4"
            />

            <h3 className="text-xl font-black text-slate-800">

              No Companies Found

            </h3>

            <p className="text-slate-500 mt-2">

              Try searching another role.

            </p>

          </div>
        )
        : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {
              filteredCompanies.map(
                (company, i) => {

                  const eligible =
                  isEligible(company);

                  return (

                    <motion.div

                      key={company._id}

                      initial={{
                        opacity: 0,
                        y: 20
                      }}

                      animate={{
                        opacity: 1,
                        y: 0
                      }}

                      transition={{
                        delay: i * 0.08
                      }}

                      whileHover={{
                        y: -5
                      }}

                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all"
                    >

                      {/* TOP */}
                      <div className="flex items-start justify-between mb-6">

                        <div>

                          <h3 className="text-xl font-black text-slate-900">

                            {
                              company.companyName
                            }

                          </h3>

                          <p className="text-slate-500 mt-1">

                            {company.role}

                          </p>

                        </div>

                        {
                          eligible
                          ? (

                            <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black">

                              <FiCheckCircle />

                              Eligible

                            </div>

                          )
                          : (

                            <div className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-black">

                              <FiXCircle />

                              Not Eligible

                            </div>

                          )
                        }
                      </div>

                      {/* DETAILS */}
                      <div className="space-y-4 mb-8">

                        <DetailRow
                          icon={<FiDollarSign />}
                          label={`${company.packageOffered} LPA`}
                        />

                        <DetailRow
                          icon={<FiMapPin />}
                          label={company.location}
                        />

                        <DetailRow
                          icon={<FiCalendar />}
                          label={
                            new Date(
                              company.driveDate
                            ).toDateString()
                          }
                        />

                        <DetailRow
                          icon={<FiBriefcase />}
                          label={`Min CGPA ${company.minCGPA}`}
                        />
                      </div>

                      {/* BUTTON */}
                      <motion.button

                        whileTap={{
                          scale: 0.97
                        }}

                        disabled={!eligible || hasApplied(company._id)
}

                        onClick={() =>
                          handleApply(
                            company._id,
                            company.role
                          )
                        }

                        className={`w-full py-4 rounded-2xl font-bold transition-all ${
                        hasApplied(company._id)
                        ? "bg-emerald-100 text-emerald-600 cursor-not-allowed"
                        : eligible
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                      >
                        {
                            hasApplied(company._id)
                            ? "Applied"
                            : eligible
                            ? "Apply Now"
                            : "Not Eligible"
                        }
                      </motion.button>
                    </motion.div>
                  );
                }
              )
            }
          </div>
        )
      }
    </DashboardLayout>
  );
};

// ====================================
// DETAIL ROW
// ====================================
const DetailRow = ({
  icon,
  label,
}) => (

  <div className="flex items-center gap-3 text-sm text-slate-600">

    <div className="p-2 rounded-xl bg-slate-100 text-slate-500">

      {icon}

    </div>

    <span className="font-medium">

      {label}

    </span>

  </div>
);

export default Companies;