import { useState } from "react";

export default function CompanyOpportunities() {
  const [form, setForm] = useState({
    title: "",
    type: "internship",
    location: "",
    description: "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      title: "Frontend Intern",
      type: "internship",
      location: "Helsinki",
      description: "React internship opportunity",
    },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now(),
      ...form,
    };

    setItems([newItem, ...items]);
    setForm({
      title: "",
      type: "internship",
      location: "",
      description: "",
    });
  };

  return (
    <div>
      <h2>Create Opportunity</h2>

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

        <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
          <option value="internship">Internship</option>
          <option value="project">Project</option>
          <option value="job">Job</option>
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
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <button type="submit" style={buttonStyle}>
          Add Opportunity
        </button>
      </form>

      <h2>My Opportunities</h2>

      <div style={{ display: "grid", gap: "16px" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{item.title}</h3>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
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