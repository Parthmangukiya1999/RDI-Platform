import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects } from "../../services/projectService";
import { getMyAssignedReviews } from "../../services/ratingService";
import "./student.css";

export default function DashboardHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [projectData, reviewData] = await Promise.all([
          getProjects(),
          getMyAssignedReviews(),
        ]);

        setProjects(Array.isArray(projectData) ? projectData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      }
    };

    load();
  }, []);

  const myProjects = useMemo(() => {
    if (!user?._id) return [];

    return projects.filter((project) => {
      const isOwner =
        project?.createdBy?._id === user._id ||
        project?.createdBy === user._id;

      const isMember = Array.isArray(project?.members)
        ? project.members.some(
            (member) =>
              member?.user?._id === user._id ||
              member?.user === user._id
          )
        : false;

      return isOwner || isMember;
    });
  }, [projects, user]);

  const activeProjects = myProjects.filter((project) =>
    ["Open for Members", "In Progress", "Submitted"].includes(project.status)
  );

  const pendingReviews = reviews.filter(
    (review) => review.status !== "completed"
  );

  const ratedProjects = myProjects.filter(
    (project) => Number(project?.ratingSummary?.compositeScore) > 0
  );

  const averageRating = ratedProjects.length
    ? (
        ratedProjects.reduce(
          (sum, project) => sum + (project?.ratingSummary?.compositeScore || 0),
          0
        ) / ratedProjects.length
      ).toFixed(2)
    : "0.00";

  const recentCompleted = myProjects
    .filter((project) => project.status === "Completed")
    .slice(0, 5);

  const cards = [
    { title: "My Projects", value: String(myProjects.length) },
    { title: "Active Projects", value: String(activeProjects.length) },
    { title: "Pending Reviews", value: String(pendingReviews.length) },
    { title: "Average Rating", value: `${averageRating} ★` },
  ];

  return (
    <div>
      <div className="page-card">
        <h2 className="page-title">Student Dashboard</h2>
        <p className="page-subtitle">
          Welcome back. Manage your projects, applications, completed work, and
          verified score from here.
        </p>
      </div>

      {error && (
        <div className="section-card" style={{ color: "#b91c1c" }}>
          {error}
        </div>
      )}

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.title} className="stat-card">
            <div className="stat-label">{card.title}</div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">My Projects Overview</h3>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate("/student/create")}
          >
            + Create New Project
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Members</th>
                <th>Leader</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="small-muted">
                    No projects found yet.
                  </td>
                </tr>
              ) : (
                myProjects.map((project) => {
                  const isOwner =
                    project?.createdBy?._id === user?._id ||
                    project?.createdBy === user?._id;

                  return (
                    <tr key={project._id}>
                      <td>{project.title}</td>
                      <td>{project.status}</td>
                      <td>{project.members?.length || 0}</td>
                      <td>{isOwner ? "You" : project?.createdBy?.name || "-"}</td>
                      <td>{project?.ratingSummary?.compositeScore || 0} ★</td>
                      <td>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => navigate(`/student/projects/${project._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="two-col">
        <div className="section-card">
          <h3 className="section-title">Recent completed projects</h3>
          {recentCompleted.length === 0 && (
            <p className="small-muted">No completed projects yet.</p>
          )}

          {recentCompleted.map((project) => (
            <div key={project._id} className="review-item">
              <strong>{project.title}</strong> —{" "}
              {project?.ratingSummary?.compositeScore || 0} ★
              <p>
                Verified score:{" "}
                {project?.ratingSummary?.isVerified ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>

        <div className="section-card">
          <h3 className="section-title">Upcoming activity</h3>
          <ul>
            <li>{pendingReviews.length} review task(s) waiting for your submission</li>
            <li>{activeProjects.length} active project(s) need monitoring</li>
            <li>
              {
                myProjects.filter(
                  (project) => project.status === "Open for Members"
                ).length
              }{" "}
              project(s) open for members
            </li>
            <li>
              <Link to="/student/score-profile">Open verified score profile</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}