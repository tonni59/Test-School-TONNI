// frontend/src/pages/ThankYou.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';

export default function ThankYou() {
  return (
    <div className="thank-container">
      <div className="thank-card">
        <h2>Thank you!</h2>
        <p>Your exam flow has ended. Good luck with your future learning.</p>
        <div className="thank-actions">
          <Link to="/">Return to Home</Link>
        </div>
      </div>
    </div>
  );
}
