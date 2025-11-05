// import nodemailer from 'nodemailer';

// const sendEmail = async ({ email, subject, message }) => {
//   if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//     console.log('Email not sent — SMTP not configured. Would send to:', email, subject);
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,

//     port: Number(process.env.EMAIL_PORT || 587),
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject,
//     text: message
//   };
  
//   await transporter.sendMail(mailOptions);
// };

// export default sendEmail;
import "dotenv/config";
import { Resend } from "resend";

const sendEmail = async ({ email, subject, message }) => {
  // If no API key found, log and skip sending (just like your old SMTP check)
  if (!process.env.RESEND_API_KEY) {
    console.log("Email not sent — Resend API key not configured. Would send to:", email, subject);
    return;
  }

  // Initialize Resend client
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Send email via Resend sandbox sender (works without domain setup)
    await resend.emails.send({
      from: "onboarding@resend.dev", // ✅ works for testing and demos
      to: email,
      subject,
      text: message,
    });

    console.log(`✅ Email successfully sent to: ${email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

export default sendEmail;
