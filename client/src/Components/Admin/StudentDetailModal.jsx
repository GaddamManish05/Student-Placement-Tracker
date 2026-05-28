import { FiX, FiMail, FiBookOpen, FiActivity, FiGlobe, FiGithub, FiLinkedin, FiFileText } from "react-icons/fi";

const StudentDetailModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;
  console.log("students :",student);
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* HEADER */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{student.name}</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Student Profile Summary</p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl hover:bg-slate-200/60 flex items-center justify-center transition-all"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* PROFILE SUMMARY STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Branch</span>
              <p className="text-base font-bold text-slate-800 mt-1 flex items-center gap-2">
                <FiBookOpen className="text-blue-600" /> {student.branch || "N/A"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">CGPA</span>
              <p className="text-base font-bold text-slate-800 mt-1 flex items-center gap-2">
                <FiActivity className="text-emerald-600" /> {student.cgpa || "N/A"}
              </p>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Contact Information</h3>
            <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <FiMail className="text-slate-400" size={18} />
              <a href={`mailto:${student.email}`} className="font-semibold text-blue-600 hover:underline">{student.email}</a>
            </div>
          </div>

          {/* SKILLS */}
          {student.skills && student.skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 rounded-lg bg-blue-50 text-xs font-bold text-blue-600 border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SOCIAL & RESUME LINKS */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Links & Resume</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.resume && (
                <a
                  href={student.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm"
                >
                  <FiFileText className="text-blue-600" size={18} />
                  <span>View Resume</span>
                </a>
              )}
              {student.linkedIn && (
                <a
                  href={student.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm"
                >
                  <FiLinkedin className="text-blue-700" size={18} />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {student.gitHub && (
                <a
                  href={student.gitHub}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm"
                >
                  <FiGithub className="text-slate-800" size={18} />
                  <span>GitHub Profile</span>
                </a>
              )}
              {student.portfolio && (
                <a
                  href={student.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm"
                >
                  <FiGlobe className="text-emerald-600" size={18} />
                  <span>Portfolio Website</span>
                </a>
              )}
            </div>
          </div>

        </div>
        
        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all text-sm shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentDetailModal;
