import express from "express";

import {
    applyToCompany,
    myApplications,
    getAllApplications
} from "../Controllers/applicationController.js";

import {
    isAuthenticated
} from "../Middlewares/authMiddleware.js";

import { isAdmin } from "../Middlewares/adminMiddleware.js";
const applicationRoutes = express.Router();


// APPLY
applicationRoutes.post(
    "/apply",
    isAuthenticated,
    applyToCompany
);


// MY APPLICATIONS
applicationRoutes.get(
    "/my-applications",
    isAuthenticated,
    myApplications
);


applicationRoutes.get(
    "/get-all-applications",
    isAuthenticated,
    isAdmin,
    getAllApplications
);

export default applicationRoutes;