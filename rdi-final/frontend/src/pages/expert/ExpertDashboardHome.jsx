export default function ExpertDashboardHome() {
  const stats = [
    { title: "Assigned Reviews", value: 6 },
    { title: "Completed Reviews", value: 14 },
    { title: "Pending Feedback", value: 3 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Expert Dashboard</h2>

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