export default function SettingsPage() {
  return (
    <>
      <div className="page-card">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Configure platform settings and admin preferences.
        </p>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Platform Settings</h2>
        </div>

        <div className="form-group">
          <label>Platform Name</label>
          <input className="form-input" type="text" placeholder="RDI Platform" />
        </div>

        <div className="form-group">
          <label>Default Role</label>
          <select className="form-select">
            <option>Student</option>
            <option>Company</option>
            <option>Admin</option>
          </select>
        </div>

        <button className="btn btn-primary">Save Settings</button>
      </div>
    </>
  );
}