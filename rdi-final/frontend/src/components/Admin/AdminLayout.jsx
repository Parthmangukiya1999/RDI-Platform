import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../Student/student.css";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const tabs = [
    { name: "Dashboard", path: "/admin/dashboard", roles: ["admin", "mentor"] },
    { name: "Users", path: "/admin/users", roles: ["admin"] },
    { name: "Teams", path: "/admin/teams", roles: ["admin", "mentor"] },
    { name: "Projects", path: "/admin/projects", roles: ["admin", "mentor"] },
    { name: "Opportunities", path: "/admin/opportunities", roles: ["admin", "mentor"] },
    { name: "Settings", path: "/admin/settings", roles: ["admin"] },
  ];

  const visibleTabs = tabs.filter((tab) => tab.roles.includes(user?.role));

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
            <span>ADMIN</span>
            <span>USERS</span>
            <span>TEAMS</span>
            <span>PROJECTS</span>
            <span>SETTINGS</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="student-profile">
            {user?.role?.toUpperCase() || "ADMIN"} | {user?.name || "User"}
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
        {visibleTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`student-tab ${
              location.pathname === tab.path ? "active" : ""
            }`}
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