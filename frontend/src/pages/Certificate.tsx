// frontend/src/pages/Certificate.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Certificate.css";

export default function Certificate({ cert }: { cert: { step: number } }) {
  const navigate = useNavigate();

  // Same navigation as "Yes" button in Exam.tsx
  const handleStartStep = (step: number) => {
    navigate(`/exam/${step}`);
  };

  return (
    <div className="certificate-container">
      {/* Certificate display */}
      <div className="certificate-content">
        {/* You can place your certificate preview or download logic here */}
        <h2>Congratulations!</h2>
        <p>Your certificate for Step {cert.step} is ready.</p>
      </div>

      {/* Step navigation buttons */}
      {cert.step === 1 && (
        <div className="next-step">
          <button
            className="step-button"
            onClick={() => handleStartStep(2)}
          >
            Start Step 2 →
          </button>
        </div>
      )}

      {cert.step === 2 && (
        <div className="next-step">
          <button
            className="step-button"
            onClick={() => handleStartStep(3)}
          >
            Start Step 3 →
          </button>
        </div>
      )}
    </div>
  );
}
