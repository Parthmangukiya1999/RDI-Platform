import { useEffect, useState } from "react";
import { getMyAssignedReviews, submitReview } from "../../services/ratingService";
import "./student.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [forms, setForms] = useState({});
  const [message, setMessage] = useState("");

  const loadReviews = async () => {
    try {
      const data = await getMyAssignedReviews();
      setReviews(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load review assignments");
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const updateScore = (reviewId, key, value) => {
    setForms((prev) => ({
      ...prev,
      [reviewId]: {
        ...(prev[reviewId] || {}),
        scores: { ...prev[reviewId]?.scores, [key]: value },
      },
    }));
  };

  const updateFeedback = (reviewId, feedback) => {
    setForms((prev) => ({
      ...prev,
      [reviewId]: { ...(prev[reviewId] || {}), feedback },
    }));
  };

  const handleSubmit = async (reviewId) => {
    try {
      await submitReview(reviewId, forms[reviewId] || {});
      setMessage("Review submitted successfully");
      await loadReviews();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div>
      {message && <div className="section-card">{message}</div>}
      <div className="section-card">
        <h2 className="section-title">Peer Rating Tasks</h2>
        <p className="small-muted">After a completed project, peer members can rate teamwork, communication, and reliability.</p>
      </div>

      {reviews.length === 0 && <div className="section-card">No peer review requests assigned yet.</div>}

      {reviews.map((review) => (
        <div key={review._id} className="section-card">
          <h3 style={{ marginTop: 0 }}>{review.project?.title}</h3>
          <div className="small-muted">Rating role: {review.reviewerRole}</div>
          <div className="small-muted">Status: {review.status}</div>
          {review.template?.map((criterion) => (
            <div className="form-group" key={criterion.key}>
              <label>{criterion.label}</label>
              <select className="form-select" disabled={review.status === "completed"} value={forms[review._id]?.scores?.[criterion.key] || review.criteria?.find((c) => c.key === criterion.key)?.score || ""} onChange={(e) => updateScore(review._id, criterion.key, e.target.value)}>
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}</option>)}
              </select>
            </div>
          ))}
          <div className="form-group">
            <label>Feedback</label>
            <textarea className="form-textarea" rows="4" disabled={review.status === "completed"} value={forms[review._id]?.feedback ?? review.feedback ?? ""} onChange={(e) => updateFeedback(review._id, e.target.value)} />
          </div>
          {review.status !== "completed" && <button className="btn btn-primary" onClick={() => handleSubmit(review._id)}>Save Rating</button>}
        </div>
      ))}
    </div>
  );
}
