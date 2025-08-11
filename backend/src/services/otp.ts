import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Simple OTP email sender using nodemailer. Replace SMTP in .env for production.
export async function sendOtpEmail(email: string){
  try{
    const code = Math.floor(100000 + Math.random()*900000).toString();
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${code}`
    });
    // In production store code in DB or cache to verify.
    return code;
  }catch(err){
    console.error('OTP email error', err);
    return null;
  }
}
