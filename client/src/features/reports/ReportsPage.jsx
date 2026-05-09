import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reports.css";

const ReportsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const [recommendationRes, deliveryRes, orderRes] =
          await Promise.all([
            axios.get(
              `${API_URL}/api/integration/forecasting/recommendations`
            ),
            axios.get(
              `${API_URL}/api/integration/logistics/delivery-status`
            ),
            axios.get(
              `${API_URL}/api/integration/inventory/orders`
            ),
          ]);

        setRecommendations(recommendationRes.data.data || []);
        setDeliveries(deliveryRes.data.data || []);
        setOrders(orderRes.data.data || []);
      } catch (err) {
        console.error("Reports fetch error:", err);
      }
    };

    fetchReportsData();
  }, [API_URL]);

  const filteredRecommendations = recommendations.filter((r) => {
    const matchSearch =
      String(r.item).toLowerCase().includes(search.toLowerCase()) ||
      String(r.category).toLowerCase().includes(search.toLowerCase()) ||
      String(r.reason).toLowerCase().includes(search.toLowerCase());

    const priority =
      Number(r.recommendedStock) >= 50 ? "High" : "Normal";

    const matchFilter =
      filter === "All" || priority === filter;

    return matchSearch && matchFilter;
  });

  const highPriorityCount = recommendations.filter(
    (r) => Number(r.recommendedStock) >= 50
  ).length;

  const lowStockCount = recommendations.filter(
    (r) => Number(r.recommendedStock) >= 30
  ).length;

  const deliveredCount = deliveries.filter(
    (d) => d.status === "Delivered"
  ).length;

  const inTransitCount = deliveries.filter(
    (d) => d.status === "In Transit"
  ).length;

  const delayedCount = deliveries.filter(
    (d) => d.status === "Delayed"
  ).length;

  const pendingCount = deliveries.filter(
    (d) => d.status === "Pending"
  ).length;

  const activityLogs = [
    ...orders.slice(0, 3).map((o) => ({
      type: "Orders",
      description: `Created order ${o.id} for ${o.item}`,
      date: o.createdAt,
    })),

    ...deliveries.slice(0, 3).map((d) => ({
      type: "Logistics",
      description: `${d.orderId} status is ${d.status}`,
      date: d.updatedAt || d.createdAt,
    })),

    ...recommendations.slice(0, 3).map((r) => ({
      type: "Forecasting",
      description: `Recommended ${r.recommendedStock} stock for ${r.item}`,
      date: r.createdAt,
    })),
  ];

  return (
    <div className="reports-page">
      <div className="reports-top">
        <button
          className="generate-report-btn"
          onClick={() => setShowReport(true)}
        >
          Generate Report
        </button>

        <div className="reports-actions">
          <input
            className="search-input"
            placeholder="Search recommendations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal Priority</option>
          </select>
        </div>
      </div>

      <div className="reports-summary">
        <div className="report-box blue">
          Total Recommendations: {recommendations.length}
        </div>

        <div className="report-box orange">
          High Priority: {highPriorityCount}
        </div>

        <div className="report-box green">
          Low Stock Items: {lowStockCount}
        </div>

        <div className="report-box red">
          Delayed Deliveries: {delayedCount}
        </div>
      </div>

      <div className="reports-main-grid">
        <div className="report-card">
          <h4>Stock Recommendations</h4>

          <div className="recommendation-table-wrapper">
            <table className="recommendation-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Recommended</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecommendations.map((r) => {
                  const priority =
                    Number(r.recommendedStock) >= 50
                      ? "High"
                      : "Normal";

                  return (
                    <tr key={r._id}>
                      <td>{r.item}</td>
                      <td>{r.category}</td>
                      <td>{r.recommendedStock}</td>
                      <td>{priority}</td>

                      <td>
                        <button
                          className="report-btn"
                          onClick={() => setView(r)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="report-card">
          <h4>Logistics Analytics</h4>

          <div className="analytics-list">
            <div className="analytics-row">
              <span>Delivered Orders</span>
              <b>{deliveredCount}</b>
            </div>

            <div className="analytics-row">
              <span>In Transit Orders</span>
              <b>{inTransitCount}</b>
            </div>

            <div className="analytics-row">
              <span>Pending Orders</span>
              <b>{pendingCount}</b>
            </div>

            <div className="analytics-row">
              <span>Delayed Deliveries</span>
              <b>{delayedCount}</b>
            </div>

            <div className="analytics-row">
              <span>Total Orders</span>
              <b>{orders.length}</b>
            </div>
          </div>
        </div>
      </div>

      <h3 className="reports-title">System Activity</h3>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Subsystem</th>
              <th>Activity</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {activityLogs.map((a, index) => (
              <tr key={index}>
                <td>{a.type}</td>
                <td>{a.description}</td>

                <td>
                  {a.date
                    ? new Date(a.date).toLocaleDateString()
                    : "N/A"}
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
            <h2>Subsystem Report</h2>

            <p>Total Orders: {orders.length}</p>
            <p>
              Total Recommendations: {recommendations.length}
            </p>
            <p>
              High Priority Recommendations:{" "}
              {highPriorityCount}
            </p>
            <p>Delivered Orders: {deliveredCount}</p>
            <p>In Transit Orders: {inTransitCount}</p>
            <p>Delayed Deliveries: {delayedCount}</p>

            <h4>Recommendation Data</h4>

            <pre>
              {JSON.stringify(recommendations, null, 2)}
            </pre>

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => setShowReport(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {view && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Stock Recommendation</h2>

            <p>
              <b>Item:</b> {view.item}
            </p>

            <p>
              <b>Category:</b> {view.category}
            </p>

            <p>
              <b>Recommended Stock:</b>{" "}
              {view.recommendedStock}
            </p>

            <p>
              <b>Reason:</b>{" "}
              {view.reason || "No reason provided"}
            </p>

            <p>
              <b>Generated By:</b>{" "}
              {view.generatedBy ||
                "Demand Forecasting Subsystem"}
            </p>

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => setView(null)}
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

export default ReportsPage;