import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Analytics.css";

interface Attempt {
  _id: string;
  step: number;
  total: number;
  correct: number;
  wrong: number;
  percent: number;
  certificateLevel?: string;
  certUrl?: string;
  emailSent?: boolean;
  createdAt?: string; // backend might use createdAt instead of date
  date?: string;      // fallback if date is used instead
}

interface AnalyticsData {
  username: string;
  email: string;
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  averagePercent: number;
  attempts: Attempt[];
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/analytics/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const handleDownload = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) return <div className="analytics-status">Loading...</div>;
  if (!data) return <div className="analytics-status">No analytics data available.</div>;

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">My Exam Analytics</h2>
      <div className="analytics-summary">
        <p><strong>Name:</strong> {data.username}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Total Attempts:</strong> {data.totalAttempts}</p>
        <p><strong>Total Questions:</strong> {data.totalQuestions}</p>
        <p><strong>Total Correct:</strong> {data.totalCorrect}</p>
        <p><strong>Total Wrong:</strong> {data.totalWrong}</p>
        <p><strong>Average %:</strong> {data.averagePercent.toFixed(2)}%</p>
      </div>

      <h3>Attempt History</h3>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Step</th>
            <th>Total</th>
            <th>Correct</th>
            <th>Wrong</th>
            <th>%</th>
            <th>Certificate Level</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {data.attempts && data.attempts.length > 0 ? (
            data.attempts.map((a) => (
              <tr key={a._id}>
                <td>
                  {a.date
                    ? new Date(a.date).toLocaleDateString()
                    : a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>{a.step}</td>
                <td>{a.total}</td>
                <td>{a.correct}</td>
                <td>{a.wrong}</td>
                <td>{a.percent.toFixed(2)}%</td>
                <td>{a.certificateLevel || "-"}</td>
                <td>
                  {a.certUrl ? (
                    <>
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(a.certUrl)}
                      >
                        Download
                      </button>
                      {a.emailSent && (
                        <span
                          title="Certificate emailed"
                          style={{ marginLeft: "5px" }}
                        >
                          📩
                        </span>
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No attempts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
