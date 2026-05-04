import { useState } from "react";
import "../../styles/reports.css";

const ReportsPage = () => {
  const [suppliers, setSuppliers] = useState([
    { name: "ABC Electronics", contact: "John Carter", location: "New York", performance: 92, status: "Active" },
    { name: "Global Textiles", contact: "Sarah Lee", location: "LA", performance: 87, status: "Active" },
    { name: "Nexa Solutions", contact: "Michael Tan", location: "Toronto", performance: 75, status: "At Risk" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [view, setView] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const filtered = suppliers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "All" || s.status === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="reports-page">

      {/* TOP */}
      <div className="reports-top">
        <button className="generate-report-btn" onClick={() => setShowReport(true)}>
          Generate Report
        </button>

        <div className="reports-actions">
          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* CHARTS */}
      <div className="reports-charts">
        <div className="chart-box">
          <h4>Supplier Performance</h4>
          <div className="chart-placeholder">Chart</div>
        </div>

        <div className="chart-box">
          <h4>Demand Forecast</h4>
          <div className="chart-placeholder">Chart</div>
        </div>
      </div>

      {/* TABLE */}
      <h3 className="reports-title">Suppliers</h3>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Performance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.contact}</td>
                <td>{s.location}</td>
                <td>{s.performance}%</td>
                <td>{s.status}</td>

                <td>
                  <button className="report-btn" onClick={() => setView(s)}>View</button>
                  <button className="report-btn" onClick={() => setDeleteItem(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REPORT MODAL */}
      {showReport && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Procurement Report</h2>

            <p>Total: {suppliers.length}</p>
            <p>Active: {suppliers.filter(s => s.status === "Active").length}</p>
            <p>At Risk: {suppliers.filter(s => s.status === "At Risk").length}</p>

            <h4>JSON</h4>
            <pre>{JSON.stringify(suppliers, null, 2)}</pre>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setShowReport(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW */}
      {view && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Supplier</h2>

            <p><b>Name:</b> {view.name}</p>
            <p><b>Contact:</b> {view.contact}</p>
            <p><b>Location:</b> {view.location}</p>
            <p><b>Performance:</b> {view.performance}%</p>
            <p><b>Status:</b> {view.status}</p>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setView(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE */}
      {deleteItem && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Delete Supplier?</h2>

            <p>{deleteItem.name}</p>

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={() => {
                  setSuppliers(suppliers.filter(s => s !== deleteItem));
                  setDeleteItem(null);
                }}
              >
                Yes
              </button>

              <button className="close-btn" onClick={() => setDeleteItem(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;