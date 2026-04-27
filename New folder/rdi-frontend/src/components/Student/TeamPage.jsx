import "./student.css";

export default function TeamPage() {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Team Members</h2>
        <button className="btn">+ Add Registered Student</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Project</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Parth Mangukiya</td>
              <td>parth@email.com</td>
              <td>AI Attendance Tracker</td>
              <td>Leader</td>
              <td>Active</td>
              <td><button className="btn" disabled>Leader</button></td>
            </tr>
            <tr>
              <td>Student Member</td>
              <td>member@email.com</td>
              <td>AI Attendance Tracker</td>
              <td>Member</td>
              <td>Active</td>
              <td>
                <button className="btn">Remove</button>
                <button className="btn">Leave</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}