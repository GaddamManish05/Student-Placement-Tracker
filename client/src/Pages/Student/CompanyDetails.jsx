import { useEffect, cloneElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiMapPin, FiCalendar, FiCheckCircle, 
  FiGlobe, FiUsers, FiMail, FiBookmark,
  FiCode, FiArrowLeft, FiXCircle
} from "react-icons/fi";
import { toast } from "sonner";
import DashboardLayout from "../../Components/Layouts/DashboardLayout";
import useCompanyStore from "../../store/companyStore";
import useApplicationStore from "../../store/applicationStore";
import useAuthStore from "../../store/authStore";

/**
 * Company Details Component
 * Displays comprehensive job role information, eligibility criteria, 
 * selection process steps, and hiring insights.
 */
const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedCompany, fetchCompanyById, isLoading: isCompanyLoading } = useCompanyStore();
  const { applyForCompany, studentApplications, fetchStudentApplications, isLoading: isAppLoading } = useApplicationStore();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchCompanyById(id);
      fetchStudentApplications();
    }
  }, [id]);

  if (isCompanyLoading || !selectedCompany) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#ff6864] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500 font-medium">Loading company details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Evaluate eligibility
  const isEligibleCGPA = currentUser?.cgpa >= selectedCompany.minCGPA;
  const isEligibleBranch = selectedCompany.allowedBranches?.includes(currentUser?.branch);
  const isEligible = isEligibleCGPA && isEligibleBranch;

  // Check if already applied
  const hasApplied = studentApplications.some(
    (app) => (app.companyId?._id || app.companyId) === selectedCompany._id
  );

  const handleApply = async () => {
    if (!isEligible) {
      toast.error("You do not meet the eligibility criteria for this hiring drive.");
      return;
    }
    const res = await applyForCompany(selectedCompany._id, selectedCompany.role);
    if (res.success) {
      toast.success(`Successfully applied to ${selectedCompany.companyName}!`);
      fetchStudentApplications();
    } else {
      toast.error(res.error || "Failed to submit application");
    }
  };

  const selectionProcess = [
    {
      step: 1,
      title: "Online Assessment",
      duration: "90 minutes",
      description: "Data Structures, Algorithms, and System Design MCQs.",
      tag: "Auto-evaluated"
    },
    {
      step: 2,
      title: "Technical Interview I",
      duration: "Live coding session",
      description: "Focusing on problem-solving and clean code principles."
    },
    {
      step: 3,
      title: "System Design & Cultural Fit",
      duration: "Architectural discussion",
      description: "Behavioral rounds with the engineering manager."
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-4 max-w-7xl mx-auto font-sans text-slate-900">
        
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-semibold text-sm cursor-pointer"
        >
          <FiArrowLeft /> Back to Drives
        </button>

        {/* Company Hero Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#faf0dc]/50 rounded-bl-full -z-0"></div>
          
          <div className="flex items-center gap-6 md:gap-8 relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm p-3 shrink-0">
              <span className="text-3xl font-black text-[#0b4141] uppercase">
                {selectedCompany.companyName.substring(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                {selectedCompany.companyName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1 text-sm font-medium">
                  <FiMapPin /> {selectedCompany.location}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Hiring Active
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Status: {selectedCompany.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-end">
            {hasApplied ? (
              <button 
                disabled 
                className="w-full md:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 justify-center cursor-not-allowed opacity-90"
              >
                <FiCheckCircle size={18} /> Applied
              </button>
            ) : !isEligible ? (
              <button 
                disabled 
                className="w-full md:w-auto px-8 py-4 bg-slate-200 text-slate-400 font-bold rounded-xl flex items-center gap-2 justify-center cursor-not-allowed"
              >
                <FiXCircle size={18} /> Ineligible
              </button>
            ) : (
              <button 
                onClick={handleApply}
                disabled={isAppLoading}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#ff6864] to-[#0b4141] text-white font-bold rounded-xl shadow-lg hover:opacity-95 active:scale-98 transition-all cursor-pointer"
              >
                {isAppLoading ? "Applying..." : "Apply Now"}
              </button>
            )}
            <button className="p-4 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
              <FiBookmark size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Job Details Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 pb-8 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    {selectedCompany.role}
                  </h2>
                  <p className="text-slate-500 font-medium flex items-center gap-2">
                    Full-time <span className="w-1 h-1 bg-slate-300 rounded-full"></span> Campus Placement
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-3xl font-black text-[#ff6864]">
                    {selectedCompany.packageOffered} LPA
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Annual Package (CTC)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatItem label="Allowed Branches" value={selectedCompany.allowedBranches?.join(", ") || "All"} />
                <StatItem label="Hiring Drive Date" value={new Date(selectedCompany.driveDate).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })} />
                <StatItem label="Last Date to Apply" value={new Date(selectedCompany.lastDate).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })} />
              </div>

              {/* Description Section */}
              <div className="pt-8 border-t border-slate-100 mb-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#0b4141] mb-3">Job Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedCompany.description || "No job description has been added for this hiring drive. Please review requirements and allowed branches before applying."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                {/* Skills Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#0b4141] font-bold mb-2">
                    <FiCode />
                    <h4 className="text-sm uppercase tracking-wider">Scope and Technologies</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Software Development", "System Infrastructure", "Database Management", "Agile Teams"].map(skill => (
                      <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100 italic">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Eligibility Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#0b4141] font-bold mb-2">
                    <FiCheckCircle />
                    <h4 className="text-sm uppercase tracking-wider">Hiring Eligibility Status</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm font-medium">
                      {isEligibleCGPA ? (
                        <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      ) : (
                        <FiXCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                      )}
                      <span className={isEligibleCGPA ? "text-slate-600" : "text-red-600 font-bold"}>
                        CGPA Requirement: {selectedCompany.minCGPA} (Your CGPA: {currentUser?.cgpa})
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium">
                      {isEligibleBranch ? (
                        <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      ) : (
                        <FiXCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                      )}
                      <span className={isEligibleBranch ? "text-slate-600" : "text-red-600 font-bold"}>
                        Branch Requirement: {selectedCompany.allowedBranches?.join(", ")} (Your Branch: {currentUser?.branch})
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium">
                      <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      <span className="text-slate-600">No active backlogs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Selection Process Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Selection Process</h3>
              <div className="space-y-0 relative before:absolute before:left-5 before:top-2 before:bottom-12 before:w-[2px] before:bg-slate-100">
                {selectionProcess.map((item, idx) => (
                  <div key={idx} className="flex gap-8 mb-12 last:mb-0 relative">
                    <div className="w-10 h-10 rounded-full bg-[#0b4141] text-white flex items-center justify-center font-bold shadow-lg shadow-[#0b4141]/10 z-10 shrink-0">
                      {item.step}
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        {item.tag && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded border border-slate-200">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 font-medium mb-1">{item.duration}</p>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-xl">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Details Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* About Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-6">About the Recruiter</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                {selectedCompany.companyName} is an active industry partner. They participate in campus hiring events annually to source talented engineering and operations graduates.
              </p>
              <div className="space-y-5">
                <AboutLink icon={<FiGlobe />} label={`${selectedCompany.companyName.toLowerCase().replace(/\s+/g, "")}.com`} />
                <AboutLink icon={<FiUsers />} label="Industry Leader" />
                <AboutLink icon={<FiCalendar />} label="Recruiting Globally" />
              </div>
            </div>

            {/* Hiring Probability Widget */}
            <div className="bg-[#faf0dc] border border-[#faf0dc] rounded-3xl p-8">
              <h4 className="font-bold text-[#0b4141] mb-6 text-sm uppercase tracking-wider">Application Insights</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#0b4141]">Match Strength</span>
                <span className="text-[10px] font-black text-[#ff6864] uppercase tracking-widest">
                  {isEligible ? "High Match" : "Requirements Incomplete"}
                </span>
              </div>
              <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden mb-8">
                <div 
                  className={`h-full rounded-full ${isEligible ? "bg-[#ff6864] w-[90%]" : "bg-red-500 w-[30%]"}`}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
                  <p className="text-2xl font-black text-[#0b4141]">{selectedCompany.totalApplications || 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Applicants</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
                  <p className="text-2xl font-black text-[#0b4141]">
                    {Math.max(1, Math.round((new Date(selectedCompany.lastDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Days Left</p>
                </div>
              </div>
            </div>

            {/* Recruiter Contact */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-6">Need Help?</h4>
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#0b4141] text-white font-black flex items-center justify-center">
                  HR
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Placement Cell Coordinator</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campus HR Contact</p>
                </div>
                <FiMail className="text-[#ff6864] group-hover:scale-110 transition-transform" size={20} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// --- Helper Components ---

const StatItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-base font-bold text-slate-900 tracking-tight">{value}</p>
  </div>
);

const AboutLink = ({ icon, label }) => (
  <div className="flex items-center gap-4 text-slate-600 hover:text-[#ff6864] transition-colors cursor-pointer group">
    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#faf0dc] text-slate-400 group-hover:text-[#ff6864] transition-colors">
      {cloneElement(icon, { size: 18 })}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default CompanyDetails;