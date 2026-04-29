import "../../styles/settings.css";

const SettingsPage = () => {
  const users = [
    ["Admin User", "Administrator", "Active"],
    ["Jessica Lee", "Manager", "Active"],
    ["Tom Harris", "Analyst", "Inactive"],
    ["Kevin Wong", "Viewer", "Active"],
  ];

  const auditLogs = [
    ["2024-04-15", "Admin User", "Modified User Permissions"],
    ["2024-04-14", "Jessica Lee", "Updated Supplier Record"],
    ["2024-04-13", "Kevin Wong", "Login Successful"],
    ["2024-04-12", "Tom Harris", "Added New Order"],
    ["2024-04-11", "Admin User", "Security Settings Changed"],
  ];

  return (
    <div className="settings-page">
      <div className="settings-top">
        <button className="add-user-btn">Add User</button>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-title">
            <span>Supplier Name</span>
            <div>
              <button className="mini-btn">Edit</button>
              <button className="mini-btn">Remove</button>
            </div>
          </div>

          <table className="settings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user[0]}</td>
                  <td>{user[1]}</td>
                  <td>
                    <span
                      className={`user-status ${
                        user[2] === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {user[2]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="settings-card">
          <h3>Security Settings</h3>

          <div className="settings-row">
            <span>Change Password</span>
            <button className="mini-btn">Remove</button>
          </div>

          <div className="settings-row">
            <span>Two-Factor Authentication</span>
            <button className="mini-btn">Update</button>
          </div>

          <div className="settings-row">
            <span>Access Logs</span>
            <button className="mini-btn">Update</button>
          </div>
        </div>

        <div className="settings-card fraud-card">
          <h3>Fraud Detection</h3>

          <div className="fraud-row">
            Suspicious Transactions: <span className="warning-text">2 Alerts</span>
          </div>

          <div className="fraud-row">
            High-Value Payment Monitoring: <span className="success-text">Enabled</span>
          </div>

          <div className="fraud-row">
            Fraud Alerts: <span className="success-text">Active</span>
          </div>

          <button className="view-alerts-btn">View Alerts</button>
        </div>

        <div className="settings-card audit-card">
          <h3>Audit Logs</h3>

          <table className="audit-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {auditLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log[0]}</td>
                  <td>{log[1]}</td>
                  <td>{log[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>»</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;