import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./CertificatePage.css";

interface CertificateData {
  step: number;
  username?: string;
  totalScore?: number;
  percent?: number;
  certificateLevel?: string;
}

interface CertificatePageProps {
  cert?: CertificateData;
  handleNextStep?: (fromCertificate?: boolean) => void;
}

const CertificatePage: React.FC<CertificatePageProps> = ({ cert, handleNextStep }) => {
  const { state } = useLocation();
  const {
    username: stateUsername,
    totalScore: stateTotal,
    percent: statePercent,
    certificateLevel: stateLevel,
    currentStep: stateStep,
  } = state || {};

  // ✅ Prefer props.cert values, fallback to state
  const username = cert?.username || stateUsername || "Student";
  const totalScore = cert?.totalScore ?? stateTotal ?? "N/A";
  const percent = cert?.percent ?? statePercent ?? "N/A";
  const certificateLevel = cert?.certificateLevel || stateLevel || "N/A";
  const currentStep = cert?.step ?? stateStep ?? 1;

  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (certificateRef.current) {
      setTimeout(() => {
        html2canvas(certificateRef.current!).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("landscape", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        });
      }, 500);
    }
  }, []);

  return (
    <div className="certificate-container">
      <div className="certificate-card" ref={certificateRef}>
        <h1>🎉 Congratulations! 🎉</h1>
        <h2>{username}</h2>
        <p><strong>Total Score:</strong> {totalScore}</p>
        <p><strong>Percent:</strong> {percent}%</p>
        <p><strong>Certificate Level:</strong> {certificateLevel}</p>
      </div>

      {currentStep === 1 && (
        <div className="next-step">
          <button
            className="exam-submit-btn"
            onClick={() => handleNextStep && handleNextStep(true)}
          >
            Start Step 2 ➡
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="next-step">
          <button
            className="exam-submit-btn"
            onClick={() => handleNextStep && handleNextStep(true)}
          >
            Start Step 3 ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
