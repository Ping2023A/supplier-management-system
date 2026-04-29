import StatCard from "../../components/common/StatCard";
import "../../styles/dashboard.css";

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="stats">
        <StatCard title="Total Suppliers" value="120" />
        <StatCard title="Pending Orders" value="35" />
        <StatCard title="Deliveries in Transit" value="18" />
        <StatCard title="Low Stock Alert" value="5" />
      </div>

      <div className="grid">
        <div className="card">
          <h3>Supplier Performance</h3>
          Chart here
        </div>

        <div className="card">
          <h3>Order Status Overview</h3>
          Pie chart here
        </div>
      </div>

      <div className="bottom-grid">
        <div className="small-card">
          <h3>Recent Orders</h3>
          <div className="table-row"><span>PO-1045</span><span>Star Medtech</span></div>
          <div className="table-row"><span>PO-6776</span><span>Global Fax</span></div>
          <div className="table-row"><span>PO-0102</span><span>Nexa Solutions</span></div>
        </div>

        <div className="small-card">
          <h3>Delivery Updates</h3>
          <div className="table-row"><span>Shipment #452</span><span>In Transit</span></div>
          <div className="table-row"><span>Shipment #451</span><span>In Transit</span></div>
          <div className="table-row"><span>Shipment #450</span><span>Delivered</span></div>
        </div>

        <div className="small-card">
          <h3>Stock Alerts</h3>
          <div className="table-row"><span>Widget A</span><span>Reorder Soon</span></div>
          <div className="table-row"><span>Component X</span><span>Low Stock</span></div>
          <div className="table-row"><span>Office Paper</span><span>Reorder Alert</span></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;