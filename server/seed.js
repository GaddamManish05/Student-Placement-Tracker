import mongoose from "mongoose";
import User from "./Models/userModel.js";
import Company from "./Models/companyModel.js";
import Application from "./Models/applicationModel.js";

const MONGO_URI = "mongodb://localhost:27017/smart-placement-db";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    // Clear existing data (but preserve admin users)
    console.log("Cleaning database...");
    await Application.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({ role: "student" });

    // 1. Create Companies
    console.log("Seeding companies...");
    const companiesData = [
      {
        companyName: "Google",
        role: "Software Engineer",
        packageOffered: 35,
        location: "Bangalore",
        minCGPA: 8.5,
        allowedBranches: ["CSE", "IT"],
        lastDate: new Date("2026-06-15"),
        driveDate: new Date("2026-06-25"),
        description: "Hiring for core engineering and machine learning teams.",
        status: "ACTIVE",
      },
      {
        companyName: "Adobe",
        role: "Full Stack Developer",
        packageOffered: 22,
        location: "Noida",
        minCGPA: 7.5,
        allowedBranches: ["CSE", "IT", "ECE"],
        lastDate: new Date("2026-06-20"),
        driveDate: new Date("2026-06-28"),
        description: "Looking for MERN stack and product development roles.",
        status: "ACTIVE",
      },
      {
        companyName: "TCS",
        role: "System Engineer",
        packageOffered: 4.5,
        location: "Hyderabad",
        minCGPA: 6.0,
        allowedBranches: ["CSE", "IT", "ECE", "ME", "CE"],
        lastDate: new Date("2026-07-05"),
        driveDate: new Date("2026-07-15"),
        description: "Mass hiring for system support and development trainees.",
        status: "ACTIVE",
      },
      {
        companyName: "Goldman Sachs",
        role: "Financial Analyst",
        packageOffered: 24,
        location: "Bangalore",
        minCGPA: 8.0,
        allowedBranches: ["CSE", "IT", "ECE"],
        lastDate: new Date("2026-06-12"),
        driveDate: new Date("2026-06-22"),
        description: "Quantitative analysis and financial modeling roles.",
        status: "ACTIVE",
      },
      {
        companyName: "JP Morgan",
        role: "Investment Analyst",
        packageOffered: 18,
        location: "Mumbai",
        minCGPA: 7.8,
        allowedBranches: ["CSE", "IT", "ECE"],
        lastDate: new Date("2026-06-18"),
        driveDate: new Date("2026-06-29"),
        description: "Hiring client advisory and core investment engineering teams.",
        status: "ACTIVE",
      },
      {
        companyName: "McKinsey",
        role: "Business Consultant",
        packageOffered: 15,
        location: "Gurugram",
        minCGPA: 8.2,
        allowedBranches: ["CSE", "IT", "ME", "ECE"],
        lastDate: new Date("2026-06-10"),
        driveDate: new Date("2026-06-20"),
        description: "Advising fortune 500 companies on operations and strategy.",
        status: "ACTIVE",
      },
      {
        companyName: "Deloitte",
        role: "Technology Consultant",
        packageOffered: 8.5,
        location: "Hyderabad",
        minCGPA: 7.0,
        allowedBranches: ["CSE", "IT", "ECE", "ME"],
        lastDate: new Date("2026-06-30"),
        driveDate: new Date("2026-07-10"),
        description: "Enterprise system architecture and digital transformation consulting.",
        status: "ACTIVE",
      },
      {
        companyName: "L&T",
        role: "Graduate Engineer Trainee",
        packageOffered: 6.5,
        location: "Chennai",
        minCGPA: 6.5,
        allowedBranches: ["ME", "CE"],
        lastDate: new Date("2026-07-02"),
        driveDate: new Date("2026-07-12"),
        description: "Hiring core mechanical and civil engineers for industrial projects.",
        status: "ACTIVE",
      },
      {
        companyName: "Tata Motors",
        role: "Design Engineer",
        packageOffered: 7.2,
        location: "Pune",
        minCGPA: 6.8,
        allowedBranches: ["ME", "ECE"],
        lastDate: new Date("2026-06-25"),
        driveDate: new Date("2026-07-08"),
        description: "Hiring engineering designers for vehicle dynamics and automation.",
        status: "ACTIVE",
      }
    ];

    const seededCompanies = await Company.insertMany(companiesData);
    console.log(`Seeded ${seededCompanies.length} companies.`);

    // 2. Create Students
    console.log("Seeding students...");
    const studentsData = [
      { name: "Rahul Sharma", email: "rahul@gmail.com", password: "password123", role: "student", branch: "CSE", cgpa: 9.2, placementStatus: "unplaced" },
      { name: "Priya Patel", email: "priya@gmail.com", password: "password123", role: "student", branch: "CSE", cgpa: 8.8, placementStatus: "unplaced" },
      { name: "Aman Verma", email: "aman@gmail.com", password: "password123", role: "student", branch: "IT", cgpa: 8.4, placementStatus: "unplaced" },
      { name: "Sneha Reddy", email: "sneha@gmail.com", password: "password123", role: "student", branch: "IT", cgpa: 7.9, placementStatus: "unplaced" },
      { name: "Vikram Singh", email: "vikram@gmail.com", password: "password123", role: "student", branch: "ECE", cgpa: 8.1, placementStatus: "unplaced" },
      { name: "Neha Gupta", email: "neha@gmail.com", password: "password123", role: "student", branch: "ECE", cgpa: 7.6, placementStatus: "unplaced" },
      { name: "Aditya Roy", email: "aditya@gmail.com", password: "password123", role: "student", branch: "ME", cgpa: 7.2, placementStatus: "unplaced" },
      { name: "Anjali Rao", email: "anjali@gmail.com", password: "password123", role: "student", branch: "ME", cgpa: 8.5, placementStatus: "unplaced" },
      { name: "Rohan Das", email: "rohan@gmail.com", password: "password123", role: "student", branch: "CE", cgpa: 6.8, placementStatus: "unplaced" },
      { name: "Siddharth Sen", email: "sid@gmail.com", password: "password123", role: "student", branch: "CSE", cgpa: 9.5, placementStatus: "unplaced" },
      { name: "Meera Nair", email: "meera@gmail.com", password: "password123", role: "student", branch: "CE", cgpa: 7.4, placementStatus: "unplaced" },
      { name: "Karan Johar", email: "karan@gmail.com", password: "password123", role: "student", branch: "IT", cgpa: 6.9, placementStatus: "unplaced" }
    ];

    const seededStudents = await User.insertMany(studentsData);
    console.log(`Seeded ${seededStudents.length} students.`);

    // 3. Create Applications with various statuses
    console.log("Seeding applications...");
    const applicationsData = [];

    // Setup map of company by name
    const compMap = {};
    seededCompanies.forEach(c => { compMap[c.companyName] = c; });

    // Rahul (CSE, 9.2) -> Google (Selected), Adobe (Round 2)
    applicationsData.push({ studentId: seededStudents[0]._id, companyId: compMap["Google"]._id, status: "Selected" });
    applicationsData.push({ studentId: seededStudents[0]._id, companyId: compMap["Adobe"]._id, status: "Round 2" });

    // Priya (CSE, 8.8) -> Google (Rejected), Adobe (Selected), JP Morgan (Round 1)
    applicationsData.push({ studentId: seededStudents[1]._id, companyId: compMap["Google"]._id, status: "Rejected" });
    applicationsData.push({ studentId: seededStudents[1]._id, companyId: compMap["Adobe"]._id, status: "Selected" });
    applicationsData.push({ studentId: seededStudents[1]._id, companyId: compMap["JP Morgan"]._id, status: "Round 1" });

    // Aman (IT, 8.4) -> Goldman Sachs (Selected), McKinsey (HR Round)
    applicationsData.push({ studentId: seededStudents[2]._id, companyId: compMap["Goldman Sachs"]._id, status: "Selected" });
    applicationsData.push({ studentId: seededStudents[2]._id, companyId: compMap["McKinsey"]._id, status: "HR Round" });

    // Sneha (IT, 7.9) -> Adobe (Rejected), Deloitte (Round 1)
    applicationsData.push({ studentId: seededStudents[3]._id, companyId: compMap["Adobe"]._id, status: "Rejected" });
    applicationsData.push({ studentId: seededStudents[3]._id, companyId: compMap["Deloitte"]._id, status: "Round 1" });

    // Vikram (ECE, 8.1) -> Goldman Sachs (Round 2), JP Morgan (Selected)
    applicationsData.push({ studentId: seededStudents[4]._id, companyId: compMap["Goldman Sachs"]._id, status: "Round 2" });
    applicationsData.push({ studentId: seededStudents[4]._id, companyId: compMap["JP Morgan"]._id, status: "Selected" });

    // Neha (ECE, 7.6) -> TCS (Selected)
    applicationsData.push({ studentId: seededStudents[5]._id, companyId: compMap["TCS"]._id, status: "Selected" });

    // Aditya (ME, 7.2) -> Tata Motors (Round 1), L&T (Applied)
    applicationsData.push({ studentId: seededStudents[6]._id, companyId: compMap["Tata Motors"]._id, status: "Round 1" });
    applicationsData.push({ studentId: seededStudents[6]._id, companyId: compMap["L&T"]._id, status: "Applied" });

    // Anjali (ME, 8.5) -> McKinsey (Selected), Tata Motors (Selected)
    applicationsData.push({ studentId: seededStudents[7]._id, companyId: compMap["McKinsey"]._id, status: "Selected" });
    applicationsData.push({ studentId: seededStudents[7]._id, companyId: compMap["Tata Motors"]._id, status: "Selected" });

    // Rohan (CE, 6.8) -> L&T (Selected)
    applicationsData.push({ studentId: seededStudents[8]._id, companyId: compMap["L&T"]._id, status: "Selected" });

    // Siddharth (CSE, 9.5) -> Google (Selected)
    applicationsData.push({ studentId: seededStudents[9]._id, companyId: compMap["Google"]._id, status: "Selected" });

    const seededApps = await Application.insertMany(applicationsData);
    console.log(`Seeded ${seededApps.length} applications.`);

    // 4. Update Student Placement Statuses and Company totalApplications
    console.log("Updating placement statuses & application counts...");
    for (const student of seededStudents) {
      const studentApps = await Application.find({ studentId: student._id });
      const hasSelected = studentApps.some(app => app.status === "Selected");
      const hasProgress = studentApps.some(app => ["Round 1", "Round 2", "HR Round"].includes(app.status));
      
      let status = "unplaced";
      if (hasSelected) {
        status = "placed";
      } else if (hasProgress) {
        status = "internship";
      }

      await User.findByIdAndUpdate(student._id, { placementStatus: status });
    }

    for (const company of seededCompanies) {
      const count = await Application.countDocuments({ companyId: company._id });
      await Company.findByIdAndUpdate(company._id, { totalApplications: count });
    }

    console.log("Database seeding completed successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
