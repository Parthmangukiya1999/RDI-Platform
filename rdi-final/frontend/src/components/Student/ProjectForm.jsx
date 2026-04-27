import { useState } from "react";
import { createProject } from "../../services/projectService";

const ProjectForm = ({ onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    technologies: "",
    requiredSkills: "",
    projectType: "Individual",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Other",
      technologies: "",
      requiredSkills: "",
      projectType: "Individual",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const data = await createProject(payload);

      setMessage(data.message || "Project posted successfully");
      resetForm();

      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-card">
      <h2>Post a New Project</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="project-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe your project idea"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Research">Research</option>
            <option value="Development">Development</option>
            <option value="Innovation">Innovation</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Technologies</label>
          <input
            type="text"
            name="technologies"
            placeholder="React, Node.js, MongoDB"
            value={formData.technologies}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Required Skills</label>
          <input
            type="text"
            name="requiredSkills"
            placeholder="JavaScript, UI Design, APIs"
            value={formData.requiredSkills}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Project Type</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
          >
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;