import express from "express";

import {studentDashboard} from "../Controllers/dashboardController.js";

import {isAuthenticated} from "../Middlewares/authMiddleware.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get(
   "/student",
   isAuthenticated,
   studentDashboard
);

export default dashboardRoutes;