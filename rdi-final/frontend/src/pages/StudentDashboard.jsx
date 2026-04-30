import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Student Dashboard</h1>
      <p>Welcome, {user?.name || "Student"}!</p>

      <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
        <Link to="/projects">Browse Projects</Link>
        <Link to="/projects/create">Create Project</Link>
      </div>

      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px 16px" }}
      >
        Logout
      </button>
    </div>
  );
}