import { useState } from "react";
import "../../styles/reports.css";

const ReportsPage = () => {
  const [suppliers, setSuppliers] = useState([
    { name: "ABC Electronics", contact: "John Carter", location: "New York, USA", performance: 92, status: "Active" },
    { name: "Global Textiles", contact: "Sarah Lee", location: "Los Angeles, USA", performance: 87, status: "Active" },
    { name: "Nexa Solutions", contact: "Michael Tan", location: "Toronto, Canada", performance: 75, status: "At Risk" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [viewData, setViewData] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // 🔍 Search + Filter
  const filtered = suppliers.filter(s =>
    (filter === "All" || s.status === filter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

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
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
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
          <div className="chart-placeholder">Chart here</div>
        </div>

        <div className="chart-box">
          <h4>Demand Forecasting</h4>
          <div className="chart-placeholder">Chart here</div>
        </div>
      </div>

      {/* TABLE */}
      <h3 className="reports-title">Supplier List</h3>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Contact Person</th>
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
                  <button className="report-btn" onClick={() => setViewData(s)}>View</button>
                  <button className="report-btn" onClick={() => setDeleteIndex(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📊 GENERATE REPORT MODAL */}
      {showReport && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Procurement Report</h2>

            <p><b>Total Suppliers:</b> {suppliers.length}</p>
            <p><b>Active:</b> {suppliers.filter(s => s.status === "Active").length}</p>
            <p><b>At Risk:</b> {suppliers.filter(s => s.status === "At Risk").length}</p>

            <h4>Performance Summary</h4>
            {suppliers.map((s, i) => (
              <p key={i}>{s.name}: {s.performance}%</p>
            ))}

            <h4>JSON Output</h4>
            <pre>
{JSON.stringify(suppliers, null, 2)}
            </pre>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setShowReport(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 👁 VIEW MODAL */}
      {viewData && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Supplier Details</h2>

            <p><b>Name:</b> {viewData.name}</p>
            <p><b>Contact:</b> {viewData.contact}</p>
            <p><b>Location:</b> {viewData.location}</p>
            <p><b>Performance:</b> {viewData.performance}%</p>
            <p><b>Status:</b> {viewData.status}</p>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setViewData(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ❌ DELETE MODAL */}
      {deleteIndex !== null && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Confirm Delete</h2>

            <p>Delete this supplier?</p>

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={() => {
                  setSuppliers(suppliers.filter((_, i) => i !== deleteIndex));
                  setDeleteIndex(null);
                }}
              >
                Yes
              </button>

              <button className="close-btn" onClick={() => setDeleteIndex(null)}>
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