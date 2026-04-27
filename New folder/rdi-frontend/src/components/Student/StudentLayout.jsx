import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./student.css";

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "My Projects", path: "/student/projects" },
    { name: "Create Project", path: "/student/create" },
    { name: "Team", path: "/student/team" },
    { name: "Reviews", path: "/student/reviews" },
    { name: "Opportunities", path: "/student/opportunities" },
  ];

  //Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // if you use it
    navigate("/login");
  };

  return (
    <div className="student-shell">
      {/* TOP BAR */}
      <div className="student-topbar">
        <div className="student-topbar-left">
          <div className="student-brand">🎓 RDI Platform</div>

          <div className="student-main-nav">
            <span>HOME</span>
            <span>MY STUDIES</span>
            <span>PROJECTS</span>
            <span>MESSAGES</span>
            <span>CALENDAR</span>
          </div>
        </div>

        {/* RIGHT SIDE PROFILE + LOGOUT */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="student-profile">EN | Parth</div>

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
          <span 
            onClick={handleLogout}
            style={{cursor: "pointer", color: "#dc2626", fontWeight: "500"}}
          ></span>
            Logout
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="student-tabs">
        {tabs.map((tab) => (
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

      {/* CONTENT */}
      <div className="student-content">
        <Outlet />
      </div>
    </div>
  );
}