import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/settings.css";

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
    status: "Active",
  });

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const openAddUser = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "Staff",
      status: "Active",
    });

    setModal("addUser");
  };

  const openEditUser = (user) => {
    setSelectedUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "Staff",
      status: user.status || "Active",
    });

    setModal("editUser");
  };

  const openDeleteUser = (user) => {
    setSelectedUser(user);
    setModal("deleteUser");
  };

  const saveUser = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Please fill in name, email, password, and role.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/api/users`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchUsers();
      setModal(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  const updateUser = async () => {
    if (!form.name || !form.email || !form.role) {
      alert("Please fill in name, email, and role.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/users/${selectedUser._id}`,
        {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUsers();

      setModal(null);
      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/users/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchUsers();

      setModal(null);
      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-grid">
        {/* USER MANAGEMENT */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-title">
              User Management
            </div>

            <button
              className="add-user-btn inside-card"
              onClick={openAddUser}
            >
              Add User
            </button>
          </div>

          <div className="settings-table-wrapper">
            <table className="settings-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name || "No Name"}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>

                      <td>
                        <span
                          className={`user-status ${String(
                            u.status || "Active"
                          ).toLowerCase()}`}
                        >
                          {u.status || "Active"}
                        </span>
                      </td>

                      <td>
                        <div className="settings-actions-cell">
                          <button
                            className="mini-btn"
                            onClick={() => openEditUser(u)}
                          >
                            Edit
                          </button>

                          <button
                            className="mini-btn danger-btn"
                            onClick={() => openDeleteUser(u)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECURITY SETTINGS */}
        <div className="settings-card">
          <h3>Security Settings</h3>

          <div className="settings-row">
            <span>Password Policy</span>

            <button
              className="mini-btn"
              onClick={() => setModal("passwordPolicy")}
            >
              Update
            </button>
          </div>

          <div className="settings-row">
            <span>Two-Factor Authentication</span>

            <button
              className="mini-btn"
              onClick={() => setModal("twoFactor")}
            >
              Configure
            </button>
          </div>

          <div className="settings-row">
            <span>Guardian Security Engine</span>

            <button
              className="mini-btn"
              onClick={() => setModal("guardianEngine")}
            >
              Active
            </button>
          </div>

          <div className="settings-row">
            <span>System Access Logs</span>

            <button
              className="mini-btn"
              onClick={() => setModal("accessLogs")}
            >
              View
            </button>
          </div>
        </div>

        {/* AUDIT LOGS */}
        <div className="settings-card audit-card">
          <div className="settings-card-title">
            Audit Logs
          </div>

          <table className="audit-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Admin</td>
                <td>Created Order</td>
                <td>Today</td>
              </tr>

              <tr>
                <td>Manager</td>
                <td>Updated Delivery</td>
                <td>Today</td>
              </tr>

              <tr>
                <td>Staff</td>
                <td>Generated Report</td>
                <td>Today</td>
              </tr>

              <tr>
                <td>Admin</td>
                <td>Added User</td>
                <td>Today</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* GUARDIAN */}
        <div className="settings-card">
          <div className="settings-card-title">
            Guardian Fraud Monitoring
          </div>

          <div className="fraud-row">
            Suspicious Orders:
            <span className="warning-text">
              2 flagged
            </span>
          </div>

          <div className="fraud-row">
            Blocked Transactions:
            <span className="success-text">
              5 blocked
            </span>
          </div>

          <button
            className="view-alerts-btn"
            onClick={() => setModal("fraudAlerts")}
          >
            View Alerts
          </button>
        </div>
      </div>

      {/* ADD / EDIT USER */}
      {(modal === "addUser" || modal === "editUser") && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>
              {modal === "addUser"
                ? "Add User"
                : "Edit User"}
            </h3>

            <input
              className="search-input"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              className="search-input"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            {modal === "addUser" && (
              <input
                type="password"
                className="search-input"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            )}

            <select
              className="filter-select"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>

            <select
              className="filter-select"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={
                  modal === "addUser"
                    ? saveUser
                    : updateUser
                }
              >
                Save
              </button>

              <button
                className="close-btn"
                onClick={() => setModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE USER */}
      {modal === "deleteUser" && selectedUser && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h3>Delete User</h3>

            <p>
              Are you sure you want to delete{" "}
              <b>
                {selectedUser.name ||
                  selectedUser.email}
              </b>
              ?
            </p>

            <div className="modal-buttons">
              <button
                className="save-btn danger-btn"
                onClick={deleteUser}
              >
                Delete
              </button>

              <button
                className="close-btn"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal === "passwordPolicy" && (
        <SimpleModal
          title="Password Policy"
          onClose={() => setModal(null)}
        >
          <p>Minimum 8 characters recommended.</p>
          <p>
            Password should include letters and numbers.
          </p>
        </SimpleModal>
      )}

      {modal === "twoFactor" && (
        <SimpleModal
          title="Two-Factor Authentication"
          onClose={() => setModal(null)}
        >
          <p>Status: Disabled</p>
          <p>
            2FA configuration can be connected later.
          </p>
        </SimpleModal>
      )}

      {modal === "guardianEngine" && (
        <SimpleModal
          title="Guardian Security Engine"
          onClose={() => setModal(null)}
        >
          <p>Status: Active</p>
          <p>
            Guardian is checking risky order
            transactions.
          </p>
        </SimpleModal>
      )}

      {modal === "accessLogs" && (
        <SimpleModal
          title="System Access Logs"
          onClose={() => setModal(null)}
        >
          <p>Admin logged in today.</p>
          <p>User management module accessed.</p>
          <p>Settings page viewed.</p>
        </SimpleModal>
      )}

      {modal === "fraudAlerts" && (
        <SimpleModal
          title="Guardian Fraud Alerts"
          onClose={() => setModal(null)}
        >
          <p>Suspicious Orders: 2 flagged</p>
          <p>Blocked Transactions: 5 blocked</p>
          <p>
            High quantity orders are monitored by
            Guardian.
          </p>
        </SimpleModal>
      )}
    </div>
  );
};

const SimpleModal = ({
  title,
  children,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="report-modal">
        <h3>{title}</h3>

        {children}

        <div className="modal-buttons">
          <button
            className="close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;