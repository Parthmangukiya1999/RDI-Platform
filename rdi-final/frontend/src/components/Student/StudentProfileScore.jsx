import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../services/projectService";
import "./student.css";

export default function StudentProfileScore() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load score profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const myProjects = useMemo(() => (
    projects.filter((project) =>
      project.createdBy?._id === user?._id ||
      project.members?.some((member) => member.user?._id === user?._id)
    )
  ), [projects, user]);

  const completed = myProjects.filter((project) => project.status === "Completed");
  const verified = completed.filter((project) => project.ratingSummary?.isVerified);
  const verifiedAverage = verified.length
    ? (verified.reduce((sum, project) => sum + (project.ratingSummary?.compositeScore || 0), 0) / verified.length).toFixed(2)
    : "0.00";

  if (loading) return <div className="section-card">Loading profile score...</div>;

  return (
    <div>
      {error && <div className="section-card" style={{ color: "#b91c1c" }}>{error}</div>}
      <div className="page-card">
        <h2 className="page-title">Student Verified Score Profile</h2>
        <p className="page-subtitle">Track your completed projects, verified scores, and rating readiness in one place.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">My Projects</div><div className="stat-value">{myProjects.length}</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value">{completed.length}</div></div>
        <div className="stat-card"><div className="stat-label">Verified Projects</div><div className="stat-value">{verified.length}</div></div>
        <div className="stat-card"><div className="stat-label">Verified Average</div><div className="stat-value">{verifiedAverage}</div></div>
      </div>

      <div className="section-card">
        <h3 className="section-title">Project score history</h3>
        {!myProjects.length && <p className="small-muted">You are not part of any projects yet.</p>}
        {!!myProjects.length && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Composite</th>
                  <th>Verified</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myProjects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.status}</td>
                    <td>{project.ratingSummary?.compositeScore || 0}</td>
                    <td>{project.ratingSummary?.isVerified ? "Yes" : "No"}</td>
                    <td><Link className="btn" to={`/student/projects/${project._id}`}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
