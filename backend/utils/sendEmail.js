import "dotenv/config";
import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message }) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not sent — SMTP not configured. Would send to:', email, subject);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,

    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message
  };
  
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
