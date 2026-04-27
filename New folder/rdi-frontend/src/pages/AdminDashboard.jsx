import { useEffect, useState } from "react";
import { getAllProjects, reviewProject } from "../services/projectService";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFeedbackChange = (projectId, value) => {
    setFeedbackInputs((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  const handleReview = async (projectId, status) => {
    try {
      setMessage("");
      setError("");

      await reviewProject(projectId, {
        status,
        feedback: feedbackInputs[projectId] || "",
      });

      setMessage(`Project ${status} successfully`);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to review project");
    }
  };

  const filteredProjects =
    statusFilter === "all"
      ? projects
      : projects.filter((project) => project.status === statusFilter);

  return (
    <div className="admin-dashboard">
      <h1>Admin / Mentor Review Panel</h1>
      <p className="dashboard-subtitle">
        Review student project submissions and update their status.
      </p>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="filter-bar">
        <label>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="admin-project-list">
          {filteredProjects.map((project) => (
            <div key={project._id} className="admin-project-card">
              <h2>{project.title}</h2>
              <p>{project.description}</p>

              <div className="project-meta">
                <p>
                  <strong>Category:</strong> {project.category}
                </p>
                <p>
                  <strong>Type:</strong> {project.projectType}
                </p>
                <p>
                  <strong>Status:</strong> {project.status}
                </p>
              </div>

              <p>
                <strong>Technologies:</strong>{" "}
                {project.technologies?.length
                  ? project.technologies.join(", ")
                  : "Not specified"}
              </p>

              <p>
                <strong>Required Skills:</strong>{" "}
                {project.requiredSkills?.length
                  ? project.requiredSkills.join(", ")
                  : "Not specified"}
              </p>

              <div className="creator-info">
                <p>
                  <strong>Student Name:</strong> {project.createdBy?.name || "Unknown"}
                </p>
                <p>
                  <strong>Email:</strong> {project.createdBy?.email || "Unknown"}
                </p>
              </div>

              {project.feedback && (
                <p>
                  <strong>Existing Feedback:</strong> {project.feedback}
                </p>
              )}

              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  rows="3"
                  placeholder="Write feedback for the student"
                  value={feedbackInputs[project._id] ?? project.feedback ?? ""}
                  onChange={(e) =>
                    handleFeedbackChange(project._id, e.target.value)
                  }
                />
              </div>

              <div className="review-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleReview(project._id, "approved")}
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => handleReview(project._id, "rejected")}
                >
                  Reject
                </button>

                <button
                  className="pending-btn"
                  onClick={() => handleReview(project._id, "pending")}
                >
                  Mark Pending
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;