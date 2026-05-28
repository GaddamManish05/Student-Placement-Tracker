import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import companyRoutes from "./Routes/companyRoute.js";
import commonRoutes from "./Routes/authRoutes.js";
import applicationRoutes from "./Routes/applicationRoute.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";

dotenv.config();

const app = express();

// DATABASE
connectDB();

// MIDDLEWARES
app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// ROUTES
app.use("/common-api", commonRoutes);

app.use("/company-api", companyRoutes);

app.use("/application-api", applicationRoutes);

app.use("/dashboard-api", dashboardRoutes);

app.use("/notification-api", notificationRoutes);

app.use("/admin-api", adminRoutes);

app.use(
  "/uploads",
  express.static("uploads")
);

// TEST
app.get("/", (req, res) => {
    res.send("API Running");
});

// SERVER
const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
      `Server running on ${PORT}`
    );
});