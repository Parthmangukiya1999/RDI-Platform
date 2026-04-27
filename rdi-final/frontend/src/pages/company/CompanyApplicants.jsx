export default function CompanyProjects() {
  const projects = [
    { id: 1, title: "AI Resume Analyzer", student: "Parth", category: "AI" },
    { id: 2, title: "Smart Irrigation System", student: "Mira", category: "IoT" },
    { id: 3, title: "Campus Marketplace", student: "John", category: "Web App" },
  ];

  return (
    <div>
      <h2>Student Projects</h2>

      <div style={{ display: "grid", gap: "16px" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{project.title}</h3>
            <p><strong>Student:</strong> {project.student}</p>
            <p><strong>Category:</strong> {project.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}