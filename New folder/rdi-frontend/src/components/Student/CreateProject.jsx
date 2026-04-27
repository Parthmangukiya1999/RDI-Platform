import React, { useState } from "react";
import { createProject } from "../../services/projectService";
import "./student.css";

const initialState = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  skillsRequired: "",
  duration: "",
  teamSize: 2,
  goals: "",
  startDate: "",
  endDate: "",
  openForMembers: true,
  status: "Open for Members",
};

export default function CreateProject() {
  const [projectType, setProjectType] = useState("group");
  const [members, setMembers] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateMember = (index, value) => {
    setMembers((prev) => prev.map((member, i) => (i === index ? value : member)));
  };

  const addMemberField = () => setMembers((prev) => [...prev, ""]);
  const removeMemberField = (indexToRemove) => {
    setMembers((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Project title is required";
    if (!formData.shortDescription.trim()) return "Short description is required";
    if (!formData.fullDescription.trim()) return "Full description is required";
    if (!formData.category.trim()) return "Category is required";
    if (!formData.skillsRequired.trim()) return "Skills required is required";
    if (!formData.startDate) return "Start date is required";
    if (!formData.endDate) return "End date is required";
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return "End date must be after start date";
    }
    return "";
  };

  const handleSubmit = async (submitStatus) => {
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.fullDescription.trim(),
        category: formData.category.trim(),
        skills: formData.skillsRequired.split(",").map((skill) => skill.trim()).filter(Boolean),
        duration: formData.duration.trim(),
        teamSize: Number(formData.teamSize),
        goals: formData.goals.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        deadline: formData.endDate,
        openForMembers: formData.openForMembers,
        status: submitStatus,
        projectType,
        members: projectType === "group" ? members.filter((m) => m.trim()) : [],
      };

      await createProject(payload);
      setMessage("Project created successfully");
      setFormData(initialState);
      setProjectType("group");
      setMembers([""]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.toLowerCase().includes("success");

  return (
    <div className="create-grid">
      <div className="section-card">
        <h2 className="section-title">Create Project</h2>
        {message && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: isSuccess ? "#f0fdf4" : "#fef2f2", color: isSuccess ? "#166534" : "#b91c1c" }}>
            {message}
          </div>
        )}

        <div className="form-row">
          <div className="form-group"><label>Title</label><input className="form-input" name="title" value={formData.title} onChange={handleChange} /></div>
          <div className="form-group"><label>Category</label><input className="form-input" name="category" value={formData.category} onChange={handleChange} /></div>
        </div>

        <div className="form-group"><label>Short Description</label><input className="form-input" name="shortDescription" value={formData.shortDescription} onChange={handleChange} /></div>
        <div className="form-group"><label>Full Description</label><textarea className="form-textarea" rows="5" name="fullDescription" value={formData.fullDescription} onChange={handleChange} /></div>
        <div className="form-group"><label>Goals</label><textarea className="form-textarea" rows="3" name="goals" value={formData.goals} onChange={handleChange} /></div>

        <div className="form-row">
          <div className="form-group"><label>Required Skills</label><input className="form-input" name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} placeholder="React, Node.js, MongoDB" /></div>
          <div className="form-group"><label>Duration</label><input className="form-input" name="duration" value={formData.duration} onChange={handleChange} placeholder="8 weeks" /></div>
        </div>

        <div className="form-row">
          <div className="form-group"><label>Team Size</label><input className="form-input" type="number" min="1" name="teamSize" value={formData.teamSize} onChange={handleChange} /></div>
          <div className="form-group"><label>Status</label>
            <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
              <option value="Draft">Draft</option>
              <option value="Open for Members">Open for Members</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group"><label>Start Date</label><input className="form-input" type="date" name="startDate" value={formData.startDate} onChange={handleChange} /></div>
          <div className="form-group"><label>End Date</label><input className="form-input" type="date" name="endDate" value={formData.endDate} onChange={handleChange} /></div>
        </div>

        <div className="form-group">
          <label>Project Type</label>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <label><input type="radio" checked={projectType === "individual"} onChange={() => setProjectType("individual")} /> Individual</label>
            <label><input type="radio" checked={projectType === "group"} onChange={() => setProjectType("group")} /> Group</label>
          </div>
        </div>

        {projectType === "group" && (
          <div className="form-group">
            <label>Invite members by email</label>
            {members.map((member, index) => (
              <div key={index} style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input className="form-input" value={member} onChange={(e) => updateMember(index, e.target.value)} placeholder="teammate@example.com" />
                {members.length > 1 && <button className="btn" type="button" onClick={() => removeMemberField(index)}>Remove</button>}
              </div>
            ))}
            <button className="btn" type="button" onClick={addMemberField} style={{ marginTop: 10 }}>Add Member</button>
          </div>
        )}

        <div className="form-group">
          <label>
            <input type="checkbox" name="openForMembers" checked={formData.openForMembers} onChange={handleChange} /> Open for members
          </label>
        </div>

        <div>
          <button className="btn" type="button" disabled={loading} onClick={() => handleSubmit("Draft")}>Save Draft</button>
          <button className="btn btn-primary" type="button" disabled={loading} onClick={() => handleSubmit(formData.openForMembers ? "Open for Members" : "In Progress")}>Publish Project</button>
        </div>
      </div>

      <div className="section-card">
        <h3 className="section-title">Posting flow</h3>
        <p className="small-muted">Create the project, publish it, review applications, then mark it completed when the work finishes.</p>
        <ul className="small-muted">
          <li>Students can apply when the project is open.</li>
          <li>Owner or admin can accept or reject applicants.</li>
          <li>Completed projects trigger mentor, peer, company, and expert ratings.</li>
        </ul>
      </div>
    </div>
  );
}
