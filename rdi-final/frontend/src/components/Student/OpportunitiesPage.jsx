import { useEffect, useMemo, useState } from "react";
import "./student.css";
import {
  applyToOpportunity,
  getAllOpportunities,
} from "../../services/opportunityService";

export default function OpportunitiesPage() {
  const [items, setItems] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllOpportunities();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch opportunities");
    } finally {
      setLoading(false);
    }
  };

  const hasApplied = (opportunity) => {
    if (!currentUser?._id) return false;
    return opportunity?.applicants?.some(
      (applicant) =>
        (typeof applicant.student === "object"
          ? applicant.student?._id
          : applicant.student) === currentUser._id
    );
  };

  const handleApply = async (id) => {
    try {
      setActionLoadingId(id);
      setError("");
      setSuccess("");
      await applyToOpportunity(id);
      setSuccess("Applied successfully.");
      await fetchOpportunities();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to apply");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "No deadline";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "No deadline";
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="page-card">
        <h2 className="page-title">New Opportunities</h2>
        <p className="page-subtitle">
          Browse projects posted by mentors and companies and join relevant opportunities.
        </p>
      </div>

      {loading && <p>Loading opportunities...</p>}
      {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginBottom: "12px" }}>{success}</p>}

      {!loading && items.length === 0 && (
        <div className="page-card">
          <p>No opportunities found.</p>
        </div>
      )}

      <div className="opportunity-list">
        {items.map((item) => {
          const applied = hasApplied(item);

          return (
            <div key={item._id} className="opportunity-card">
              <div className="opportunity-header">
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    <strong>Posted By:</strong>{" "}
                    {item.companyName || item.createdBy?.name || "Company"}
                  </p>
                  <p>
                    <strong>Type:</strong> {item.type || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {item.location || "Not specified"}
                  </p>
                  <p>{item.description}</p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {item.skillsRequired?.length
                      ? item.skillsRequired.join(", ")
                      : "Not specified"}
                  </p>
                  <p>
                    <strong>Deadline:</strong> {formatDate(item.deadline)}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    className="btn"
                    onClick={() => setSelectedOpportunity(item)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => handleApply(item._id)}
                    disabled={applied || actionLoadingId === item._id}
                  >
                    {actionLoadingId === item._id
                      ? "Applying..."
                      : applied
                      ? "Applied"
                      : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedOpportunity && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{selectedOpportunity.title}</h2>
            <p>
              <strong>Posted By:</strong>{" "}
              {selectedOpportunity.companyName ||
                selectedOpportunity.createdBy?.name ||
                "Company"}
            </p>
            <p>
              <strong>Type:</strong> {selectedOpportunity.type || "N/A"}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {selectedOpportunity.location || "Not specified"}
            </p>
            <p>
              <strong>Description:</strong> {selectedOpportunity.description}
            </p>
            <p>
              <strong>Skills Required:</strong>{" "}
              {selectedOpportunity.skillsRequired?.length
                ? selectedOpportunity.skillsRequired.join(", ")
                : "Not specified"}
            </p>
            <p>
              <strong>Deadline:</strong> {formatDate(selectedOpportunity.deadline)}
            </p>
            <p>
              <strong>Total Applicants:</strong>{" "}
              {selectedOpportunity.applicants?.length || 0}
            </p>

            <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
              <button
                className="btn"
                onClick={() => setSelectedOpportunity(null)}
              >
                Close
              </button>

              <button
                className="btn btn-primary"
                onClick={() => handleApply(selectedOpportunity._id)}
                disabled={
                  hasApplied(selectedOpportunity) ||
                  actionLoadingId === selectedOpportunity._id
                }
              >
                {actionLoadingId === selectedOpportunity._id
                  ? "Applying..."
                  : hasApplied(selectedOpportunity)
                  ? "Already Applied"
                  : "Apply Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}