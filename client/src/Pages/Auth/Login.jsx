import { useState, useEffect } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const Login = () => {
  // =========================
  // LOCAL STATE
  // =========================
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // =========================
  // ZUSTAND STORE
  // =========================
  const {
    login,
    isLoading,
    error,
    clearError,
    isAuthenticated,
    currentUser,
  } = useAuthStore();

  const navigate = useNavigate();
  console.log("current user :",currentUser);
  console.log("error :",error);
  // =========================
  // REDIRECT IF LOGGED IN
  // =========================
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === "admin") {
        toast.success(`Welcome back, ${currentUser.name} 👋`);
        navigate("/admin");
      } else {
        toast.success(`Welcome back, ${currentUser.name} 👋`);
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      clearError();
    }
  };

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">

      {/* HEADER */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 mb-4">
          <div className="text-white text-2xl font-bold">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
              <path d="M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M18.4 5.6l-2.1 2.1M5.6 18.4l2.1-2.1" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          PlacementTracker
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Sign in to manage your professional trajectory.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">

        <form
          onSubmit={handleSubmit}
          className="p-10 space-y-6"
        >

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Email Address
            </label>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <FiMail size={18} />
              </div>

              <input
                type="email"
                name="email"
                required
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Password
              </label>

              <button
                type="button"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <FiLock size={18} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* REMEMBER ME */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                className="peer hidden"
                checked={formData.rememberMe}
                onChange={handleChange}
              />

              <div className="w-5 h-5 border-2 border-slate-200 rounded-md bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
              Stay signed in
            </span>
          </label>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group mt-2"
          >
            {isLoading ? "Signing In..." : "Sign In"}

            {!isLoading && (
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          {/* DIVIDER */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>

            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="bg-white px-4">
                or continue with
              </span>
            </div>
          </div>

          {/* DEMO LOGIN */}
          <button
            type="button"
            className="w-full py-3.5 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <FiZap
              className="text-blue-600"
              fill="currentColor"
            />

            Quick Demo Login
          </button>
        </form>

        {/* FOOTER */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
          <p className="text-slate-600 text-sm font-medium">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;