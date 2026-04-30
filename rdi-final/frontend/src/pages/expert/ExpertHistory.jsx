export default function ExpertHistory() {
  const history = [
    { id: 1, project: "Smart Irrigation System", status: "Completed", score: 8 },
    { id: 2, project: "Campus Marketplace", status: "Completed", score: 9 },
  ];

  return (
    <div>
      <h2>Review History</h2>

      <div style={{ display: "grid", gap: "16px" }}>
        {history.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{item.project}</h3>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Score:</strong> {item.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}