import User from "../Models/userModel.js";

import Company from "../Models/companyModel.js";

import Application from "../Models/applicationModel.js";

import Notification from "../Models/notificationModel.js";

import {transporter} from '../config/Nodemailer.js'

import apiInstance from "../config/brevo.js";


// ======================================
// ADMIN DASHBOARD STATS
// ======================================
export const getDashboardStats =
async (req, res) => {

  try {

    // ==================================
    // TOTAL STUDENTS
    // ==================================
    const totalStudents =
    await User.countDocuments({
      role: "student",
    });

    // ==================================
    // ACTIVE COMPANIES
    // ==================================
    const totalCompanies =
    await Company.countDocuments({
      isDeleted: false,
    });

    // ==================================
    // TOTAL APPLICATIONS
    // ==================================
    const totalApplications =
    await Application.countDocuments();

    // ==================================
    // PLACED STUDENTS
    // ==================================
    const placedStudents =
    await User.countDocuments({
      placementStatus: "placed",
    });

    // ==================================
    // INTERVIEW COUNT
    // ==================================
    const interviewCount =
    await Application.countDocuments({
      status: "Interview",
    });

    // ==================================
    // RESPONSE
    // ==================================
    return res.status(200).json({

      success: true,

      stats: {
        totalStudents,
        totalCompanies,
        totalApplications,
        placedStudents,
        interviewCount,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch dashboard stats",
    });
  }
};

// ======================================
// GET ADMIN COMPANIES
// ======================================
export const getAdminCompanies =
async (req, res) => {

  try {

    // ==================================
    // FETCH COMPANIES
    // ==================================
    const companies =
    await Company.find({

      isDeleted: false,

    })
    .sort({
      createdAt: -1,
    })
    .lean();

    // ==================================
    // STATS
    // ==================================
    const totalPartners = companies.length;

    const activeDrives =
    companies.filter((company) => company.status === "ACTIVE").length;

    const pendingDrives = companies.filter((company) =>company.status === "PENDING").length;

    // ==================================
    // AVERAGE PACKAGE
    // ==================================
    let avgPackage = 0;

    if (companies.length > 0) {

      const total =
      companies.reduce(
        (acc, curr) => {

          const value =
          parseFloat(
            curr.packageOffered
          ) || 0;

          return acc + value;

        },
        0
      );

      avgPackage =
      (
        total /
        companies.length
      ).toFixed(1);
    }

    // ==================================
    // RESPONSE
    // ==================================
    return res.status(200).json({

      success: true,

      stats: {

        totalPartners,

        activeDrives,

        pendingDrives,

        avgPackage:
        `${avgPackage} LPA`,
      },

      companies,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch companies",
    });
  }
};

// ======================================
// RECENT APPLICATIONS
// ======================================
export const getRecentApplications =
async (req, res) => {

  try {

    const applications =
    await Application.find()

      .populate(
        "studentId",
        "name branch email cgpa"
      )

      .populate(
        "companyId",
        "companyName role"
      )

      .sort({
        createdAt: -1,
      })

      .limit(5)

      .lean();

    return res.status(200).json({

      success: true,

      applications,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch applications",
    });
  }
};


export const getApplications =
async (req, res) => {

  try {

    const applications =
    await Application.find()

      .populate(
        "studentId",
        "name branch email cgpa"
      )

      .populate(
        "companyId",
        "companyName role"
      )

      .sort({
        createdAt: -1,
      })

      .lean();

    return res.status(200).json({

      success: true,

      applications,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch applications",
    });
  }
};

export const getStudents =
async (req, res) => {

  try {

    const students =
    await User.find({
      role: "student",
    })

    .select(
      "name email branch cgpa placementStatus isActive"
    )

    .sort({
      createdAt: -1,
    })

    .lean();

    return res.status(200).json({

      success: true,

      students,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch students",
    });
  }
};

export const toggleStudentStatus =
async (req, res) => {

  try {

    const {
      id,
    } = req.params;

    const student =
    await User.findById(id);

    // ==================================
    // CHECK STUDENT
    // ==================================
    if (!student) {

      return res.status(404).json({

        success: false,

        message:
        "Student not found",
      });
    }

    // ==================================
    // TOGGLE STATUS
    // ==================================
    student.isActive =
    !student.isActive;

    await student.save();

    return res.status(200).json({

      success: true,

      message:
      student.isActive

      ? "Student restored successfully"

      : "Student deactivated successfully",

      student,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to update student status",
    });
  }
};


// ======================================
// ADMIN ANALYTICS
// ======================================
export const getAnalytics =
async (req, res) => {

  try {

    // ==================================
    // FETCH APPLICATIONS
    // ==================================
    const applications =
    await Application.find().lean();

    // ==================================
    // MONTHS
    // ==================================
    const months = [

      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // ==================================
    // MONTHLY DATA
    // ==================================
    const monthlyData =
    months.map(
      (month, index) => {

        const monthlyApplications =
        applications.filter(
          (app) => {

            const date =
            new Date(
              app.createdAt
            );

            return (
              date.getMonth() ===
              index
            );
          }
        );

        const selected =
        monthlyApplications.filter(
          (app) =>
            app.status ===
            "Selected"
        ).length;

        return {

          month,

          applications:
          monthlyApplications.length,

          selected,
        };
      }
    );

    // ==================================
    // TOTALS
    // ==================================
    const totalApplications =
    applications.length;

    const selectedCount =
    applications.filter(
      (app) =>
        app.status ===
        "Selected"
    ).length;

    const rejectedCount =
    applications.filter(
      (app) =>
        app.status ===
        "Rejected"
    ).length;

    const interviewCount =
    applications.filter(
      (app) =>

        app.status ===
        "Round 1"

        ||

        app.status ===
        "Round 2"

        ||

        app.status ===
        "HR Round"
    ).length;

    // ==================================
    // SUCCESS RATE
    // ==================================
    const successRate =
    totalApplications > 0

    ? Math.round(
        (
          selectedCount /
          totalApplications
        ) * 100
      )

    : 0;
    // ==================================
// SECTOR DISTRIBUTION
// ==================================
const sectorCounts = {

  IT: 0,

  Finance: 0,

  Consulting: 0,

  Other: 0,
};

// ==================================
// FETCH COMPANIES
// ==================================
const companies =
await Company.find()
.select("role")
.lean();

// ==================================
// COUNT SECTORS
// ==================================
companies.forEach(
  (company) => {

    const role =
    String(
      company?.role || ""
    ).toLowerCase();

    // IT
    if (

      role.includes(
        "developer"
      )

      ||

      role.includes(
        "engineer"
      )

      ||

      role.includes(
        "software"
      )
    ) {

      sectorCounts.IT++;
    }

    // FINANCE
    else if (

      role.includes(
        "finance"
      )

      ||

      role.includes(
        "analyst"
      )
    ) {

      sectorCounts.Finance++;
    }

    // CONSULTING
    else if (

      role.includes(
        "consultant"
      )
    ) {

      sectorCounts.Consulting++;
    }

    // OTHER
    else {

      sectorCounts.Other++;
    }
  }
);

// ==================================
// FINAL DATA
// ==================================
const sectorDistribution =

Object.entries(
  sectorCounts
)

.map(
  ([name, value]) => ({

    name,

    value,
  })
);

    // ==================================
    // APPLICATION STATUS BREAKDOWN
    // ==================================
    const statusCounts = {
      Applied: 0,
      "Round 1": 0,
      "Round 2": 0,
      "HR Round": 0,
      Selected: 0,
      Rejected: 0,
    };
    applications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });
    const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // ==================================
    // BRANCH-WISE PLACEMENT STATS
    // ==================================
    const students = await User.find({ role: "student" }).select("branch placementStatus").lean();
    const branchCounts = {};
    students.forEach((student) => {
      const branch = student.branch || "Unknown";
      if (!branchCounts[branch]) {
        branchCounts[branch] = { placed: 0, total: 0 };
      }
      branchCounts[branch].total++;
      if (student.placementStatus === "placed") {
        branchCounts[branch].placed++;
      }
    });
    const branchPlacements = Object.entries(branchCounts).map(([name, data]) => ({
      name,
      placed: data.placed,
      total: data.total,
      unplaced: data.total - data.placed,
    }));

    // ==================================
    // SECTOR-WISE SALARY PACKAGE (AVERAGE)
    // ==================================
    const companyPackages = await Company.find({ isDeleted: false }).select("role packageOffered").lean();
    const sectorSalaries = {
      IT: { total: 0, count: 0 },
      Finance: { total: 0, count: 0 },
      Consulting: { total: 0, count: 0 },
      Other: { total: 0, count: 0 },
    };
    companyPackages.forEach((company) => {
      const role = String(company.role || "").toLowerCase();
      const pkg = parseFloat(company.packageOffered) || 0;
      let sector = "Other";
      if (
        role.includes("developer") ||
        role.includes("engineer") ||
        role.includes("software")
      ) {
        sector = "IT";
      } else if (role.includes("finance") || role.includes("analyst")) {
        sector = "Finance";
      } else if (role.includes("consultant")) {
        sector = "Consulting";
      }
      sectorSalaries[sector].total += pkg;
      sectorSalaries[sector].count++;
    });
    const sectorAverageSalary = Object.entries(sectorSalaries).map(([name, data]) => ({
      name,
      avgPackage: data.count > 0 ? parseFloat((data.total / data.count).toFixed(2)) : 0,
    }));

    // ==================================
    // RESPONSE
    // ==================================
    return res.status(200).json({

      success: true,

      analytics: {

        monthlyData,

        totalApplications,

        selectedCount,

        rejectedCount,

        interviewCount,

        successRate,

        sectorDistribution,

        statusDistribution,

        branchPlacements,

        sectorAverageSalary,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to fetch analytics",
    });
  }
};

// ======================================
// UPDATE APPLICATION STATUS
// ======================================
export const updateApplicationStatus =
async (req, res) => {

  try {

    const {
      id,
    } = req.params;

    const {
      status,remarks
    } = req.body;

    // ==================================
    // VALIDATION
    // ==================================
    const allowedStatuses = [

      "Applied",

      "Round 1",

      "Round 2",

      "HR Round",

      "Selected",

      "Rejected",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
        "Invalid application status",
      });
    }

    // ==================================
    // FIND APPLICATION
    // ==================================
    const application =
    await Application.findById(id);

    if (!application) {

      return res.status(404).json({

        success: false,

        message:
        "Application not found",
      });
    }

    // ==================================
    // UPDATE STATUS
    // ==================================
    // ==================================
// UPDATE STATUS
// ==================================
application.status =
status;


await application.save();

// ==================================
// FETCH COMPANY
// ==================================
await application.populate(
  "companyId",
  "companyName role",
);

let user = await User.findById(application.studentId);

// ==================================
// NOTIFICATION MESSAGES
// ==================================
const notificationMessages = {

  Applied:
  `Your application for ${application.companyId.companyName} has been received.`,

  "Round 1":
  `You have advanced to Round 1 at ${application.companyId.companyName}.`,

  "Round 2":
  `You have advanced to Round 2 at ${application.companyId.companyName}.`,

  "HR Round":
  `HR Round scheduled for ${application.companyId.companyName}.`,

  Selected:
  `Congratulations! You have been selected at ${application.companyId.companyName}.`,

  Rejected:
  `Your application was not selected for ${application.companyId.companyName}.`,
};

// ==================================
// CREATE NOTIFICATION
// ==================================
await Notification.create({

  userId:
  application.studentId,

  title:
  `Application Status Updated`,

  message:
  notificationMessages[
    status
  ],

  type:
  "placement",
});
  console.log("application :",user.email);

  (async () => {
              try {
                  if (!process.env.BREVO_API_KEY) {
                      console.log("No BREVO_API_KEY found. Logging status update email locally:");
                      console.log(`To: ${user.email}, Subject: Status Updated, Status: ${status}`);
                      return;
                  }
  
                  let statusColor = "#3b82f6"; // Blue
                  let statusIcon = "🚀";
  
                  if (status.toUpperCase() === "SELECTED" || status.toUpperCase() === "HIRED") {
                      statusColor = "#10b981"; // Emerald
                      statusIcon = "🎉";
                  } else if (status.toUpperCase() === "REJECTED") {
                      statusColor = "#ff6864"; // Coral
                      statusIcon = "💼";
                  }
  
                  const remarksHtml = remarks 
                      ? `<div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(11, 65, 65, 0.08); text-align: left; font-size: 13px;">
                           <strong style="color: #0b4141; display: block; margin-bottom: 5px;">Coordinator Remarks:</strong>
                           <p style="margin: 0; color: rgba(11, 65, 65, 0.7); leading-relaxed: 1.5; font-style: italic;">"${remarks}"</p>
                         </div>`
                      : "";
  
                  const sendSmtpEmail = {
                      sender: {
                          name: "Placement Portal Team",
                          email: process.env.EMAIL_USER || "no-reply@placementhub.com"
                      },
                      to: [
                          {
                              email:user.email,
                              name: user.name || "Candidate"
                          }
                      ],
                      subject: `Application Status Alert: ${application.companyId.companyName} - ${status} ${statusIcon}`,
                      htmlContent: `
                          <div style="background-color: #faf0dc; padding: 40px 20px; font-family: Arial, sans-serif;">
                              <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(11, 65, 65, 0.08);">
                                  <div style="background: #0b4141; padding: 35px; text-align: center; color: #faf0dc;">
                                      <h1 style="margin: 0; font-size: 26px;">Status Updated ${statusIcon}</h1>
                                      <p style="margin-top: 10px; opacity: 0.8; font-size: 14px; uppercase; tracking-wider;">PlacementHub Alerts</p>
                                  </div>
                                  <div style="padding: 40px; color: #0b4141;">
                                      <h2 style="margin-top: 0; font-size: 20px; color: #0b4141;">Hello ${user.name},</h2>
                                      <p style="line-height: 1.6; color: rgba(11, 65, 65, 0.8); font-size: 15px;">
                                          There is a status update on your application for the role of <strong>${application.companyId.role}</strong> at <strong>${application.companyId.companyName}</strong>.
                                      </p>
                                      
                                      <div style="background: #faf0dc; border: 1px solid rgba(11, 65, 65, 0.08); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                                          <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; color: rgba(11, 65, 65, 0.5); text-transform: uppercase; letter-spacing: 1px;">Current Application Status</p>
                                          <div style="display: inline-block; padding: 12px 28px; background-color: ${statusColor}15; border: 1.5px solid ${statusColor}; color: ${statusColor}; border-radius: 12px; font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
                                              ${status}
                                          </div>
                                          ${remarksHtml}
                                      </div>
                                      
                                      <p style="line-height: 1.6; color: rgba(11, 65, 65, 0.6); font-size: 13px;">
                                          For next steps, interview schedules, or documents requests, please check the applications portal dashboard.
                                      </p>
                                  </div>
                                  <div style="background: #0b4141; padding: 20px; text-align: center; color: rgba(250, 240, 220, 0.6); font-size: 11px; border-top: 1px solid rgba(250, 240, 220, 0.1);">
                                      Placement Portal Team © 2026
                                  </div>
                              </div>
                          </div>
                      `
                  };
  
                  const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
                  console.log("APPLICATION STATUS MAIL SENT:", data);
              } catch (err) {
  console.error(
    "APPLICATION STATUS MAIL ERROR:",
    JSON.stringify(err.response?.body || err, null, 2)
  );
}
  })();

    // ==================================
    // RESPONSE
    // ==================================
    return res.status(200).json({

      success: true,

      message:
      "Application status updated",

      application,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to update application status",
    });
  }
};