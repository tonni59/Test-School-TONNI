import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import User from "../src/models/User";
import Result from "../src/models/Result";
import sendEmail from "../utils/sendEmail";

export async function submitExam(req: Request, res: Response) {
  try {
    const { step, answers, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const total = answers.length;
    const correct = answers.filter((a: any) => a.isCorrect).length;
    const percent = (correct / total) * 100;

    let certificateLevel = "";
    let proceed = false;

    if (step === 1) {
      if (percent < 25) certificateLevel = "Fail";
      else if (percent < 50) certificateLevel = "A1";
      else if (percent < 75) certificateLevel = "A2";
      else {
        certificateLevel = "A2";
        proceed = true;
      }
    } else if (step === 2) {
      if (percent < 25) certificateLevel = "A2";
      else if (percent < 50) certificateLevel = "B1";
      else if (percent < 75) certificateLevel = "B2";
      else {
        certificateLevel = "B2";
        proceed = true;
      }
    } else if (step === 3) {
      if (percent < 25) certificateLevel = "B2";
      else if (percent < 50) certificateLevel = "C1";
      else certificateLevel = "C2";
    }

    // Ensure cert storage exists
    const pdfStoragePath = process.env.PDF_STORAGE_PATH || "certs";
    const absoluteStoragePath = path.join(process.cwd(), pdfStoragePath);
    fs.mkdirSync(absoluteStoragePath, { recursive: true });

    // Generate certificate PDF
    const fileName = `cert_${user._id}_${Date.now()}.pdf`;
    const certFilePath = path.join(absoluteStoragePath, fileName);
    const baseUrl = process.env.APP_BASE_URL || "http://localhost:4000";
    const certUrl = `${baseUrl}/certs/${fileName}`;

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.fontSize(26).fillColor("darkblue").text("TONNI School Project", { align: "center" });
    doc.moveDown();
    doc.fontSize(20).text("Professional Certificate", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(18).text(`Awarded to: ${user.name}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Level Achieved: ${certificateLevel}`, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.pipe(fs.createWriteStream(certFilePath));
    doc.end();

    // Email certificate
    await sendEmail(
      user.email,
      "Your Professional Certificate",
      `Dear ${user.name},\n\nCongratulations! Your ${certificateLevel} certificate is attached.\n\nRegards,\nTONNI School`,
      certFilePath
    );

    // Save result
    await Result.create({
      userId,
      step,
      total,
      correct,
      percent,
      certificateLevel,
      certUrl,
      emailSent: true
    });

    // Build response with step-specific certificate URL
    const responseData: any = {
      total,
      correct,
      percent,
      certificateLevel: proceed ? `${certificateLevel} - Proceed` : certificateLevel,
      proceed,
      step1CertUrl: step === 1 ? certUrl : null,
      step2CertUrl: step === 2 ? certUrl : null,
      lifetimeCertUrl: step === 3 ? certUrl : null,
      emailSent: true
    };

    res.json(responseData);

  } catch (err) {
    console.error("❌ submitExam error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
