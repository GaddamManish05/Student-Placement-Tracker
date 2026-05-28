import {
  useState,useRef,useEffect
} from "react";

import DashboardLayout
from "../../Components/Layouts/DashboardLayout";

import {
  FiDownload,
  FiPlus,
  FiUploadCloud,
} from "react-icons/fi";

import jsPDF
from "jspdf";

import html2canvas
from "html2canvas";

import useAuthStore from "../../store/authStore";
import { toast } from "sonner";

const ResumeBuilder = () => {

  const {
    currentUser,
    uploadResume,
  } = useAuthStore();

  const [isSaving, setIsSaving] = useState(false);

  // ====================================
  // RESUME DATA
  // ====================================
  const [
    resumeData,

    setResumeData,
  ] = useState({

    personalInfo: {

      fullName: currentUser?.name || "",

      email: currentUser?.email || "",

      phone: "",

      location: "",

      linkedin: "",

      github: "",
    },

    education: {

      college: "",

      degree: currentUser?.branch ? `${currentUser.branch} Student` : "",

      cgpa: currentUser?.cgpa?.toString() || "",

      year: "",
    },

    skills: currentUser?.skills?.join(", ") || "",

    projects: "",

    experience: "",
  });

  useEffect(() => {
    if (currentUser) {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: prev.personalInfo.fullName || currentUser.name || "",
          email: prev.personalInfo.email || currentUser.email || "",
        },
        education: {
          ...prev.education,
          cgpa: prev.education.cgpa || currentUser.cgpa?.toString() || "",
        },
        skills: prev.skills || currentUser.skills?.join(", ") || "",
      }));
    }
  }, [currentUser]);

  // ====================================
  // HANDLE CHANGE
  // ====================================
  const handleChange = (
    section,
    field,
    value
  ) => {

    setResumeData(
      (prev) => ({

        ...prev,

        [section]: {

          ...prev[section],

          [field]: value,
        },
      })
    );
  };
  const previewRef =
  useRef(null);

  // ====================================
  // SAVE TO PROFILE
  // ====================================
  const saveResumeToProfile = async () => {
    try {
      setIsSaving(true);
      const element = previewRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        ignoreElements: (element) => element.tagName === "STYLE",
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });

      const result = await uploadResume(pdfFile);

      if (result.success) {
        toast.success("Resume saved to profile successfully! 🚀");
      } else {
        toast.error("Failed to save resume to profile.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while saving resume.");
    } finally {
      setIsSaving(false);
    }
  };

// ====================================
// DOWNLOAD PDF
// ====================================
const downloadResume =
async () => {

  try {

    const element =
    previewRef.current;

    if (!element) return;

    // CAPTURE
    const canvas =
await html2canvas(
  element,
  {

    scale: 2,

    useCORS: true,

    backgroundColor:
    "#ffffff",

    ignoreElements:
    (element) => {

      return (
        element.tagName ===
        "STYLE"
      );
    },
  }
);

    // IMAGE
    const imageData =
    canvas.toDataURL(
      "image/png"
    );

    // PDF
    const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

    // A4 SIZE
    const pdfWidth = 210;

    const pdfHeight =
    (
      canvas.height *
      pdfWidth
    ) / canvas.width;

    // ADD IMAGE
    pdf.addImage(

      imageData,

      "PNG",

      0,

      0,

      pdfWidth,

      pdfHeight
    );

    // DOWNLOAD
    pdf.save(
      "Resume.pdf"
    );

  } catch (error) {

    console.log(error);
  }
};

  return (

    <DashboardLayout>

      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-4xl font-black text-slate-900">

              Resume Builder

            </h1>

            <p className="text-slate-500 mt-2">

              Create ATS-friendly professional resumes

            </p>

          </div>

        <div className="flex items-center gap-4">
          <button
            onClick={saveResumeToProfile}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all disabled:opacity-75"
          >
            <FiUploadCloud />
            {isSaving ? "Saving..." : "Save to Profile"}
          </button>

          <button
            onClick={downloadResume}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
          >
            <FiDownload />
            Download Resume
          </button>
        </div>

        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* ================================= */}
          {/* FORM */}
          {/* ================================= */}
          <div className="space-y-6">

            {/* PERSONAL INFO */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7">

              <h3 className="text-xl font-black text-slate-900 mb-6">

                Personal Information

              </h3>

              <div className="grid grid-cols-2 gap-4">

                <Input
                  label="Full Name"
                  value={
                    resumeData.personalInfo.fullName
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "fullName",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Email"
                  value={
                    resumeData.personalInfo.email
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "email",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Phone"
                  value={
                    resumeData.personalInfo.phone
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "phone",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Location"
                  value={
                    resumeData.personalInfo.location
                  }
                  onChange={(e) =>
                    handleChange(
                      "personalInfo",
                      "location",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* EDUCATION */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7">

              <h3 className="text-xl font-black text-slate-900 mb-6">

                Education

              </h3>

              <div className="grid grid-cols-2 gap-4">

                <Input
                  label="College"
                  value={
                    resumeData.education.college
                  }
                  onChange={(e) =>
                    handleChange(
                      "education",
                      "college",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Degree"
                  value={
                    resumeData.education.degree
                  }
                  onChange={(e) =>
                    handleChange(
                      "education",
                      "degree",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="CGPA"
                  value={
                    resumeData.education.cgpa
                  }
                  onChange={(e) =>
                    handleChange(
                      "education",
                      "cgpa",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Graduation Year"
                  value={
                    resumeData.education.year
                  }
                  onChange={(e) =>
                    handleChange(
                      "education",
                      "year",
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* SKILLS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7">

              <h3 className="text-xl font-black text-slate-900 mb-5">

                Skills

              </h3>

              <textarea

                rows={4}

                placeholder="React, Node.js, MongoDB..."

                value={
                  resumeData.skills
                }

                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    skills:
                    e.target.value,
                  })
                }

                className="w-full p-4 rounded-2xl border border-slate-200 outline-none resize-none"
              />

            </div>

            {/* PROJECTS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7">
              <h3 className="text-xl font-black text-slate-900 mb-5">
                Projects
              </h3>
              <textarea
                rows={4}
                placeholder="E-commerce Platform: Built using MERN stack..."
                value={resumeData.projects}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    projects: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl border border-slate-200 outline-none resize-none"
              />
            </div>

            {/* EXPERIENCE */}
            <div className="bg-white border border-slate-200 rounded-3xl p-7">
              <h3 className="text-xl font-black text-slate-900 mb-5">
                Experience
              </h3>
              <textarea
                rows={4}
                placeholder="Software Engineer Intern at Acme Corp (June - August 2025)..."
                value={resumeData.experience}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    experience: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl border border-slate-200 outline-none resize-none"
              />
            </div>

          </div>

          {/* ================================= */}
          {/* LIVE PREVIEW */}
          {/* ================================= */}
<div
    ref={previewRef}
  style={{
    backgroundColor:
    "#ffffff",

    color:
    "#000000",
  }}

  className="bg-white border border-slate-200 rounded-3xl p-10"
>
            <div className="border-b border-slate-200 pb-6 mb-6">

              <h1 className="text-4xl font-black text-slate-900">

                {
                  resumeData.personalInfo.fullName ||

                  "Your Name"
                }

              </h1>

              <p className="text-slate-500 mt-3">

                {
                  resumeData.personalInfo.email
                }

              </p>

              <p className="text-slate-500">

                {
                  resumeData.personalInfo.phone
                }

              </p>

            </div>

            {/* EDUCATION */}
            <div className="mb-8">

              <h2 className="text-xl font-black text-slate-900 mb-3">

                Education

              </h2>

              <div>

                <h3 className="font-bold text-slate-800">

                  {
                    resumeData.education.college
                  }

                </h3>

                <p className="text-sm text-slate-500 mt-1">

                  {
                    resumeData.education.degree
                  }

                </p>

                <p className="text-sm text-slate-500">

                  CGPA:
                  {
                    resumeData.education.cgpa
                  }

                </p>

              </div>

            </div>

            {/* SKILLS */}
            <div>

              <h2 className="text-xl font-black text-slate-900 mb-3">

                Skills

              </h2>

              <p className="text-slate-600 leading-relaxed">

                {
                  resumeData.skills
                }

              </p>

            </div>

            {/* PROJECTS */}
            {resumeData.projects && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                <h2 className="text-xl font-black text-slate-900 mb-3">
                  Projects
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {resumeData.projects}
                </p>
              </div>
            )}

            {/* EXPERIENCE */}
            {resumeData.experience && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                <h2 className="text-xl font-black text-slate-900 mb-3">
                  Experience
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {resumeData.experience}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

// ====================================
// INPUT
// ====================================
const Input = ({
  label,
  value,
  onChange,
}) => (

  <div>

    <label className="block text-sm font-bold text-slate-700 mb-2">

      {label}

    </label>

    <input

      type="text"

      value={value}

      onChange={onChange}

      className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/10"
    />

  </div>
);

export default ResumeBuilder;