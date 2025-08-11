import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">TONNI School Project</div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} TONNI School. All Rights Reserved.
        </p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/exam/1">Exam</a>
          <a href="/analytics">Analytics</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
