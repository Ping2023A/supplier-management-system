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

  const [page, setPage] = useState(1);
  const logsPerPage = 3;

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    status: "Active",
  });

  const openAddModal = () => {
    setForm({ name: "", role: "", status: "Active" });
    setEditIndex(null);
    setModalOpen(true);
  };

  const openEditModal = (index) => {
    const user = users[index];
    setForm(user);
    setEditIndex(index);
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

  const deleteUser = (index) => {
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
  };

  const logsStart = (page - 1) * logsPerPage;
  const paginatedLogs = auditLogs.slice(logsStart, logsStart + logsPerPage);
  const totalPages = Math.ceil(auditLogs.length / logsPerPage);

  return (
    <div className="settings-page">

      {/* TOP BAR (like Reports page) */}
      <div className="settings-top">
        <button className="add-user-btn" onClick={openAddModal}>
          Add User
        </button>
      </div>

      <div className="settings-grid">

        {/* USERS TABLE */}
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
                <th>Actions</th>
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

                  <td>
                    <button className="mini-btn" onClick={() => openEditModal(index)}>
                      Edit
                    </button>
                    <button className="mini-btn" onClick={() => deleteUser(index)}>
                      Remove
                    </button>
                    <button
                      className="mini-btn"
                      onClick={() => alert(JSON.stringify(user, null, 2))}
                    >
                      View
                    </button>
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
            <button className="mini-btn">Update</button>
          </div>

          <div className="settings-row">
            <span>Two-Factor Authentication</span>
            <button className="mini-btn">Update</button>
          </div>

          <div className="settings-row">
            <span>Access Logs</span>
            <button className="mini-btn">View</button>
          </div>
        </div>

        {/* FRAUD */}
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

          <button className="view-alerts-btn">View Alerts</button>
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

          {/* PAGINATION (CLICKABLE FIX) */}
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

      {/* MODAL (ADD / EDIT USER) */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>{editIndex !== null ? "Edit User" : "Add User"}</h3>

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
              <button className="close-btn" onClick={() => setModalOpen(false)}>
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