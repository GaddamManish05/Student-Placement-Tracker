import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { sendEmailViaBrevo } from "../config/brevo.js";

dotenv.config();

let transporterInstance = null;

// Lazy initialize transporter with Dev fallback
const getTransporter = async () => {
  if (transporterInstance) return transporterInstance;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass) {
    console.log("Using Production SMTP Transport configuration for Gmail");
    transporterInstance = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass }
    });
  } else {
    console.log("No SMTP credentials found. Initializing temporary Ethereal SMTP test account...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporterInstance = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      transporterInstance.isTest = true;
    } catch (error) {
      console.error("Failed to construct Ethereal SMTP test account. Falling back to local console mock.", error);
      transporterInstance = {
        sendMail: async (options) => {
          console.log(`[LOCAL MOCK EMAIL DISPATCH]
-----------------------------------------
From: ${options.from}
To: ${options.to}
Subject: ${options.subject}
Body: (HTML content omitted for brevity)
-----------------------------------------`);
          return { messageId: "mock-message-id" };
        }
      };
    }
  }

  return transporterInstance;
};

// Dispatch Helper
const dispatch = async (options) => {
  try {
    // Attempt Brevo sending first
    const brevoResult = await sendEmailViaBrevo(options);
    if (brevoResult) {
      return brevoResult;
    }

    const transporter = await getTransporter();
    const info = await transporter.sendMail(options);
    console.log(`Email dispatched successfully! Message ID: ${info.messageId}`);
    
    // Log preview link if using Ethereal
    if (transporter.isTest) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[ETHEREAL SIMULATION] Preview Email here: ${previewUrl}`);
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Critical error during email dispatch: ", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Application Confirmation Email
 */
export const sendApplicationConfirmation = async (student, company) => {
  const fromEmail = process.env.EMAIL_USER || "no-reply@placementhub.com";
  
  const html = `
    <div style="background-color: #faf0dc; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 16px 32px rgba(11, 65, 65, 0.08); border: 1px solid rgba(11, 65, 65, 0.1);">
        <div style="background-color: #0b4141; padding: 40px; text-align: center; color: #faf0dc;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Application Submitted 🎉</h1>
          <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">PlacementHub Drives</p>
        </div>
        <div style="padding: 40px; background-color: #ffffff; color: #0b4141;">
          <h2 style="margin-top: 0; font-size: 20px; font-weight: 700;">Hello ${student.name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: rgba(11, 65, 65, 0.8);">
            Your application for the hiring drive has been registered successfully. The placement coordinator has shared your academic records with the recruiting team.
          </p>
          
          <div style="background-color: #faf0dc; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1.5px solid rgba(11, 65, 65, 0.06);">
            <h3 style="margin-top: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #ff6864; font-weight: 800; margin-bottom: 15px;">Drive Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; font-weight: 700; color: #0b4141; width: 40%;">Company:</td>
                <td style="padding: 8px 0; color: rgba(11, 65, 65, 0.9); font-weight: 600;">${company.companyName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 700; color: #0b4141;">Role:</td>
                <td style="padding: 8px 0; color: rgba(11, 65, 65, 0.9);">${company.role}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 700; color: #0b4141;">Package:</td>
                <td style="padding: 8px 0; color: #ff6864; font-weight: 800;">${company.packageOffered} LPA</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 700; color: #0b4141;">Location:</td>
                <td style="padding: 8px 0; color: rgba(11, 65, 65, 0.9);">📍 ${company.location}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 13px; line-height: 1.6; color: rgba(11, 65, 65, 0.6); margin-bottom: 0;">
            You can monitor your review progress and track any upcoming technical evaluations directly inside your student portal dashboard.
          </p>
        </div>
        <div style="background-color: #0b4141; padding: 20px; text-align: center; color: rgba(250, 240, 220, 0.6); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; border-top: 1px solid rgba(250, 240, 220, 0.1);">
          © 2026 PlacementHub. All rights reserved. Campus Placement Cell.
        </div>
      </div>
    </div>
  `;

  return dispatch({
    from: `"PlacementHub" <${fromEmail}>`,
    to: student.email,
    subject: `Application Submitted: ${company.companyName} 🎉`,
    html
  });
};

/**
 * Send Application Status Update Email
 */
export const sendApplicationStatusUpdate = async (student, company, status, remarks = "") => {
  const fromEmail = process.env.EMAIL_USER || "no-reply@placementhub.com";

  // Determine status color codes
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

  const html = `
    <div style="background-color: #faf0dc; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 16px 32px rgba(11, 65, 65, 0.08); border: 1px solid rgba(11, 65, 65, 0.1);">
        <div style="background-color: #0b4141; padding: 40px; text-align: center; color: #faf0dc;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Status Updated ${statusIcon}</h1>
          <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">PlacementHub Alerts</p>
        </div>
        <div style="padding: 40px; background-color: #ffffff; color: #0b4141;">
          <h2 style="margin-top: 0; font-size: 20px; font-weight: 700;">Hello ${student.name},</h2>
          <p style="font-size: 15px; line-height: 1.6; color: rgba(11, 65, 65, 0.8);">
            There is a status update on your application for the role of <strong>${company.role}</strong> at <strong>${company.companyName}</strong>.
          </p>
          
          <div style="background-color: #faf0dc; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1.5px solid rgba(11, 65, 65, 0.06); text-align: center;">
            <p style="margin: 0; font-size: 11px; font-weight: 800; color: rgba(11, 65, 65, 0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Current Application Status</p>
            <div style="display: inline-block; padding: 12px 28px; background-color: ${statusColor}15; border: 1.5px solid ${statusColor}; color: ${statusColor}; border-radius: 12px; font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
              ${status}
            </div>
            
            ${remarksHtml}
          </div>
          
          <p style="font-size: 13px; line-height: 1.6; color: rgba(11, 65, 65, 0.6); margin-bottom: 0;">
            For next steps, interview schedules, or documents requests, please check the applications portal dashboard.
          </p>
        </div>
        <div style="background-color: #0b4141; padding: 20px; text-align: center; color: rgba(250, 240, 220, 0.6); font-size: 11px; font-weight: 600; letter-spacing: 0.5px; border-top: 1px solid rgba(250, 240, 220, 0.1);">
          © 2026 PlacementHub. All rights reserved. Campus Placement Cell.
        </div>
      </div>
    </div>
  `;

  return dispatch({
    from: `"PlacementHub Alerts" <${fromEmail}>`,
    to: student.email,
    subject: `Application Status Alert: ${company.companyName} - ${status} ${statusIcon}`,
    html
  });
};
