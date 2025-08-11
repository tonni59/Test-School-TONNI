import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";


// ==== Load environment variables ====
dotenv.config();

// ==== Import Routes ====
import authRoutes from "./routes/auth";
import examRoutes from "./routes/exam";
import analyticsRoutes from "./routes/analytics";
import certificateRoutes from "./routes/certificate"; // Certificate download
import userRoutes from "./routes/user"; // User profile (update, get)
import examStepsRoutes from "./routes/examSteps"; // Step-by-step exam handling

// ==== Initialize App ====
const app = express();

// ==== Middlewares ====
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true, // Allow all origins in dev
    credentials: true,
  })
);
app.use(express.json());

// ==== Static Files (Certificates & Profile Photos) ====
const pdfStoragePath = process.env.PDF_STORAGE_PATH || "storage/certs";
app.use("/certs", express.static(path.join(process.cwd(), pdfStoragePath)));

const uploadsPath = process.env.UPLOADS_PATH || "storage/uploads";
app.use("/uploads", express.static(path.join(process.cwd(), uploadsPath)));

// ==== API Routes ====
app.use("/api/auth", authRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/user", userRoutes);
app.use("/api/exam-steps", examStepsRoutes); // ✅ Step-by-step exam routes

// ==== MongoDB Connection ====
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

const PORT = process.env.PORT || 4000;


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📄 Certificates served at /certs`);
      console.log(`🖼  Profile photos served at /uploads`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });
