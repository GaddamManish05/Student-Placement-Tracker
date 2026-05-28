import express from "express";

import {addCompany,getCompanies,deleteCompany,updateCompany,getCompanyById} from "../Controllers/companyController.js";

import { isAuthenticated }
from "../Middlewares/authMiddleware.js";

import { isAdmin }
from "../Middlewares/adminMiddleware.js";

const companyRoutes = express.Router();


// GET ALL
companyRoutes.get("/", getCompanies);

// GET SINGLE
companyRoutes.get("/companies/:id", isAuthenticated, getCompanyById);

// ADD COMPANY
companyRoutes.post("/add-company",isAuthenticated,isAdmin,addCompany);

// DELETE
companyRoutes.put("/:id",isAuthenticated,isAdmin,deleteCompany);

// UPDATE COMPANY
companyRoutes.put(
  "/update-company/:id",
  isAuthenticated,
  isAdmin,
  updateCompany
);


export default companyRoutes;