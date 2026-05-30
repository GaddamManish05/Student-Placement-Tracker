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