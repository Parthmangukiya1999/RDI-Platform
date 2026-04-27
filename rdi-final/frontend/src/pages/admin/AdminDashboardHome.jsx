import { useEffect, useState } from "react";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    projects: 0,
    pendingReviews: 0,
    teams: 0,
    users: 0,
    opportunities: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [
          usersRes,
          projectsRes,
          teamsRes,
          opportunitiesRes,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", { headers }),
          fetch("http://localhost:5000/api/admin/projects", { headers }),
          fetch("http://localhost:5000/api/admin/teams", { headers }),
          fetch("http://localhost:5000/api/admin/opportunities", { headers }),
        ]);

        const usersData = usersRes.ok ? await usersRes.json() : [];
        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        const teamsData = teamsRes.ok ? await teamsRes.json() : [];
        const opportunitiesData = opportunitiesRes.ok ? await opportunitiesRes.json() : [];

        const users = Array.isArray(usersData) ? usersData : usersData.users || [];
        const projects = Array.isArray(projectsData) ? projectsData : projectsData.projects || [];
        const teams = Array.isArray(teamsData) ? teamsData : teamsData.teams || [];
        const opportunities = Array.isArray(opportunitiesData)
          ? opportunitiesData
          : opportunitiesData.opportunities || [];

        const pendingReviews = projects.filter(
          (project) =>
            project.status === "pending" ||
            project.reviewStatus === "pending" ||
            project.approvalStatus === "pending"
        ).length;

        setStats({
          users: users.length,
          projects: projects.length,
          teams: teams.length,
          opportunities: opportunities.length,
          pendingReviews,
        });

        setRecentUsers(users.slice(0, 5));
        setRecentProjects(projects.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="page-card">Loading admin dashboard...</div>;
  }

  return (
    <>
      <div className="page-card">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">
          Real-time overview of users, teams, projects, and opportunities.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Users</div>
          <div className="stat-value">{stats.users}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Projects</div>
          <div className="stat-value">{stats.projects}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pending Reviews</div>
          <div className="stat-value">{stats.pendingReviews}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Teams</div>
          <div className="stat-value">{stats.teams}</div>
        </div>
      </div>

      <div className="two-col">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Users</h2>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, index) => (
                    <tr key={user._id || user.id || index}>
                      <td>{user.name || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>{user.role || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Projects</h2>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.length > 0 ? (
                  recentProjects.map((project, index) => (
                    <tr key={project._id || project.id || index}>
                      <td>{project.title || project.name || "Untitled"}</td>
                      <td>
                        {project.status ||
                          project.reviewStatus ||
                          project.approvalStatus ||
                          "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No projects found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}