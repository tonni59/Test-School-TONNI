import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setUsers);

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setReports);

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setAnalytics);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map((u: any) => (
          <li key={u._id}>{u.name} - {u.email} ({u.role})</li>
        ))}
      </ul>

      <h2>Reports</h2>
      <pre>{JSON.stringify(reports, null, 2)}</pre>

      <h2>Analytics</h2>
      <pre>{JSON.stringify(analytics, null, 2)}</pre>
    </div>
  );
}
