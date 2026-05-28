import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { useEffect } from "react";

// ==========================================
// AUTH PAGES
// ==========================================
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

// ==========================================
// STUDENT PAGES
// ==========================================
import Dashboard from "./Pages/Student/Dashboard";
import Companies from "./Pages/Student/Companies";
import CompanyDetails from "./Pages/Student/CompanyDetails";
import Applications from "./Pages/Student/Applications";
import Profile from "./Pages/Student/Profile";
import ResumeBuilder from "./Pages/Student/ResumeBuilder";

// ==========================================
// ADMIN PAGES
// ==========================================
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ManageCompanies from "./Pages/Admin/ManageCompanies";
import ManageApplications from "./Pages/Admin/ManageApplications";
import ManageStudents from "./Pages/Admin/ManageStudents";
import ManageNotifications from "./Pages/Admin/ManageNotifications";

// ==========================================
// STORES
// ==========================================
import useAuthStore
from "./store/authStore";

// ==========================================
// PROTECTED ROUTE
// ==========================================
import ProtectedRoute
from "./Components/Common/ProtectedRoute";

// ==========================================
// ROUTER CONFIG
// ==========================================
const router =
createBrowserRouter([

  // ========================================
  // PUBLIC ROUTES
  // ========================================
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  // ========================================
  // STUDENT ROUTES
  // ========================================
  {
    path: "/dashboard",

    element: (

      <ProtectedRoute>

        <Dashboard />

      </ProtectedRoute>
    ),
  },

  {
    path: "/companies",

    element: (

      <ProtectedRoute>

        <Companies />

      </ProtectedRoute>
    ),
  },

  {
    path: "/company/:id",

    element: (

      <ProtectedRoute>

        <CompanyDetails />

      </ProtectedRoute>
    ),
  },

  {
    path: "/applications",

    element: (

      <ProtectedRoute>

        <Applications />

      </ProtectedRoute>
    ),
  },

  {
    path: "/profile",

    element: (

      <ProtectedRoute>

        <Profile />

      </ProtectedRoute>
    ),
  },
  {
  path: "/resume-builder",

  element: (

    <ProtectedRoute>

      <ResumeBuilder />

    </ProtectedRoute>
  ),
},

  // ========================================
  // ADMIN ROUTES
  // ========================================
  {
    path: "/admin",

    element: (

      <ProtectedRoute adminOnly>

        <AdminDashboard />

      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/companies",

    element: (

      <ProtectedRoute
        adminOnly
      >

        <ManageCompanies />

      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/applications",

    element: (

      <ProtectedRoute
        adminOnly
      >

        <ManageApplications />

      </ProtectedRoute>
    ),
  },
   {
    path: "/admin/students",

    element: (

      <ProtectedRoute
        adminOnly
      >

        <ManageStudents />

      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/notifications",

    element: (

      <ProtectedRoute adminOnly>
        <ManageNotifications />

      </ProtectedRoute>
    ),
  },

  // ========================================
  // DEFAULT ROUTE
  // ========================================
  {
    path: "/",

    element: (

      <Navigate
        to="/login"
        replace
      />
    ),
  },

  // ========================================
  // FALLBACK ROUTE
  // ========================================
  {
    path: "*",

    element: (

      <Navigate
        to="/login"
        replace
      />
    ),
  },
]);

// ==========================================
// APP COMPONENT
// ==========================================
function App() {

  const {
    checkAuth,
  } = useAuthStore();

  // ========================================
  // CHECK AUTH ON APP LOAD
  // ========================================
  useEffect(() => {

    checkAuth();

  }, [checkAuth]);

  return (
    <RouterProvider
      router={router}
    />
  );
}

export default App;