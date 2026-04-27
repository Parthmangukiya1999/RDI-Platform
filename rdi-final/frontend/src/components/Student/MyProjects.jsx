import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../services/projectService";
import "./student.css";

export default function MyProjects() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = `${project.title} ${project.category} ${(project.skills || []).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "All" ? true : project.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, status]);

  return (
    <div className="section-card">
      <div className="filter-bar">
        <h2 className="section-title">Projects</h2>
        <div className="filter-controls">
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search projects" className="form-input" />
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Open for Members">Open for Members</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {filteredProjects.map((project) => {
          const slotsLeft = Math.max((project.teamSize || project.members?.length || 1) - (project.members?.length || 0), 0);
          const isOwner = project.createdBy?._id === user?._id;
          return (
            <div key={project._id} className="section-card" style={{ marginBottom: 0 }}>
              <div className="section-header">
                <div>
                  <h3 style={{ margin: 0 }}>{project.title}</h3>
                  <div className="small-muted">Owner: {project.createdBy?.name || "Unknown"}</div>
                </div>
                <span className="btn">{project.status}</span>
              </div>
              <p className="muted">{project.shortDescription}</p>
              <div className="small-muted" style={{ marginBottom: 12 }}>
                Skills: {(project.skills || []).join(", ") || "None"} • Duration: {project.duration || "Not set"} • Team slots left: {slotsLeft}
              </div>
              <div>
                <Link className="btn btn-primary" to={`/student/projects/${project._id}`}>View details</Link>
                {isOwner && <span className="small-muted" style={{ marginLeft: 12 }}>Your project</span>}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !filteredProjects.length && <p className="small-muted">No projects match your filters.</p>}
    </div>
  );
}
