import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

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
    const fetchDashboardData = async () => {
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

    fetchDashboardData();
  }, [API_URL]);

  const getLatestOrderStatus = (order) => {
    const orderId = order.id || order.orderId || order._id;

    const delivery = deliveries.find(
      (d) => String(d.orderId || d.order) === String(orderId)
    );

    return delivery?.status || order.status || "Pending";
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => getLatestOrderStatus(o) === "Pending"
  ).length;

  const deliveredOrders = deliveries.filter(
    (d) => d.status === "Delivered"
  ).length;

  const inTransitDeliveries = deliveries.filter(
    (d) => d.status === "In Transit"
  ).length;

  const delayedDeliveries = deliveries.filter(
    (d) => d.status === "Delayed"
  ).length;

  const stockRecommendations = recommendations.length;

  const highPriorityRecommendations = recommendations.filter(
    (r) => Number(r.recommendedStock) >= 50
  ).length;

  const totalSuppliers = suppliers.length;

  const recentOrders = [...orders]
    .map((order) => ({
      ...order,
      latestStatus: getLatestOrderStatus(order),
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || b.deliveryDate || 0) -
        new Date(a.createdAt || a.updatedAt || a.deliveryDate || 0)
    )
    .slice(0, 5);

  const deliveryUpdates = [...deliveries]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || b.estimatedArrival || 0) -
        new Date(a.updatedAt || a.createdAt || a.estimatedArrival || 0)
    )
    .slice(0, 5);

  const stockAlerts = [...recommendations]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="stats">
        <div className="stat-card">Total Orders: {totalOrders}</div>
        <div className="stat-card">Total Suppliers: {totalSuppliers}</div>
        <div className="stat-card">Pending Orders: {pendingOrders}</div>
        <div className="stat-card">
          Stock Recommendations: {stockRecommendations}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Operational Summary</h3>

          <div className="summary-list">
            <div className="summary-row">
              <span>Total Orders</span>
              <b>{totalOrders}</b>
            </div>

            <div className="summary-row">
              <span>Total Suppliers</span>
              <b>{totalSuppliers}</b>
            </div>

            <div className="summary-row">
              <span>Pending Orders</span>
              <b>{pendingOrders}</b>
            </div>

            <div className="summary-row">
              <span>Delivered Orders</span>
              <b>{deliveredOrders}</b>
            </div>

            <div className="summary-row">
              <span>In Transit Deliveries</span>
              <b>{inTransitDeliveries}</b>
            </div>

            <div className="summary-row">
              <span>Delayed Deliveries</span>
              <b>{delayedDeliveries}</b>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Demand Forecasting Summary</h3>

          <div className="summary-list">
            <div className="summary-row">
              <span>Total Recommendations</span>
              <b>{stockRecommendations}</b>
            </div>

            <div className="summary-row">
              <span>High Priority Restocks</span>
              <b>{highPriorityRecommendations}</b>
            </div>

            <div className="summary-row">
              <span>Latest Recommended Item</span>
              <b>{stockAlerts[0]?.item || "N/A"}</b>
            </div>

            <div className="summary-row">
              <span>Generated By</span>
              <b>{stockAlerts[0]?.generatedBy || "Forecasting"}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="small-card">
          <h3>Recent Orders</h3>

          <div className="small-card-scroll">
            {recentOrders.length > 0 ? (
              recentOrders.map((o) => (
                <div className="table-row" key={o._id || o.id || o.orderId}>
                  <span>{o.id || o.orderId || o._id}</span>
                  <span>{o.latestStatus}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No recent orders</p>
            )}
          </div>
        </div>

        <div className="small-card">
          <h3>Delivery Updates</h3>

          <div className="small-card-scroll">
            {deliveryUpdates.length > 0 ? (
              deliveryUpdates.map((d) => (
                <div
                  className="table-row"
                  key={d._id || d.orderId || d.shipmentId}
                >
                  <span>{d.orderId || d.shipmentId || "N/A"}</span>
                  <span>{d.status || "Pending"}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No delivery updates</p>
            )}
          </div>
        </div>

        <div className="small-card">
          <h3>Stock Recommendations</h3>

          <div className="small-card-scroll">
            {stockAlerts.length > 0 ? (
              stockAlerts.map((s) => (
                <div className="table-row" key={s._id || s.item}>
                  <span>{s.item}</span>
                  <span>{s.recommendedStock}</span>
                </div>
              ))
            ) : (
              <p className="empty-text">No stock recommendations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;