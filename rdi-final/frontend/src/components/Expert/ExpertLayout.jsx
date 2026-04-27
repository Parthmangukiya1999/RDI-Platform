import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../Student/student.css";

export default function ExpertLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const tabs = [
    { name: "Dashboard", path: "/expert/dashboard" },
    { name: "Reviews", path: "/expert/reviews" },
    { name: "History", path: "/expert/history" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="student-shell">
      <div className="student-topbar">
        <div className="student-topbar-left">
          <div className="student-brand">RDI Platform</div>

          <div className="student-main-nav">
            <span>EXPERT</span>
            <span>REVIEWS</span>
            <span>HISTORY</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="student-profile">
            EXPERT | {user?.name || "Expert"}
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#dc2626",
              color: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="student-tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`student-tab ${location.pathname === tab.path ? "active" : ""}`}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="student-content">
        <Outlet />
      </div>
    </div>
  );
}