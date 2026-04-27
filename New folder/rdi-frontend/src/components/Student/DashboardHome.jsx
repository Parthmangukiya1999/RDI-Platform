import "./student.css";

export default function DashboardHome() {
  const cards = [
    { title: "Total Projects", value: "8" },
    { title: "Active Projects", value: "4" },
    { title: "Pending Reviews", value: "3" },
    { title: "Average Rating", value: "4.4 ★" },
  ];

  return (
    <div>
      <div className="page-card">
        <h2 className="page-title">Student Dashboard</h2>
        <p className="page-subtitle">
          Welcome back. Manage your projects, members, reviews, and new opportunities here.
        </p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.title} className="stat-card">
            <div className="stat-label">{card.title}</div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">My Projects Overview</h3>
          <button className="btn btn-primary">+ Create New Project</button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Members</th>
                <th>Leader</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AI Attendance Tracker</td>
                <td>In Progress</td>
                <td>4</td>
                <td>You</td>
                <td>4.5 ★</td>
                <td><button className="btn">View</button></td>
              </tr>
              <tr>
                <td>Smart Farming Analytics</td>
                <td>Submitted</td>
                <td>3</td>
                <td>You</td>
                <td>4.8 ★</td>
                <td><button className="btn">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="two-col">
        <div className="section-card">
          <h3 className="section-title">Recent Reviews</h3>
          <div className="review-item">
            <strong>Mentor Review</strong> — 4 ★
            <p>Good progress. Improve documentation and project timeline clarity.</p>
          </div>
          <div className="review-item">
            <strong>Company Review</strong> — 5 ★
            <p>Strong practical relevance and good teamwork presentation.</p>
          </div>
        </div>

        <div className="section-card">
          <h3 className="section-title">Upcoming Activity</h3>
          <ul>
            <li>Project review due in 3 days</li>
            <li>2 member requests pending</li>
            <li>New company opportunity posted</li>
            <li>Mentor feedback added to 1 project</li>
          </ul>
        </div>
      </div>
    </div>
  );
}