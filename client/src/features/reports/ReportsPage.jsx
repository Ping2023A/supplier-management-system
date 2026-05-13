import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reports.css";

const ReportsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState(null);
  const [showReport, setShowReport] = useState(false);

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
    const fetchReportsData = async () => {
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
        const deliveryRes = await axios.get(
          `${API_URL}/api/integration/logistics/delivery-status`
        );

        const mappedDeliveries = (deliveryRes.data.data || []).map((d) => ({
          shipmentId:
            d.trackingNumber || d.shipmentId || `Shipment-${d.orderId}`,
          order: d.orderId,
          supplier: d.supplier,
          status: d.status || "Pending",
          date: d.estimatedArrival
            ? new Date(d.estimatedArrival).toLocaleDateString()
            : "No ETA",
          item: d.item,
          qty: d.qty,
          category: d.category,
          rawDate: d.updatedAt || d.createdAt || d.estimatedArrival,
        }));

        setDeliveries(mappedDeliveries);
      } catch (err) {
        console.error("Deliveries fetch error:", err);
        setDeliveries([]);
      }

      try {
        const orderRes = await axios.get(
          `${API_URL}/api/orders`,
          getAuthHeader()
        );

        const orderData =
          orderRes.data.data ||
          orderRes.data.orders ||
          orderRes.data ||
          [];

        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        console.error("Orders fetch error:", err);
        setOrders([]);
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
    };

    fetchReportsData();
  }, [API_URL]);

  const filteredRecommendations = recommendations.filter((r) => {
    const matchSearch =
      String(r.item || "").toLowerCase().includes(search.toLowerCase()) ||
      String(r.category || "").toLowerCase().includes(search.toLowerCase()) ||
      String(r.reason || "").toLowerCase().includes(search.toLowerCase());

    const priority = Number(r.recommendedStock) >= 50 ? "High" : "Normal";
    const matchFilter = filter === "All" || priority === filter;

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

  const delayedCount = deliveries.filter((d) => d.status === "Delayed").length;

  const pendingCount = deliveries.filter((d) => d.status === "Pending").length;

  const orderActivities = orders.map((o) => ({
    type: "Orders",
    description: `Created order ${o.id || o.orderId || o._id} for ${
      o.item || "Unknown Item"
    }`,
    date: o.createdAt || o.updatedAt || o.deliveryDate || new Date(),
  }));

  const supplierActivities = suppliers.map((s) => ({
    type: "Suppliers",
    description: `Created supplier ${s.name || "Unknown Supplier"}`,
    date: s.createdAt || s.updatedAt || new Date(),
  }));

  const deliveryActivities = deliveries.map((d) => ({
    type: "Logistics",
    description: `Order ${d.order} status is ${d.status}`,
    date: d.rawDate || d.date || new Date(),
  }));

  const forecastingActivities = recommendations.map((r) => ({
    type: "Forecasting",
    description: `Recommended ${r.recommendedStock} stock for ${r.item}`,
    date: r.updatedAt || r.createdAt || new Date(),
  }));

  const activityLogs = [
    ...orderActivities,
    ...supplierActivities,
    ...deliveryActivities,
    ...forecastingActivities,
  ]
    .filter((a) => a.description)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 10);

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
                {filteredRecommendations.length > 0 ? (
                  filteredRecommendations.map((r) => {
                    const priority =
                      Number(r.recommendedStock) >= 50 ? "High" : "Normal";

                    return (
                      <tr key={r._id || `${r.item}-${r.category}`}>
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
                  })
                ) : (
                  <tr>
                    <td colSpan="5">No recommendations found.</td>
                  </tr>
                )}
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
              <b>{deliveries.length}</b>
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
            {activityLogs.length > 0 ? (
              activityLogs.map((a, index) => (
                <tr key={`${a.type}-${index}`}>
                  <td>{a.type}</td>
                  <td>{a.description}</td>
                  <td>
                    {a.date
                      ? new Date(a.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No recent activity found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showReport && (
        <div className="modal-overlay">
          <div className="report-modal">
            <h2>Subsystem Report</h2>

            <p>Total Orders: {orders.length}</p>
            <p>Total Suppliers: {suppliers.length}</p>
            <p>Total Recommendations: {recommendations.length}</p>
            <p>High Priority Recommendations: {highPriorityCount}</p>
            <p>Delivered Orders: {deliveredCount}</p>
            <p>In Transit Orders: {inTransitCount}</p>
            <p>Pending Orders: {pendingCount}</p>
            <p>Delayed Deliveries: {delayedCount}</p>

            <h4>Recommendation Data</h4>
            <pre>{JSON.stringify(recommendations, null, 2)}</pre>

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
              <b>Recommended Stock:</b> {view.recommendedStock}
            </p>

            <p>
              <b>Reason:</b> {view.reason || "No reason provided"}
            </p>

            <p>
              <b>Generated By:</b>{" "}
              {view.generatedBy || "Demand Forecasting Subsystem"}
            </p>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setView(null)}>
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