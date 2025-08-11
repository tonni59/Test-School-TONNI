import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function sendEmail(to: string, subject: string, text: string, attachmentPath?: string) {
  const mailOptions: any = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text
  };

  if (attachmentPath) {
    mailOptions.attachments = [
      {
        filename: attachmentPath.split("/").pop(),
        path: attachmentPath
      }
    ];
  }

  await transporter.sendMail(mailOptions);
}
