import Application from "../Models/applicationModel.js";

import Company from "../Models/companyModel.js";
import NotificationModel from "../Models/notificationModel.js";
import apiInstance from "../config/brevo.js";

// APPLY TO COMPANY
export const applyToCompany = async (req,res) => {
    try {
        const student = req.user;
        const { companyId } = req.body;
        // FIND COMPANY
        const company = await Company.findById(
            companyId
        );

        if(!company || company.isDeleted){

            return res.status(404).json({
                message: "Company not found"
            });

        }


        // ELIGIBILITY CHECK
        if(student.cgpa < company.minCGPA){

            return res.status(400).json({
                message: "Not eligible due to CGPA"
            });

        }


        if(
            !company.allowedBranches.includes(
                student.branch
            )
        ){

            return res.status(400).json({
                message: "Branch not eligible"
            });

        }


        // CHECK DUPLICATE APPLICATION
        const alreadyApplied =
        await Application.findOne({
            studentId: student._id,
            companyId
        });



        if(alreadyApplied){

            return res.status(400).json({
                message: "Already applied"
            });

        }


        // CREATE APPLICATION
        const application =
        await Application.create({
            studentId: student._id,
            companyId
        });

        await NotificationModel.create({
            userId: student._id,
            title: "Application Submitted",
            message: `You applied to ${company.companyName}`,
            type: "application"
        });

        (async () => {
            try {
                if (!process.env.BREVO_API_KEY) {
                    console.log("No BREVO_API_KEY found. Logging application email locally:");
                    console.log(`To: ${student.email}, Subject: Application Submitted, Company: ${company.companyName}`);
                    return;
                }

                const sendSmtpEmail = {
                    sender: {
                        name: "Placement Portal Team",
                        email: process.env.EMAIL_USER || "no-reply@placementhub.com"
                    },
                    to: [
                        {
                            email: student.email,
                            name: student.name || "Candidate"
                        }
                    ],
                    subject: `Application Submitted: ${company.companyName} 🎉`,
                    htmlContent: `
                        <div style="background-color: #faf0dc; padding: 40px 20px; font-family: Arial, sans-serif;">
                            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(11, 65, 65, 0.08);">
                                <div style="background: #0b4141; padding: 35px; text-align: center; color: #faf0dc;">
                                    <h1 style="margin: 0; font-size: 26px;">Application Submitted 🎉</h1>
                                    <p style="margin-top: 10px; opacity: 0.8; font-size: 14px; uppercase; tracking-wider;">PlacementHub Drives</p>
                                </div>
                                <div style="padding: 40px; color: #0b4141;">
                                    <h2 style="margin-top: 0; font-size: 20px; color: #0b4141;">Hello ${student.name},</h2>
                                    <p style="line-height: 1.6; color: rgba(11, 65, 65, 0.8); font-size: 15px;">
                                        Your application for the hiring drive has been registered successfully.
                                    </p>
                                    <div style="background: #faf0dc; border: 1px solid rgba(11, 65, 65, 0.08); border-radius: 12px; padding: 20px; margin: 25px 0;">
                                        <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${company.companyName}</p>
                                        <p style="margin: 0 0 10px 0;"><strong>Role:</strong> ${company.role}</p>
                                        <p style="margin: 0 0 10px 0;"><strong>Package:</strong> <span style="color: #ff6864; font-weight: bold;">${company.packageOffered} LPA</span></p>
                                        <p style="margin: 0;"><strong>Location:</strong> 📍 ${company.location}</p>
                                    </div>
                                    <p style="line-height: 1.6; color: rgba(11, 65, 65, 0.6); font-size: 13px;">
                                        Monitor your review status and upcoming evaluations inside your student portal dashboard.
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
                console.log("APPLICATION CONFIRMATION MAIL SENT:", data);
            } catch (err) {
                console.error("APPLICATION MAIL ERROR:", err.message || err);
            }
        })();


        res.status(201).json({
            success: true,
            message: "Applied successfully",
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const myApplications = async (
    req,
    res
) => {

    try {

        const applications =
        await Application.find({
            studentId: req.user._id
        })
        .populate("companyId")
        .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const updateApplicationStatus = async (
    req,
    res
) => {

    try {

        const { status, remarks } = req.body;


        const application =
        await Application.findById(
            req.params.id
        ).populate("studentId").populate("companyId");

        if(!application){

            return res.status(404).json({
                message: "Application not found"
            });

        }


        application.status = status;

        if(remarks){
            application.remarks = remarks;
        }


        await application.save();
        
        await NotificationModel.create({
            userId: application.studentId._id,
            title: "Application Status Updated",
            message:`Your application for ${application.companyId.companyName} is now ${status}`,
            type: "placement"

        });

        // Asynchronously send application status update email
        (async () => {
            try {
                if (!process.env.BREVO_API_KEY) {
                    console.log("No BREVO_API_KEY found. Logging status update email locally:");
                    console.log(`To: ${application.studentId.email}, Subject: Status Updated, Status: ${status}`);
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
                            email: application.studentId.email,
                            name: application.studentId.name || "Candidate"
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
                                    <h2 style="margin-top: 0; font-size: 20px; color: #0b4141;">Hello ${application.studentId.name},</h2>
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
                console.error("APPLICATION STATUS MAIL ERROR:", err.message || err);
            }
        })();

        res.status(200).json({
            success: true,
            message: "Application status updated",
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


export const getAllApplications = async (
    req,
    res
) => {

    try {

        const applications =
        await Application.find()
        .populate("studentId")
        .populate("companyId")
        .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};