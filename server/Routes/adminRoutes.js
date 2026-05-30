import express from "express";

import {
  getDashboardStats,
  getAdminCompanies,
  getRecentApplications,
  getApplications,
  getStudents,
  toggleStudentStatus,
  getAnalytics,
  updateApplicationStatus
} from "../Controllers/adminController.js";

import {
  isAuthenticated,
} from "../Middlewares/authMiddleware.js";

import { isAdmin } from "../Middlewares/adminMiddleware.js";

const adminRoutes = express.Router();

// ======================================
// DASHBOARD STATS
// ======================================
adminRoutes.get(
  "/dashboard-stats",
  isAuthenticated,
  isAdmin,
  getDashboardStats
);

// ======================================
// COMPANIES
// ======================================
adminRoutes.get(
  "/companies",
  isAuthenticated,
  isAdmin,
  getAdminCompanies
);

// ======================================
// RECENT APPLICATIONS
// ======================================
adminRoutes.get(
  "/recent-applications",
  isAuthenticated,
  isAdmin,
  getRecentApplications
);

adminRoutes.get(
  "/applications",
  isAuthenticated,
  isAdmin,
  getApplications
);

adminRoutes.get(
  "/students",
  isAuthenticated,
  isAdmin,
  getStudents
);

adminRoutes.patch(
  "/students/:id/status",
  isAuthenticated,
  isAdmin,
  toggleStudentStatus
);


adminRoutes.get(
  "/analytics",
  isAuthenticated,
  isAdmin,
  getAnalytics
);


// ======================================
// UPDATE APPLICATION STATUS
// ======================================
adminRoutes.patch(

  "/applications/:id/status",

  isAuthenticated,

  isAdmin,

  updateApplicationStatus
);
export default adminRoutes;