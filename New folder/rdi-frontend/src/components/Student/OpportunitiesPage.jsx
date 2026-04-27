import "./student.css";

export default function OpportunitiesPage() {
  const items = [
    {
      title: "IoT Smart Campus Project",
      postedBy: "Mentor",
      description: "Build a smart monitoring system for campus resources.",
      deadline: "25 Apr 2026",
    },
    {
      title: "Industry Data Dashboard",
      postedBy: "Company",
      description: "Create a reporting dashboard for real business data analysis.",
      deadline: "30 Apr 2026",
    },
  ];

  return (
    <div>
      <div className="page-card">
        <h2 className="page-title">New Opportunities</h2>
        <p className="page-subtitle">
          Browse projects posted by mentors and companies and join relevant opportunities.
        </p>
      </div>

      <div className="opportunity-list">
        {items.map((item) => (
          <div key={item.title} className="opportunity-card">
            <div className="opportunity-header">
              <div>
                <h3>{item.title}</h3>
                <p><strong>Posted By:</strong> {item.postedBy}</p>
                <p>{item.description}</p>
                <p><strong>Deadline:</strong> {item.deadline}</p>
              </div>

              <div>
                <button className="btn">View</button>
                <button className="btn btn-primary">Apply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}