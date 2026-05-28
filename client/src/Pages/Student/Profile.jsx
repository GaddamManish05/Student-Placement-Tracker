import { motion } from "framer-motion";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import {
  FiCamera,
  FiBookOpen,
  FiLinkedin,
  FiGithub,
  FiGlobe,
  FiExternalLink,
  FiUploadCloud,
  FiCheckCircle,
} from "react-icons/fi";

import DashboardLayout
from "../../Components/Layouts/DashboardLayout";

import useAuthStore
from "../../store/authStore";

// ==========================================
// PROFILE PAGE
// ==========================================
const Profile = () => {

  // ======================================
  // STORE
  // ======================================
  const {
    currentUser,
    updateProfile,
    isLoading,
    uploadResume
  } = useAuthStore();

  // ======================================
  // BRANCHES
  // ======================================
  const branches = [

  "CSE",

  "DS",

  "ECE",

  "EEE",

  "MECH",

  "Other",
];

  // ======================================
  // PROFILE COMPLETION
  // ======================================
 // ======================================
// PROFILE COMPLETION
// ======================================
let profileCompletion = 0;

// NAME
if (currentUser?.name) {
  profileCompletion += 15;
}

// BRANCH
if (currentUser?.branch) {
  profileCompletion += 15;
}

// ROLL NUMBER
if (currentUser?.rollNumber) {
  profileCompletion += 10;
}

// CGPA
if (currentUser?.cgpa >= 6) {
  profileCompletion += 25;
}

// SKILLS
const skillCount =
currentUser?.skills?.length || 0;

if (skillCount >= 1) {
  profileCompletion += 10;
}

if (skillCount >= 3) {
  profileCompletion += 10;
}

if (skillCount >= 5) {
  profileCompletion += 15;
}

// PROFILE IMAGE
if (currentUser?.profileImage) {
  profileCompletion += 10;
}

// LIMIT
if (profileCompletion > 100) {
  profileCompletion = 100;
}

  // ======================================
  // FORM
  // ======================================
  const {
    register,
    handleSubmit,
  } = useForm({

    defaultValues: {

      name:
        currentUser?.name || "",

      email:
        currentUser?.email || "",

      branch:
        currentUser?.branch || "",

      cgpa:
        currentUser?.cgpa || "",

      rollNumber:
        currentUser?.rollNumber || "",

      skills:
        currentUser?.skills?.join(", ") || "",

      linkedIn:
        currentUser?.linkedIn || "",

      gitHub:
        currentUser?.gitHub || "",

      portfolio:
        currentUser?.portfolio || "",
    },
  });

  // ======================================
  // SUBMIT
  // ======================================
  const onSubmit = async (data) => {

    const formattedData = {

      ...data,

      cgpa:
        Number(data.cgpa),

      skills:
        data.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          ),
    };

    const result =
    await updateProfile(
      formattedData
    );

    if(result.success){

      toast.success(
        "Profile updated successfully 🚀"
      );
    }
  };
  // ======================================
// RESUME UPLOAD
// ======================================
const handleResumeUpload =
async (e) => {

  const file =
  e.target.files[0];

  if (!file) return;

  const result =
  await uploadResume(file);

  if (result.success) {

    toast.success(
      "Resume uploaded successfully 🚀"
    );

  } else {

    toast.error(
      "Resume upload failed"
    );
  }
};

  return (

    <DashboardLayout>

      {/* PAGE HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-black text-slate-900 tracking-tight">

          My Profile

        </h1>

        <p className="text-slate-500 mt-2 font-medium">

          Manage your placement profile and career information.

        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="xl:col-span-2 space-y-8">

          {/* HERO */}
          <motion.div

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
          >

            <div className="flex flex-col md:flex-row items-center gap-8">

              {/* IMAGE */}
              <div className="relative group">

                <img
                  src={
                    currentUser?.profileImage ||

                    `https://ui-avatars.com/api/?name=${currentUser?.name}`
                  }

                  alt="Profile"

                  className="w-36 h-36 rounded-3xl object-cover border-4 border-slate-100"
                />

                <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg border-4 border-white hover:bg-blue-700 transition-all">

                  <FiCamera size={18} />

                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 text-center md:text-left">

                <h2 className="text-4xl font-black text-slate-900 tracking-tight">

                  {currentUser?.name}

                </h2>

                <p className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mt-3">

                  <FiBookOpen className="text-blue-600" />

                  {
                    currentUser?.branch ||
                    "Branch not added"
                  }

                </p>

                {/* PROFILE STATS */}
                <div className="grid grid-cols-3 gap-6 mt-8">

                  <ProfileStat
                    label="CGPA"
                    value={
                      currentUser?.cgpa || "N/A"
                    }
                  />

                  <ProfileStat
                    label="Role"
                    value={
                      currentUser?.role
                    }
                  />

                  <ProfileStat
                    label="Completion"
                    value={`${profileCompletion}%`}
                  />
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-8">

                  <div className="flex justify-between text-sm mb-2">

                    <span className="font-semibold text-slate-700">

                      Profile Strength

                    </span>

                    <span className="text-blue-600 font-bold">

                      {profileCompletion}%

                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                    <motion.div

                      initial={{
                        width: 0
                      }}

                      animate={{
                        width:
                          `${profileCompletion}%`
                      }}

                      transition={{
                        duration: 1
                      }}

                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.form

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 0.2
            }}

            onSubmit={handleSubmit(onSubmit)}

            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
          >

            <div className="mb-10">

              <h3 className="text-2xl font-black text-slate-900">

                Personal Information

              </h3>

              <p className="text-slate-500 mt-2">

                Keep your placement information updated.

              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* NAME */}
              <InputField
                label="Full Name"
                register={register("name")}
              />

              {/* ROLL NUMBER */}
              <InputField
                label="Roll Number"
                register={register("rollNumber")}
              />

              {/* BRANCH */}
              <div className="space-y-2">

                <label className="text-xs font-black uppercase tracking-wide text-slate-400">

                  Branch

                </label>

                <select

                  {...register("branch")}

                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 outline-none"
                >

                  <option value="">
                    Select Branch
                  </option>

                  {
                    branches.map(
                      (branch) => (

                        <option
                          key={branch}
                          value={branch}
                        >

                          {branch}

                        </option>
                      )
                    )
                  }
                </select>
              </div>

              {/* EMAIL */}
              <InputField
                label="University Email"
                register={register("email")}
                readOnly
              />

              {/* CGPA */}
              <InputField
                label="CGPA"
                type="number"
                register={register("cgpa")}
              />

              {/* LINKEDIN */}
              <InputField
                label="LinkedIn Profile URL"
                register={register("linkedIn")}
                placeholder="https://linkedin.com/in/username"
              />

              {/* GITHUB */}
              <InputField
                label="GitHub Profile URL"
                register={register("gitHub")}
                placeholder="https://github.com/username"
              />

              {/* PORTFOLIO */}
              <InputField
                label="Portfolio Website URL"
                register={register("portfolio")}
                placeholder="https://myportfolio.com"
              />

              {/* SKILLS */}
              <div className="md:col-span-2">

                <InputField
                  label="Skills"
                  register={register("skills")}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-12 flex justify-end">

              <motion.button

                whileTap={{
                  scale: 0.97
                }}

                type="submit"

                disabled={isLoading}

                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-70"
              >

                {
                  isLoading
                  ? "Saving..."
                  : "Save Changes"
                }

              </motion.button>
            </div>
          </motion.form>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-8">

          {/* SKILLS */}
          <motion.div

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 0.3
            }}

            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
          >

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-xl font-black text-slate-900">

                Core Skills

              </h3>

              <FiCheckCircle
                className="text-emerald-500"
                size={20}
              />
            </div>

            <div className="flex flex-wrap gap-3">

              {
                currentUser?.skills?.map(
                  (skill) => (

                    <motion.span

                      whileHover={{
                        y: -2
                      }}

                      key={skill}

                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-sm font-bold border border-blue-100"
                    >

                      {skill}

                    </motion.span>
                  )
                )
              }
            </div>
          </motion.div>

          {/* RESUME */}
<motion.div

  initial={{
    opacity: 0,
    y: 20
  }}

  animate={{
    opacity: 1,
    y: 0
  }}

  transition={{
    delay: 0.35
  }}

  className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
>

  {/* HEADER */}
  <div className="flex items-center justify-between mb-6">

    <div>

      <h3 className="text-xl font-black text-slate-900">

        Resume

      </h3>

      <p className="text-sm text-slate-500 mt-1">

        Upload your latest resume

      </p>

    </div>

    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

      <FiUploadCloud size={20} />

    </div>

  </div>

  {/* RESUME STATUS */}
  {
    currentUser?.resume ? (

      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">

        <div className="flex items-center justify-between">

          <div>

            <h4 className="font-black text-emerald-700">

              Resume Uploaded

            </h4>

            <p className="text-sm text-emerald-600 mt-1">

              Your resume is available for recruiters

            </p>

          </div>

          <a

            href={
              currentUser.resume
            }

            target="_blank"

            rel="noreferrer"

            className="px-4 py-2 rounded-xl bg-white text-emerald-700 text-sm font-bold border border-emerald-200 hover:bg-emerald-100 transition-all"
          >

            View

          </a>

        </div>

      </div>

    ) : (

      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">

        <p className="text-sm text-slate-500 mb-4">

          No resume uploaded yet

        </p>

      </div>
    )
  }

  {/* UPLOAD */}
  <label className="mt-5 flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 transition-all">

    <FiUploadCloud />

    {
      currentUser?.resume

      ? "Replace Resume"

      : "Upload Resume"
    }

    <input

      type="file"

      accept=".pdf"

      hidden

      onChange={
        handleResumeUpload
      }
    />

  </label>

</motion.div>

          {/* SOCIAL LINKS */}
          <motion.div

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 0.4
            }}

            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
          >

            <h3 className="text-xl font-black text-slate-900 mb-6">

              Professional Links

            </h3>

            <div className="space-y-4">

              <SocialLink
                icon={<FiLinkedin />}
                label="LinkedIn"
                color="bg-blue-50 text-blue-600"
                url={currentUser?.linkedIn}
              />

              <SocialLink
                icon={<FiGithub />}
                label="GitHub"
                color="bg-slate-100 text-slate-800"
                url={currentUser?.gitHub}
              />

              <SocialLink
                icon={<FiGlobe />}
                label="Portfolio"
                color="bg-indigo-50 text-indigo-600"
                url={currentUser?.portfolio}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ==========================================
// PROFILE STAT
// ==========================================
const ProfileStat = ({
  label,
  value,
}) => (

  <div>

    <p className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-1">

      {label}

    </p>

    <p className="text-xl font-black text-slate-900">

      {value}

    </p>

  </div>
);

// ==========================================
// INPUT FIELD
// ==========================================
const InputField = ({
  label,
  register,
  readOnly = false,
  type = "text",
  placeholder = "",
}) => (

  <div className="space-y-2">

    <label className="text-xs font-black uppercase tracking-wide text-slate-400">

      {label}

    </label>

    <input

      type={type}

      readOnly={readOnly}

      placeholder={placeholder}

      {...register}

      className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/10 outline-none transition-all ${
        readOnly
        ? "opacity-60 cursor-not-allowed"
        : "hover:border-slate-300"
      }`}
    />
  </div>
);

// ==========================================
// SOCIAL LINK
// ==========================================
const SocialLink = ({
  icon,
  label,
  color,
  url,
}) => {
  const handleClick = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.error(`${label} link not added yet.`);
    }
  };

  return (
    <motion.div
      whileHover={{
        x: 4
      }}
      onClick={handleClick}
      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="font-bold text-slate-700">
          {label}
        </span>
      </div>
      <FiExternalLink
        className={url ? "text-blue-600" : "text-slate-300"}
        size={16}
      />
    </motion.div>
  );
};

export default Profile;