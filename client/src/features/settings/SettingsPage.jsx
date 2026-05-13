import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/settings.css";

const SettingsPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [guardianAlerts, setGuardianAlerts] = useState([]);

  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
    status: "Active",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    fetchUsers();
    fetchSettingsData();

    const interval = setInterval(() => {
      fetchSettingsData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`, getAuthHeader());
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const fetchSettingsData = async () => {
    try {
      const [directOrderRes, integrationOrderRes] =
        await Promise.allSettled([
          axios.get(`${API_URL}/api/orders`, getAuthHeader()),
          axios.get(`${API_URL}/api/integration/inventory/orders`),
        ]);

      const directOrders =
        directOrderRes.status === "fulfilled"
          ? directOrderRes.value.data.data ||
            directOrderRes.value.data.orders ||
            directOrderRes.value.data ||
            []
          : [];

      const integrationOrders =
        integrationOrderRes.status === "fulfilled"
          ? integrationOrderRes.value.data.data ||
            integrationOrderRes.value.data.orders ||
            integrationOrderRes.value.data ||
            []
          : [];

      const mergedOrders = [...directOrders, ...integrationOrders];

      const uniqueOrders = mergedOrders.filter(
        (order, index, self) =>
          index ===
          self.findIndex(
            (o) =>
              String(o.id || o.orderId || o._id) ===
              String(order.id || order.orderId || order._id)
          )
      );

      setOrders(Array.isArray(uniqueOrders) ? uniqueOrders : []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setOrders([]);
    }

    try {
      const deliveryRes = await axios.get(
        `${API_URL}/api/integration/logistics/delivery-status`
      );

      setDeliveries(deliveryRes.data.data || []);
    } catch (err) {
      console.error("Deliveries fetch error:", err);
      setDeliveries([]);
    }

    try {
      const supplierRes = await axios.get(
        `${API_URL}/api/suppliers`,
        getAuthHeader()
      );

      const supplierData =
        supplierRes.data.data ||
        supplierRes.data.suppliers ||
        supplierRes.data ||
        [];

      setSuppliers(Array.isArray(supplierData) ? supplierData : []);
    } catch (err) {
      console.error("Suppliers fetch error:", err);
      setSuppliers([]);
    }

    try {
      const recommendationRes = await axios.get(
        `${API_URL}/api/integration/forecasting/external-recommendations`
      );

      setRecommendations(recommendationRes.data.data || []);
    } catch (err) {
      console.error("Forecasting fetch error:", err);

      try {
        const localRecommendationRes = await axios.get(
          `${API_URL}/api/integration/forecasting/recommendations`
        );

        setRecommendations(localRecommendationRes.data.data || []);
      } catch (localErr) {
        console.error("Local recommendations fetch error:", localErr);
        setRecommendations([]);
      }
    }

    try {
      const guardianRes = await axios.get(
        `${API_URL}/api/settings/guardian-alerts`,
        getAuthHeader()
      );

      setGuardianAlerts(guardianRes.data.data || []);
    } catch (err) {
      console.error("Guardian alerts fetch error:", err);
      setGuardianAlerts([]);
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
      await axios.post(`${API_URL}/api/users`, form, getAuthHeader());

      await fetchUsers();
      await fetchSettingsData();
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
      await axios.put(
        `${API_URL}/api/users/${selectedUser._id}`,
        {
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        },
        getAuthHeader()
      );

      await fetchUsers();
      await fetchSettingsData();

      setModal(null);
      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(
        `${API_URL}/api/users/${selectedUser._id}`,
        getAuthHeader()
      );

      await fetchUsers();
      await fetchSettingsData();

      setModal(null);
      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const auditLogs = [
    ...orders.map((o) => ({
      user: "Admin",
      action: `Created Order ${o.id || o.orderId || o._id}`,
      date: o.createdAt || o.updatedAt || o.deliveryDate,
    })),

    ...suppliers.map((s) => ({
      user: "Admin",
      action: `Created Supplier ${s.name || "Unknown Supplier"}`,
      date: s.createdAt || s.updatedAt,
    })),

    ...deliveries.map((d) => ({
      user: "Logistics",
      action: `Updated Delivery ${d.orderId || d.order} to ${
        d.status || "Pending"
      }`,
      date: d.updatedAt || d.createdAt || d.estimatedArrival,
    })),

    ...recommendations.map((r) => ({
      user: "Demand Forecasting",
      action: `Generated Recommendation for ${r.item}`,
      date: r.updatedAt || r.createdAt,
    })),

    ...users.map((u) => ({
      user: "Admin",
      action: `Added User ${u.name || u.email}`,
      date: u.createdAt || u.updatedAt,
    })),

    ...guardianAlerts.map((g) => ({
      user: "Guardian",
      action: `${g.status || "Flagged"} Order ${
        g.orderId || "Unknown Order"
      } - ${g.reason || "Security monitoring"}`,
      date: g.createdAt || g.updatedAt,
    })),
  ]
    .filter((log) => log.action)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 8);

  const suspiciousOrders = guardianAlerts.filter(
    (a) => a.status === "Flagged"
  );

  const blockedTransactions = guardianAlerts.filter(
    (a) => a.status === "Blocked"
  );

  const guardianAlertsList = guardianAlerts.map((alert) => ({
    type: alert.status || "Guardian Alert",
    message: `${alert.orderId || "Unknown Order"} - ${
      alert.reason || "Security monitoring"
    }`,
  }));

  return (
    <div className="settings-page">
      <div className="settings-grid">
        {/* USER MANAGEMENT */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-title">User Management</div>

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
          <div className="settings-card-title">Audit Logs</div>

          <table className="audit-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {auditLogs.length > 0 ? (
                auditLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td>
                      {log.date
                        ? new Date(log.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-cell">
                    No audit logs found
                  </td>
                </tr>
              )}
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
              {suspiciousOrders.length} flagged
            </span>
          </div>

          <div className="fraud-row">
            Blocked Transactions:
            <span className="success-text">
              {blockedTransactions.length} blocked
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
            <h3>{modal === "addUser" ? "Add User" : "Edit User"}</h3>

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
                onClick={modal === "addUser" ? saveUser : updateUser}
              >
                Save
              </button>

              <button className="close-btn" onClick={() => setModal(null)}>
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
              <b>{selectedUser.name || selectedUser.email}</b>?
            </p>

            <div className="modal-buttons">
              <button className="save-btn danger-btn" onClick={deleteUser}>
                Delete
              </button>

              <button className="close-btn" onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal === "passwordPolicy" && (
        <SimpleModal title="Password Policy" onClose={() => setModal(null)}>
          <p>Minimum 8 characters recommended.</p>
          <p>Password should include letters and numbers.</p>
        </SimpleModal>
      )}

      {modal === "twoFactor" && (
        <SimpleModal
          title="Two-Factor Authentication"
          onClose={() => setModal(null)}
        >
          <p>Status: Disabled</p>
          <p>2FA configuration can be connected later.</p>
        </SimpleModal>
      )}

      {modal === "guardianEngine" && (
        <SimpleModal
          title="Guardian Security Engine"
          onClose={() => setModal(null)}
        >
          <p>Status: Active</p>
          <p>Guardian is checking risky order transactions.</p>
        </SimpleModal>
      )}

      {modal === "accessLogs" && (
        <SimpleModal
          title="System Access Logs"
          onClose={() => setModal(null)}
        >
          {auditLogs.length > 0 ? (
            auditLogs.slice(0, 5).map((log, index) => (
              <p key={index}>
                {log.user}: {log.action}
              </p>
            ))
          ) : (
            <p>No access logs found.</p>
          )}
        </SimpleModal>
      )}

      {modal === "fraudAlerts" && (
        <SimpleModal
          title="Guardian Fraud Alerts"
          onClose={() => setModal(null)}
        >
          {guardianAlertsList.length > 0 ? (
            guardianAlertsList.map((alert, index) => (
              <p key={index}>
                <b>{alert.type}:</b> {alert.message}
              </p>
            ))
          ) : (
            <p>No fraud alerts detected.</p>
          )}
        </SimpleModal>
      )}
    </div>
  );
};

const SimpleModal = ({ title, children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="report-modal">
        <h3>{title}</h3>

        {children}

        <div className="modal-buttons">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;