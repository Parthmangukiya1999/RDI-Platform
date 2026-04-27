import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  applyToProject,
  getProjectById,
  markProjectCompleted,
  updateApplicationStatus,
} from "../../services/projectService";
import {
  assignProjectReviewers,
  getProjectRatingSummary,
  getProjectReviews,
  getReviewCandidates,
} from "../../services/ratingService";
import "./student.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState(null);
  const [projectReviews, setProjectReviews] = useState([]);
  const [reviewCandidates, setReviewCandidates] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState({ mentor: "", expert: "", company: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await getProjectById(id);
      setProject(data);

      const canManageRating = ["admin", "mentor"].includes(user?.role) || data.createdBy?._id === user?._id;
      if (data.status === "Completed") {
        const [ratingData, reviews] = await Promise.all([
          getProjectRatingSummary(id),
          getProjectReviews(id),
        ]);
        setSummary(ratingData);
        setProjectReviews(reviews);
        if (canManageRating) {
          const candidates = await getReviewCandidates();
          setReviewCandidates(candidates);
        }
      } else {
        setSummary(null);
        setProjectReviews([]);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const role = user?.role;
  const isOwner = project?.createdBy?._id === user?._id;
  const canManageApplications = isOwner || role === "admin";
  const canComplete = isOwner || role === "admin" || role === "mentor";
  const canManageRating = canComplete;

  const applicationStatus = useMemo(() => {
    const own = project?.applications?.find((item) => item.applicantId?._id === user?._id);
    return own?.status || null;
  }, [project, user]);

  const isMember = project?.members?.some((member) => member.user?._id === user?._id);

  const groupedCandidates = useMemo(() => ({
    mentor: reviewCandidates.filter((candidate) => candidate.role === "mentor"),
    expert: reviewCandidates.filter((candidate) => candidate.role === "expert"),
    company: reviewCandidates.filter((candidate) => candidate.role === "company"),
  }), [reviewCandidates]);

  const reviewCounts = useMemo(() => ({
    assigned: projectReviews.filter((review) => review.status === "assigned").length,
    completed: projectReviews.filter((review) => review.status === "completed").length,
  }), [projectReviews]);

  const handleApply = async () => {
    try {
      const response = await applyToProject(id, { message: "Interested in joining this project." });
      setMessage(response.message);
      await loadProject();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to apply");
    }
  };

  const handleApplicationDecision = async (applicationId, status) => {
    try {
      const response = await updateApplicationStatus(id, { applicationId, status });
      setMessage(response.message);
      await loadProject();
    } catch (error) {
      setMessage(error.response?.data?.message || `Failed to ${status} application`);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await markProjectCompleted(id);
      setMessage(response.message);
      await loadProject();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to complete project");
    }
  };

  const handleAssignReviewers = async () => {
    try {
      const reviewers = Object.entries(selectedReviewers)
        .filter(([, reviewerId]) => reviewerId)
        .map(([reviewerRole, reviewerId]) => ({ reviewerRole, reviewerId }));

      if (!reviewers.length) {
        setMessage("Select at least one reviewer to assign.");
        return;
      }

      const response = await assignProjectReviewers(id, { reviewers });
      setMessage(response.message);
      setSelectedReviewers({ mentor: "", expert: "", company: "" });
      await loadProject();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to assign reviewers");
    }
  };

  if (loading) return <div className="section-card">Loading project...</div>;
  if (!project) return <div className="section-card">{message || "Project not found"}</div>;

  return (
    <div>
      {message && <div className="section-card" style={{ color: message.toLowerCase().includes("failed") ? "#b91c1c" : "#166534" }}>{message}</div>}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h2 className="section-title">{project.title}</h2>
            <div className="small-muted">Owner: {project.createdBy?.name} • Status: {project.status}</div>
          </div>
          <span className="btn">{project.status}</span>
        </div>
        <p>{project.description}</p>
        <div className="small-muted">Short description: {project.shortDescription}</div>
        <div className="small-muted">Category: {project.category}</div>
        <div className="small-muted">Skills needed: {(project.skills || []).join(", ") || "None"}</div>
        <div className="small-muted">Duration: {project.duration || "Not specified"}</div>
        <div className="small-muted">Timeline: {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"} to {project.endDate ? new Date(project.endDate).toLocaleDateString() : project.deadline ? new Date(project.deadline).toLocaleDateString() : "-"}</div>
        <div className="small-muted">Goals: {project.goals || "Not provided"}</div>
        <div className="small-muted">Team members: {project.members?.map((member) => member.user?.name).join(", ") || "None"}</div>

        <div style={{ marginTop: 16 }}>
          {role === "student" && !isOwner && !isMember && project.status === "Open for Members" && !applicationStatus && (
            <button className="btn btn-primary" onClick={handleApply}>Apply to project</button>
          )}
          {applicationStatus && <span className="btn">Application: {applicationStatus}</span>}
          {canComplete && project.status !== "Completed" && (
            <button className="btn btn-primary" onClick={handleComplete}>Mark Project Completed</button>
          )}
        </div>
      </div>

      {canManageApplications && (
        <div className="section-card">
          <h3 className="section-title">Applicants</h3>
          {!project.applications?.length && <p className="small-muted">No applications yet.</p>}
          {project.applications?.map((application) => (
            <div key={application._id} className="review-item">
              <strong>{application.applicantId?.name}</strong>
              <div className="small-muted">{application.applicantId?.email}</div>
              <div className="small-muted">Status: {application.status}</div>
              {application.message && <p className="muted">{application.message}</p>}
              {application.status === "pending" && (
                <div>
                  <button className="btn btn-primary" onClick={() => handleApplicationDecision(application._id, "accepted")}>Accept</button>
                  <button className="btn" onClick={() => handleApplicationDecision(application._id, "rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {project.status === "Completed" && (
        <>
          {canManageRating && (
            <div className="section-card">
              <h3 className="section-title">Reviewer assignment</h3>
              <p className="small-muted">Automatic assignments are already created at completion. Use this panel to add a specific mentor, expert, or company reviewer if needed.</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Mentor reviewer</label>
                  <select className="form-select" value={selectedReviewers.mentor} onChange={(e) => setSelectedReviewers((prev) => ({ ...prev, mentor: e.target.value }))}>
                    <option value="">Select mentor</option>
                    {groupedCandidates.mentor.map((candidate) => <option key={candidate._id} value={candidate._id}>{candidate.name} ({candidate.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Expert reviewer</label>
                  <select className="form-select" value={selectedReviewers.expert} onChange={(e) => setSelectedReviewers((prev) => ({ ...prev, expert: e.target.value }))}>
                    <option value="">Select expert</option>
                    {groupedCandidates.expert.map((candidate) => <option key={candidate._id} value={candidate._id}>{candidate.name} ({candidate.email})</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Company reviewer</label>
                <select className="form-select" value={selectedReviewers.company} onChange={(e) => setSelectedReviewers((prev) => ({ ...prev, company: e.target.value }))}>
                  <option value="">Select company</option>
                  {groupedCandidates.company.map((candidate) => <option key={candidate._id} value={candidate._id}>{candidate.name} ({candidate.email})</option>)}
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleAssignReviewers}>Assign Selected Reviewers</button>
            </div>
          )}

          <div className="section-card">
            <h3 className="section-title">Rating workflow status</h3>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Assigned</div><div className="stat-value">{reviewCounts.assigned}</div></div>
              <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value">{reviewCounts.completed}</div></div>
              <div className="stat-card"><div className="stat-label">Composite</div><div className="stat-value">{summary?.ratingSummary?.compositeScore || 0}</div></div>
              <div className="stat-card"><div className="stat-label">Verified</div><div className="stat-value">{summary?.ratingSummary?.isVerified ? "Yes" : "No"}</div></div>
            </div>
          </div>

          {summary && (
            <div className="section-card">
              <h3 className="section-title">Rating Summary</h3>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Composite Score</div><div className="stat-value">{summary.ratingSummary?.compositeScore || 0}</div></div>
                <div className="stat-card"><div className="stat-label">Mentor</div><div className="stat-value">{summary.ratingSummary?.mentorAverage || 0}</div></div>
                <div className="stat-card"><div className="stat-label">Peer</div><div className="stat-value">{summary.ratingSummary?.peerAverage || 0}</div></div>
                <div className="stat-card"><div className="stat-label">Company/Expert</div><div className="stat-value">{`${summary.ratingSummary?.companyAverage || 0} / ${summary.ratingSummary?.expertAverage || 0}`}</div></div>
              </div>
              {projectReviews.map((review) => (
                <div key={review._id} className="review-item">
                  <h4 style={{ marginBottom: 6 }}>{review.reviewerRole.toUpperCase()} — {review.reviewer?.name || "Assigned reviewer"}</h4>
                  <div className="small-muted">Status: {review.status}</div>
                  {review.status === "completed" && (
                    <>
                      <div className="small-muted">Average: {review.averageScore}</div>
                      <div className="small-muted">{review.criteria?.map((item) => `${item.label}: ${item.score}`).join(" • ")}</div>
                      <p>{review.feedback || "No feedback provided."}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
