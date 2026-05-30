import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import {toast }from 'sonner'
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const Register = () => {

  // =========================
  // LOCAL UI STATE
  // =========================
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // REACT HOOK FORM
  // =========================
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm();


  // =========================
  // AUTH STORE
  // =========================
  const {
    register,
    isLoading,
    error,
    clearError,
    currentUser,
    isAuthenticated,
  } = useAuthStore();

  const navigate = useNavigate();

  // =========================
  // REDIRECT
  // =========================
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate("/login");
    }
  }, [isAuthenticated, currentUser, navigate]);

  // =========================
  // SUBMIT HANDLER
  // =========================
  const onSubmit = async (data) => {

    clearError();

    const result = await register({
      ...data,
      cgpa: Number(data.cgpa),
    });

    if (result.success) {
      toast.success("Account created successfully 🚀");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#2563eb 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* CONTAINER */}
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 shadow-xl relative z-10 overflow-hidden">

        {/* HEADER */}
        <div className="p-10 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <FiCheckCircle className="text-white text-2xl" />
            </div>

            <span className="text-2xl font-bold tracking-tight text-slate-900">
              PlacementTracker
            </span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Create Account
          </h1>

          <p className="text-slate-500 leading-relaxed text-lg max-w-lg">
            Join the Placement Hub to track your applications and manage your placement journey.
          </p>
        </div>

        {/* FORM */}
        <form
          className="p-10 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* NAME */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Full Name
            </label>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <FiUser size={18} />
              </div>

              <input
                type="text"
                placeholder="Enter your official name"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                {...registerField("name", {
                  required: "Full name is required",
                })}
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL + PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Email Address
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiMail size={18} />
                </div>

                <input
                  type="email"
                  placeholder="student@college.edu"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  {...registerField("email", {
                    required: "Email is required",
                  })}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Password
              </label>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiLock size={18} />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  {...registerField("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* GLOBAL ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading
              ? "Creating Account..."
              : "Complete Registration"}

            {!isLoading && (
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;