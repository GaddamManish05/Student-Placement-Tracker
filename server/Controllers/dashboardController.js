import Application from "../Models/applicationModel.js";
import Company from "../Models/companyModel.js";

export const studentDashboard =
async (req, res) => {

   try {

      const studentId = req.user._id;

      // =========================
      // TOTAL APPLICATIONS
      // =========================
      const totalApplications =
      await Application.countDocuments({
         studentId
      });

      // =========================
      // SELECTED COUNT
      // =========================
      const selectedCount =
      await Application.countDocuments({
         studentId,
         status: "Selected"
      });

      // =========================
      // INTERVIEW COUNT
      // =========================
      const interviewCount =
      await Application.countDocuments({
         studentId,
         status: {
            $in: [
               "Round 1",
               "Round 2",
               "HR Round"
            ]
         }
      });

      // =========================
      // RECENT APPLICATIONS
      // =========================
      const recentApplications =
      await Application.find({
         studentId
      })
      .populate("companyId")
      .sort({ createdAt: -1 })
      .limit(5);

      // =========================
      // UPCOMING DRIVES (Context-Aware Match & Fallbacks)
      // =========================
      const user = req.user;
      const userSkills = user.skills || [];

      const upcomingDrivesRaw = await Company.find({
         isDeleted: false,
         lastDate: {
            $gte: new Date()
         }
      }).lean();

      // Filter based on basic eligibility (branch and CGPA)
      const eligibleDrives = upcomingDrivesRaw.filter((drive) => {
         const isBranchEligible = !drive.allowedBranches || 
            drive.allowedBranches.length === 0 || 
            drive.allowedBranches.includes(user.branch) || 
            drive.allowedBranches.includes("Other");
         const isCgpaEligible = user.cgpa === undefined || user.cgpa >= (drive.minCGPA || 0);
         return isBranchEligible && isCgpaEligible;
      });

      // Calculate skill overlap score
      const scoredDrives = eligibleDrives.map((drive) => {
         let matchScore = 0;
         const roleKeywords = String(drive.role || "").toLowerCase().split(/[\s,]+/);
         const descKeywords = String(drive.description || "").toLowerCase().split(/[\s,]+/);
         const matchKeywords = [...roleKeywords, ...descKeywords];

         if (userSkills.length > 0) {
            const matched = userSkills.filter(skill =>
               matchKeywords.some(kw => kw.includes(skill.toLowerCase()) || skill.toLowerCase().includes(kw))
            ).length;
            matchScore = Math.round((matched / Math.max(userSkills.length, 1)) * 100);
         }

         return {
            ...drive,
            matchScore
         };
      });

      // Sort by match overlap first, then drive date
      scoredDrives.sort((a, b) => b.matchScore - a.matchScore || new Date(a.driveDate) - new Date(b.driveDate));

      const fallbacks = [
         {
            _id: "fallback-resume",
            companyName: "Career Services",
            role: "ATS Resume Optimization Prep",
            location: "Virtual Module",
            driveDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            description: "Optimize your resume with our AI-powered Resume Builder.",
            isFallback: true,
            matchScore: 100
         },
         {
            _id: "fallback-interview",
            companyName: "Career Services",
            role: "Technical Mock Interview Prep",
            location: "Virtual Module",
            driveDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            description: "Practice mock interview patterns with feedback logs.",
            isFallback: true,
            matchScore: 100
         }
      ];

      const upcomingDrives = scoredDrives.length > 0 ? scoredDrives.slice(0, 5) : fallbacks;

      // Assign AB Group statically per user ID
      const abGroup = parseInt(user._id.toString().slice(-4), 16) % 2 === 0 ? "A" : "B";

      // =========================
      // DYNAMIC PROFILE SCORE
      // =========================
      let profileCompletion = 0;
      if (user.name) profileCompletion += 15;
      if (user.branch) profileCompletion += 15;
      if (user.rollNumber) profileCompletion += 10;
      if (user.cgpa >= 6) profileCompletion += 25;

      const skillCount = user.skills?.length || 0;
      if (skillCount >= 1) profileCompletion += 10;
      if (skillCount >= 3) profileCompletion += 10;
      if (skillCount >= 5) profileCompletion += 15;
      if (user.profileImage) profileCompletion += 10;

      if (profileCompletion > 100) {
         profileCompletion = 100;
      }
      const profileScore = profileCompletion * 10;

      // =========================
      // RESPONSE
      // =========================
      res.status(200).json({

         success: true,

         dashboardData: {

            stats: {

               totalApplications,

               selectedCount,

               interviewCount,

               profileScore,

               abGroup
            },

            recentApplications,

            upcomingDrives
         }
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};