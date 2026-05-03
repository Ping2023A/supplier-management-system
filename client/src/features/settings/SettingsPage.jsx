import { useState } from "react";
import "../../styles/settings.css";

const SettingsPage = () => {
  const [users, setUsers] = useState([
    { name: "Admin User", role: "Administrator", status: "Active" },
    { name: "Jessica Lee", role: "Manager", status: "Active" },
    { name: "Tom Harris", role: "Analyst", status: "Inactive" },
    { name: "Kevin Wong", role: "Viewer", status: "Active" },
  ]);

  const [auditLogs] = useState([
    ["2024-04-15", "Admin User", "Modified User Permissions"],
    ["2024-04-14", "Jessica Lee", "Updated Supplier Record"],
    ["2024-04-13", "Kevin Wong", "Login Successful"],
    ["2024-04-12", "Tom Harris", "Added New Order"],
    ["2024-04-11", "Admin User", "Security Settings Changed"],
  ]);

  const [alerts] = useState([
    {
      id: 1,
      type: "Suspicious Payment",
      supplier: "ABC Supplies",
      amount: "$12,500",
      status: "Pending Review",
    },
    {
      id: 2,
      type: "Multiple Failed Transactions",
      supplier: "Global Traders",
      amount: "$8,200",
      status: "Investigating",
    },
  ]);

  const [page, setPage] = useState(1);
  const logsPerPage = 3;

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [alertModal, setAlertModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [twoFactorModal, setTwoFactorModal] = useState(false);
  const [accessLogsModal, setAccessLogsModal] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    status: "Active",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const openAddModal = () => {
    setForm({ name: "", role: "", status: "Active" });
    setEditIndex(null);
    setModalOpen(true);
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

    setModalOpen(false);
  };

  const logsStart = (page - 1) * logsPerPage;
  const paginatedLogs = auditLogs.slice(logsStart, logsStart + logsPerPage);
  const totalPages = Math.ceil(auditLogs.length / logsPerPage);

  const updatePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert("Please complete all fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password updated successfully!");
    setPasswordModal(false);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  return (
    <div className="settings-page">

      {/* TOP BAR */}
      <div className="settings-top">
        <button className="add-user-btn" onClick={openAddModal}>
          Add User
        </button>
      </div>

      <div className="settings-grid">

        {/* USER MANAGEMENT */}
        <div className="settings-card">
          <div className="settings-card-title">
            <span>User Management</span>
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
                  <td>{user.name}</td>
                  <td>{user.role}</td>

                  <td>
                    <span
                      className={`user-status ${
                        user.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECURITY SETTINGS */}
        <div className="settings-card">
          <h3>Security Settings</h3>

          <div className="settings-row">
            <span>Change Password</span>

            <button
              className="mini-btn"
              onClick={() => setPasswordModal(true)}
            >
              Update
            </button>
          </div>

          <div className="settings-row">
            <span>Two-Factor Authentication</span>

            <button
              className="mini-btn"
              onClick={() => setTwoFactorModal(true)}
            >
              Update
            </button>
          </div>

          <div className="settings-row">
            <span>Access Logs</span>

            <button
              className="mini-btn"
              onClick={() => setAccessLogsModal(true)}
            >
              View
            </button>
          </div>
        </div>

        {/* FRAUD DETECTION */}
        <div className="settings-card fraud-card">
          <h3>Fraud Detection</h3>

          <div className="fraud-row">
            Suspicious Transactions:
            <span className="warning-text">2 Alerts</span>
          </div>

          <div className="fraud-row">
            High-Value Payment Monitoring:
            <span className="success-text">Enabled</span>
          </div>

          <div className="fraud-row">
            Fraud Alerts:
            <span className="success-text">Active</span>
          </div>

          <button
            className="view-alerts-btn"
            onClick={() => setAlertModal(true)}
          >
            View Alerts
          </button>
        </div>

        {/* AUDIT LOGS */}
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
              {paginatedLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log[0]}</td>
                  <td>{log[1]}</td>
                  <td>{log[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  background: page === i + 1 ? "#444" : "#2e2e2e",
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Add User</h3>

            <input
              className="search-input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="search-input"
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />

            <select
              className="filter-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveUser}>
                Save
              </button>

              <button
                className="close-btn"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FRAUD ALERTS MODAL */}
      {alertModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Fraud Alerts</h3>

            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  background: "#2e2e2e",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "6px",
                }}
              >
                <p><strong>Type:</strong> {alert.type}</p>
                <p><strong>Supplier:</strong> {alert.supplier}</p>
                <p><strong>Amount:</strong> {alert.amount}</p>
                <p><strong>Status:</strong> {alert.status}</p>
              </div>
            ))}

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => setAlertModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {passwordModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Change Password</h3>

            <input
              type="password"
              className="search-input"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              className="search-input"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              className="search-input"
              placeholder="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={updatePassword}>
                Update
              </button>

              <button
                className="close-btn"
                onClick={() => setPasswordModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TWO FACTOR MODAL */}
      {twoFactorModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Two-Factor Authentication</h3>

            <p style={{ marginBottom: "20px" }}>
              Current Status:
              <strong>
                {twoFactorEnabled ? " Enabled" : " Disabled"}
              </strong>
            </p>

            <div className="modal-buttons">
              <button className="save-btn" onClick={toggleTwoFactor}>
                {twoFactorEnabled ? "Disable" : "Enable"}
              </button>

              <button
                className="close-btn"
                onClick={() => setTwoFactorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCESS LOGS MODAL */}
      {accessLogsModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Access Logs</h3>

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

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => setAccessLogsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;