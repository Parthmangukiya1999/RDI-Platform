// import "../../components/Admin/admin.css";

// export default function AdminDashboardHome() {
//   return (
//     <div className="admin-card-grid">
//       <div className="admin-card">
//         <h3>Total Projects</h3>
//         <div className="admin-big-number">24</div>
//         <p>All active and submitted student projects</p>
//       </div>

//       <div className="admin-card">
//         <h3>Pending Reviews</h3>
//         <div className="admin-big-number">8</div>
//         <p>Projects waiting for mentor or admin review</p>
//       </div>

//       <div className="admin-card">
//         <h3>Teams</h3>
//         <div className="admin-big-number">12</div>
//         <p>Student groups currently collaborating</p>
//       </div>

//       <div className="admin-card">
//         <h3>Opportunities</h3>
//         <div className="admin-big-number">5</div>
//         <p>Open company and expert opportunities</p>
//       </div>
//     </div>
//   );
// }

export default function AdminDashboardHome() {
  return (
    <div className="admin-card-grid">
      <div className="admin-card">
        <h3>Total Projects</h3>
        <p className="admin-big-number">24</p>
      </div>

      <div className="admin-card">
        <h3>Pending Reviews</h3>
        <p className="admin-big-number">8</p>
      </div>

      <div className="admin-card">
        <h3>Active Teams</h3>
        <p className="admin-big-number">12</p>
      </div>

      <div className="admin-card">
        <h3>Users</h3>
        <p className="admin-big-number">56</p>
      </div>
    </div>
  );
}