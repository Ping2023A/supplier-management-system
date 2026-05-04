import { useState } from "react";
import "../../styles/settings.css";

const SettingsPage = () => {
  const [users, setUsers] = useState([
    { name: "Admin User", role: "Administrator", status: "Active" },
    { name: "Jessica Lee", role: "Manager", status: "Active" },
    { name: "Tom Harris", role: "Analyst", status: "Inactive" },
    { name: "Kevin Wong", role: "Viewer", status: "Active" },
  ]);

  const auditLogs = [
    ["2024-04-15", "Admin User", "Modified User Permissions"],
    ["2024-04-14", "Jessica Lee", "Updated Supplier Record"],
    ["2024-04-13", "Kevin Wong", "Login Successful"],
    ["2024-04-12", "Tom Harris", "Added New Order"],
    ["2024-04-11", "Admin User", "Security Settings Changed"],
  ];

  const alerts = [
    { id: 1, type: "Suspicious Payment", supplier: "ABC Supplies", amount: "$12,500", status: "Pending Review" },
    { id: 2, type: "Failed Transactions", supplier: "Global Traders", amount: "$8,200", status: "Investigating" },
  ];

  const [page, setPage] = useState(1);
  const logsPerPage = 3;

  const [modal, setModal] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [form, setForm] = useState({ name: "", role: "", status: "Active" });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const openAddModal = () => {
    setForm({ name: "", role: "", status: "Active" });
    setEditIndex(null);
    setModal("user");
  };

  const saveUser = () => {
    if (!form.name || !form.role) return;

    if (editIndex !== null) {
      const updated = [...users];
      updated[editIndex] = form;
      setUsers(updated);
    } else {
      setUsers([...users, form]);
    }

    setModal(null);
  };

  const updatePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      alert("Check password fields.");
      return;
    }

    alert("Password updated!");
    setModal(null);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const toggleTwoFactor = () => setTwoFactorEnabled(!twoFactorEnabled);

  const logsStart = (page - 1) * logsPerPage;
  const paginatedLogs = auditLogs.slice(logsStart, logsStart + logsPerPage);
  const totalPages = Math.ceil(auditLogs.length / logsPerPage);

  return (
    <div className="settings-page">

      {/* TOP */}
      <div className="settings-top">
        <button className="add-user-btn" onClick={openAddModal}>
          Add User
        </button>
      </div>

      <div className="settings-grid">

        {/* USERS */}
        <div className="settings-card">
          <div className="settings-card-title">User Management</div>

          <table className="settings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`user-status ${u.status.toLowerCase()}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECURITY */}
        <div className="settings-card">
          <h3>Security Settings</h3>

          <div className="settings-row">
            <span>Change Password</span>
            <button className="mini-btn" onClick={() => setModal("password")}>Update</button>
          </div>

          <div className="settings-row">
            <span>Two-Factor Authentication</span>
            <button className="mini-btn" onClick={() => setModal("2fa")}>Update</button>
          </div>

          <div className="settings-row">
            <span>Access Logs</span>
            <button className="mini-btn" onClick={() => setModal("logs")}>View</button>
          </div>
        </div>

        {/* FRAUD */}
        <div className="settings-card">
          <h3>Fraud Detection</h3>

          <div className="fraud-row">
            Suspicious Transactions: <span className="warning-text">2 Alerts</span>
          </div>

          <div className="fraud-row">
            High Value Monitoring: <span className="success-text">Enabled</span>
          </div>

          <div className="fraud-row">
            Fraud Alerts: <span className="success-text">Active</span>
          </div>

          <button className="view-alerts-btn" onClick={() => setModal("alerts")}>
            View Alerts
          </button>
        </div>

        {/* ✅ FIXED AUDIT */}
        <div className="settings-card audit-card">
          <h3>Audit Logs</h3>

          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedLogs.map((log, i) => (
                  <tr key={i}>
                    <td>{log[0]}</td>
                    <td>{log[1]}</td>
                    <td>{log[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "active-page" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MODALS (unchanged) ===== */}

      {modal === "user" && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Add User</h3>

            <input className="search-input" placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input className="search-input" placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />

            <select className="filter-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveUser}>Save</button>
              <button className="close-btn" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {modal === "password" && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Change Password</h3>

            <input type="password" className="search-input" placeholder="Current"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />

            <input type="password" className="search-input" placeholder="New"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />

            <input type="password" className="search-input" placeholder="Confirm"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={updatePassword}>Update</button>
              <button className="close-btn" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {modal === "2fa" && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Two-Factor Authentication</h3>

            <p>Status: <b>{twoFactorEnabled ? "Enabled" : "Disabled"}</b></p>

            <div className="modal-buttons">
              <button className="save-btn" onClick={toggleTwoFactor}>
                {twoFactorEnabled ? "Disable" : "Enable"}
              </button>
              <button className="close-btn" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {modal === "alerts" && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Fraud Alerts</h3>

            {alerts.map(a => (
              <div key={a.id} style={{ background: "#2e2e2e", padding: 10, marginBottom: 10 }}>
                <p>{a.type}</p>
                <p>{a.supplier}</p>
                <p>{a.amount}</p>
                <p>{a.status}</p>
              </div>
            ))}

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {modal === "logs" && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Access Logs</h3>

            <table className="audit-table">
              <tbody>
                {auditLogs.map((l, i) => (
                  <tr key={i}>
                    <td>{l[0]}</td>
                    <td>{l[1]}</td>
                    <td>{l[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;