export default function CompanyDashboardHome() {
  const stats = [
    { title: "Active Opportunities", value: 4 },
    { title: "Applicants", value: 12 },
    { title: "Shortlisted", value: 5 },
    { title: "Projects Viewed", value: 18 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Company Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {stats.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <h4 style={{ margin: 0, color: "#6b7280" }}>{item.title}</h4>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: "12px 0 0" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}