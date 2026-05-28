import express from "express";

import {register,login,logout,currentUser,updateProfile,uploadResume} from "../Controllers/authController.js"

import { isAuthenticated } from "../Middlewares/authMiddleware.js";

import upload from "../Middlewares/uploadMiddleware.js";

const commonRoutes = express.Router();

commonRoutes.post("/register", register);

commonRoutes.post("/login", login);

commonRoutes.post("/logout", logout);

commonRoutes.get("/current-user",isAuthenticated,currentUser);

commonRoutes.put("/update-profile",isAuthenticated,updateProfile);

commonRoutes.post("/upload-resume",isAuthenticated,upload.single("resume"),uploadResume);
export default commonRoutes;