import { useEffect, useMemo, useState } from "react";
import {
  createOpportunity,
  getMyOpportunities,
} from "../../services/opportunityService";

export default function CompanyOpportunities() {
  const [form, setForm] = useState({
    title: "",
    type: "internship",
    location: "",
    description: "",
    skillsRequired: "",
    deadline: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
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
    fetchMyOpportunities();
  }, []);

  const fetchMyOpportunities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyOpportunities();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        title: form.title,
        companyName:
          currentUser?.companyName ||
          currentUser?.name ||
          "Company",
        description: form.description,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        type: form.type,
        location: form.location,
        deadline: form.deadline || null,
      };

      await createOpportunity(payload);

      setSuccess("Opportunity created successfully.");
      setForm({
        title: "",
        type: "internship",
        location: "",
        description: "",
        skillsRequired: "",
        deadline: "",
      });

      await fetchMyOpportunities();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create opportunity");
    } finally {
      setSubmitLoading(false);
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
      <h2>Create Opportunity</h2>

      {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginBottom: "12px" }}>{success}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Opportunity title"
          value={form.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="internship">Internship</option>
          <option value="project">Project</option>
          <option value="job">Job</option>
          <option value="collaboration">Collaboration</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          required
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <input
          type="text"
          name="skillsRequired"
          placeholder="Skills required (comma separated)"
          value={form.skillsRequired}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle} disabled={submitLoading}>
          {submitLoading ? "Adding..." : "Add Opportunity"}
        </button>
      </form>

      <h2>My Opportunities</h2>

      {loading ? (
        <p>Loading opportunities...</p>
      ) : items.length === 0 ? (
        <p>No opportunities created yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {items.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#fff",
                padding: "18px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{item.title}</h3>
              <p><strong>Company:</strong> {item.companyName}</p>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Location:</strong> {item.location || "Not specified"}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p>
                <strong>Skills Required:</strong>{" "}
                {item.skillsRequired?.length
                  ? item.skillsRequired.join(", ")
                  : "Not specified"}
              </p>
              <p><strong>Deadline:</strong> {formatDate(item.deadline)}</p>
              <p><strong>Applicants:</strong> {item.applicants?.length || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
};

const buttonStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};