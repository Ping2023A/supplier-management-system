import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../../components/common/StatCard";
import "../../styles/dashboard.css";

// Chart.js imports
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components once
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [orderStatusData, setOrderStatusData] = useState(null);
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [overviewRes, perfRes, alertsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/dashboard/overview", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/dashboard/performance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/dashboard/alerts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOverview(overviewRes.data);

        // ✅ Transform performance API response into Chart.js format
        setPerformanceData({
          labels: perfRes.data.labels || [],
          datasets: [
            {
              label: "Supplier Performance",
              data: perfRes.data.values || [],
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        });

        // ✅ Build order status chart data from overview
        setOrderStatusData({
          labels: ["Pending", "Processing", "Completed", "Cancelled"],
          datasets: [
            {
              data: [
                overviewRes.data.pendingOrders || 0,
                overviewRes.data.processingOrders || 0,
                overviewRes.data.completedOrders || 0,
                overviewRes.data.cancelledOrders || 0,
              ],
              backgroundColor: [
                "rgba(255, 206, 86, 0.6)",   // Pending
                "rgba(54, 162, 235, 0.6)",   // Processing
                "rgba(75, 192, 192, 0.6)",   // Completed
                "rgba(255, 99, 132, 0.6)",   // Cancelled
              ],
            },
          ],
        });

        setAlerts(alertsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  if (!overview || !alerts || !performanceData || !orderStatusData) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Stat Cards */}
      <div className="stats">
        <StatCard title="Total Suppliers" value={overview.suppliers} />
        <StatCard title="Pending Orders" value={overview.pendingOrders} />
        <StatCard title="Deliveries in Transit" value={overview.deliveriesInTransit} />
        <StatCard title="Low Stock Alert" value={overview.lowStock} />
      </div>

      {/* Charts */}
      <div className="grid">
        <div className="card">
          <h3>Supplier Performance</h3>
          <Bar data={performanceData} />
        </div>

        <div className="card">
          <h3>Order Status Overview</h3>
          <Pie data={orderStatusData} />
        </div>
      </div>

      {/* Alerts */}
      <div className="bottom-grid">
        <div className="small-card">
          <h3>Recent Orders</h3>
          {alerts.recentOrders?.map((o) => (
            <div className="table-row" key={o._id}>
              <span>{o.orderNumber}</span>
              <span>{o.supplier}</span>
            </div>
          ))}
        </div>

        <div className="small-card">
          <h3>Delivery Updates</h3>
          {alerts.deliveryUpdates?.map((d) => (
            <div className="table-row" key={d._id}>
              <span>{d.shipmentNumber}</span>
              <span>{d.status}</span>
            </div>
          ))}
        </div>

        <div className="small-card">
          <h3>Stock Alerts</h3>
          {alerts.stockAlerts?.map((s) => (
            <div className="table-row" key={s._id}>
              <span>{s.name}</span>
              <span>{s.quantity < 5 ? "Critical" : "Low Stock"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
